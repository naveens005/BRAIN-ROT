package com.focusguard.usage

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.*
import java.util.Calendar

class UsageStatsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "FocusGuardUsageStats"

    @ReactMethod
    fun hasUsagePermission(promise: Promise) {
        try {
            val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(),
                    reactContext.packageName
                )
            } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(),
                    reactContext.packageName
                )
            }
            promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
        } catch (e: Exception) {
            promise.reject("PERMISSION_CHECK_ERROR", e.message)
        }
    }

    @ReactMethod
    fun requestUsagePermission() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        reactContext.startActivity(intent)
    }

    @ReactMethod
    fun queryDailyUsageMetrics(startTimeMs: Double, endTimeMs: Double, promise: Promise) {
        try {
            val usm = reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val start = startTimeMs.toLong()
            val end = endTimeMs.toLong()

            val events = usm.queryEvents(start, end)
            val event = UsageEvents.Event()

            var totalScreenTimeMs: Long = 0
            var shortFormVideoMs: Long = 0
            var socialMediaMs: Long = 0
            var gamingMs: Long = 0
            var messagingMs: Long = 0
            var lateNightUsageMs: Long = 0
            var unlockCount = 0
            var appSwitchCount = 0

            var currentForegroundPackage: String? = null
            var currentForegroundStartTime: Long = 0
            var longestSessionMs: Long = 0

            // Known package category maps
            val shortFormPackages = setOf(
                "com.zhiliaoapp.musically", "com.ss.android.ugc.trill", // TikTok
                "com.instagram.android", // Instagram / Reels
                "com.google.android.youtube" // YouTube Shorts
            )
            val socialPackages = setOf(
                "com.twitter.android", "com.reddit.frontpage", "com.snapchat.android"
            )
            val messagingPackages = setOf(
                "com.whatsapp", "org.telegram.messenger", "com.discord"
            )

            // Setup late night bounds (00:00 to 05:00 for the day)
            val cal = Calendar.getInstance()
            cal.timeInMillis = start
            cal.set(Calendar.HOUR_OF_DAY, 0)
            cal.set(Calendar.MINUTE, 0)
            cal.set(Calendar.SECOND, 0)
            val nightStart = cal.timeInMillis
            cal.set(Calendar.HOUR_OF_DAY, 5)
            val nightEnd = cal.timeInMillis

            while (events.hasNextEvent()) {
                events.getNextEvent(event)

                when (event.eventType) {
                    UsageEvents.Event.SCREEN_INTERACTIVE,
                    UsageEvents.Event.KEYGUARD_HIDDEN -> {
                        unlockCount++
                    }

                    UsageEvents.Event.ACTIVITY_RESUMED -> {
                        val newPackage = event.packageName
                        if (currentForegroundPackage != null && currentForegroundPackage != newPackage) {
                            appSwitchCount++
                            val duration = event.timeStamp - currentForegroundStartTime
                            if (duration > 0) {
                                totalScreenTimeMs += duration
                                if (duration > longestSessionMs) longestSessionMs = duration

                                // Check late night
                                if (event.timeStamp in nightStart..nightEnd) {
                                    lateNightUsageMs += duration
                                }

                                // Categorize
                                when {
                                    shortFormPackages.contains(currentForegroundPackage) -> shortFormVideoMs += duration
                                    socialPackages.contains(currentForegroundPackage) -> socialMediaMs += duration
                                    messagingPackages.contains(currentForegroundPackage) -> messagingMs += duration
                                }
                            }
                        }
                        currentForegroundPackage = newPackage
                        currentForegroundStartTime = event.timeStamp
                    }

                    UsageEvents.Event.ACTIVITY_PAUSED,
                    UsageEvents.Event.SCREEN_NON_INTERACTIVE -> {
                        if (currentForegroundPackage != null) {
                            val duration = event.timeStamp - currentForegroundStartTime
                            if (duration > 0) {
                                totalScreenTimeMs += duration
                                if (duration > longestSessionMs) longestSessionMs = duration

                                if (event.timeStamp in nightStart..nightEnd) {
                                    lateNightUsageMs += duration
                                }

                                when {
                                    shortFormPackages.contains(currentForegroundPackage) -> shortFormVideoMs += duration
                                    socialPackages.contains(currentForegroundPackage) -> socialMediaMs += duration
                                    messagingPackages.contains(currentForegroundPackage) -> messagingMs += duration
                                }
                            }
                            currentForegroundPackage = null
                        }
                    }
                }
            }

            val elapsedHours = Math.max(1.0, (end - start).toDouble() / (1000.0 * 3600.0))
            val appSwitchesPerHour = appSwitchCount.toDouble() / elapsedHours

            val result = Arguments.createMap().apply {
                putDouble("totalScreenTimeMinutes", (totalScreenTimeMs / (1000.0 * 60.0)))
                putDouble("shortFormVideoMinutes", (shortFormVideoMs / (1000.0 * 60.0)))
                putDouble("socialMediaMinutes", (socialMediaMs / (1000.0 * 60.0)))
                putDouble("messagingMinutes", (messagingMs / (1000.0 * 60.0)))
                putDouble("lateNightUsageMinutes", (lateNightUsageMs / (1000.0 * 60.0)))
                putDouble("longestSessionMinutes", (longestSessionMs / (1000.0 * 60.0)))
                putInt("unlockCount", unlockCount)
                putDouble("appSwitchesPerHour", appSwitchesPerHour)
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("USAGE_QUERY_FAILED", e.message)
        }
    }
}

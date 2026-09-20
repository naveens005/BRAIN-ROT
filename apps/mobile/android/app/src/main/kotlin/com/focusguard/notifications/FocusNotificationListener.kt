package com.focusguard.notifications

import android.content.Context
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class FocusNotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null || sbn.isOngoing) return

        // Privacy rule: Record ONLY count and timestamp, NEVER notification content or text
        val prefs = applicationContext.getSharedPreferences("focusguard_notifications", Context.MODE_PRIVATE)
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val currentCount = prefs.getInt(todayStr, 0)
        prefs.edit().putInt(todayStr, currentCount + 1).apply()
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
    }

    companion object {
        fun getNotificationCountForDate(context: Context, dateStr: String): Int {
            val prefs = context.getSharedPreferences("focusguard_notifications", Context.MODE_PRIVATE)
            return prefs.getInt(dateStr, 0)
        }
    }
}

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Sparkles, AlertTriangle, Flame, RefreshCw } from 'lucide-react';
import type { PostItem } from '../../types';
import { generateInitialPosts, generatePost } from './generator';

import { useAudio } from '../../context/AudioContext';
import { useUser } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';

export const DoomscrollView: React.FC = () => {
  const { playSound, playUiClick } = useAudio();
  const { addXp, incrementStat, unlockAchievement } = useUser();
  const { triggerScreenShake, reducedMotion } = useSettings();

  const [posts, setPosts] = useState<PostItem[]>(() => generateInitialPosts(6));
  const [rotMeter, setRotMeter] = useState<number>(10); // 0 to 100%
  const [commentModalPost, setCommentModalPost] = useState<PostItem | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollCountRef = useRef<number>(0);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [posts.length, rotMeter]);

  const loadMorePosts = () => {
    scrollCountRef.current += 1;
    incrementStat('totalScrolls');
    addXp(5, 'Infinite Doomscroll');

    const newPosts = Array.from({ length: 4 }, (_, i) => generatePost(posts.length + i));
    setPosts((prev) => [...prev, ...newPosts]);

    // Fill Rot Meter
    setRotMeter((prev) => {
      const next = Math.min(100, prev + 6);

      // Trigger escalating audio/chaos cues
      if (next >= 50 && prev < 50) {
        playSound('bruh_bass');
      } else if (next >= 75 && prev < 75) {
        playSound('metal_pipe');
        triggerScreenShake(false);
      } else if (next >= 100 && prev < 100) {
        playSound('vine_boom');
        triggerScreenShake(true);
        unlockAchievement('doomscroll_fiend');
        addXp(150, 'Rot Meter 100%');
      }

      return next;
    });
  };

  const handleLike = (id: string) => {
    playUiClick();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
    addXp(2, 'Liked post');
  };

  const handleResetRot = () => {
    playUiClick();
    setRotMeter(0);
    playSound('mewing_hush');
  };

  const getRotStatus = () => {
    if (rotMeter < 25) return { label: 'HEALTHY SCROLLER', color: 'text-emerald-400', bar: 'from-emerald-500 to-green-500' };
    if (rotMeter < 50) return { label: 'COOKING SLOWLY', color: 'text-cyan-400', bar: 'from-cyan-500 to-blue-500' };
    if (rotMeter < 75) return { label: 'BRAIN MELTDOWN', color: 'text-amber-400', bar: 'from-amber-500 to-orange-500' };
    return { label: 'TERMINAL TRANSCENDENCE', color: 'text-rose-500', bar: 'from-pink-600 via-purple-600 to-rose-600' };
  };

  const status = getRotStatus();

  return (
    <div className={`relative max-w-xl mx-auto px-3 py-6 pb-24 ${rotMeter >= 90 && !reducedMotion ? 'animate-pulse' : ''}`}>
      {/* Sticky Rot Meter Header */}
      <div className="sticky top-16 z-30 bg-zinc-950/95 backdrop-blur-md p-3 rounded-xl border-2 border-zinc-800 shadow-[4px_4px_0px_0px_#000000] mb-6">
        <div className="flex items-center justify-between text-xs font-black uppercase font-heading mb-1.5">
          <div className="flex items-center space-x-1.5">
            <Flame className={`w-4 h-4 ${status.color}`} />
            <span className={status.color}>{status.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-white text-xs">{rotMeter}% ROT</span>
            {rotMeter > 0 && (
              <button
                onClick={handleResetRot}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded flex items-center space-x-1 uppercase"
                title="Detox brain"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Detox</span>
              </button>
            )}
          </div>
        </div>

        {/* Rot Meter Bar */}
        <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-700">
          <motion.div
            className={`h-full bg-gradient-to-r ${status.bar}`}
            style={{ width: `${rotMeter}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        {rotMeter >= 75 && (
          <p className="text-[11px] text-rose-400 font-bold uppercase mt-1 flex items-center justify-center space-x-1 animate-bounce">
            <AlertTriangle className="w-3 h-3" />
            <span>WARNING: Cognitive functions dissolving... keep scrolling!</span>
          </p>
        )}
      </div>

      {/* Floating Attention Retention Simulator (Subway Surfers / Parkour widget when rot >= 50%) */}
      {rotMeter >= 50 && (
        <div className="fixed bottom-20 right-4 z-30 hidden sm:block pointer-events-none select-none">
          <div className="w-44 bg-black/90 border-2 border-yellow-400 p-2 rounded-lg shadow-[4px_4px_0px_0px_#000000]">
            <div className="text-[9px] font-black text-yellow-400 uppercase tracking-widest text-center mb-1">
              🎮 ATTENTION RETAINER
            </div>
            <div className="h-20 bg-zinc-900 border border-zinc-800 rounded flex flex-col items-center justify-center text-center p-1">
              <span className="text-2xl animate-bounce">🛹💨</span>
              <span className="text-[10px] text-zinc-400 font-mono">
                [Subway Surfers Simulation]
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-5" id="doomscroll-feed">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-zinc-900 border-3 border-zinc-700 p-4 md:p-5 rounded-2xl shadow-[6px_6px_0px_0px_#000000] space-y-3 transition-transform hover:-translate-y-0.5"
          >
            {/* Author Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-pink-500 flex items-center justify-center text-xl shadow-inner">
                  {post.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-sm text-white font-heading">
                      {post.author}
                    </span>
                    {post.badge && (
                      <span className="text-[9px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                        {post.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">{post.handle}</div>
                </div>
              </div>

              <span className="text-[11px] text-zinc-500 font-mono">{post.timestamp}</span>
            </div>

            {/* Post Caption */}
            <p className="text-sm md:text-base text-zinc-100 font-sans leading-relaxed select-text">
              {post.content}
            </p>

            {/* Special Media Preview Box */}
            {post.mediaContent && (
              <div className="bg-zinc-950 border-2 border-zinc-800 p-3 rounded-xl font-mono text-xs text-cyan-300">
                {post.mediaContent}
              </div>
            )}

            {/* Post Tag */}
            <div className="text-xs font-bold text-pink-400 font-heading">
              {post.tag}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-zinc-400 text-xs">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1.5 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  post.isLiked ? 'text-pink-500' : 'hover:text-pink-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-pink-500' : ''}`} />
                <span className="font-bold">{post.likes.toLocaleString()}</span>
              </button>

              <button
                onClick={() => {
                  playUiClick();
                  setCommentModalPost(post);
                }}
                className="flex items-center space-x-1.5 p-1.5 rounded-lg hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.toLocaleString()}</span>
              </button>

              <button
                onClick={() => {
                  playUiClick();
                  navigator.clipboard.writeText(`Check out this cooked post: "${post.content}"`);
                  playSound('lazer_pew');
                }}
                className="flex items-center space-x-1.5 p-1.5 rounded-lg hover:text-yellow-400 transition-colors cursor-pointer"
                title="Share post"
              >
                <Share2 className="w-4 h-4" />
                <span>{post.shares.toLocaleString()}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="py-8 text-center text-zinc-500 flex flex-col items-center">
        <Sparkles className="w-5 h-5 text-pink-500 animate-spin mb-1" />
        <span className="text-xs font-mono font-bold tracking-wider uppercase">
          SYNTHESIZING MORE BRAIN ROT...
        </span>
      </div>

      {/* Chaotic Comments Modal */}
      {commentModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border-3 border-zinc-700 p-5 rounded-2xl max-w-sm w-full shadow-[8px_8px_0px_0px_#000000]">
            <h3 className="text-base font-black uppercase text-pink-400 font-heading mb-3">
              CHAT REACTIONS ({commentModalPost.comments})
            </h3>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <span className="font-bold text-cyan-400">@fanum_apprentice:</span> bro is speaking fluent ancient gibberish 💀
              </div>
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <span className="font-bold text-yellow-400">@mewing_samurai:</span> I lost 4,000 aura just reading this fr fr 😭
              </div>
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <span className="font-bold text-pink-400">@sigma_bot_42:</span> who let him cook with zero seasoning?! 🗣️🔥
              </div>
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <span className="font-bold text-emerald-400">@ohio_native:</span> Normal Tuesday afternoon in Cleveland 🗿
              </div>
            </div>
            <button
              onClick={() => {
                playUiClick();
                setCommentModalPost(null);
              }}
              className="mt-4 w-full py-2 bg-pink-500 text-black font-black text-xs uppercase tracking-wider rounded-lg neo-btn"
            >
              CLOSE CHAT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

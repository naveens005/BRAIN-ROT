import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Image as ImageIcon, Wand2, Trash2 } from 'lucide-react';
import { MEME_TEMPLATES, AVAILABLE_STICKERS } from './templates';
import type { MemeTemplate, MemeSticker } from './templates';

import { renderMeme, downloadMemeAsPng } from './memeCanvas';
import { aiGenerateMemeCaptions } from '../translator/aiRot';
import { useAudio } from '../../context/AudioContext';
import { useUser } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';

export const MemeMakerView: React.FC = () => {
  const { playSound, playUiClick } = useAudio();
  const { addXp, incrementStat, unlockAchievement } = useUser();
  const { apiKey, triggerScreenShake } = useSettings();

  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(MEME_TEMPLATES[0]);
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState<string>(MEME_TEMPLATES[0].defaultTop);
  const [bottomText, setBottomText] = useState<string>(MEME_TEMPLATES[0].defaultBottom);
  const [fontSize, setFontSize] = useState<number>(44);
  const [stickers, setStickers] = useState<MemeSticker[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Re-render canvas whenever state changes
  useEffect(() => {
    if (canvasRef.current) {
      renderMeme({
        canvas: canvasRef.current,
        template: userImage ? undefined : selectedTemplate,
        userImage,
        topText,
        bottomText,
        fontSize,
        stickers,
      });
    }
  }, [selectedTemplate, userImage, topText, bottomText, fontSize, stickers]);

  const handleTemplateSelect = (template: MemeTemplate) => {
    playUiClick();
    setSelectedTemplate(template);
    setUserImage(null);
    setTopText(template.defaultTop);
    setBottomText(template.defaultBottom);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playUiClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        playSound('bonk_pop');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddSticker = (emoji: string) => {
    playUiClick();
    const newSticker: MemeSticker = {
      id: `sticker-${Date.now()}-${Math.random()}`,
      label: emoji,
      emoji,
      x: 320 + (Math.random() * 100 - 50),
      y: 320 + (Math.random() * 100 - 50),
      size: 64,
      rotation: Math.floor(Math.random() * 30 - 15),
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleRemoveStickers = () => {
    playUiClick();
    setStickers([]);
  };

  const handleGenerateAiCaption = async () => {
    playUiClick();
    setIsAiLoading(true);

    try {
      const result = await aiGenerateMemeCaptions(
        userImage ? 'absurd internet photo' : selectedTemplate.name,
        apiKey
      );
      setTopText(result.top);
      setBottomText(result.bottom);
      playSound('airhorn_synth');
      addXp(25, 'AI Meme Caption');
    } catch {
      // Ignore
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    playUiClick();
    downloadMemeAsPng(canvasRef.current, `cooked-meme-${Date.now()}.png`);
    triggerScreenShake(false);
    playSound('critical_win');
    incrementStat('totalMemesCreated');
    unlockAchievement('meme_creator');
    addXp(100, 'Meme Created');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>CANVAS MEME ENGINE & AI CAPTIONER</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase font-heading tracking-tight text-white">
          BRAIN ROT MEME MAKER
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
          Choose a cursed preset or upload your own image. Add Impact text, stickers, or generate viral AI captions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Preview */}
        <div className="md:col-span-7 bg-zinc-900 border-3 border-zinc-700 p-4 md:p-5 rounded-2xl shadow-[6px_6px_0px_0px_#000000] flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[480px] bg-black rounded-lg overflow-hidden border-2 border-zinc-800 shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          <button
            id="download-meme-btn"
            onClick={handleDownload}
            className="mt-4 w-full py-3.5 bg-pink-500 hover:bg-pink-400 text-black font-black text-sm uppercase tracking-wider rounded-xl neo-btn flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>DOWNLOAD MEME (PNG)</span>
          </button>
        </div>

        {/* Right Column: Controls & Templates */}
        <div className="md:col-span-5 space-y-5">
          {/* Template / Upload Choice */}
          <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300 font-heading">
                Choose Base Plate
              </span>
              <button
                id="upload-meme-image-btn"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-cyan-500 hover:bg-cyan-400 text-black px-2.5 py-1 rounded font-black uppercase flex items-center space-x-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Template selector pills */}
            <div className="grid grid-cols-2 gap-2">
              {MEME_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl)}
                  className={`p-2 rounded-lg border-2 text-left text-xs font-bold transition-all truncate ${
                    selectedTemplate.id === tmpl.id && !userImage
                      ? 'border-pink-500 bg-pink-500/20 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
            {userImage && (
              <div className="text-[11px] text-green-400 font-mono font-bold bg-green-950/30 p-2 rounded border border-green-700/50 flex items-center justify-between">
                <span>Custom Image Active</span>
                <button
                  onClick={() => setUserImage(null)}
                  className="text-zinc-400 hover:text-white uppercase"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Text Controls */}
          <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300 font-heading">
                Caption Controls
              </span>
              <button
                id="ai-meme-caption-btn"
                onClick={handleGenerateAiCaption}
                disabled={isAiLoading}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded font-black uppercase flex items-center space-x-1 disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isAiLoading ? 'THINKING...' : 'AI CAPTION'}</span>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase font-heading block mb-1">
                Top Text
              </label>
              <input
                id="meme-top-text-input"
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP TEXT..."
                className="w-full bg-zinc-950 border-2 border-zinc-800 px-3 py-2 text-sm uppercase font-mono text-white rounded focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase font-heading block mb-1">
                Bottom Text
              </label>
              <input
                id="meme-bottom-text-input"
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM TEXT..."
                className="w-full bg-zinc-950 border-2 border-zinc-800 px-3 py-2 text-sm uppercase font-mono text-white rounded focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase mb-1">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="64"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-2 bg-zinc-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Stickers Tray */}
          <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300 font-heading">
                Tap Stickers to Stamp ({stickers.length})
              </span>
              {stickers.length > 0 && (
                <button
                  onClick={handleRemoveStickers}
                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STICKERS.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSticker(emoji)}
                  className="w-9 h-9 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-lg hover:scale-110 active:scale-90 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

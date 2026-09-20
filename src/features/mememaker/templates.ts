export interface MemeTemplate {
  id: string;
  name: string;
  category: string;
  defaultTop: string;
  defaultBottom: string;
  renderBackground: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export interface MemeSticker {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'let_him_cook',
    name: '🔥 Let Him Cook',
    category: 'Cooking',
    defaultTop: 'THEY SAID I WAS DELUSIONAL',
    defaultBottom: 'BUT I SAID LET HIM COOK',
    renderBackground: (ctx, width, height) => {
      // Fiery gradient background
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(0.5, '#ef4444');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Skillet & pan illustration
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2 + 30, 160, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#27272a';
      ctx.stroke();

      // Giant flame emoji in center
      ctx.font = '140px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍳', width / 2, height / 2 + 50);
      ctx.fillText('🔥', width / 2 - 80, height / 2 + 10);
      ctx.fillText('🔥', width / 2 + 80, height / 2 + 10);
    },
  },
  {
    id: 'gigachad_aura',
    name: '🗿 GigaChad Jawline',
    category: 'Chad',
    defaultTop: 'DID NOT SPEAK A SINGLE WORD',
    defaultBottom: 'STILL GAINED 100,000 AURA',
    renderBackground: (ctx, width, height) => {
      // Dark moody noir gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(0.5, '#09090b');
      grad.addColorStop(1, '#27272a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Cyber glow ring
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 170, 0, Math.PI * 2);
      ctx.stroke();

      // Huge Chad Moai in center
      ctx.font = '170px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗿', width / 2, height / 2 + 60);

      // Sparkles
      ctx.font = '50px sans-serif';
      ctx.fillText('✨', width / 2 - 140, height / 2 - 60);
      ctx.fillText('✨', width / 2 + 140, height / 2 - 60);
    },
  },
  {
    id: 'brain_melt',
    name: '🧠 Brain Melting In Ohio',
    category: 'Rot',
    defaultTop: 'ME AFTER 4 HOURS',
    defaultBottom: 'OF TIKTOK LIVE STREAMS',
    renderBackground: (ctx, width, height) => {
      // Toxic neon green / purple swirl
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.5, '#581c87');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Warning hazard stripes at border
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, width - 14, height - 14);

      // Brain emoji
      ctx.font = '160px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧠', width / 2, height / 2 + 30);
      ctx.fillText('⚡', width / 2 - 100, height / 2 - 40);
      ctx.fillText('⚡', width / 2 + 100, height / 2 - 40);
    },
  },
  {
    id: 'skibidi_toilet',
    name: '🚽 Skibidi Ascendant',
    category: 'Lore',
    defaultTop: 'NOBODY UNDERSTANDS',
    defaultBottom: 'MY COMPLEX LORE',
    renderBackground: (ctx, width, height) => {
      // Vaporwave cyan/pink sunset
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.6, '#db2777');
      grad.addColorStop(1, '#4c1d95');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Grid at bottom
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      for (let y = height * 0.7; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Toilet & Camera
      ctx.font = '150px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚽', width / 2, height / 2 + 50);
      ctx.font = '70px sans-serif';
      ctx.fillText('👑', width / 2, height / 2 - 80);
    },
  },
  {
    id: 'doge_shock',
    name: '🐕 Much Shock Very Cooked',
    category: 'Classic',
    defaultTop: 'SUCH RIZZ',
    defaultBottom: 'VERY AURA MUCH COOKED',
    renderBackground: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#451a03');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.font = '160px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐕', width / 2, height / 2 + 50);
      ctx.font = '60px sans-serif';
      ctx.fillText('❓', width / 2 - 120, height / 2 - 40);
      ctx.fillText('❗', width / 2 + 120, height / 2 - 40);
    },
  },
];

export const AVAILABLE_STICKERS = ['🔥', '💀', '🗿', '💯', '🍷', '🤫', '🚨', '🍔', '🚽', '👑', '🕶️', '⚡', '👀'];

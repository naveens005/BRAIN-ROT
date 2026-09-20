import type { MemeSticker, MemeTemplate } from './templates';


export interface RenderMemeOptions {
  canvas: HTMLCanvasElement;
  template?: MemeTemplate;
  userImage?: HTMLImageElement | null;
  topText: string;
  bottomText: string;
  fontSize: number;
  stickers: MemeSticker[];
}

export function renderMeme({
  canvas,
  template,
  userImage,
  topText,
  bottomText,
  fontSize,
  stickers,
}: RenderMemeOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 640;
  const height = 640;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);

  // 1. Render base image or template
  if (userImage && userImage.complete && userImage.naturalWidth > 0) {
    // Center & cover crop
    const imgRatio = userImage.naturalWidth / userImage.naturalHeight;
    const canvasRatio = width / height;
    let sWidth = userImage.naturalWidth;
    let sHeight = userImage.naturalHeight;
    let sx = 0;
    let sy = 0;

    if (imgRatio > canvasRatio) {
      sWidth = userImage.naturalHeight * canvasRatio;
      sx = (userImage.naturalWidth - sWidth) / 2;
    } else {
      sHeight = userImage.naturalWidth / canvasRatio;
      sy = (userImage.naturalHeight - sHeight) / 2;
    }
    ctx.drawImage(userImage, sx, sy, sWidth, sHeight, 0, 0, width, height);
  } else if (template) {
    template.renderBackground(ctx, width, height);
  } else {
    // Default fallback gradient
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Render stickers
  stickers.forEach((sticker) => {
    ctx.save();
    ctx.translate(sticker.x, sticker.y);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.font = `${sticker.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, 0, 0);
    ctx.restore();
  });

  // 3. Render Top and Bottom Meme Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(4, Math.floor(fontSize / 8));
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 2;
  ctx.font = `900 ${fontSize}px "Space Grotesk", Impact, sans-serif`;

  if (topText.trim()) {
    ctx.textBaseline = 'top';
    drawMemeWrappedText(ctx, topText.toUpperCase(), width / 2, 24, width - 40, fontSize * 1.1);
  }

  if (bottomText.trim()) {
    ctx.textBaseline = 'bottom';
    drawMemeWrappedTextBottom(ctx, bottomText.toUpperCase(), width / 2, height - 24, width - 40, fontSize * 1.1);
  }
}

function drawMemeWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.strokeText(line.trim(), x, currentY);
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.strokeText(line.trim(), x, currentY);
  ctx.fillText(line.trim(), x, currentY);
}

function drawMemeWrappedTextBottom(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  bottomY: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  let startY = bottomY - (lines.length - 1) * lineHeight;
  lines.forEach((l, idx) => {
    const y = startY + idx * lineHeight;
    ctx.strokeText(l, x, y);
    ctx.fillText(l, x, y);
  });
}

export function downloadMemeAsPng(canvas: HTMLCanvasElement, filename: string = 'cooked-meme.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

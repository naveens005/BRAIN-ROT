import type { QuizResult } from '../../types';


export function renderQuizResultCard(
  canvas: HTMLCanvasElement,
  result: QuizResult,
  score: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 800;
  const height = 960;
  canvas.width = width;
  canvas.height = height;

  // Background - Dark cyber slate
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, width, height);

  // Subtle grid pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Outer Neo-brutalist frame
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Inner card container
  ctx.fillStyle = '#18181b';
  ctx.fillRect(40, 40, width - 80, height - 80);
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Header banner: "OFFICIAL DIAGNOSIS"
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(60, 60, width - 120, 56);
  ctx.fillStyle = '#000000';
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔥 CERTIFIED COOKED EVALUATION REPORT 🔥', width / 2, 98);

  // App title & watermark
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 16px "Outfit", sans-serif';
  ctx.fillText('ISSUED BY COOKED ENTERTAINMENT HUB // BRAIN ROT DIAGNOSTICS', width / 2, 145);

  // Result Rank Title Box
  const rankBoxY = 175;
  ctx.fillStyle = '#12111a';
  ctx.fillRect(70, rankBoxY, width - 140, 140);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 4;
  ctx.strokeRect(70, rankBoxY, width - 140, 140);

  ctx.fillStyle = '#f43f5e';
  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.fillText('OFFICIAL BRAIN ROT RANK', width / 2, rankBoxY + 35);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px "Space Grotesk", sans-serif';
  ctx.fillText(result.title, width / 2, rankBoxY + 80);

  ctx.fillStyle = '#a855f7';
  ctx.font = '700 20px "Outfit", sans-serif';
  ctx.fillText(result.badge, width / 2, rankBoxY + 115);

  // Rot percentage gauge bar
  const gaugeY = 345;
  ctx.fillStyle = '#27272a';
  ctx.fillRect(70, gaugeY, width - 140, 36);
  
  // Progress fill
  const fillWidth = ((width - 140) * result.percentage) / 100;
  const gradient = ctx.createLinearGradient(70, 0, 70 + fillWidth, 0);
  gradient.addColorStop(0, '#06b6d4');
  gradient.addColorStop(0.5, '#a855f7');
  gradient.addColorStop(1, '#ec4899');
  ctx.fillStyle = gradient;
  ctx.fillRect(70, gaugeY, fillWidth, 36);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(70, gaugeY, width - 140, 36);

  // Percentage text
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`COOKED LEVEL: ${result.percentage}% (Score: ${score} / 60)`, width / 2, gaugeY + 25);

  // Diagnosis Section
  const diagY = 415;
  ctx.fillStyle = '#f4f4f5';
  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📋 CLINICAL OBSERVATION:', 70, diagY);

  ctx.fillStyle = '#d4d4d8';
  ctx.font = '500 18px "Outfit", sans-serif';
  wrapText(ctx, result.diagnosis, 70, diagY + 32, width - 140, 26);

  // Prescription Section
  const prescY = 560;
  ctx.fillStyle = '#ec4899';
  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.fillText('💊 EMERGENCY REMEDY:', 70, prescY);

  ctx.fillStyle = '#fef08a';
  ctx.font = '600 18px "Outfit", sans-serif';
  wrapText(ctx, result.prescription, 70, prescY + 32, width - 140, 26);

  // Big Rubber Stamp Badge (Tilted)
  ctx.save();
  ctx.translate(width - 170, height - 190);
  ctx.rotate((-12 * Math.PI) / 180);
  
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
  ctx.strokeRect(-90, -40, 180, 80);
  
  ctx.fillStyle = '#22c55e';
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFIED', 0, -8);
  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.fillText('TERMINAL', 0, 22);
  ctx.restore();

  // Bottom Footer / Branding
  ctx.fillStyle = '#71717a';
  ctx.font = '600 15px "Outfit", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Generated on: ' + new Date().toLocaleDateString(), 70, height - 70);
  ctx.textAlign = 'right';
  ctx.fillText('Test your brain at: github.com/cooked', width - 70, height - 70);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string = 'cooked-diagnosis.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

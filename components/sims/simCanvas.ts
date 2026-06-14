// Shared canvas drawing helpers for the sims — stylized 2D only (spec hard rule).

export function drawCarSide(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  img?: HTMLImageElement | null
) {
  if (img && img.complete && img.naturalWidth !== 0) {
    ctx.drawImage(img, x, y, w, h);
    return;
  }
  ctx.save();
  // body
  ctx.fillStyle = color;
  roundRect(ctx, x, y + h * 0.35, w, h * 0.45, h * 0.2);
  ctx.fill();
  // cabin
  roundRect(ctx, x + w * 0.25, y, w * 0.5, h * 0.5, h * 0.18);
  ctx.fill();
  // wheels
  ctx.fillStyle = "#0A0A0B";
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  for (const wx of [x + w * 0.22, x + w * 0.78]) {
    ctx.beginPath();
    ctx.arc(wx, y + h * 0.82, h * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

export function drawCarTop(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, h * 0.3);
  ctx.fill();
  ctx.fillStyle = "rgba(245,245,244,0.22)";
  roundRect(ctx, x + w * 0.3, y + h * 0.15, w * 0.32, h * 0.7, h * 0.18);
  ctx.fill();
  ctx.restore();
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export const CANVAS_BG = "#0F0F11";
export const TEXT_PRIMARY = "#F5F5F4";
export const TEXT_SECONDARY = "#A1A1AA";
export const ACCENT = "#E8590C";
export const MONO_FONT = "12px ui-monospace, Menlo, monospace";

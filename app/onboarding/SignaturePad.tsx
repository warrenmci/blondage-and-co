"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";

interface SignaturePadProps {
  /** Called with a PNG data URL after each stroke, or null when cleared. */
  onChange: (dataUrl: string | null) => void;
}

export function SignaturePad({ onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  // Match the canvas' pixel size to its on-screen size so strokes are crisp.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.2 * ratio;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#241a11";
    ctx.fillStyle = "#241a11";
  }, []);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function handleDown(event: PointerEvent<HTMLCanvasElement>) {
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const { x, y } = point(event);
    // A dot, so a tap still leaves a mark.
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handleMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handleUp(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    drawing.current = false;
    setHasInk(true);
    onChange(exportPng(event.currentTarget));
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
          aria-label="Signature area. Draw your signature with your finger or mouse."
          className="h-44 w-full touch-none rounded-2xl border border-dashed border-[#cab69c] bg-white"
        />
        {!hasInk && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-[#b29578]">
            Sign here with your finger
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        disabled={!hasInk}
        className="text-xs font-medium text-[#7c6750] underline underline-offset-2 disabled:opacity-40"
      >
        Clear signature
      </button>
    </div>
  );
}

// Flatten onto white so the signature stays visible in dark-mode email apps.
function exportPng(canvas: HTMLCanvasElement): string {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/png");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  return out.toDataURL("image/png");
}

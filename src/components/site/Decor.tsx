import type { SVGProps } from "react";

export function TornPaper({ className = "", color = "white", flip = false }: { className?: string; color?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={className} style={{ transform: flip ? "rotate(180deg)" : undefined }}>
      <path
        fill={color}
        d="M0,40 C120,10 200,70 320,45 C440,20 520,75 640,50 C760,25 840,70 960,42 C1080,15 1160,68 1280,45 C1360,30 1400,55 1440,42 L1440,80 L0,80 Z"
      />
    </svg>
  );
}

export function WavyDivider({ className = "", color = "white", flip = false }: { className?: string; color?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={className} style={{ transform: flip ? "rotate(180deg)" : undefined }}>
      <path fill={color} d="M0,64 C240,120 480,0 720,48 C960,96 1200,32 1440,72 L1440,120 L0,120 Z" />
    </svg>
  );
}

export function Blob(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M45.5,-59.6C58.4,-49.6,67.7,-34.5,71.9,-18.1C76,-1.7,75,16,67.6,30.3C60.2,44.6,46.4,55.6,31.1,63.2C15.7,70.8,-1.3,75,-17.4,71.4C-33.5,67.8,-48.8,56.4,-58.8,41.5C-68.7,26.6,-73.3,8.2,-71,-9.1C-68.6,-26.4,-59.3,-42.6,-46.1,-52.9C-32.9,-63.1,-16.4,-67.4,0.6,-68.1C17.6,-68.9,32.5,-69.6,45.5,-59.6Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function DottedPath({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 100" fill="none">
      <path d="M10,50 Q100,10 200,50 T390,50" stroke="currentColor" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" />
    </svg>
  );
}

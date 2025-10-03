import React, { useEffect, useState } from "react";

import MuncLogo from "../../assets/img/logo/MuncSmall.svg";

// RingLoader.jsx
// Default export a React component. Uses Tailwind utility classes for layout.
// - Shows a circular progress ring (SVG) that continuously animates.
// - The logo SVG sits centered and blinks (pulse).
// - Props: size (px), stroke (px), speed (ms) — you can control visuals.

export default function RingLoader({ size = 140, stroke = 10, speed = 1800 }) {
  const [progress, setProgress] = useState(0);

  // animate progress value between 0 and 90 and loop to give a moving progress feeling
  useEffect(() => {
    let mounted = true;
    let dir = 1;
    let value = 0;
    const step = 2; // amount to change progress per tick
    const tick = Math.max(20, Math.round(speed / 90));

    const id = setInterval(() => {
      if (!mounted) return;
      value += dir * step;
      if (value >= 90) {
        dir = -1;
        value = 90;
      } else if (value <= 6) {
        dir = 1;
        value = 6;
      }
      setProgress(value);
    }, tick);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [speed]);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label="loading"
      role="status"
    >
      {/* container that holds the rotating ring */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* background ring (subtle) */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute top-0 left-0"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            strokeOpacity={0.12}
            stroke="currentColor"
            fill="none"
            className="text-slate-400"
          />

          {/* animated progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: dashoffset,
              transform: `rotate(-90deg)`,
              transformOrigin: '50% 50%',
            }}
            className="text-blue-600 transition-all duration-200"
          />
        </svg>

        {/* subtle continuous rotation layer to give motion to the progress */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            animation: `spin ${Math.max(1000, speed)}ms linear infinite`,
            WebkitAnimation: `spin ${Math.max(1000, speed)}ms linear infinite`,
          }}
        />

        {/* Center logo that blinks */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          {/* Replace the src with the correct path to your SVG in your project. */}
          <img
            src={MuncLogo}
            alt="logo"
            width={Math.round(size * 0.42)}
            height={Math.round(size * 0.42)}
            className="animate-pulse" /* tailwind pulse gives a blink-like effect */
            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
          />
        </div>

        {/* Inline styles for keyframes — JSX supports a <style> tag here. */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* optional: make the pulse a bit faster than default */
          .animate-pulse {
            animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(0.98); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

/*
Usage:
import RingLoader from './RingLoader';

< RingLoader size={140} stroke={12} speed={1800} />

- size: diameter in pixels
- stroke: ring thickness
- speed: how fast the whole ring rotates (ms) — lower = faster
*/

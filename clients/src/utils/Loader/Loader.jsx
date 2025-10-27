import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultLogo from "../../assets/img/logo/MuncSmall.svg";

export default function RingLoader({
  logo = defaultLogo,
  progress = 75,
  blink = true,
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // 🔹 Responsive smaller size
  const screenWidth = window.innerWidth;
  const size =
    screenWidth < 400 ? 80 : screenWidth < 768 ? 100 : 120; // smaller for all devices

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 300);
    return () => clearTimeout(timer);
  }, [progress]);

  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-white"
      style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      <div
        className="position-relative"
        style={{ width: size, height: size }}
      >
        {/* Outer circular progress */}
        <svg
          width={size}
          height={size}
          className="position-absolute top-0 start-0"
        >
          <circle
            stroke="#e6e6e6"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke="#0d6efd"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              transition: "stroke-dashoffset 1s ease",
            }}
          />
        </svg>

        {/* Center logo + percentage */}
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: size * 0.35, // smaller logo
              height: size * 0.35,
              objectFit: "contain",
              animation: blink ? "blinkLogo 1s infinite ease-in-out" : "none",
              display: "block",
              margin: "0 auto",
            }}
          />
          {/* <div
            className="fw-bold text-primary mt-1"
            style={{
              fontSize: size * 0.12, // smaller font
              lineHeight: "1",
            }}
          >
            {Math.round(animatedProgress)}%
          </div> */}
        </div>

        {/* Blinking animation */}
        <style>{`
          @keyframes blinkLogo {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from "react";

// import MuncLogo from "../../assets/img/logo/MuncSmall.svg";

// // RingLoader.jsx
// // Default export a React component. Uses Tailwind utility classes for layout.
// // - Shows a circular progress ring (SVG) that continuously animates.
// // - The logo SVG sits centered and blinks (pulse).
// // - Props: size (px), stroke (px), speed (ms) — you can control visuals.

// export default function RingLoader({ size = 140, stroke = 10, speed = 1800 }) {
//   const [progress, setProgress] = useState(0);

//   // animate progress value between 0 and 90 and loop to give a moving progress feeling
//   useEffect(() => {
//     let mounted = true;
//     let dir = 1;
//     let value = 0;
//     const step = 2; // amount to change progress per tick
//     const tick = Math.max(20, Math.round(speed / 90));

//     const id = setInterval(() => {
//       if (!mounted) return;
//       value += dir * step;
//       if (value >= 90) {
//         dir = -1;
//         value = 90;
//       } else if (value <= 6) {
//         dir = 1;
//         value = 6;
//       }
//       setProgress(value);
//     }, tick);

//     return () => {
//       mounted = false;
//       clearInterval(id);
//     };
//   }, [speed]);

//   const radius = (size - stroke) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const dashoffset = circumference - (progress / 100) * circumference;

//   return (
//     <div
//       className="flex items-center justify-center"
//       style={{ width: size, height: size }}
//       aria-label="loading"
//       role="status"
//     >
//       {/* container that holds the rotating ring */}
//       <div className="relative" style={{ width: size, height: size }}>
//         {/* background ring (subtle) */}
//         <svg
//           width={size}
//           height={size}
//           viewBox={`0 0 ${size} ${size}`}
//           className="absolute top-0 left-0"
//         >
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             strokeWidth={stroke}
//             strokeOpacity={0.12}
//             stroke="currentColor"
//             fill="none"
//             className="text-slate-400"
//           />

//           {/* animated progress stroke */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             strokeWidth={stroke}
//             strokeLinecap="round"
//             stroke="currentColor"
//             fill="none"
//             style={{
//               strokeDasharray: circumference,
//               strokeDashoffset: dashoffset,
//               transform: `rotate(-90deg)`,
//               transformOrigin: '50% 50%',
//             }}
//             className="text-blue-600 transition-all duration-200"
//           />
//         </svg>

//         {/* subtle continuous rotation layer to give motion to the progress */}
//         <div
//           className="absolute inset-0 rounded-full"
//           style={{
//             animation: `spin ${Math.max(1000, speed)}ms linear infinite`,
//             WebkitAnimation: `spin ${Math.max(1000, speed)}ms linear infinite`,
//           }}
//         />

//         {/* Center logo that blinks */}
//         <div
//           className="absolute inset-0 flex items-center justify-center"
//           style={{ pointerEvents: 'none' }}
//         >
//           {/* Replace the src with the correct path to your SVG in your project. */}
//           <img
//             src={MuncLogo}
//             alt="logo"
//             width={Math.round(size * 0.42)}
//             height={Math.round(size * 0.42)}
//             className="animate-pulse" /* tailwind pulse gives a blink-like effect */
//             style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
//           />
//         </div>

//         {/* Inline styles for keyframes — JSX supports a <style> tag here. */}
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }

//           /* optional: make the pulse a bit faster than default */
//           .animate-pulse {
//             animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//           }

//           @keyframes pulse {
//             0% { opacity: 1; transform: scale(1); }
//             50% { opacity: 0.35; transform: scale(0.98); }
//             100% { opacity: 1; transform: scale(1); }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }

// tem code for reference - previous version with progress prop and blink option
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import defaultLogo from "../../assets/img/logo/MuncSmall.svg"; // default logo

// export default function RingLoader({
//   logo = defaultLogo, // renamed prop to avoid conflict
//   size = 150,
//   progress = 75,
//   blink = true,
// }) {
//   const [animatedProgress, setAnimatedProgress] = useState(0);

//   useEffect(() => {
//     const timer = setTimeout(() => setAnimatedProgress(progress), 300);
//     return () => clearTimeout(timer);
//   }, [progress]);

//   const strokeWidth = 8;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (animatedProgress / 100) * circumference;

//   return (
//     <div
//       className="d-flex justify-content-center align-items-center"
//       style={{ minHeight: "100vh" }}
//     >
//       <div className="position-relative" style={{ width: size, height: size }}>
//         {/* circular ring */}
//         <svg width={size} height={size} className="position-absolute top-0 start-0">
//           <circle
//             stroke="#e6e6e6"
//             fill="transparent"
//             strokeWidth={strokeWidth}
//             r={radius}
//             cx={size / 2}
//             cy={size / 2}
//           />
//           <circle
//             stroke="#0d6efd"
//             fill="transparent"
//             strokeWidth={strokeWidth}
//             strokeLinecap="round"
//             strokeDasharray={circumference}
//             strokeDashoffset={offset}
//             r={radius}
//             cx={size / 2}
//             cy={size / 2}
//             style={{
//               transform: "rotate(-90deg)",
//               transformOrigin: "50% 50%",
//               transition: "stroke-dashoffset 1s ease",
//             }}
//           />
//         </svg>

//         {/* logo center */}
//         <div className="position-absolute top-50 start-50 translate-middle">
//           <img
//             src={logo}
//             alt="Logo"
//             style={{
//               width: size * 0.45,
//               height: size * 0.45,
//               objectFit: "contain",
//               animation: blink ? "blinkLogo 1s infinite ease-in-out" : "none",
//             }}
//           />
//         </div>

//         <style>{`
//           @keyframes blinkLogo {
//             0% { opacity: 1; transform: scale(1); }
//             50% { opacity: 0.4; transform: scale(0.95); }
//             100% { opacity: 1; transform: scale(1); }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }

/*
Usage:
import RingLoader from './RingLoader';

< RingLoader size={140} stroke={12} speed={1800} />

- size: diameter in pixels
- stroke: ring thickness
- speed: how fast the whole ring rotates (ms) — lower = faster
*/

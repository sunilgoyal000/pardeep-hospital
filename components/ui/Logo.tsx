import React from "react";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full scale-150 animate-pulse" />
      
      {/* Geometric Medical Cross (Modern Style) */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-2xl"
      >
        <rect x="35" y="10" width="30" height="80" rx="6" fill="url(#logo-grad)" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
        <rect x="10" y="35" width="80" height="30" rx="6" fill="url(#logo-grad)" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
        
        {/* Modern Dot Accent */}
        <circle cx="50" cy="50" r="8" fill="white" fillOpacity="0.8" />
        
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d9488" />
            <stop offset="1" stopColor="#0891b2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

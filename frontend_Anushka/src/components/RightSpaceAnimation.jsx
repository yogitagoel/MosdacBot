import React from 'react';

const RightSpaceAnimation = () => (
  <div className="absolute right-0 top-0 h-full w-1/4 pointer-events-none z-0">
    <svg width="100%" height="100%" viewBox="0 0 300 800" className="h-full w-full">
      {/* Star shapes (mix of circles and stars) */}
      {[...Array(10)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 300}
          cy={Math.random() * 800}
          r={Math.random() * 2 + 0.5}
          fill="#fbbf24"
          opacity={Math.random() * 0.8 + 0.2}
          className="star-animation"
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <polygon
          key={100 + i}
          points="5,0 6,3 10,3.5 7,6 8,10 5,8 2,10 3,6 0,3.5 4,3"
          fill="#fffde4"
          opacity={Math.random() * 0.7 + 0.3}
          className="star-shape-animation"
          transform={`translate(${Math.random() * 280},${Math.random() * 780}) scale(${Math.random() * 0.7 + 0.3})`}
        />
      ))}
      {/* Planets */}
      <g className="planet-animation">
        <circle cx="240" cy="100" r="32" fill="#fca5a5" opacity="0.7" />
        <circle cx="240" cy="100" r="36" fill="none" stroke="#f87171" strokeWidth="2" opacity="0.4" />
        <circle cx="220" cy="120" r="7" fill="#fbbf24" opacity="0.7" />
      </g>
      {/* Asteroids */}
      <g className="asteroid-animation">
        <ellipse cx="260" cy="600" rx="10" ry="5" fill="#a8a29e" opacity="0.8" />
        <ellipse cx="210" cy="550" rx="7" ry="3" fill="#78716c" opacity="0.7" />
      </g>
      {/* Comet */}
      <g className="comet-animation">
        <ellipse cx="100" cy="700" rx="12" ry="4" fill="#fbbf24" opacity="0.7" />
        <rect x="100" y="700" width="30" height="2" fill="#fbbf24" opacity="0.3" transform="rotate(20 100 700)" />
      </g>
      {/* Satellite 1 */}
      <g className="satellite-animation">
        <rect x="120" y="700" width="40" height="20" fill="#ef4444" stroke="#60a5fa" strokeWidth="2" rx="4" />
        <rect x="110" y="705" width="10" height="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <rect x="160" y="705" width="10" height="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <line x1="140" y1="720" x2="140" y2="735" stroke="#ffd700" strokeWidth="2" />
        <circle cx="140" cy="738" r="3" fill="#f59e0b" />
      </g>
      {/* Satellite 2 */}
      <g className="satellite-animation2">
        <rect x="200" y="200" width="30" height="15" fill="#f59e0b" stroke="#60a5fa" strokeWidth="2" rx="3" />
        <rect x="190" y="205" width="8" height="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
        <rect x="230" y="205" width="8" height="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
        <line x1="215" y1="200" x2="215" y2="190" stroke="#ffd700" strokeWidth="2" />
        <circle cx="215" cy="187" r="2" fill="#f59e0b" />
      </g>
      {/* Satellite 3 (dish style) */}
      <g className="satellite-animation3">
        <ellipse cx="100" cy="150" rx="18" ry="8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <rect x="92" y="142" width="16" height="6" fill="#1e293b" />
        <rect x="107" y="140" width="4" height="12" fill="#3b82f6" />
        <line x1="100" y1="150" x2="120" y2="140" stroke="#60a5fa" strokeWidth="2" />
      </g>
      {/* UFO */}
      <g className="ufo-animation">
        <ellipse cx="150" cy="500" rx="18" ry="7" fill="#a5f3fc" />
        <ellipse cx="150" cy="497" rx="10" ry="3" fill="#fbbf24" />
        <rect x="140" y="500" width="20" height="4" fill="#fbbf24" opacity="0.5" />
        <circle cx="150" cy="497" r="2" fill="#f59e0b" />
      </g>
      {/* Rocket */}
      <g className="rocket-animation">
        <rect x="240" y="200" width="10" height="30" fill="#ef4444" rx="5" />
        <polygon points="245,200 240,190 250,190" fill="#ffd700" />
        <polygon points="240,230 238,235 245,232" fill="#b91c1c" />
        <polygon points="250,230 252,235 245,232" fill="#b91c1c" />
        <rect x="243" y="230" width="4" height="6" fill="#374151" />
      </g>
    </svg>
    <style>{`
      .star-animation {
        animation: star-twinkle 2s infinite alternate;
      }
      .star-shape-animation {
        animation: star-twinkle 2.5s infinite alternate;
      }
      @keyframes star-twinkle {
        0% { opacity: 0.2; }
        100% { opacity: 1; }
      }
      .planet-animation {
        animation: planet-move 18s linear infinite;
      }
      @keyframes planet-move {
        0% { transform: translateY(0px); }
        50% { transform: translateY(40px); }
        100% { transform: translateY(0px); }
      }
      .asteroid-animation {
        animation: asteroid-move 12s linear infinite;
      }
      @keyframes asteroid-move {
        0% { transform: translateX(0px); }
        50% { transform: translateX(-30px); }
        100% { transform: translateX(0px); }
      }
      .comet-animation {
        animation: comet-move 10s linear infinite;
      }
      @keyframes comet-move {
        0% { transform: translateX(0px) scale(1); opacity: 1; }
        80% { transform: translateX(80px) scale(0.7); opacity: 0.5; }
        100% { transform: translateX(0px) scale(1); opacity: 1; }
      }
      .satellite-animation {
        animation: satellite-move 9s linear infinite;
        transform-origin: 140px 710px;
      }
      @keyframes satellite-move {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-100px) rotate(-20deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      .satellite-animation2 {
        animation: satellite2-move 11s linear infinite;
        transform-origin: 215px 207px;
      }
      @keyframes satellite2-move {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(60px) rotate(15deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      .satellite-animation3 {
        animation: satellite3-move 13s linear infinite;
        transform-origin: 100px 150px;
      }
      @keyframes satellite3-move {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(40px) rotate(10deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      .ufo-animation {
        animation: ufo-move 15s linear infinite;
      }
      @keyframes ufo-move {
        0% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(60px) scale(1.1); }
        100% { transform: translateY(0px) scale(1); }
      }
      .rocket-animation {
        animation: rocket-move 11s linear infinite;
      }
      @keyframes rocket-move {
        0% { transform: translateY(0px); }
        50% { transform: translateY(70px); }
        100% { transform: translateY(0px); }
      }
    `}</style>
  </div>
);

export default RightSpaceAnimation; 
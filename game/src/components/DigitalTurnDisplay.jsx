import React from 'react';

const SEGMENTS_MAP = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
  '-': ['g'],
  ' ': []
};

function MiniDigit({ char }) {
  const activeSegments = SEGMENTS_MAP[char] || [];

  return (
    <div className="compact-digit-cell">
      <svg viewBox="0 0 50 80" className="compact-digit-svg">
        <polygon points="10,6 40,6 34,14 16,14" className={activeSegments.includes('a') ? 'vfd-on' : 'vfd-off'} />
        <polygon points="41,8 45,13 42,39 36,36 36,14" className={activeSegments.includes('b') ? 'vfd-on' : 'vfd-off'} />
        <polygon points="42,43 45,69 41,74 36,68 36,46" className={activeSegments.includes('c') ? 'vfd-on' : 'vfd-off'} />
        <polygon points="16,68 34,68 40,76 10,76" className={activeSegments.includes('d') ? 'vfd-on' : 'vfd-off'} />
        <polygon points="9,43 14,46 14,68 9,74 5,69" className={activeSegments.includes('e') ? 'vfd-on' : 'vfd-off'} />
        <polygon points="9,8 14,14 14,36 9,39 5,13" className={activeSegments.includes('f') ? 'vfd-on' : 'vfd-off'} />
        <polygon points="15,37 35,37 39,41 35,45 15,45 11,41" className={activeSegments.includes('g') ? 'vfd-on' : 'vfd-off'} />
      </svg>
    </div>
  );
}

export default function DigitalTurnDisplay({ turn, maxTurns = 8 }) {
  const formattedTurn = String(turn).padStart(2, '0');
  const formattedMax = String(maxTurns).padStart(2, '0');

  return (
    <div className="glass-screen-capsule compact-turn-capsule">
      <div className="capsule-top-meta">
        <span className="capsule-label">TURN</span>
        <span className="capsule-sub-label">MAX {maxTurns}</span>
      </div>

      <div className="vfd-digits-compact-row">
        {/* Số lượt hiện tại (Ví dụ: 01) */}
        <div className="digit-pair pair-active">
          <MiniDigit char={formattedTurn[0]} />
          <MiniDigit char={formattedTurn[1]} />
        </div>

        {/* Dấu gạch ngang VFD LED cyan */}
        <div className="vfd-dash-separator">-</div>

        {/* Số lượt tối đa (08) */}
        <div className="digit-pair pair-max">
          <MiniDigit char={formattedMax[0]} />
          <MiniDigit char={formattedMax[1]} />
        </div>
      </div>

      {/* LỚP KÍNH PHẢN QUANG SAPPHIRE */}
      <div className="glass-reflection-overlay">
        <div className="glass-sheen-sweep" />
        <div className="glass-rim-highlight" />
      </div>
    </div>
  );
}

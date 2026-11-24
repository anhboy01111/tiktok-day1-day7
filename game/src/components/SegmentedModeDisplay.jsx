import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DIFFICULTY_CONFIGS, DIFFICULTY_KEYS } from '../constants';

const ALPHANUMERIC_MAP = {
  'N': ['e', 'f', 'h', 'k', 'b', 'c'],
  'O': ['a', 'b', 'c', 'd', 'e', 'f'],
  'V': ['f', 'e', 'm', 'j'],
  'I': ['a', 'd', 'i', 'l'],
  'C': ['a', 'f', 'e', 'd'],
  'E': ['a', 'f', 'e', 'd', 'g1', 'g2'],
  'L': ['f', 'e', 'd'],
  'A': ['e', 'f', 'a', 'b', 'c', 'g1', 'g2'],
  'S': ['a', 'f', 'g1', 'g2', 'c', 'd'],
  'D': ['a', 'd', 'b', 'c', 'i', 'l'],
  'M': ['e', 'f', 'h', 'j', 'b', 'c'],
  'T': ['a', 'i', 'l'],
  'R': ['e', 'f', 'a', 'b', 'g1', 'g2', 'k'],
  'W': ['e', 'f', 'm', 'k', 'b', 'c'],
  ' ': []
};

function FourteenSegmentChar({ char }) {
  const active = ALPHANUMERIC_MAP[char?.toUpperCase()] || [];

  return (
    <div className="fourteen-seg-char">
      <svg viewBox="0 0 36 54" className="fourteen-seg-svg">
        {/* a - Top */}
        <polygon points="5,2 31,2 26,6 10,6" className={active.includes('a') ? 'seg-lit' : 'seg-dim'} />
        {/* b - Top Right */}
        <polygon points="32,4 35,7 33,24 30,22 30,8" className={active.includes('b') ? 'seg-lit' : 'seg-dim'} />
        {/* c - Bottom Right */}
        <polygon points="33,28 35,47 32,50 30,46 30,30" className={active.includes('c') ? 'seg-lit' : 'seg-dim'} />
        {/* d - Bottom */}
        <polygon points="10,48 26,48 31,52 5,52" className={active.includes('d') ? 'seg-lit' : 'seg-dim'} />
        {/* e - Bottom Left */}
        <polygon points="4,28 6,30 6,46 4,50 1,47" className={active.includes('e') ? 'seg-lit' : 'seg-dim'} />
        {/* f - Top Left */}
        <polygon points="4,4 6,8 6,22 3,24 1,7" className={active.includes('f') ? 'seg-lit' : 'seg-dim'} />
        {/* g1 - Mid Left */}
        <polygon points="7,25 17,25 15,28 7,28" className={active.includes('g1') ? 'seg-lit' : 'seg-dim'} />
        {/* g2 - Mid Right */}
        <polygon points="19,25 29,25 29,28 21,28" className={active.includes('g2') ? 'seg-lit' : 'seg-dim'} />
        {/* h - Top Left Diag */}
        <polygon points="8,9 15,22 13,23 7,13" className={active.includes('h') ? 'seg-lit' : 'seg-dim'} />
        {/* i - Top Mid Vert */}
        <polygon points="17,7 19,7 19,23 17,23" className={active.includes('i') ? 'seg-lit' : 'seg-dim'} />
        {/* j - Top Right Diag */}
        <polygon points="28,9 29,13 23,23 21,22" className={active.includes('j') ? 'seg-lit' : 'seg-dim'} />
        {/* m - Bot Left Diag */}
        <polygon points="15,31 13,30 7,41 8,45" className={active.includes('m') ? 'seg-lit' : 'seg-dim'} />
        {/* l - Bot Mid Vert */}
        <polygon points="17,31 19,31 19,47 17,47" className={active.includes('l') ? 'seg-lit' : 'seg-dim'} />
        {/* k - Bot Right Diag */}
        <polygon points="21,31 23,30 29,41 28,45" className={active.includes('k') ? 'seg-lit' : 'seg-dim'} />
      </svg>
    </div>
  );
}

export default function SegmentedModeDisplay({
  currentModeId = 'novice',
  onPrev,
  onNext,
  canPrev,
  canNext,
  onCycle
}) {
  const cfg = DIFFICULTY_CONFIGS[currentModeId] || DIFFICULTY_CONFIGS.novice;
  const textChars = cfg.name.padEnd(7, ' ').slice(0, 7).split('');

  return (
    <div className="mode-selector-glass-cluster">
      {/* NÚT MŨI TÊN TRÁI < */}
      <button
        type="button"
        className="glass-step-btn"
        onClick={onPrev}
        disabled={!canPrev}
        title="Previous Difficulty"
      >
        <ChevronLeft size={18} strokeWidth={2.4} />
      </button>

      {/* MÀN HÌNH LED KÍNH SAPPHIRE HIỂN THỊ CHẾ ĐỘ (VD: < ADVANCE >) */}
      <div 
        className="glass-screen-capsule mode-capsule" 
        onClick={onCycle} 
        title="Click to cycle Difficulty Mode"
      >
        <div className="capsule-top-meta">
          <span className="capsule-label">DIFFICULTY</span>
          <span className="capsule-badge">{cfg.colorCount} COLORS</span>
        </div>

        <div className="alphanumeric-chars-row">
          {textChars.map((ch, idx) => (
            <FourteenSegmentChar key={idx} char={ch} />
          ))}
        </div>

        {/* LỚP PHẢN QUANG KÍNH SAPPHIRE ĐẬM CHẤT THIẾT BỊ THẬT */}
        <div className="glass-reflection-overlay">
          <div className="glass-sheen-sweep" />
          <div className="glass-rim-highlight" />
        </div>
      </div>

      {/* NÚT MŨI TÊN PHẢI > */}
      <button
        type="button"
        className="glass-step-btn"
        onClick={onNext}
        disabled={!canNext}
        title="Next Difficulty"
      >
        <ChevronRight size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
}

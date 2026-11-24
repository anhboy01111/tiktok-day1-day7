import React from 'react';

// Bản đồ các đoạn LED cho chữ số 0-9
// Các đoạn: a (top), b (top-right), c (bottom-right), d (bottom), e (bottom-left), f (top-left), g (middle)
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

function Digit({ char }) {
  const activeSegments = SEGMENTS_MAP[char] || [];

  return (
    <div className="digit-container">
      {/* Background shadow of all unlit segments */}
      <svg viewBox="0 0 50 80" className="digit-svg">
        <defs>
          <filter id="led-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Segment A */}
        <polygon
          points="10,6 40,6 34,14 16,14"
          className={activeSegments.includes('a') ? 'segment active' : 'segment inactive'}
        />
        {/* Segment B */}
        <polygon
          points="41,8 45,13 42,39 36,36 36,14"
          className={activeSegments.includes('b') ? 'segment active' : 'segment inactive'}
        />
        {/* Segment C */}
        <polygon
          points="42,43 45,69 41,74 36,68 36,46"
          className={activeSegments.includes('c') ? 'segment active' : 'segment inactive'}
        />
        {/* Segment D */}
        <polygon
          points="16,68 34,68 40,76 10,76"
          className={activeSegments.includes('d') ? 'segment active' : 'segment inactive'}
        />
        {/* Segment E */}
        <polygon
          points="9,43 14,46 14,68 9,74 5,69"
          className={activeSegments.includes('e') ? 'segment active' : 'segment inactive'}
        />
        {/* Segment F */}
        <polygon
          points="9,8 14,14 14,36 9,39 5,13"
          className={activeSegments.includes('f') ? 'segment active' : 'segment inactive'}
        />
        {/* Segment G */}
        <polygon
          points="15,37 35,37 39,41 35,45 15,45 11,41"
          className={activeSegments.includes('g') ? 'segment active' : 'segment inactive'}
        />
      </svg>
    </div>
  );
}

export default function SevenSegment({ value }) {
  // Đảm bảo luôn có 3 chữ số (VD: 001, 042, 299)
  const formatted = String(value).padStart(3, '0').slice(-3);

  return (
    <div className="seven-segment-display">
      <div className="digit-row">
        {formatted.split('').map((char, index) => (
          <Digit key={index} char={char} />
        ))}
      </div>
      <div className="display-glare" />
    </div>
  );
}

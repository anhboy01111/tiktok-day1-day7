// 8 Standard arcade colors
export const ALL_COLORS = [
  { id: 'red', name: 'RED', hex: '#ff2d2d', glow: '#ff2d2d', soundFreq: 440 },
  { id: 'orange', name: 'ORANGE', hex: '#ff8a00', glow: '#ff8a00', soundFreq: 494 },
  { id: 'yellow', name: 'YELLOW', hex: '#ffd600', glow: '#ffd600', soundFreq: 554 },
  { id: 'green', name: 'GREEN', hex: '#00e676', glow: '#00e676', soundFreq: 587 },
  { id: 'cyan', name: 'CYAN', hex: '#00e5ff', glow: '#00e5ff', soundFreq: 659 },
  { id: 'blue', name: 'BLUE', hex: '#2979ff', glow: '#2979ff', soundFreq: 740 },
  { id: 'purple', name: 'PURPLE', hex: '#ba55d3', glow: '#ba55d3', soundFreq: 831 },
  { id: 'white', name: 'WHITE', hex: '#ffffff', glow: '#ffffff', soundFreq: 880 },
];

export const TOTAL_ROWS = 8;
export const CODE_LENGTH = 4;

// 4 Cấp độ khó: NOVICE (5), CLASSIC (6), ADVANCE (7), MASTER (8)
export const DIFFICULTY_CONFIGS = {
  novice: {
    id: 'novice',
    name: 'NOVICE',
    colorCount: 5,
    colors: ALL_COLORS.slice(0, 5),
    desc: '5 Colors Active. Pure logical deduction, perfect for warm-up.'
  },
  classic: {
    id: 'classic',
    name: 'CLASSIC',
    colorCount: 6,
    colors: ALL_COLORS.slice(0, 6),
    desc: '6 Colors Active. Standard Mastermind balance.'
  },
  advanced: {
    id: 'advanced',
    name: 'ADVANCE',
    colorCount: 7,
    colors: ALL_COLORS.slice(0, 7),
    desc: '7 Colors Active. Advanced logic deduction challenge.'
  },
  master: {
    id: 'master',
    name: 'MASTER',
    colorCount: 8,
    colors: ALL_COLORS.slice(0, 8),
    desc: '8 Colors Active. Full master codebreaker difficulty.'
  }
};

export const DIFFICULTY_KEYS = ['novice', 'classic', 'advanced', 'master'];

export function getAvailableColors(difficulty = 'novice') {
  return DIFFICULTY_CONFIGS[difficulty]?.colors || DIFFICULTY_CONFIGS.novice.colors;
}

// Sinh mật mã bí mật theo độ khó (100% UNIQUE COLORS - TUYỆT ĐỐI KHÔNG TRÙNG MÀU)
export function generateSecretCode(difficulty = 'novice', seedNumber = Date.now()) {
  const availableColors = getAvailableColors(difficulty);

  let seed = (seedNumber * 9301 + 49297) % 233280;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const code = [];
  const pool = [...availableColors];

  // Rút 4 màu hoàn toàn khác biệt từ pool (không lặp lại)
  for (let i = 0; i < CODE_LENGTH; i++) {
    const idx = Math.floor(pseudoRandom() * pool.length);
    code.push(pool.splice(idx, 1)[0].id);
  }

  return code;
}

// Evaluate guess feedback: exact match (Green LED), partial match (White LED)
export function evaluateGuess(guess, secretCode) {
  let exact = 0;
  let partial = 0;

  const secretRemaining = [];
  const guessRemaining = [];

  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === secretCode[i]) {
      exact++;
    } else {
      secretRemaining.push(secretCode[i]);
      guessRemaining.push(guess[i]);
    }
  }

  for (let i = 0; i < guessRemaining.length; i++) {
    const foundIndex = secretRemaining.indexOf(guessRemaining[i]);
    if (foundIndex !== -1) {
      partial++;
      secretRemaining.splice(foundIndex, 1);
    }
  }

  return { exact, partial };
}

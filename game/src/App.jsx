import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, VolumeX, HelpCircle, Sparkles, ChevronsRight, RotateCcw, SlidersHorizontal
} from 'lucide-react';
import { 
  ALL_COLORS, TOTAL_ROWS, CODE_LENGTH, 
  DIFFICULTY_CONFIGS, DIFFICULTY_KEYS, getAvailableColors, 
  generateSecretCode, evaluateGuess 
} from './constants';
import { sounds } from './sounds';
import SegmentedModeDisplay from './components/SegmentedModeDisplay';
import DigitalTurnDisplay from './components/DigitalTurnDisplay';
import PegGrid from './components/PegGrid';
import Palette from './components/Palette';
import TransparentPCBWindow from './components/TransparentPCBWindow';
import OnDeviceMenu from './components/OnDeviceMenu';

export default function App() {
  // Trạng thái độ khó: 'novice' | 'classic' | 'advanced' | 'master'
  const [difficulty, setDifficulty] = useState(() => {
    return localStorage.getItem('mastermind_difficulty') || 'novice';
  });

  // Màn hình hiển thị nội bộ ('game' hoặc 'menu')
  const [currentView, setCurrentView] = useState('game');
  const [menuTab, setMenuTab] = useState('settings');

  const [soundOn, setSoundOn] = useState(true);
  const [hintsLeft, setHintsLeft] = useState(3);

  // Danh sách màu khả dụng theo cấp độ khó hiện tại
  const availableColors = getAvailableColors(difficulty);

  // Mật mã bí mật (100% Unique colors)
  const [secretCode, setSecretCode] = useState([]);

  // Lịch sử 8 hàng
  const [history, setHistory] = useState(() =>
    Array(TOTAL_ROWS).fill(null).map(() => ({ guess: [], feedback: null }))
  );

  const [currentRow, setCurrentRow] = useState(0);
  const [winningRowIndex, setWinningRowIndex] = useState(null);
  const [currentGuess, setCurrentGuess] = useState([null, null, null, null]);
  const [activeCol, setActiveCol] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'evaluating' | 'won' | 'lost'

  // Trạng thái đèn bo mạch trong suốt
  const [topLightMode, setTopLightMode] = useState('idle');

  // Khởi tạo game mới theo độ khó (100% Unique colors)
  const initGame = useCallback((targetDiff = difficulty) => {
    const newCode = generateSecretCode(targetDiff);
    setSecretCode(newCode);
    setHistory(Array(TOTAL_ROWS).fill(null).map(() => ({ guess: [], feedback: null })));
    setCurrentRow(0);
    setWinningRowIndex(null);
    setCurrentGuess([null, null, null, null]);
    setActiveCol(0);
    setGameState('playing');
    setTopLightMode('idle');
    setHintsLeft(3);
    localStorage.setItem('mastermind_difficulty', targetDiff);
  }, [difficulty]);

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty, initGame]);

  // Đổi độ khó
  const handleSelectDifficulty = (newDiff) => {
    setDifficulty(newDiff);
    initGame(newDiff);
  };

  const diffIdx = DIFFICULTY_KEYS.indexOf(difficulty);

  const handlePrevDifficulty = () => {
    if (diffIdx > 0) {
      sounds.playClick();
      sounds.vibrate(20);
      handleSelectDifficulty(DIFFICULTY_KEYS[diffIdx - 1]);
    }
  };

  const handleNextDifficulty = () => {
    if (diffIdx < DIFFICULTY_KEYS.length - 1) {
      sounds.playClick();
      sounds.vibrate(20);
      handleSelectDifficulty(DIFFICULTY_KEYS[diffIdx + 1]);
    }
  };

  const handleCycleDifficulty = () => {
    sounds.playClick();
    sounds.vibrate(20);
    const nextIdx = (diffIdx + 1) % DIFFICULTY_KEYS.length;
    handleSelectDifficulty(DIFFICULTY_KEYS[nextIdx]);
  };

  // Bật / tắt âm thanh
  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    sounds.enabled = nextState;
    if (nextState) sounds.playClick();
  };

  // Mở menu hệ thống nội bộ trên màn hình máy
  const openInternalMenu = (tab = 'settings') => {
    sounds.playClick();
    sounds.vibrate(20);
    setMenuTab(tab);
    setCurrentView('menu');
  };

  // Chọn ô trên hàng hiện tại
  const handleSelectSlot = (colIdx) => {
    if (gameState !== 'playing' || currentView !== 'game') return;
    setActiveCol(colIdx);
  };

  // Chọn màu đưa vào ô đang active (100% Unique: tự gỡ ô cũ nếu chọn màu đã có)
  const handlePickColor = (colorId) => {
    if (gameState !== 'playing' || currentView !== 'game') return;

    const newGuess = [...currentGuess];

    const existingIdx = newGuess.indexOf(colorId);
    if (existingIdx !== -1 && existingIdx !== activeCol) {
      newGuess[existingIdx] = null;
    }

    newGuess[activeCol] = colorId;
    setCurrentGuess(newGuess);

    // Tự động nhảy sang ô trống tiếp theo
    let nextCol = (activeCol + 1) % CODE_LENGTH;
    for (let i = 0; i < CODE_LENGTH; i++) {
      const checkIdx = (activeCol + 1 + i) % CODE_LENGTH;
      if (newGuess[checkIdx] === null) {
        nextCol = checkIdx;
        break;
      }
    }
    setActiveCol(nextCol);
  };

  // Xóa màu ô hiện tại
  const handleDeleteCurrent = () => {
    if (gameState !== 'playing' || currentView !== 'game') return;
    sounds.playClick();
    sounds.vibrate(20);

    const newGuess = [...currentGuess];
    if (newGuess[activeCol] !== null) {
      newGuess[activeCol] = null;
      setCurrentGuess(newGuess);
    } else {
      const prevCol = (activeCol - 1 + CODE_LENGTH) % CODE_LENGTH;
      setActiveCol(prevCol);
      newGuess[prevCol] = null;
      setCurrentGuess(newGuess);
    }
  };

  // Gợi ý 1 ô đúng
  const handleUseHint = () => {
    if (hintsLeft <= 0 || gameState !== 'playing' || currentView !== 'game') return;

    const wrongIndices = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (currentGuess[i] !== secretCode[i]) {
        wrongIndices.push(i);
      }
    }

    if (wrongIndices.length > 0) {
      const targetCol = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      const targetColor = secretCode[targetCol];
      const newGuess = [...currentGuess];

      const existingIdx = newGuess.indexOf(targetColor);
      if (existingIdx !== -1 && existingIdx !== targetCol) {
        newGuess[existingIdx] = null;
      }

      newGuess[targetCol] = targetColor;
      setCurrentGuess(newGuess);
      setActiveCol((targetCol + 1) % CODE_LENGTH);
      setHintsLeft((prev) => prev - 1);
      sounds.playColorSelect(700);
      sounds.vibrate(40);
    }
  };

  // Điều kiện để được nộp hàng: điền đủ 4 ô và 4 màu hoàn toàn khác biệt
  const isAllFilled = currentGuess.every((c) => c !== null);
  const isUniqueValid = new Set(currentGuess.filter(Boolean)).size === CODE_LENGTH;
  const canSubmit = isAllFilled && isUniqueValid && gameState === 'playing' && currentView === 'game';

  // Nộp kết quả phỏng đoán
  const handleSubmitGuess = () => {
    if (!canSubmit) return;

    const rowBeingSubmitted = currentRow;
    setGameState('evaluating');
    setTopLightMode('scanning');
    sounds.playClick();
    sounds.vibrate(40);

    const feedback = evaluateGuess(currentGuess, secretCode);

    setTimeout(() => {
      if (feedback.exact > 0) {
        sounds.playScanPing(true);
      } else if (feedback.partial > 0) {
        sounds.playScanPing(false);
      }

      const newHistory = [...history];
      newHistory[rowBeingSubmitted] = {
        guess: [...currentGuess],
        feedback: feedback
      };
      setHistory(newHistory);

      // Thắng nếu đoán đúng cả 4 ô (4 đèn xanh)
      if (feedback.exact === CODE_LENGTH) {
        setGameState('won');
        setWinningRowIndex(rowBeingSubmitted);
        setTopLightMode('success');
        sounds.playWin();
        sounds.vibrate(120);

        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.55 },
            colors: ['#00ff66', '#00e5ff', '#ffd600', '#ffffff', '#ff8a00']
          });
        } catch {}
      } 
      // Thua nếu đã hết 8 hàng
      else if (rowBeingSubmitted + 1 >= TOTAL_ROWS) {
        setGameState('lost');
        setTopLightMode('alert');
        sounds.playGameOver();
        sounds.vibrate(200);
      } 
      // Qua hàng tiếp theo
      else {
        setCurrentRow((r) => r + 1);
        setCurrentGuess([null, null, null, null]);
        setActiveCol(0);
        setGameState('playing');
        setTopLightMode('idle');
      }
    }, 450);
  };

  return (
    <div className="app-shell">
      {/* THIẾT BỊ CẦM TAY 3D CHẤT LIỆU SILICONE / NHỰA NHÁM MỜ CAO CẤP */}
      <div className="handheld-device">
        {/* GỜ BÁM VÂN TAY CHỐNG TRƯỢT 2 BÊN HÔNG MÁY */}
        <div className="chassis-side-grip grip-left">
          <div className="grip-rib" /><div className="grip-rib" /><div className="grip-rib" /><div className="grip-rib" />
        </div>
        <div className="chassis-side-grip grip-right">
          <div className="grip-rib" /><div className="grip-rib" /><div className="grip-rib" /><div className="grip-rib" />
        </div>

        {/* THÂN VỎ MÁY MÀU XANH 3D SILICONE CAO CẤP */}
        <div className="device-chassis">
          {/* 4 ĐINH ỐC TITAN CHÌM Ở 4 GÓC VÁT */}
          <div className="screw screw-top-left" />
          <div className="screw screw-top-right" />
          <div className="screw screw-bottom-left" />
          <div className="screw screw-bottom-right" />

          {/* HEADER TRÊN CÙNG: HELP SQUIRCLE + CỬA SỔ KÍNH TRONG SUỐT LỘ MẠCH + CÀI ĐẶT */}
          <div className="device-top-bar">
            <button
              type="button"
              className="left-help-squircle-btn"
              onClick={() => openInternalMenu('rules')}
              title="Game Rules & Guide"
            >
              <div className="help-icon-ring">
                <HelpCircle size={18} strokeWidth={2.4} />
              </div>
            </button>

            {/* CỬA SỔ KÍNH TRONG SUỐT LỘ BẢNG MẠCH THẬT CHUẨN ẢNH MẪU */}
            <TransparentPCBWindow 
              statusMode={topLightMode}
              onClick={() => openInternalMenu('settings')}
            />

            <div className="top-right-tools">
              <button
                type="button"
                className="icon-tool-btn"
                onClick={() => openInternalMenu('settings')}
                title="System Settings & Difficulty"
              >
                <SlidersHorizontal size={16} />
              </button>

              <button
                type="button"
                className="icon-tool-btn"
                onClick={toggleSound}
                title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
              >
                {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </button>
            </div>
          </div>

          {/* MÀN HÌNH CHÍNH (FACEPLATE): TÍCH HỢP TRỰC TIẾP GAME GRID HOẶC MENU NỘI BỘ */}
          <div className="device-faceplate">
            {currentView === 'menu' ? (
              /* MENU CÀI ĐẶT NỘI BỘ TRÊN MÀN HÌNH MÁY */
              <OnDeviceMenu
                activeTab={menuTab}
                setActiveTab={setMenuTab}
                difficulty={difficulty}
                onSelectDifficulty={handleSelectDifficulty}
                soundOn={soundOn}
                toggleSound={toggleSound}
                onClose={() => setCurrentView('game')}
              />
            ) : (
              /* MÀN HÌNH BÀN CỜ PHÁ MÃ */
              <>
                {/* LƯỚI 8 HÀNG TRONG HỘP KÍNH SAPPHIRE DẬP CHÌM */}
                <div className="grid-glass-capsule">
                  <div className="grid-glass-reflection-sweep" />
                  <div className="grid-glass-rim-bezel" />
                  <PegGrid
                    history={history}
                    currentRow={currentRow}
                    currentGuess={currentGuess}
                    activeCol={activeCol}
                    onSelectSlot={handleSelectSlot}
                    isGameOver={gameState !== 'playing' && gameState !== 'evaluating'}
                    winningRow={winningRowIndex}
                  />
                </div>

                {/* THANH THÔNG TIN MÀU KHẢ DỤNG */}
                <div className="legend-strip">
                  <div className="legend-dots">
                    {ALL_COLORS.map((c) => {
                      const isAvailable = availableColors.some((ac) => ac.id === c.id);
                      return (
                        <span
                          key={c.id}
                          className={`legend-dot ${!isAvailable ? 'dot-locked' : ''}`}
                          style={{ 
                            backgroundColor: isAvailable ? c.hex : '#1e242a',
                            boxShadow: isAvailable ? `0 0 6px ${c.glow}` : 'none' 
                          }}
                          title={c.name}
                        />
                      );
                    })}
                  </div>
                  <div className="level-pool-info">
                    {availableColors.length} ACTIVE COLORS
                  </div>
                </div>

                {/* BẢNG CHỌN MÀU & 4 PHÍM KÝ HIỆU ĐÈN LED HUỲNH QUANG */}
                <Palette
                  availableColors={availableColors}
                  selectedColor={currentGuess[activeCol]}
                  onPickColor={handlePickColor}
                  onSubmitGuess={handleSubmitGuess}
                  onDeleteCurrent={handleDeleteCurrent}
                  canSubmit={canSubmit}
                  onUseHint={handleUseHint}
                  hintsLeft={hintsLeft}
                  onNewGame={() => initGame(difficulty)}
                />
              </>
            )}
          </div>

          {/* KHU VỰC ĐÁY MÁY: < DIFFICULTY > BÊN TRÁI & MÀN HÌNH TURN 01-08 THU GỌN BÊN PHẢI */}
          <div className="device-bottom-panel-clean">
            {/* CỤM ĐỔI ĐỘ KHÓ < ADVANCE > BẰNG KÍNH SAPPHIRE CHUẨN YÊU CẦU */}
            <SegmentedModeDisplay 
              currentModeId={difficulty}
              onPrev={handlePrevDifficulty}
              onNext={handleNextDifficulty}
              canPrev={diffIdx > 0}
              canNext={diffIdx < DIFFICULTY_KEYS.length - 1}
              onCycle={handleCycleDifficulty}
            />

            {/* BÊN PHẢI: KHI THẮNG HIỆN NÚT QUA MÀN | BÌNH THƯỜNG HIỆN MÀN HÌNH TURN 01-08 THU GỌN */}
            {gameState === 'won' ? (
              <button
                type="button"
                className="next-level-trigger-btn"
                onClick={() => {
                  sounds.playClick();
                  initGame(difficulty);
                }}
                title="Next Puzzle"
              >
                <div className="next-level-glow-core">
                  <Sparkles size={16} className="sparkle-icon" />
                  <span className="next-level-text">NEXT</span>
                  <ChevronsRight size={18} className="next-level-icon" />
                </div>
              </button>
            ) : (
              /* MÀN HÌNH TURN 01-08 THU GỌN KÍNH SAPPHIRE NẰM BÊN PHẢI */
              <DigitalTurnDisplay 
                turn={currentRow + 1}
                maxTurns={TOTAL_ROWS}
              />
            )}
          </div>
        </div>
      </div>

      {/* THANH BÁO THUA TIẾT LỘ ĐÁP ÁN GỌN GÀNG (KHÔNG CHE BÀN CỜ) */}
      {gameState === 'lost' && (
        <div className="defeat-strip">
          <div className="defeat-left">
            <span className="defeat-title">SECRET CODE:</span>
            <div className="mini-reveal-row">
              {secretCode.map((colId, idx) => {
                const c = ALL_COLORS.find((col) => col.id === colId);
                return (
                  <div
                    key={idx}
                    className="mini-peg"
                    style={{ backgroundColor: c.hex, boxShadow: `0 0 8px ${c.glow}` }}
                  />
                );
              })}
            </div>
          </div>
          <button
            type="button"
            className="defeat-retry-btn"
            onClick={() => initGame(difficulty)}
          >
            <RotateCcw size={15} />
            <span>RETRY</span>
          </button>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ALL_COLORS as COLORS } from '../constants';
import { sounds } from '../sounds';

export default function PegGrid({
  history,
  currentRow,
  currentGuess,
  activeCol,
  onSelectSlot,
  isGameOver,
  winningRow
}) {
  return (
    <div className="grid-container">
      {history.map((rowResult, rowIndex) => {
        const isCurrent = rowIndex === currentRow && !isGameOver;
        const isPast = rowIndex < currentRow || (isGameOver && rowResult.guess.length > 0);
        const isWinning = rowIndex === winningRow;

        const rowSlots = isCurrent
          ? currentGuess
          : isPast
          ? rowResult.guess
          : [null, null, null, null];

        const feedback = isPast ? rowResult.feedback : null;

        const pins = [];
        if (feedback) {
          for (let i = 0; i < feedback.exact; i++) pins.push('exact');
          for (let i = 0; i < feedback.partial; i++) pins.push('partial');
        }
        while (pins.length < 4) pins.push('none');

        return (
          <div
            key={rowIndex}
            className={`grid-row ${isCurrent ? 'row-active' : ''} ${isPast ? 'row-past' : ''} ${
              isWinning ? 'row-victory' : ''
            }`}
          >
            {/* CỤM 4 SOCKET NÚT PEG */}
            <div className="slots-container">
              {rowSlots.map((colorId, colIndex) => {
                const colorObj = COLORS.find((c) => c.id === colorId);
                const isSelected = isCurrent && activeCol === colIndex;

                return (
                  <div key={colIndex} className="peg-socket-well">
                    <button
                      type="button"
                      className={`peg-button ${colorObj ? (isCurrent ? 'lit-active' : 'lit') : 'empty'} ${
                        isSelected ? 'slot-focused' : ''
                      } ${isWinning ? 'peg-victory' : ''}`}
                      onClick={() => {
                        if (isCurrent) {
                          sounds.playClick();
                          sounds.vibrate(25);
                          onSelectSlot(colIndex);
                        }
                      }}
                      style={{
                        '--peg-color': colorObj ? colorObj.hex : '#1c2126',
                        '--peg-glow': colorObj ? colorObj.glow : 'transparent'
                      }}
                    >
                      <div className="peg-inner">
                        <div className="peg-surface-matte" />
                      </div>
                      {isSelected && <div className="active-cursor-dash" />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* CHỈ SỐ HÀNG KHẮC LASER CHÌM TINH XẢO (01 - 08) */}
            <div className="row-index-indicator">
              <span className="row-num-text">{rowIndex + 1}</span>
            </div>

            {/* CỤM 4 CHÂN GHIM PHẢN HỒI KẾT QUẢ VỚI HỐC KIM LOẠI DẬP CHÌM */}
            <div className={`feedback-container ${isWinning ? 'feedback-victory' : ''}`}>
              <div className="feedback-col">
                <div className={`feedback-dot ${pins[0]}`}>
                  <div className="dot-pin-core" />
                </div>
                <div className={`feedback-dot ${pins[2]}`}>
                  <div className="dot-pin-core" />
                </div>
              </div>
              <div className="feedback-col">
                <div className={`feedback-dot ${pins[1]}`}>
                  <div className="dot-pin-core" />
                </div>
                <div className={`feedback-dot ${pins[3]}`}>
                  <div className="dot-pin-core" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

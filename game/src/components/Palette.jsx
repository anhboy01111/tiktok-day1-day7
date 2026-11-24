import React from 'react';
import { ALL_COLORS } from '../constants';
import { sounds } from '../sounds';
import { Check, Delete, RotateCcw, Lightbulb, Lock } from 'lucide-react';

export default function Palette({
  availableColors,
  selectedColor,
  onPickColor,
  onSubmitGuess,
  onDeleteCurrent,
  canSubmit,
  onUseHint,
  hintsLeft,
  onNewGame
}) {
  const availableIds = availableColors.map((c) => c.id);

  return (
    <div className="palette-panel">
      <div className="palette-swatches">
        {ALL_COLORS.map((col) => {
          const isAvailable = availableIds.includes(col.id);
          const isCurrent = selectedColor === col.id;

          return (
            <button
              key={col.id}
              type="button"
              disabled={!isAvailable}
              className={`swatch-btn ${isCurrent ? 'selected' : ''} ${!isAvailable ? 'swatch-locked' : ''}`}
              style={{
                '--col-hex': col.hex,
                '--col-glow': col.glow
              }}
              onClick={() => {
                if (isAvailable) {
                  sounds.playColorSelect(col.soundFreq);
                  sounds.vibrate(20);
                  onPickColor(col.id);
                }
              }}
              title={isAvailable ? col.name : `${col.name} (Locked)`}
            >
              {isAvailable ? (
                <div className="swatch-core" />
              ) : (
                <Lock size={12} className="lock-icon" />
              )}
            </button>
          );
        })}
      </div>

      <div className="led-action-toolbar">
        <button
          type="button"
          className="led-action-key key-delete"
          onClick={onDeleteCurrent}
          title="Delete"
        >
          <div className="led-glass-screen">
            <Delete size={20} strokeWidth={2.4} className="led-symbol symbol-delete" />
            <div className="led-glare" />
          </div>
        </button>

        <button
          type="button"
          className={`led-action-key key-hint ${hintsLeft <= 0 ? 'is-disabled' : ''}`}
          onClick={onUseHint}
          disabled={hintsLeft <= 0}
          title={`Hint (${hintsLeft} left)`}
        >
          <div className="led-glass-screen">
            <div className="hint-led-combo">
              <Lightbulb size={20} strokeWidth={2.4} className="led-symbol symbol-hint" />
              <span className="hint-digit-led">{hintsLeft}</span>
            </div>
            <div className="led-glare" />
          </div>
        </button>

        <button
          type="button"
          className="led-action-key key-reset"
          onClick={onNewGame}
          title="Restart"
        >
          <div className="led-glass-screen">
            <RotateCcw size={19} strokeWidth={2.4} className="led-symbol symbol-reset" />
            <div className="led-glare" />
          </div>
        </button>

        <button
          type="button"
          className={`led-action-key key-submit ${canSubmit ? 'is-ready' : 'is-disabled'}`}
          onClick={onSubmitGuess}
          disabled={!canSubmit}
          title="Submit"
        >
          <div className="led-glass-screen">
            <Check size={24} strokeWidth={3.5} className="led-symbol symbol-submit" />
            <div className="led-glare" />
          </div>
        </button>
      </div>
    </div>
  );
}

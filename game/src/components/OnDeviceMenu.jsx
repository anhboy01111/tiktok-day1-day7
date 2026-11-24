import React from 'react';
import { Volume2, VolumeX, HelpCircle, SlidersHorizontal, Play, ShieldCheck } from 'lucide-react';
import { sounds } from '../sounds';
import { DIFFICULTY_CONFIGS, DIFFICULTY_KEYS } from '../constants';

export default function OnDeviceMenu({
  activeTab = 'settings',
  setActiveTab,
  difficulty,
  onSelectDifficulty,
  soundOn,
  toggleSound,
  onClose
}) {
  return (
    <div className="on-device-menu-screen">
      {/* HEADER TABS TRÊN MÀN HÌNH NỘI BỘ */}
      <div className="menu-screen-header">
        <button
          type="button"
          className={`menu-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => {
            sounds.playClick();
            setActiveTab('settings');
          }}
        >
          <SlidersHorizontal size={14} />
          <span>SETTINGS</span>
        </button>

        <button
          type="button"
          className={`menu-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => {
            sounds.playClick();
            setActiveTab('rules');
          }}
        >
          <HelpCircle size={14} />
          <span>RULES</span>
        </button>
      </div>

      {/* NỘI DUNG MÀN HÌNH SETTINGS */}
      {activeTab === 'settings' && (
        <div className="menu-body-scroll">
          {/* MỤC 1: CHỌN ĐỘ KHÓ (NOVICE, CLASSIC, ADVANCED, MASTER) */}
          <div className="menu-section-title">SELECT DIFFICULTY</div>
          <div className="menu-difficulty-grid">
            {DIFFICULTY_KEYS.map((key) => {
              const cfg = DIFFICULTY_CONFIGS[key];
              const isSelected = difficulty === key;

              return (
                <button
                  key={key}
                  type="button"
                  className={`diff-select-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    sounds.vibrate(20);
                    onSelectDifficulty(key);
                  }}
                >
                  <div className="diff-btn-top">
                    <strong>{cfg.name}</strong>
                    <span className="diff-badge">{cfg.colorCount} COLORS</span>
                  </div>
                  <span className="diff-desc-text">{cfg.desc}</span>
                </button>
              );
            })}
          </div>

          {/* QUY TẮC MẬT MÃ CHUẨN MỰC: 100% UNIQUE COLORS */}
          <div className="menu-section-title mt-2">CODE STANDARD</div>
          <div className="standard-rule-card">
            <ShieldCheck size={18} className="text-lime" />
            <div className="standard-text">
              <strong>100% UNIQUE COLORS ONLY</strong>
              <p>Duplicate colors are strictly disabled. Pure deductive logic.</p>
            </div>
          </div>

          {/* MỤC 2: ÂM THANH */}
          <div className="menu-section-title mt-2">SYSTEM AUDIO</div>
          <button
            type="button"
            className="menu-toggle-row"
            onClick={toggleSound}
          >
            <div className="toggle-left">
              {soundOn ? <Volume2 size={16} className="text-lime" /> : <VolumeX size={16} className="text-muted" />}
              <span>SOUND EFFECTS</span>
            </div>
            <div className={`switch-capsule ${soundOn ? 'on' : 'off'}`}>
              <div className="switch-thumb" />
            </div>
          </button>
        </div>
      )}

      {/* NỘI DUNG MÀN HÌNH RULES */}
      {activeTab === 'rules' && (
        <div className="menu-body-scroll">
          <div className="rules-hero-card">
            <div className="rules-hero-title">GOAL: CRACK THE 4-PIN CODE</div>
            <p className="rules-hero-desc">
              The device hid a secret 4-color code. All 4 colors are distinct. Deduce the sequence in 8 turns!
            </p>
          </div>

          <div className="menu-section-title mt-2">FEEDBACK PIN GUIDE</div>
          <div className="rules-pins-list">
            <div className="pin-rule-card">
              <div className="pin-dot-visual exact-dot" />
              <div className="pin-rule-text">
                <strong>GREEN LED (EXACT MATCH)</strong>
                <span>Correct color in the correct position.</span>
              </div>
            </div>

            <div className="pin-rule-card">
              <div className="pin-dot-visual partial-dot" />
              <div className="pin-rule-text">
                <strong>WHITE LED (COLOR MATCH)</strong>
                <span>Color exists in the code, but in a different position.</span>
              </div>
            </div>

            <div className="pin-rule-card">
              <div className="pin-dot-visual none-dot" />
              <div className="pin-rule-text">
                <strong>DARK (NO MATCH)</strong>
                <span>Color does not exist in the secret code.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NÚT QUAY LẠI MÀN CHƠI CHÍNH TRÊN THIẾT BỊ */}
      <div className="menu-footer">
        <button
          type="button"
          className="resume-screen-btn"
          onClick={() => {
            sounds.playClick();
            sounds.vibrate(25);
            onClose();
          }}
        >
          <Play size={16} fill="currentColor" />
          <span>START PLAYING</span>
        </button>
      </div>
    </div>
  );
}

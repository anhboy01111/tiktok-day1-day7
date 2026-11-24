import React from 'react';
import { Layers, Shuffle, Play, ShieldCheck, Zap } from 'lucide-react';
import { sounds } from '../sounds';

export default function ModeSelectModal({ isOpen, currentMode, onSelectMode, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="mode-select-backdrop">
      <div className="mode-select-card">
        {/* Đèn báo trạng thái mạch trên đỉnh popup */}
        <div className="card-pcb-header">
          <div className="pcb-micro-chip">
            <div className="chip-led-core" />
          </div>
          <span className="card-device-title">SMART CODE BREAKER</span>
        </div>

        <h2 className="mode-title-main">CHỌN CHẾ ĐỘ CHƠI</h2>
        <p className="mode-subtitle">Vui lòng chọn luật chơi trước khi bắt đầu phá mã:</p>

        <div className="mode-options-grid">
          {/* LỰA CHỌN 1: KHÔNG TRÙNG MÀU */}
          <button
            type="button"
            className={`mode-card-btn ${!currentMode ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              sounds.vibrate(25);
              onSelectMode(false);
            }}
          >
            <div className="mode-card-header">
              <div className="mode-badge-icon badge-unique">
                <Layers size={22} />
              </div>
              <div className="mode-name-wrap">
                <div className="mode-name">KHÔNG TRÙNG MÀU</div>
                <div className="mode-tag tag-recommended">Khuyên dùng cho tư duy</div>
              </div>
            </div>

            <p className="mode-card-desc">
              Mật mã và mỗi hàng đoán 100% gồm các màu khác biệt. Phù hợp suy luận logic loại suy thuần túy, có thể tìm ra đáp án 100% bằng trí tuệ!
            </p>

            <div className="mode-feature-list">
              <div className="mode-feature-item">
                <ShieldCheck size={14} className="text-lime" />
                <span>Không màu lặp lại trong mật mã</span>
              </div>
              <div className="mode-feature-item">
                <Zap size={14} className="text-lime" />
                <span>Tập trung vào suy luận vị trí</span>
              </div>
            </div>
          </button>

          {/* LỰA CHỌN 2: CÓ TRÙNG MÀU */}
          <button
            type="button"
            className={`mode-card-btn ${currentMode ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              sounds.vibrate(25);
              onSelectMode(true);
            }}
          >
            <div className="mode-card-header">
              <div className="mode-badge-icon badge-dupes">
                <Shuffle size={22} />
              </div>
              <div className="mode-name-wrap">
                <div className="mode-name">CÓ THỂ TRÙNG MÀU</div>
                <div className="mode-tag tag-hard">Thử thách mở rộng</div>
              </div>
            </div>

            <p className="mode-card-desc">
              Mật mã có thể xuất hiện màu lặp lại (ví dụ: 2 màu cam). Yêu cầu kỹ năng phán đoán đa chiều và chiến thuật nâng cao hơn!
            </p>

            <div className="mode-feature-list">
              <div className="mode-feature-item">
                <ShieldCheck size={14} className="text-orange" />
                <span>Cho phép xuất hiện màu giống nhau</span>
              </div>
              <div className="mode-feature-item">
                <Zap size={14} className="text-orange" />
                <span>Số lượng tổ hợp khả thi phong phú</span>
              </div>
            </div>
          </button>
        </div>

        {/* NÚT XÁC NHẬN BẮT ĐẦU VÀO GAME */}
        <button
          type="button"
          className="start-game-btn"
          onClick={() => {
            sounds.playScanPing(true);
            sounds.vibrate(40);
            onClose();
          }}
        >
          <Play size={18} fill="currentColor" />
          <span>VÀO BÀN CHƠI NGAY</span>
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { X, AlertCircle, HelpCircle, Layers, Shuffle, Award } from 'lucide-react';

export default function HelpModal({ isOpen, onClose, allowDuplicates }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <HelpCircle size={22} className="text-lime" />
            <span>LUẬT CHƠI & ĐỘ KHÓ MÁY PHÁ MÃ</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* GIỚI THIỆU 2 CHẾ ĐỘ CHƠI */}
          <div className="mode-explainer-box">
            <div className="mode-row">
              <Layers size={18} className="text-lime" />
              <div>
                <strong>Chế độ Không Trùng Màu (Mặc định):</strong>
                <p>4 ô mật mã là 4 màu hoàn toàn khác biệt. Dễ tư duy và loại suy logic nhất!</p>
              </div>
            </div>
            <div className="mode-row">
              <Shuffle size={18} className="text-orange" />
              <div>
                <strong>Chế độ Có Thể Trùng Màu:</strong>
                <p>Mật mã có thể có màu xuất hiện lặp lại. Thử thách giải đố cao hơn!</p>
              </div>
            </div>
          </div>

          {/* ĐỘ KHÓ THEO CẤP ĐỘ */}
          <div className="level-progression-box">
            <div className="prog-header">
              <Award size={16} />
              <span>LỘ TRÌNH ĐỘ KHÓ TĂNG DẦN:</span>
            </div>
            <ul className="prog-list">
              <li><strong>Level 1 - 10:</strong> Dùng 5 màu khả dụng (Tập sự, dễ dàng suy luận).</li>
              <li><strong>Level 11 - 30:</strong> Dùng 6 màu khả dụng (Cân bằng logic kinh điển).</li>
              <li><strong>Level 31 - 60:</strong> Dùng 7 màu khả dụng (Thử thách nâng cao).</li>
              <li><strong>Level 61+:</strong> Dùng toàn bộ 8 màu (Chuyên gia phá mã).</li>
            </ul>
          </div>

          {/* Ý NGHĨA 2 CỘT ĐÈN BÁO PHẢN HỒI */}
          <div className="rule-section">
            <h4>Ý nghĩa đèn báo kết quả bên phải:</h4>
            
            <div className="rule-item">
              <div className="dot-preview exact-dot" />
              <div className="rule-desc">
                <strong>Đèn Xanh Lá (Chính xác):</strong>
                <span>Có 1 ô đúng cả màu sắc lẫn đúng vị trí.</span>
              </div>
            </div>

            <div className="rule-item">
              <div className="dot-preview partial-dot" />
              <div className="rule-desc">
                <strong>Đèn Trắng (Đúng màu nhưng sai vị trí):</strong>
                <span>Có 1 màu xuất hiện trong mật mã nhưng đang đặt sai vị trí.</span>
              </div>
            </div>

            <div className="rule-item">
              <div className="dot-preview none-dot" />
              <div className="rule-desc">
                <strong>Đèn Tối (Sai):</strong>
                <span>Màu này không xuất hiện trong mật mã bí mật.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="tactile-btn modal-ok-btn" onClick={onClose}>
            ĐÃ RÕ - BẮT ĐẦU CHƠI
          </button>
        </div>
      </div>
    </div>
  );
}

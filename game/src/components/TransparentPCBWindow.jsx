import React from 'react';

export default function TransparentPCBWindow({ statusMode = 'idle', onClick }) {
  return (
    <div 
      className={`authentic-pcb-window ${statusMode}`}
      onClick={onClick}
      title="Exposed Circuit Window - Click to open System Menu"
    >
      {/* ẢNH BẢNG MẠCH VI ĐIỆN TỬ THẬT CHUẨN 1:1 VỚI HÌNH ẢNH MẪU */}
      <img 
        src="/assets/circuit_pcb_window.png" 
        alt="Transparent PCB Circuit" 
        className="pcb-photoreal-img"
        draggable={false}
      />

      {/* ĐÈN LED PHÁT QUANG ĐỘNG NẰM TRỰC TIẾP TẠI VỊ TRÍ CHIP AI-BUS */}
      <div className={`dynamic-ai-bus-led ${statusMode}`}>
        <div className="filament-core" />
      </div>

      {/* LỚP KÍNH PHẢN CHIẾU 3D CONG & VỆT LÓA ÁNH SÁNG SAPPHIRE */}
      <div className="sapphire-glass-sheen">
        <div className="sheen-diagonal-highlight" />
        <div className="glass-bezel-rim" />
      </div>
    </div>
  );
}

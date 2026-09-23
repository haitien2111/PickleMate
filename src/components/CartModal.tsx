import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScreenId } from '../types';
import paddleImg1 from '../assets/images/regenerated_image_1789473026899.jpg';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-700 p-6 text-white shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-lime-400" />
              <h3 className="text-lg font-bold">Giỏ hàng của bạn (1)</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart item */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex gap-3">
              <img
                src={paddleImg1}
                alt="RPM Q2 Cotton Candy Limited Edition"
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-100 truncate">RPM Q2 Cotton Candy Limited Edition</h4>
                <p className="text-xs text-lime-400 font-semibold mt-0.5">3.300.000 VNĐ</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đã chọn: Kiểm định PickleMate (+50k)</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Khắc Laser: "AnnaLee" (+80k)</span>
              <span className="text-slate-200 font-bold">Tạm tính: 3.430.000 đ</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Tổng hóa đơn tạm tính:</span>
            <span className="text-lg font-black text-lime-400">3.460.000 VNĐ</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onCheckout();
            }}
            className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20"
          >
            <span>Tiến hành Thanh toán Ký quỹ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

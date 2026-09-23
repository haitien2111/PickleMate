import React from 'react';
import { X, Wallet, ShieldCheck, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const transactions = [
    {
      id: 'tx-1',
      title: 'Tạm giữ Ký quỹ - Vợt RPM Q2 Cotton Candy Limited Edition',
      amount: -3460000,
      status: 'Đang ký quỹ bảo vệ',
      date: '13/09/2026 11:42',
      type: 'escrow',
    },
    {
      id: 'tx-2',
      title: 'Chia tiền sân - Sân Việt Phố (Kèo 20h)',
      amount: -50000,
      status: 'Đã hoàn tất',
      date: '13/09/2026 10:15',
      type: 'split',
    },
    {
      id: 'tx-3',
      title: 'Cọc 50% Sân Swin Q7 (17:00-19:00)',
      amount: -150000,
      status: 'Đã phát hành mã QR vé',
      date: '13/09/2026 09:30',
      type: 'booking',
    },
    {
      id: 'tx-4',
      title: 'Nạp tiền vào ví qua VietQR Napas247',
      amount: +4000000,
      status: 'Thành công',
      date: '12/09/2026 18:20',
      type: 'topup',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/20 text-lime-400 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Lexend',sans-serif]">Pickle Wallet</h3>
            <p className="text-xs text-slate-400">Quản lý số dư, Chia tiền sân & Ký quỹ an toàn (Escrow)</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/80 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Số dư khả dụng</p>
              <h2 className="text-3xl font-black text-lime-400 mt-1">
                {user.walletBalance.toLocaleString('vi-VN')} <span className="text-lg font-bold text-white">VNĐ</span>
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bảo chứng Escrow</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Tài khoản thụ hưởng: CTG - 1088 2901 8888</span>
            <span className="text-cyan-400 font-medium">Auto-Napas 24/7</span>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-between">
            <span>Lịch sử giao dịch gần đây</span>
            <span className="text-xs text-lime-400 font-normal">Xem tất cả</span>
          </h4>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tx.amount > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-700/60 text-slate-300'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{tx.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tx.date} • {tx.status}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-mono font-bold text-sm ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

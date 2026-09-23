import React, { useState } from 'react';
import { ScreenId, SocialMatch, UserProfile } from '../types';
import { SOCIAL_MATCHES } from '../data/mockData';
import { VietQRCode } from '../components/VietQRCode';
import { 
  Users, 
  MapPin, 
  Clock, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  Sparkles,
  QrCode,
  DollarSign,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

interface Screen6MatchDetailSplitProps {
  match?: SocialMatch;
  user?: UserProfile | null;
  onNavigate: (screen: ScreenId) => void;
  onRestrictedAction?: (action: () => void, prompt?: string) => void;
}

export const Screen6MatchDetailSplit: React.FC<Screen6MatchDetailSplitProps> = ({
  match = SOCIAL_MATCHES[0],
  user,
  onNavigate,
  onRestrictedAction,
}) => {
  const [isJoined, setIsJoined] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);

  const totalFee = match.totalCourtFee || 200000;
  const splitSlots = match.totalSlots || 4;
  const splitAmount = match.pricePerSlot || 50000;

  const handleJoinClick = () => {
    const doJoin = () => {
      setShowQRPopup(true);
    };

    if (onRestrictedAction) {
      onRestrictedAction(doJoin, 'Vui lòng đăng nhập để giữ suất & tham gia kèo');
    } else {
      doJoin();
    }
  };

  const handleConfirmQRPayment = () => {
    setShowQRPopup(false);
    setIsJoined(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => onNavigate(5)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Kèo</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI: Thông tin chi tiết trận đấu, vị trí, danh sách người tham gia (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-xs font-black uppercase tracking-wider">
                  Trận Giao Lưu DUPR 3.0
                </span>
                <span className="text-xs text-slate-400">Mã trận: #VP-2000-D3</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif] mt-1.5">
                {match.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                  <strong>{match.courtName}</strong> (45 Đào Trí, Q7)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>20:00 - 22:00 Tối nay (Thứ 7)</span>
                </span>
              </div>
            </div>

            {/* Match Format & Ground Rules */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Hình thức & Quy cách thi đấu:</h4>
              <p className="text-slate-600 leading-relaxed">
                • {match.format}
              </p>
              <p className="text-slate-600 leading-relaxed">
                • Chủ kèo Minh Khang đã chuẩn bị sẵn bóng thi đấu Franklin X-40 mới bóc hộp và mượn thêm vợt phụ trợ nếu cần.
              </p>
            </div>

            {/* DANH SÁCH NGƯỜI THAM GIA (3/4 người đã có mặt, 1 vị trí trống ghi "Đang chờ Anna") */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-600" />
                  <span>Danh sách người tham gia ({isJoined ? '4/4 Đủ đội hình' : '3/4 Đang chờ'})</span>
                </h4>
                <span className="text-xs font-bold text-slate-500">Kèo Đôi 4 người</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Minh Khang (Host) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                      alt="Minh Khang"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-400"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Minh Khang (Chủ kèo)</p>
                      <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-1.5 py-0.2 rounded">
                        DUPR 3.1
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã cọc ✓
                  </span>
                </div>

                {/* 2. Tuấn Anh */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                      alt="Tuấn Anh"
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Tuấn Anh</p>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                        DUPR 3.0
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã cọc ✓
                  </span>
                </div>

                {/* 3. Thảo Vy */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                      alt="Thảo Vy"
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Thảo Vy</p>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                        DUPR 2.9
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã cọc ✓
                  </span>
                </div>

                {/* 4. VỊ TRÍ THỨ 4: Đang chờ Anna (hoặc Đã vào trận) */}
                <div className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isJoined
                    ? 'bg-lime-50 border-lime-500 shadow-md'
                    : 'bg-cyan-50/50 border-dashed border-cyan-400 animate-pulse'
                }`}>
                  <div className="flex items-center gap-3">
                    {isJoined ? (
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt="Anna"
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-lime-400"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-cyan-200/60 border border-cyan-400 text-cyan-800 flex items-center justify-center font-bold text-xs">
                        ?
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {isJoined ? 'Anna Nguyễn (Bạn)' : 'Đang chờ Anna (DUPR 3.2)'}
                      </p>
                      <span className="text-[10px] bg-lime-100 text-lime-800 font-bold px-1.5 py-0.2 rounded">
                        DUPR 3.2
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isJoined
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-cyan-100 text-cyan-800'
                  }`}>
                    {isJoined ? 'Đã Tham Gia ✓' : 'Vị trí của bạn'}
                  </span>
                </div>
              </div>
            </div>

            {/* Post-Join Attendance QR Code (Mã QR Điểm danh) */}
            {isJoined && (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-xs text-emerald-950">
                        Đã tham gia trận thành công! Tiền đang giữ Ký quỹ an toàn
                      </h4>
                      <p className="text-[11px] text-emerald-700">Mã vé giao lưu: #MATCH-VP20-ANNA</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-emerald-200">
                    ESCROW-50K-HELD
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-xs text-slate-600">Muốn sắm thêm vợt mới cho trận tối nay?</span>
                  <button
                    onClick={() => onNavigate(7)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-lime-400 hover:text-slate-950 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Xem Chợ Vợt Kiểm Định</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* CỘT PHẢI: Khung Chia tiền Tự động (Split Payment Box) - lg:col-span-5 */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border-2 border-cyan-400 shadow-xl space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
                Thuật toán chia tự động
              </span>
              <h3 className="text-xl font-black text-slate-900 font-['Lexend',sans-serif] mt-1">
                Khung Chia Tiền Sân Tự Động
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chia đều minh bạch, không cần thu tiền mặt lắt nhắt
              </p>
            </div>

            {/* Math Breakdown formula */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Tổng tiền sân (2 tiếng + bóng):</span>
                <span className="font-extrabold text-slate-900">{totalFee.toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Số người chia:</span>
                <span className="font-extrabold text-slate-900">{splitSlots} người (Đôi 4 người)</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-700">Chia đều / suất chơi:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-cyan-600 font-mono">
                    {splitAmount.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-bold text-slate-700 ml-1">VNĐ</span>
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Callout */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Bảo vệ Ký quỹ Trận đấu (Match Escrow)</strong>
                <span className="text-[11px] text-emerald-700">
                  Số tiền 50.000 VNĐ được PickleMate tạm giữ an toàn. Chỉ giải ngân cho chủ sân sau khi trận đấu hoàn tất hoặc hoàn tiền 100% nếu hủy do mưa.
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            {!isJoined ? (
              <button
                id="btn-join-match"
                onClick={handleJoinClick}
                className="w-full py-4 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.01]"
              >
                <span>Giữ suất & Tham gia (50.000 VNĐ)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate(7)}
                className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2"
              >
                <span>Tiếp tục: Đến Chợ Vợt Kiểm Định</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* POP-UP THANH TOÁN QUICK-QR (50.000 VNĐ) */}
      {showQRPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border-2 border-slate-200 space-y-4">
            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider bg-cyan-50 px-2 py-0.5 rounded">
                Napas 247 VietQR
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-1">
                Thanh Toán Suất Chơi (50.000 VNĐ)
              </h4>
              <p className="text-xs text-slate-400">Tự động giữ chỗ vào slot thứ 4 của trận</p>
            </div>

            <VietQRCode
              amount={50000}
              transferMemo="PM KEO VIETPHO ANNA"
            />

            <button
              onClick={handleConfirmQRPayment}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Xác nhận Thanh toán QR (50.000 VNĐ)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

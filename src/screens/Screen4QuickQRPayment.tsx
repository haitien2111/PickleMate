import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, BookingState, UserProfile } from '../types';
import { VietQRCode } from '../components/VietQRCode';
import { downloadSvgAsPng } from '../utils/qrDownload';
import { 
  Clock, 
  CheckCircle2, 
  QrCode, 
  Users, 
  ArrowRight, 
  Share2, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Sparkles,
  Ticket,
  Copy,
  Check
} from 'lucide-react';

interface Screen4QuickQRPaymentProps {
  booking?: BookingState | null;
  user?: UserProfile | null;
  onNavigate: (screen: ScreenId) => void;
  onPaymentComplete: () => void;
}

export const Screen4QuickQRPayment: React.FC<Screen4QuickQRPaymentProps> = ({
  booking,
  user,
  onNavigate,
  onPaymentComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 05:00 countdown timer
  const [isPaid, setIsPaid] = useState(false);
  const [isPassDownloaded, setIsPassDownloaded] = useState(false);
  const [isPassCopied, setIsPassCopied] = useState(false);
  const checkInSvgRef = useRef<SVGSVGElement>(null);

  // 05:00 countdown timer ticker
  useEffect(() => {
    if (isPaid || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaid, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const amount = booking?.depositAmount || 150000;
  const courtName = booking?.court?.name || 'Sân Pickleball Swin Q7';
  const timeSlot = booking?.timeSlot || '17:00 - 19:00';
  const bookingDate = booking?.date || 'Thứ 7, 14/09/2026';
  const transferMemo = `PM SWINQ7 1719 ANNA`;

  const handleCompletePayment = () => {
    setIsPaid(true);
    onPaymentComplete();
  };

  const handleDownloadBookingPassQR = () => {
    if (!checkInSvgRef.current) return;
    downloadSvgAsPng(
      checkInSvgRef.current,
      `PickleMate-BookingPass-SWIN1719`,
      {
        title: 'THẺ VÉ ĐIỆN TỬ',
        subtitle: `${courtName} • Sân 02 Mái che`,
        extraDetails: [
          `Khách hàng: ${user?.name || 'Khách'} Nguyễn (DUPR ${user?.dupr || '3.5'})`,
          `Thời gian: ${timeSlot} | ${bookingDate}`,
          `Mã vé: #SWIN-1719-7B • Pass: PM-ANNA-SWIN-1719`,
          `Trạng thái: Đã cọc 50% (${amount.toLocaleString('vi-VN')} VNĐ)`,
        ],
        footerText: 'Xuất trình mã QR tại cổng kiểm soát hoặc quầy lễ tân để nhận sân',
      }
    );
    setIsPassDownloaded(true);
    setTimeout(() => setIsPassDownloaded(false), 2500);
  };

  const handleCopyPassCode = () => {
    navigator.clipboard.writeText('PM-ANNA-SWIN-1719');
    setIsPassCopied(true);
    setTimeout(() => setIsPassCopied(false), 2000);
  };

  const handleFindMatch = () => {
    // Navigate to Screen 5 with auto pre-filled filters as required!
    onNavigate(5);
  };

  return (
    <div className="relative min-h-[580px] flex items-center justify-center p-2 sm:p-4">
      
      {/* Dimmed & Blurred Background simulating the Court/App underlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md rounded-3xl -z-10 flex flex-col justify-between p-6 opacity-40 pointer-events-none">
        <div className="h-20 bg-slate-800 rounded-2xl"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
        </div>
      </div>

      {/* Main Container: Toggles between Payment State and Post-Payment Booking Pass Ticket */}
      {!isPaid ? (
        /* POP-UP THANH TOÁN VIETQR */
        <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 text-slate-900 animate-in zoom-in-95 duration-200">
          
          {/* Header & Countdown Timer (05:00) */}
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
              Thanh Toán Cọc Đặt Sân Real-time
            </span>
            <h3 className="text-xl font-black text-slate-900 font-['Lexend',sans-serif]">
              Quét Mã VietQR Động
            </h3>
            
            {/* Live 05:00 countdown */}
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
              <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Thời gian giữ ô lịch còn:</span>
              <span className="font-mono text-sm font-black text-amber-700">{formattedTime}</span>
            </div>
          </div>

          {/* Quick-QR Presentation Component */}
          <div className="my-4">
            <VietQRCode
              amount={amount}
              transferMemo={transferMemo}
            />
          </div>

          {/* User Prompt Interaction Button: [Hoàn tất Thanh toán QR] */}
          <div className="space-y-2.5 pt-2">
            <button
              id="btn-complete-qr"
              onClick={handleCompletePayment}
              className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-lime-400/30 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
              <span>Hoàn tất Thanh toán QR (150.000 VNĐ)</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              Hệ thống tự động phát hiện webhook chuyển khoản Napas247 trong 3 giây.
            </p>
          </div>
        </div>
      ) : (
        /* TRẠNG THÁI SAU THANH TOÁN THÀNH CÔNG: THẺ MÃ VÉ QR CHECK-IN */
        <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-lime-400 shadow-2xl overflow-hidden text-slate-900 animate-in zoom-in-95 duration-300">
          
          {/* Top Success Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 text-white text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 text-xs font-bold uppercase mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              <span>Thanh toán giữ chỗ thành công 100%</span>
            </div>
            
            <h3 className="text-2xl font-black font-['Lexend',sans-serif]">
              Thẻ Vé Điện Tử
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Đã lưu vào Ví PickleMate của Anna • Mã vé: <strong className="text-lime-400 font-mono">#SWIN-1719-7B</strong>
            </p>
          </div>

          {/* Ticket Body with perforated edges */}
          <div className="p-6 relative space-y-5">
            {/* Ticket Info Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Khách hàng</span>
                  <p className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>{user?.name || 'Khách'} Nguyễn</span>
                    <span className="text-[10px] bg-lime-100 text-lime-800 font-bold px-1.5 py-0.5 rounded">
                      DUPR {user?.dupr || '3.5'}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Trạng thái cọc</span>
                  <p className="text-sm font-black text-emerald-600">Đã cọc 50% (150.000đ)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Cụm sân:</span>
                  <strong className="text-slate-800">{courtName} (Sân 02 Mái che)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Thời gian thi đấu:</span>
                  <strong className="text-slate-800">{timeSlot} {bookingDate}</strong>
                </div>
              </div>
            </div>

            {/* Check-in QR Code Display */}
            <div className="p-4 bg-lime-50/70 border-2 border-dashed border-lime-400 rounded-2xl flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Ticket className="w-4 h-4 text-lime-600" />
                Mã QR Check-in qua cổng & Nhận sân
              </p>

              {/* Check-in QR Pattern */}
              <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                <svg ref={checkInSvgRef} className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="none">
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#0B132B" />
                  <rect x="10" y="10" width="20" height="20" rx="1.5" fill="white" />
                  <rect x="14" y="14" width="12" height="12" rx="1" fill="#84CC16" />

                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#0B132B" />
                  <rect x="70" y="10" width="20" height="20" rx="1.5" fill="white" />
                  <rect x="74" y="14" width="12" height="12" rx="1" fill="#84CC16" />

                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#0B132B" />
                  <rect x="10" y="70" width="20" height="20" rx="1.5" fill="white" />
                  <rect x="14" y="74" width="12" height="12" rx="1" fill="#84CC16" />

                  <circle cx="50" cy="50" r="10" fill="#0B132B" />
                  <circle cx="50" cy="50" r="5" fill="#84CC16" />
                  <rect x="42" y="10" width="6" height="16" fill="#0B132B" />
                  <rect x="52" y="74" width="8" height="16" fill="#0B132B" />
                  <rect x="68" y="45" width="18" height="6" fill="#0B132B" />
                </svg>
              </div>

              <p className="text-[11px] font-mono text-slate-600 mt-2 font-bold">
                PASS: PM-ANNA-SWIN-1719
              </p>

              {/* Thao tác Tải Mã QR Booking & Sao chép mã vé */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 w-full">
                <button
                  id="btn-download-booking-qr"
                  type="button"
                  onClick={handleDownloadBookingPassQR}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-lime-400 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
                  title="Tải mã QR Booking về thiết bị dưới dạng ảnh PNG"
                >
                  {isPassDownloaded ? (
                    <>
                      <Check className="w-4 h-4 text-lime-400" />
                      <span>Đã tải mã QR về máy</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-lime-400" />
                      <span>Tải mã QR Booking</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyPassCode}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Sao chép mã Pass nhận sân"
                >
                  {isPassCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sao chép Pass</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Prompt Required Action: CYAN ACTION BUTTON [Tìm thêm người ghép kèo tối nay] */}
            <div className="space-y-2 pt-1">
              <button
                id="btn-find-social-matches"
                onClick={handleFindMatch}
                className="w-full py-4 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01]"
              >
                <Users className="w-5 h-5 text-slate-950" />
                <span>Tìm thêm người ghép kèo tối nay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate(1)}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Về Trang chủ PickleMate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

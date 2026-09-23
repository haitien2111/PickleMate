import React, { useState } from 'react';
import { ScreenId, Court, BookingState } from '../types';
import { COURTS_DATA, SATURDAY_SLOTS } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  Star, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  ChevronLeft,
  Lock,
  Sparkles
} from 'lucide-react';

interface Screen3ScheduleDetailsProps {
  court?: Court;
  onNavigate: (screen: ScreenId) => void;
  onConfirmBooking: (booking: BookingState) => void;
  onRestrictedAction?: (action: () => void, prompt?: string) => void;
}

export const Screen3ScheduleDetails: React.FC<Screen3ScheduleDetailsProps> = ({
  court = COURTS_DATA[0],
  onNavigate,
  onConfirmBooking,
  onRestrictedAction,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-6'); // 'slot-6' is 17:00 - 19:00 (300.000 VND)
  const [isFiftyPercent, setIsFiftyPercent] = useState<boolean>(true);
  const [activeDateTab, setActiveDateTab] = useState<string>('sat');

  const selectedSlot = SATURDAY_SLOTS.find((s) => s.id === selectedSlotId) || SATURDAY_SLOTS[5];
  const totalPrice = selectedSlot.price;
  const depositAmount = isFiftyPercent ? Math.round(totalPrice * 0.5) : totalPrice;

  const handleConfirm = () => {
    const doConfirm = () => {
      const newBooking: BookingState = {
        court,
        date: 'Thứ 7, 14/09/2026',
        timeSlot: selectedSlot.time,
        isFiftyPercentDeposit: isFiftyPercent,
        totalPrice,
        depositAmount,
        bookingCode: 'SWIN-1719-7B',
        paymentComplete: false,
      };
      onConfirmBooking(newBooking);
      onNavigate(4);
    };

    if (onRestrictedAction) {
      onRestrictedAction(doConfirm, 'Vui lòng đăng nhập để thanh toán & đặt sân');
    } else {
      doConfirm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          onClick={() => onNavigate(2)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Bản đồ Sân</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Images, Reviews, Court Rules) - lg:col-span-5 */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Gallery Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-lime-600 bg-lime-50 px-2.5 py-1 rounded-md border border-lime-200">
                Sân thi đấu tiêu chuẩn
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif] mt-1">
                {court.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{court.address}</p>

              {/* Tiện ích sân bãi in đậm */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {court.amenities.map((am, i) => (
                  <span key={i} className="text-xs font-black bg-slate-100 text-slate-900 px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                    <span>{am}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Photo Gallery with featured big photo */}
            <div className="space-y-2">
              <img
                src={court.image}
                alt={court.name}
                referrerPolicy="no-referrer"
                className="w-full h-52 rounded-2xl object-cover border border-slate-200 shadow-inner"
              />
              <div className="grid grid-cols-3 gap-2">
                {court.gallery.slice(1, 4).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Court preview ${i}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-16 rounded-xl object-cover border border-slate-200"
                  />
                ))}
              </div>
            </div>

            {/* Ratings & Player Reviews */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">4.9 / 5.0</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">148 đánh giá đã xác thực</span>
              </div>

              {/* Sample Review */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Hoàng Nam (DUPR 3.8)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Hôm qua</span>
                </div>
                <p className="text-slate-600">
                  "Mặt sân Swin Q7 chuẩn thi đấu PPA, độ nhám bám bóng rất đều dink không bị trượt. Đèn LED sáng 500 lux không bị chói mắt khi lốp bóng cao."
                </p>
              </div>
            </div>

            {/* Court Rules (Quy định sân) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                Quy định cụm sân
              </h4>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Bắt buộc mang giày thể thao đế non-marking (không để lại vết đen).</li>
                <li>Vui lòng check-in trước giờ thi đấu 10 phút tại quầy lễ tân bằng mã QR.</li>
                <li>Sân có sẵn nước uống ion miễn phí & bóng tập Franklin X-40.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Ma trận lưới lịch trống + Payment Options) - lg:col-span-7 */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
            
            {/* Header: Date Tabs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-lime-600" />
                  <span>Ma Trận Lịch Trống & Đặt Chỗ Real-time</span>
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Cập nhật 5 giây trước
                </span>
              </div>

              {/* Day selection tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveDateTab('fri')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeDateTab === 'fri'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Hôm nay</p>
                  <p>Thứ 6, 13/09</p>
                </button>

                <button
                  onClick={() => setActiveDateTab('sat')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    activeDateTab === 'sat'
                      ? 'bg-lime-400 text-slate-950 border-lime-500 shadow-md ring-2 ring-lime-400/40'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <p className="text-[10px] uppercase font-black text-slate-900">Mục tiêu yêu cầu</p>
                  <p>Thứ 7, 14/09</p>
                </button>

                <button
                  onClick={() => setActiveDateTab('sun')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeDateTab === 'sun'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Ngày mai</p>
                  <p>Chủ Nhật, 15/09</p>
                </button>
              </div>
            </div>

            {/* Time slot matrix grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Khung giờ hoạt động (Thứ 7):</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-md bg-lime-400 border border-lime-500"></span>
                    <span className="text-slate-600">Ô trống</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-300"></span>
                    <span className="text-slate-400">Đã có người đặt</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SATURDAY_SLOTS.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const isTarget = slot.time === '17:00 - 19:00';

                  if (slot.isBooked) {
                    return (
                      <div
                        key={slot.id}
                        className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 opacity-70 cursor-not-allowed text-center"
                      >
                        <span className="text-[10px] font-bold block uppercase">Đã kín lịch</span>
                        <p className="text-xs font-bold line-through mt-0.5">{slot.time}</p>
                        <span className="text-[10px] block mt-1">Đã giữ chỗ</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-lime-400 border-slate-950 text-slate-950 font-black shadow-lg ring-2 ring-lime-400 scale-[1.03]'
                          : 'bg-lime-50/80 hover:bg-lime-100 border-lime-300 text-slate-900 font-bold'
                      }`}
                    >
                      {isTarget && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900 text-lime-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                          Khung giờ vàng
                        </span>
                      )}
                      <span className="text-[10px] block uppercase tracking-wider text-slate-700">
                        {isSelected ? '✓ Đang chọn' : 'Còn trống'}
                      </span>
                      <p className="text-sm font-black mt-0.5">{slot.time}</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {slot.price.toLocaleString('vi-VN')} đ
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Options (Khung Tùy chọn Thanh toán) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Hình thức thanh toán cọc</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Bảo đảm hoàn cọc trước 6H
                </span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Radio Option 1: Cọc 50% (150.000 VNĐ) */}
                <label
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    isFiftyPercent
                      ? 'bg-white border-lime-500 shadow-md ring-1 ring-lime-400'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="depositOption"
                    checked={isFiftyPercent}
                    onChange={() => setIsFiftyPercent(true)}
                    className="mt-1 w-4 h-4 text-lime-600 focus:ring-lime-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-slate-900">
                        Thanh toán Cọc 50%
                      </span>
                      <span className="bg-lime-100 text-lime-800 text-[10px] font-black px-1.5 py-0.2 rounded">
                        Phổ biến
                      </span>
                    </div>
                    <p className="text-base font-black text-lime-600 mt-0.5">
                      {(totalPrice * 0.5).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Còn lại {(totalPrice * 0.5).toLocaleString('vi-VN')} VNĐ thanh toán tại quầy khi đến sân.
                    </p>
                  </div>
                </label>

                {/* Radio Option 2: Thanh toán 100% (300.000 VNĐ) */}
                <label
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    !isFiftyPercent
                      ? 'bg-white border-lime-500 shadow-md ring-1 ring-lime-400'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="depositOption"
                    checked={!isFiftyPercent}
                    onChange={() => setIsFiftyPercent(false)}
                    className="mt-1 w-4 h-4 text-lime-600 focus:ring-lime-500"
                  />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900">
                      Thanh toán 100%
                    </span>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {totalPrice.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Thanh toán trọn gói, vào sân quét QR nhận chìa khóa locker tự động.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Total summary and Confirmation Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Số tiền cọc cần thanh toán ngay:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-lime-600 font-mono">
                    {depositAmount.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-sm font-bold text-slate-800">VNĐ</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Khung giờ: {selectedSlot.time} (Thứ 7) • Sân 02 Mái che Swin Q7
                </p>
              </div>

              <button
                id="btn-confirm-booking"
                onClick={handleConfirm}
                className="px-8 py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-lime-400/25 flex items-center gap-2 group cursor-pointer hover:scale-[1.02]"
              >
                <span>Thanh toán & Đặt sân</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

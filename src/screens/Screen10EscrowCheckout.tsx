import React, { useState } from 'react';
import { ScreenId, UserProfile, Paddle, CustomLaserSettings } from '../types';
import { PADDLES_DATA, CURRENT_USER } from '../data/mockData';
import { VietQRCode } from '../components/VietQRCode';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  PackageCheck, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ChevronLeft,
  Calendar,
  Layers,
  Home,
  Edit3,
  Check,
  X,
  Building2,
  Navigation
} from 'lucide-react';

interface Screen10EscrowCheckoutProps {
  user?: UserProfile | null;
  paddle?: Paddle;
  isVerificationRequested?: boolean;
  customization?: CustomLaserSettings;
  onNavigate: (screen: ScreenId) => void;
  onOrderSuccess: () => void;
  onRestrictedAction?: (action: () => void, prompt?: string) => void;
}

export const Screen10EscrowCheckout: React.FC<Screen10EscrowCheckoutProps> = ({
  user,
  paddle = PADDLES_DATA[0],
  isVerificationRequested = true,
  customization = {
    enabled: true,
    text: 'AnnaLee',
    font: 'Sport Bold',
    position: 'bottom-right',
    fontSize: 24,
    laserStyle: 'silver',
    overwrapColor: 'Lime Neon',
  },
  onNavigate,
  onOrderSuccess,
  onRestrictedAction,
}) => {
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1: Đã nhận tiền -> 2: Đang kiểm định -> 3: Đang khắc Laser -> 4: Đang giao hàng

  // Delivery address and recipient state
  const [receiverName, setReceiverName] = useState(`${user?.name || 'Hoàng Long'} Nguyễn`);
  const [receiverPhone, setReceiverPhone] = useState(user?.phone || '0909123456');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Quận 7, TP. Hồ Chí Minh');

  // Address edit mode state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressInput, setEditAddressInput] = useState(user?.address || 'Quận 7, TP. Hồ Chí Minh');
  const [editNameInput, setEditNameInput] = useState(`${user?.name || 'Hoàng Long'} Nguyễn`);
  const [editPhoneInput, setEditPhoneInput] = useState(user?.phone || '0909123456');
  const [addressSavedNotification, setAddressSavedNotification] = useState(false);

  const presetAddresses = [
    {
      label: 'Nhà riêng (Sunrise City)',
      address: 'Tháp V5 Sunrise City, 23 Nguyễn Hữu Thọ, P. Tân Hưng, Quận 7, TP. Hồ Chí Minh',
      tag: 'Nhà riêng',
    },
    {
      label: 'Văn phòng Bitexco Q1',
      address: 'Tầng 18, Bitexco Financial Tower, Số 2 Hải Triều, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      tag: 'Văn phòng',
    },
    {
      label: 'Sân Swin Q7',
      address: 'Sân Pickleball Swin Q7, Số 14 Đường số 7, KĐT Him Lam, P. Tân Hưng, Quận 7, TP.HCM',
      tag: 'Sân bóng',
    },
  ];

  const handleStartEdit = () => {
    setEditAddressInput(deliveryAddress);
    setEditNameInput(receiverName);
    setEditPhoneInput(receiverPhone);
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    if (!editAddressInput.trim()) return;
    setDeliveryAddress(editAddressInput.trim());
    setReceiverName(editNameInput.trim() || `${user?.name || 'Hoàng Long'} Nguyễn`);
    setReceiverPhone(editPhoneInput.trim() || user?.phone || '0909123456');
    setIsEditingAddress(false);
    setAddressSavedNotification(true);
    setTimeout(() => setAddressSavedNotification(false), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
  };

  // Exact Itemized Cost Formula:
  const paddlePrice = paddle?.price || 4550000;
  const verificationFee = isVerificationRequested ? 50000 : 0;
  const laserEngravingFee = customization.enabled ? 80000 : 0;
  const shippingFee = 30000;
  const grandTotal = paddlePrice + verificationFee + laserEngravingFee + shippingFee;

  const handleConfirmPayment = () => {
    const doPayment = () => {
      setIsOrderCreated(true);
      onOrderSuccess();
      // Simulate progression steps for visual delight
      setTimeout(() => setActiveStep(2), 2500);
    };

    if (onRestrictedAction) {
      onRestrictedAction(doPayment, 'Vui lòng đăng nhập để xác nhận đơn & thanh toán');
    } else {
      doPayment();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => onNavigate(9)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Custom Lab</span>
        </button>
      </div>

      {!isOrderCreated ? (
        /* GIAO DIỆN THANH TOÁN KÝ QUỸ (ESCROW CHECKOUT) */
        <div className="space-y-6">
          
          {/* BANNER AN TOÀN KÝ QUỸ (BẮT BUỘC THEO ĐỀ BÀI) */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 border-2 border-emerald-500 text-white shadow-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-black uppercase tracking-wider">
                  Bảo Vệ Ký Quỹ Độc Quyền (Escrow 100%)
                </span>
              </div>
              <h3 className="text-lg font-black mt-1 font-['Lexend',sans-serif]">
                Tiền được PickleMate tạm giữ an toàn tuyệt đối
              </h3>
              <p className="text-xs text-emerald-100 mt-1 leading-relaxed max-w-3xl">
                "Bảo vệ Ký quỹ: Tiền được PickleMate tạm giữ an toàn. Chỉ giải ngân cho người bán sau khi vợt kiểm định thành công và bạn nhận hàng đúng mô tả."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC VIETQR ĐỘNG (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Shipping Address Information */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-lime-600" />
                  <span>Thông tin nhận hàng của khách hàng</span>
                </h3>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Người nhận:
                    </span>
                    <strong className="text-slate-900">{receiverName}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Số điện thoại:
                    </span>
                    <strong className="text-slate-900 font-mono">{receiverPhone}</strong>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    {!isEditingAddress ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-500 font-medium">Địa chỉ giao hàng:</span>
                          <button
                            type="button"
                            onClick={handleStartEdit}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-700 hover:text-lime-800 bg-lime-100 hover:bg-lime-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa địa chỉ nhận hàng"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Thay đổi</span>
                          </button>
                        </div>
                        <strong className="text-slate-800 leading-relaxed block">
                          {deliveryAddress}
                        </strong>

                        {addressSavedNotification && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1.5 rounded-xl font-semibold animate-in fade-in">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Đã cập nhật địa chỉ giao hàng thành công!</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 py-1 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-lime-600" />
                            Chỉnh sửa địa chỉ nhận hàng
                          </span>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Gợi ý địa chỉ nhanh */}
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1.5">Chọn nhanh địa chỉ lưu sẵn:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {presetAddresses.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setEditAddressInput(preset.address);
                                }}
                                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all text-left cursor-pointer ${
                                  editAddressInput === preset.address
                                    ? 'bg-lime-100 border-lime-400 text-lime-900 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Ô nhập địa chỉ chi tiết */}
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-600 font-semibold block">
                            Địa chỉ cụ thể (Số nhà, đường, phường, quận):
                          </label>
                          <textarea
                            value={editAddressInput}
                            onChange={(e) => setEditAddressInput(e.target.value)}
                            rows={2}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 outline-none bg-white text-slate-900 resize-none font-medium leading-relaxed"
                            placeholder="Nhập địa chỉ giao hàng cụ thể..."
                          />
                        </div>

                        {/* Thông tin người nhận & điện thoại */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-600 font-semibold block mb-0.5">
                              Tên người nhận:
                            </label>
                            <input
                              type="text"
                              value={editNameInput}
                              onChange={(e) => setEditNameInput(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 outline-none bg-white text-slate-900 font-medium"
                              placeholder="Họ và tên"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-600 font-semibold block mb-0.5">
                              Số điện thoại:
                            </label>
                            <input
                              type="text"
                              value={editPhoneInput}
                              onChange={(e) => setEditPhoneInput(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 outline-none bg-white text-slate-900 font-mono font-medium"
                              placeholder="09xx xxx xxx"
                            />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleSaveAddress}
                            disabled={!editAddressInput.trim()}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-lime-400/30"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Lưu địa chỉ</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="py-1.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Vận chuyển Hỏa tốc nội thành 2H
                    </span>
                    <span>Đảm bảo kiểm tra hàng trước</span>
                  </div>
                </div>
              </div>

              {/* Dynamic VietQR Payment box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Phương thức thanh toán VietQR Động
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Napas 247 Instant
                  </span>
                </div>

                <VietQRCode
                  amount={grandTotal}
                  transferMemo="PM ESCROW 2660 ANNA"
                />
              </div>

            </div>

            {/* CỘT PHẢI: BẢNG CHI TIẾT HÓA ĐƠN & NÚT XÁC NHẬN (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-3xl p-6 border-2 border-lime-400 shadow-xl space-y-5">
                
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-700 bg-lime-100 px-2 py-0.5 rounded">
                    Bảng Kê Khai Minh Bạch
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-['Lexend',sans-serif] mt-1">
                    Bảng Chi Tiết Hóa Đơn
                  </h3>
                </div>

                {/* Paddle item review */}
                <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={paddle.images[0]}
                    alt={paddle.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold text-slate-900 truncate">{paddle.name}</h4>
                    <p className="text-slate-500 mt-0.5">Tình trạng: {paddle.conditionPercentage}% • Người bán: {paddle.seller.name}</p>
                    <p className="text-lime-600 font-bold mt-1">Khắc Laser: "{customization.text}" ({customization.position})</p>
                  </div>
                </div>

                {/* EXACT ITEMIZED COST BREAKDOWN TABLE AS SPECIFIED */}
                <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 truncate mr-2">1. Giá {paddle?.name || 'Vợt'}:</span>
                    <span className="font-bold font-mono text-slate-900 shrink-0">
                      {paddlePrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">2. Phí Kiểm định PickleMate chuyên sâu:</span>
                    <span className="font-bold font-mono text-slate-900">
                      +{verificationFee.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">3. Phí Khắc Laser (Chữ "{customization.text}"):</span>
                    <span className="font-bold font-mono text-slate-900">
                      +{laserEngravingFee.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">4. Phí Vận chuyển hỏa tốc 2H:</span>
                    <span className="font-bold font-mono text-slate-900">
                      +{shippingFee.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>

                  {/* GRAND TOTAL */}
                  <div className="pt-3 border-t border-slate-300 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-slate-900 block">Tổng cộng:</span>
                      <span className="text-[10px] text-slate-400">Đã bao gồm VAT & Ký quỹ bảo chứng</span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-lime-600 font-mono">
                        {grandTotal.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-sm font-bold text-slate-800 ml-1">VNĐ</span>
                    </div>
                  </div>
                </div>

                {/* ACTION CTA BUTTON: [Xác nhận đơn & Thanh toán] */}
                <div className="pt-2">
                  <button
                    id="btn-confirm-vietqr"
                    onClick={handleConfirmPayment}
                    className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-lime-400/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    <span>Xác nhận đơn & Thanh toán ({grandTotal.toLocaleString('vi-VN')} VNĐ)</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Nhấn xác nhận để hoàn tất thanh toán & kích hoạt quy trình Ký quỹ bảo đảm
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      ) : (
        /* PHẢN HỒI GIAO DIỆN: TRẠNG THÁI "TẠO ĐƠN THÀNH CÔNG" & THANH TIẾN ĐỘ ĐƠN HÀNG */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border-2 border-emerald-400 p-6 sm:p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          
          {/* Header Congratulations */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Giao Dịch Được Bảo Vệ Bởi Ký Quỹ PickleMate
            </span>

            <h2 className="text-3xl font-black text-slate-900 font-['Lexend',sans-serif]">
              Tạo Đơn Hàng Thành Công!
            </h2>
            <p className="text-sm text-slate-500">
              Mã đơn hàng: <strong className="text-slate-900 font-mono">#PM-882910</strong> • Tổng tiền đã ký quỹ: <strong className="text-emerald-600 font-mono">2.660.000 VNĐ</strong>
            </p>
          </div>

          {/* THANH TIẾN ĐỘ ĐƠN HÀNG (Đã nhận tiền -> Đang kiểm định -> Đang khắc Laser -> Đang giao hàng) */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Tiến độ thực hiện đơn hàng Real-time</span>
              <span className="text-emerald-600 font-bold">KTV: Nguyễn Nam (PickleMate Lab)</span>
            </h4>

            {/* Stepper bar */}
            <div className="relative flex justify-between items-center pt-3 pb-2">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0">
                <div 
                  className="h-full bg-lime-500 transition-all duration-700"
                  style={{ width: activeStep === 1 ? '15%' : activeStep === 2 ? '48%' : activeStep === 3 ? '80%' : '100%' }}
                ></div>
              </div>

              {[
                { step: 1, label: 'Đã nhận tiền', desc: 'Ký quỹ an toàn' },
                { step: 2, label: 'Đang kiểm định', desc: 'Test nứt & cân nặng' },
                { step: 3, label: 'Đang khắc Laser', desc: 'Chữ "AnnaLee"' },
                { step: 4, label: 'Đang giao hàng', desc: 'Giao hỏa tốc 2H' },
              ].map((st) => {
                const isPassed = activeStep >= st.step;
                const isCurrent = activeStep === st.step;

                return (
                  <div key={st.step} className="relative z-10 flex flex-col items-center text-center max-w-[90px]">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all shadow-md ${
                      isCurrent
                        ? 'bg-lime-400 text-slate-950 ring-4 ring-lime-400/30 scale-110'
                        : isPassed
                        ? 'bg-slate-900 text-lime-400'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}>
                      {isPassed && !isCurrent ? '✓' : st.step}
                    </div>
                    <p className={`text-xs font-bold mt-2 ${isCurrent ? 'text-slate-900 font-black' : isPassed ? 'text-slate-700' : 'text-slate-400'}`}>
                      {st.label}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 hidden sm:block">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chi tiết người nhận & địa chỉ giao hàng */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-lime-100 text-lime-800 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Giao hàng hỏa tốc đến:</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Hỏa tốc 2H
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {deliveryAddress}
              </p>
              <p className="text-slate-500 text-[11px] pt-0.5">
                Người nhận: <strong className="text-slate-800">{receiverName}</strong> • SĐT: <strong className="text-slate-800 font-mono">{receiverPhone}</strong>
              </p>
            </div>
          </div>

          {/* Action buttons after completion */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate(1)}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Về Trang chủ PickleMate</span>
            </button>

            <button
              onClick={() => onNavigate(4)}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Xem Thẻ Vé Đặt Sân Tối Nay</span>
            </button>

            <button
              onClick={() => onNavigate(6)}
              className="px-6 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <span>Xem Kèo Giao Lưu (Sân Việt Phố)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

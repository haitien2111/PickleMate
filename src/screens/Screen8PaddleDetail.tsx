import React, { useState, useRef } from 'react';
import { ScreenId, Paddle } from '../types';
import { PADDLES_DATA } from '../data/mockData';
import paddleImg1 from '../assets/images/regenerated_image_1789473026899.jpg';
import paddleImg2 from '../assets/images/regenerated_image_1789473837933.jpg';
import paddleImg3 from '../assets/images/regenerated_image_1789473665427.jpg';
import paddleImg4 from '../assets/images/regenerated_image_1789473666609.jpg';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  ChevronLeft, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Activity, 
  Scale, 
  Award,
  AlertCircle,
  Camera,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  RefreshCw
} from 'lucide-react';

interface Screen8PaddleDetailProps {
  paddle?: Paddle;
  onNavigate: (screen: ScreenId) => void;
  onUpdateVerification: (verified: boolean) => void;
  onUpdatePaddleImages?: (images: string[]) => void;
}

const SAMPLE_ANGLE_PRESETS = [
  { label: 'Góc 1: Mặt chính Carbon', url: paddleImg1 },
  { label: 'Góc 2: Cạnh viền Edge Guard', url: paddleImg2 },
  { label: 'Góc 3: Bề mặt nhám Toray T700', url: paddleImg3 },
  { label: 'Góc 4: Mặt sau & Cán vợt', url: paddleImg4 },
  { label: 'Góc 5: Tem mã vạch & Lõi tổ ong', url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=700&q=80' },
];

export const Screen8PaddleDetail: React.FC<Screen8PaddleDetailProps> = ({
  paddle = PADDLES_DATA[0],
  onNavigate,
  onUpdateVerification,
  onUpdatePaddleImages,
}) => {
  const [images, setImages] = useState<string[]>(
    paddle.images && paddle.images.length > 0 ? paddle.images : [paddleImg1, paddleImg2, paddleImg3]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVerificationRequested, setIsVerificationRequested] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReplacingCurrent, setIsReplacingCurrent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 5) {
      showToast('⚠️ Sản phẩm đã đạt tối đa 5 hình ảnh!');
      return;
    }

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newUrls.push(URL.createObjectURL(files[i]));
    }

    const updated = [...images, ...newUrls].slice(0, 5);
    setImages(updated);
    setSelectedImageIndex(updated.length - 1);
    onUpdatePaddleImages?.(updated);
    showToast(`📸 Đã tải thêm thành công ảnh thực tế! (Hiện có ${updated.length}/5 ảnh)`);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplaceCurrentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUrl = URL.createObjectURL(files[0]);
    const updated = [...images];
    updated[selectedImageIndex] = newUrl;
    setImages(updated);
    onUpdatePaddleImages?.(updated);
    showToast(`✓ Đã thay thế thành công ảnh góc #${selectedImageIndex + 1}!`);

    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  const handleDeleteImage = (indexToRemove: number) => {
    if (images.length <= 3) {
      showToast('⚠️ Mỗi sản phẩm cần tối thiểu 3 ảnh thực tế để bảo đảm thẩm định!');
      return;
    }

    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    setSelectedImageIndex((prev) => Math.max(0, Math.min(prev, updated.length - 1)));
    onUpdatePaddleImages?.(updated);
    showToast(`🗑️ Đã xóa 1 ảnh. Sản phẩm hiện có ${updated.length}/5 ảnh.`);
  };

  const handleAddPreset = (url: string) => {
    if (images.length >= 5) {
      showToast('⚠️ Sản phẩm đã có đủ 5 ảnh tối đa!');
      return;
    }
    if (images.includes(url)) {
      showToast('Góc ảnh này đã có trong bộ sưu tập!');
      return;
    }
    const updated = [...images, url];
    setImages(updated);
    setSelectedImageIndex(updated.length - 1);
    onUpdatePaddleImages?.(updated);
    showToast(`✓ Đã thêm ảnh góc chụp thực tế (${updated.length}/5 ảnh)!`);
  };

  const basePrice = paddle.price;
  const verificationFee = isVerificationRequested ? paddle.verificationFee : 0;
  const subTotal = basePrice + verificationFee;

  const handleToggleVerification = (checked: boolean) => {
    setIsVerificationRequested(checked);
    onUpdateVerification(checked);
  };

  const handleProceedToCustomizer = () => {
    onUpdateVerification(isVerificationRequested);
    onNavigate(9);
  };

  const handleDirectBuy = () => {
    onUpdateVerification(isVerificationRequested);
    onNavigate(10);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-lime-400/50 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => onNavigate(7)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Chợ Vợt</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Tiêu chuẩn hình ảnh:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
            images.length >= 3 && images.length <= 5
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}>
            {images.length}/5 ảnh thực tế {images.length >= 3 ? '✓ Đủ điều kiện' : '(Cần tối thiểu 3 ảnh)'}
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI: BỘ ẢNH THỰC TẾ CÁC GÓC CẠNH (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            
            {/* Featured Image Viewer */}
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 group">
              <img
                id="paddle-detail-featured-img"
                src={images[selectedImageIndex] || images[0]}
                alt={paddle.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-lime-400" />
                <span>Góc ảnh thực tế {selectedImageIndex + 1}/{images.length}</span>
              </span>
              <span className="absolute bottom-3 right-3 px-3 py-1 bg-lime-400 text-slate-950 text-xs font-black rounded-lg shadow">
                Độ mới thẩm định: {paddle.conditionPercentage}%
              </span>

              {/* Action buttons overlay trên ảnh chính */}
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => replaceInputRef.current?.click()}
                  className="bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl backdrop-blur-md border border-slate-700 flex items-center gap-1 cursor-pointer shadow hover:scale-105 transition-all"
                  title="Thay thế ảnh góc này"
                >
                  <RefreshCw className="w-3 h-3 text-lime-400" />
                  <span>Đổi ảnh này</span>
                </button>

                {images.length > 3 && (
                  <button
                    onClick={() => handleDeleteImage(selectedImageIndex)}
                    className="bg-rose-600/90 hover:bg-rose-600 text-white text-[11px] font-bold p-1.5 rounded-xl backdrop-blur-md border border-rose-400/40 flex items-center justify-center cursor-pointer shadow hover:scale-105 transition-all"
                    title="Xóa ảnh góc này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnails (3 - 5 ảnh) + Nút thêm ảnh nhanh */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-0.5">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Danh sách ảnh sản phẩm ({images.length}/5):</span>
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {images.length < 5 ? `Có thể thêm ${5 - images.length} ảnh nữa` : 'Đã đạt tối đa 5 ảnh'}
                </span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-1 items-center">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group shrink-0">
                    <button
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`h-20 w-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative block ${
                        selectedImageIndex === idx
                          ? 'border-lime-500 ring-2 ring-lime-400/50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 opacity-80'
                      }`}
                    >
                      <img
                        id={`paddle-detail-thumb-img-${idx}`}
                        src={img}
                        alt={`Góc ảnh thực tế ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded backdrop-blur-xs">
                        {idx === 0 ? 'Ảnh chính' : `#${idx + 1}`}
                      </span>
                    </button>

                    {/* Delete button on thumbnail */}
                    {images.length > 3 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(idx);
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Nút thêm ảnh vào thumbnail row nếu < 5 */}
                {images.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-24 shrink-0 rounded-xl border-2 border-dashed border-lime-500/70 hover:border-lime-500 bg-lime-50/50 hover:bg-lime-50 text-slate-700 hover:text-slate-950 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group"
                    title="Tải thêm ảnh cho sản phẩm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-lime-400/70 flex items-center justify-center group-hover:bg-lime-400 transition-colors">
                      <Plus className="w-4 h-4 text-slate-950" />
                    </div>
                    <span className="text-[10px] font-bold">Thêm ảnh</span>
                  </button>
                )}
              </div>
            </div>

            {/* Input files ẩn */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddFiles}
            />
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleReplaceCurrentFile}
            />

            {/* Khung công cụ quản lý ảnh sản phẩm (3 - 5 ảnh) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-lime-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Cập nhật hình ảnh sản phẩm (3 - 5 ảnh)
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  Hỗ trợ định dạng .JPG, .PNG, .WEBP
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (images.length >= 5) {
                      showToast('Sản phẩm đã đủ tối đa 5 hình ảnh!');
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  disabled={images.length >= 5}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    images.length >= 5
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-xs hover:scale-[1.01]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải ảnh từ máy ({images.length}/5)</span>
                </button>

                <button
                  onClick={() => replaceInputRef.current?.click()}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Đổi ảnh góc #{selectedImageIndex + 1}</span>
                </button>
              </div>

              {/* Gợi ý góc chụp mẫu */}
              <div className="pt-2 border-t border-slate-200/80">
                <p className="text-[11px] text-slate-500 font-medium mb-1.5">
                  Thêm góc ảnh chụp tiêu chuẩn kiểm định:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_ANGLE_PRESETS.map((preset, idx) => {
                    const isAdded = images.includes(preset.url);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddPreset(preset.url)}
                        disabled={isAdded || images.length >= 5}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                          isAdded
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                            : images.length >= 5
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white hover:bg-lime-50 text-slate-700 hover:text-slate-950 border-slate-200 hover:border-lime-400 cursor-pointer'
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Plus className="w-3 h-3 text-lime-600" />
                        )}
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              Hình ảnh chụp macro góc cạnh rõ ràng giúp tăng 85% tỷ lệ chốt đơn và vượt qua khâu kiểm định nhanh chóng.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN NGƯỜI BÁN, THÔNG SỐ, KIỂM ĐỊNH & 2 NÚT BẤM (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
            
            {/* Paddle Title & Seller Info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-xs font-black uppercase">
                  Thương hiệu: {paddle.brand}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Tình trạng: {paddle.conditionPercentage}% (Rất mới)
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Lexend',sans-serif]">
                {paddle.name}
              </h2>

              {/* Price display */}
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {paddle.price.toLocaleString('vi-VN')} VNĐ
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Bảo chứng kiểm định
                </span>
              </div>
            </div>

            {/* Seller profile box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={paddle.seller.avatar}
                  alt={paddle.seller.name}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-lime-400"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900">{paddle.seller.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Đã bán thành công: <strong className="text-slate-800">{paddle.seller.salesCount} cây vợt</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{paddle.seller.rating} / 5.0</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">KYC Đã xác minh</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Thông số kỹ thuật chính:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Độ dày lõi:</span>
                  <strong className="text-slate-800">{paddle.specs.coreThickness}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Trọng lượng:</span>
                  <strong className="text-slate-800">{paddle.specs.weight}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Bề mặt tiếp xúc:</span>
                  <strong className="text-slate-800">{paddle.specs.surface}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px]">Chỉ số Swingweight:</span>
                  <strong className="text-slate-800">{paddle.specs.swingWeight}</strong>
                </div>
              </div>
            </div>

            {/* KHUNG TÙY CHỌN KIỂM ĐỊNH NỔI BẬT (BẮT BUỘC THEO ĐỀ BÀI) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-lime-50 to-emerald-50 border-2 border-lime-400 space-y-2.5 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerificationRequested}
                  onChange={(e) => handleToggleVerification(e.target.checked)}
                  className="mt-1 w-5 h-5 text-lime-600 rounded focus:ring-lime-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      [x] Yêu cầu Kiểm định PickleMate chuyên sâu (+50.000 VNĐ)
                    </span>
                    <span className="text-xs font-black text-emerald-700 font-mono">
                      +50.000 đ
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    "Chuyên viên test nứt ngầm bằng cảm biến siêu âm, đo trọng lượng cân bằng và cấp Chứng nhận bảo hành 30 ngày trước khi giao."
                  </p>
                </div>
              </label>
            </div>

            {/* Subtotal preview */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Tạm tính (Giá vợt + Phí kiểm định):</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {subTotal.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            {/* CỤM 2 NÚT BẤM (BẮT BUỘC THEO ĐỀ BÀI) */}
            <div className="space-y-2.5 pt-2">
              {/* Nút chính */}
              <button
                id="btn-custom-lab-studio"
                onClick={handleProceedToCustomizer}
                className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm sm:text-base transition-all duration-200 shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Mua ngay & Chuyển sang Thiết kế Vợt Riêng (+80.000 VNĐ)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Nút phụ */}
              <button
                id="btn-skip-custom-buy"
                onClick={handleDirectBuy}
                className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Bỏ qua thiết kế - Mua ngay</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};


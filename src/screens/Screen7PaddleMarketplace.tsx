import React, { useState } from 'react';
import { ScreenId, Paddle } from '../types';
import { PADDLES_DATA } from '../data/mockData';
import { 
  ShieldCheck, 
  Filter, 
  Check, 
  Search, 
  ArrowRight, 
  SlidersHorizontal, 
  Star, 
  Sparkles,
  ShoppingBag,
  BadgePercent,
  CheckCircle2,
  Tag,
  Plus,
  Package,
  Layers
} from 'lucide-react';

interface Screen7PaddleMarketplaceProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectPaddle: (paddle: Paddle) => void;
}

export const Screen7PaddleMarketplace: React.FC<Screen7PaddleMarketplaceProps> = ({
  onNavigate,
  onSelectPaddle,
}) => {
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [selectedCondition, setSelectedCondition] = useState('Tất cả');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');

  const isFilterActive =
    selectedBrand !== 'Tất cả' ||
    selectedCondition !== 'Tất cả' ||
    selectedPriceRange !== 'Tất cả' ||
    onlyVerified;

  const handleResetFilters = () => {
    setSelectedBrand('Tất cả');
    setSelectedCondition('Tất cả');
    setOnlyVerified(false);
    setSelectedPriceRange('Tất cả');
  };

  const handlePaddleCardClick = (paddle: Paddle) => {
    onSelectPaddle(paddle);
    onNavigate(8);
  };

  const filteredPaddles = PADDLES_DATA.filter((pad) => {
    if (selectedBrand !== 'Tất cả' && pad.brand !== selectedBrand) return false;
    if (onlyVerified && !pad.isVerifiedEligible) return false;

    if (selectedCondition === '> 85%' && pad.conditionPercentage < 85) return false;
    if (selectedCondition === '> 90%' && pad.conditionPercentage < 90) return false;
    if (selectedCondition === 'Like New' && pad.conditionPercentage < 93) return false;

    if (selectedPriceRange === '< 5.000.000đ' && pad.price >= 5000000) return false;
    if (selectedPriceRange === '5.000.000đ - 6.000.000đ' && (pad.price < 5000000 || pad.price > 6000000)) return false;
    if (selectedPriceRange === '> 6.000.000đ' && pad.price <= 6000000) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header breadcrumb & Seller Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => onNavigate(1)}>Trang chủ</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Chợ Vợt Cũ</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif] mt-0.5">
            Chợ Vợt Cũ - Sàn Giao Dịch Kiểm Định Chuyên Sâu
          </h2>
        </div>

        {/* Nút hành động dành cho Người Bán (Pass vợt) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate(12)}
            className="px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-lime-400/25 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <Tag className="w-4 h-4" />
            <span>Đăng bán vợt</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Filter (Col 3) and Right Paddle Grid (Col 9 / 4 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI (BỘ LỌC) - lg:col-span-3 */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-lime-600" />
                BỘ LỌC
              </span>
              <button
                onClick={handleResetFilters}
                className={`text-[11px] font-semibold hover:underline transition-colors ${
                  isFilterActive ? 'text-lime-600' : 'text-slate-400'
                }`}
              >
                Đặt lại
              </button>
            </div>

            {/* Verification Checkbox Toggle */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-xs text-emerald-950 block">
                    Chỉ hiện sản phẩm có kiểm định
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    Bảo chứng không nứt ngầm, bảo vệ ký quỹ 100%.
                  </span>
                </div>
              </label>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Thương hiệu</label>
              {['Tất cả', 'RPM', 'Honolulu', 'Zocker', 'Joola', 'Selkirk', 'CRBN', 'Gearbox', 'Diadem', 'Six Zero', 'Engage'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedBrand === brand
                      ? 'bg-slate-900 text-lime-400 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{brand}</span>
                  {selectedBrand === brand && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Độ mới (Tình trạng)</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {['Tất cả', '> 85%', '> 90%', 'Like New'].map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`py-1.5 px-2 rounded-xl border text-center font-semibold transition-colors ${
                      selectedCondition === cond
                        ? 'bg-lime-400 border-lime-500 text-slate-950 font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Tầm giá</label>
              <select 
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800"
              >
                <option value="Tất cả">Tất cả mức giá</option>
                <option value="< 5.000.000đ">&lt; 5.000.000đ</option>
                <option value="5.000.000đ - 6.000.000đ">5.000.000đ - 6.000.000đ</option>
                <option value="> 6.000.000đ">&gt; 6.000.000đ</option>
              </select>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (DANH SÁCH 4 CỘT) - lg:col-span-9 */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 min-h-[22px]">
            {isFilterActive ? (
              <span className="flex items-center gap-1.5 text-slate-700 animate-in fade-in duration-200">
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse shrink-0"></span>
                Tìm thấy {filteredPaddles.length} mẫu vợt đã được định giá & sẵn sàng kiểm định
              </span>
            ) : null}
            <span className={`text-lime-600 font-semibold ${!isFilterActive ? 'ml-auto' : ''}`}>
              Giao hỏa tốc 2H tại TP.HCM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredPaddles.map((paddle) => {
              const isTargetZocker = paddle.id === 'paddle-zocker-aspire';

              return (
                <div
                  key={paddle.id}
                  onClick={() => handlePaddleCardClick(paddle)}
                  className={`group cursor-pointer rounded-3xl bg-white border p-4 transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                    isTargetZocker
                      ? 'border-2 border-lime-400 shadow-xl ring-2 ring-lime-400/30 hover:scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {isTargetZocker && (
                    <div className="absolute top-0 right-0 bg-lime-400 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-bl-xl shadow">
                      Sản phẩm tâm điểm
                    </div>
                  )}

                  <div>
                    {/* Paddle Photo */}
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 mb-3">
                      <img
                        src={paddle.images[0]}
                        alt={paddle.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Condition badge - Vợt cũ pass lại */}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-xs text-amber-300 text-[10px] font-black flex items-center gap-1 border border-amber-400/30 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Vợt cũ • Độ mới {paddle.conditionPercentage}%
                      </span>
                    </div>

                    {/* Badge: "Hỗ trợ Kiểm định PickleMate 50k" */}
                    {paddle.isVerifiedEligible && (
                      <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lime-100 text-lime-900 border border-lime-300 text-[10px] font-extrabold">
                        <ShieldCheck className="w-3 h-3 text-lime-700" />
                        <span>Hỗ trợ Kiểm định PickleMate 50k</span>
                      </div>
                    )}

                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-lime-600 transition-colors line-clamp-2">
                      {paddle.name}
                    </h4>

                    {/* Seller small tag */}
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span>Người bán: <strong className="text-slate-700">{paddle.seller.name}</strong></span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-base font-black text-slate-900">
                          {paddle.price.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        Chính hãng
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaddleCardClick(paddle);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                        isTargetZocker
                          ? 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>Xem Chi Tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

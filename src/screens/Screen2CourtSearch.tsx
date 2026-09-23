import React, { useState } from 'react';
import { ScreenId, Court } from '../types';
import { COURTS_DATA } from '../data/mockData';
import { CourtSearchFilter, FilterState, calculateDistanceKm, RealLocation } from '../components/CourtSearchFilter';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Filter, 
  ChevronDown, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Wifi, 
  Car, 
  Coffee, 
  SlidersHorizontal,
  Navigation,
  Sparkles,
  Maximize2,
  ExternalLink,
  Layers,
  Compass,
  Locate
} from 'lucide-react';

interface Screen2CourtSearchProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectCourt: (court: Court) => void;
}

export const Screen2CourtSearch: React.FC<Screen2CourtSearchProps> = ({ onNavigate, onSelectCourt }) => {
  const [filters, setFilters] = useState<FilterState>({
    province: 'Toàn quốc',
    district: 'Quận 7',
    ward: 'Tất cả',
    bookingDate: '',
    startTime: '',
    endTime: '',
    priceRange: 'Tất cả',
    realLocation: null,
    maxDistanceKm: 0,
  });
  const [selectedCourtId, setSelectedCourtId] = useState<string>('court-swin-q7');
  const [isZoomedToQ7, setIsZoomedToQ7] = useState(true);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const selectedCourt = COURTS_DATA.find((c) => c.id === selectedCourtId) || COURTS_DATA[0];

  const handleCourtClick = (court: Court) => {
    setSelectedCourtId(court.id);
    onSelectCourt(court);
    if (court.district === 'Quận 7') {
      setIsZoomedToQ7(true);
    }
  };

  const handleProceedToBooking = () => {
    onSelectCourt(selectedCourt);
    onNavigate(3);
  };

  // Tính khoảng cách cho từng sân dựa trên vị trí thực (nếu người dùng đã chọn)
  const courtsWithDistance = COURTS_DATA.map((court) => {
    const distance = filters.realLocation
      ? calculateDistanceKm(filters.realLocation.lat, filters.realLocation.lng, court.lat, court.lng)
      : null;
    return {
      ...court,
      distance,
    };
  });

  // Lọc sân theo các tiêu chí: Vị trí thực tế / Bán kính, Quận/Huyện, Phường/Xã, Khoảng giá
  const filteredCourts = courtsWithDistance
    .filter((court) => {
      // Lọc theo vị trí thực tế & bán kính quét
      if (filters.realLocation) {
        if (filters.maxDistanceKm && filters.maxDistanceKm > 0 && court.distance !== null) {
          if (court.distance > filters.maxDistanceKm) return false;
        }
        // Nếu người dùng chọn mốc thực tế mà không chọn quận cụ thể thì ưu tiên hiển thị theo bán kính
        if (filters.district !== 'Tất cả' && (!filters.maxDistanceKm || filters.maxDistanceKm === 0)) {
          if (court.district !== filters.district) return false;
        }
      } else {
        // District filter thông thường khi chưa chọn vị trí thực
        if (filters.district !== 'Tất cả' && court.district !== filters.district) return false;
      }

      // Ward filter (phân loại theo phường/xã)
      if (filters.ward && filters.ward !== 'Tất cả') {
        if (!court.address.toLowerCase().includes(filters.ward.toLowerCase())) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange === 'Dưới 100k') {
        if (court.pricePerHour >= 100000) return false;
      } else if (filters.priceRange === '100k - 150k') {
        if (court.pricePerHour < 100000 || court.pricePerHour > 150000) return false;
      } else if (filters.priceRange === '150k - 200k') {
        if (court.pricePerHour < 150000 || court.pricePerHour > 200000) return false;
      } else if (filters.priceRange === '200k - 300k') {
        if (court.pricePerHour < 200000 || court.pricePerHour > 300000) return false;
      } else if (filters.priceRange === 'Trên 300k') {
        if (court.pricePerHour <= 300000) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Nếu có vị trí thực tế thì tự động sắp xếp theo thứ tự từ gần nhất đến xa nhất
      if (filters.realLocation && a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    });

  // Khoảng cách của sân đang được chọn đến vị trí thực (nếu có)
  const selectedCourtDistance = filters.realLocation
    ? calculateDistanceKm(filters.realLocation.lat, filters.realLocation.lng, selectedCourt.lat, selectedCourt.lng)
    : null;

  return (
    <div className="space-y-4">
      {/* Header breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => onNavigate(1)}>Trang chủ</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Tìm kiếm & Bản đồ Sân</span>
          </div>
        </div>
      </div>

      {/* 1. BỘ LỌC TÌM KIẾM SÂN PICKLEBALL - FULL MÀN HÌNH NGANG */}
      <div className="w-full">
        <CourtSearchFilter className="w-full" onFilterChange={setFilters} />
      </div>

      {/* 2. BỐ CỤC DỌC: DANH SÁCH CÁC CỤM SÂN PHÙ HỢP */}
      <div className="w-full space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-700 px-1 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse"></span>
            {filters.realLocation ? (
              <>
                <span className="text-sm font-black text-slate-900 font-['Lexend',sans-serif]">
                  {filteredCourts.length} sân gần "{filters.realLocation.name}"
                </span>
                {filters.maxDistanceKm > 0 ? (
                  <span className="text-lime-800 bg-lime-100 text-xs px-2 py-0.5 rounded-md font-bold">
                    Bán kính &lt; {filters.maxDistanceKm} km
                  </span>
                ) : (
                  <span className="text-slate-600 bg-slate-100 text-xs px-2 py-0.5 rounded-md font-medium">
                    Sắp xếp theo khoảng cách gần nhất
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-black text-slate-900 font-['Lexend',sans-serif]">
                {filteredCourts.length} sân phù hợp tại {filters.district}
              </span>
            )}
            {filters.bookingDate && (
              <span className="text-slate-500 font-normal">
                ({new Date(filters.bookingDate).toLocaleDateString('vi-VN')})
              </span>
            )}
            {filters.priceRange !== 'Tất cả' && (
              <span className="text-lime-800 bg-lime-100 text-xs px-2 py-0.5 rounded-md font-bold">
                {filters.priceRange}
              </span>
            )}
          </div>
          <span className="text-lime-600 font-bold bg-lime-50 px-2.5 py-1 rounded-lg border border-lime-200">
            ✓ Cập nhật Real-time 24/7
          </span>
        </div>

        {/* Grid thẻ sân rộng rãi theo chiều ngang màn hình */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourts.map((court) => {
            const isSelected = court.id === selectedCourtId;
            return (
              <div
                key={court.id}
                onClick={() => handleCourtClick(court)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-lime-50/70 border-lime-400 shadow-md ring-2 ring-lime-400/50'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-lime-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg shadow-xs">
                    Đang chọn
                  </div>
                )}

                <div>
                  <div className="relative mb-3">
                    <img
                      src={court.image}
                      alt={court.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{court.rating}</span>
                      <span className="text-slate-300">({court.reviewCount})</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {court.name}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{court.address}</span>
                  </p>

                  {/* Huy hiệu khoảng cách thực tế so với vị trí đã chọn */}
                  {court.distance !== null && (
                    <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl ${
                      court.distance <= 3
                        ? 'bg-lime-400 text-slate-950 shadow-2xs ring-1 ring-lime-500/40'
                        : court.distance <= 6
                        ? 'bg-lime-100 text-lime-900 border border-lime-300/80'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Navigation className="w-3.5 h-3.5 shrink-0 text-slate-900" />
                      <span>Cách bạn: <strong>{court.distance} km</strong></span>
                      {court.distance <= 3 && (
                        <span className="ml-auto text-[10px] font-black uppercase tracking-wider bg-slate-950 text-lime-400 px-1.5 py-0.5 rounded">
                          Gần bạn
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Giá thuê sân</span>
                    <span className="text-sm font-extrabold text-lime-600">
                      {court.pricePerHour.toLocaleString('vi-VN')} đ<span className="text-[10px] font-normal text-slate-500">/h</span>
                    </span>
                  </div>
                  
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-lime-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                  }`}>
                    {isSelected ? 'Đang xem map ↓' : 'Chọn xem ↓'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. BỐ CỤC DỌC: BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC REAL-TIME */}
      <div className="w-full space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-lime-600" />
            <h3 className="text-base font-black text-slate-900 font-['Lexend',sans-serif]">
              Bản Đồ Vị Trí Thực Tế (Google Maps GPS Real-time)
            </h3>
          </div>

          {/* Lộ trình chỉ đường khi đã có vị trí thực */}
          {filters.realLocation && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${filters.realLocation.lat},${filters.realLocation.lng}&destination=${selectedCourt.lat},${selectedCourt.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-all shadow-xs cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Chỉ đường từ {filters.realLocation.name.split('(')[0].trim()} ({selectedCourtDistance ?? 0} km)</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
        </div>

        {/* Thanh lộ trình di chuyển trực quan khi có vị trí thực */}
        {filters.realLocation && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Lộ trình di chuyển từ vị trí thực tế của bạn:</div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                  <span className="text-lime-400 font-black">{filters.realLocation.name}</span>
                  <span className="text-slate-500">➔</span>
                  <span className="text-white font-bold">{selectedCourt.name}</span>
                  {selectedCourtDistance !== null && (
                    <span className="text-xs font-black bg-lime-400 text-slate-950 px-2 py-0.5 rounded-md">
                      Khoảng cách: {selectedCourtDistance} km
                    </span>
                  )}
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${filters.realLocation.lat},${filters.realLocation.lng}&destination=${selectedCourt.lat},${selectedCourt.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-transform hover:scale-105 cursor-pointer shadow-md"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Mở lộ trình chỉ đường</span>
            </a>
          </div>
        )}

        <div id="google-maps-container" className="relative h-[440px] sm:h-[490px] w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
          {/* Map Canvas Background: Real Google Maps Embed */}
          <div className="absolute inset-0 z-0">
            {/* SVG GPS Beacon Anchor (matching target selector & visual indicator) */}
            <svg
              className="absolute top-3 left-3 w-5 h-5 text-lime-400 z-10 pointer-events-none drop-shadow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#84cc16" fillOpacity="0.3" />
            </svg>

            {/* Real Google Map Embed with exact coordinates or route */}
            <iframe
              id="gmap-real-embed"
              title={`Vị trí thực tế trên Google Maps - ${selectedCourt.name}`}
              src={
                filters.realLocation
                  ? `https://maps.google.com/maps?saddr=${filters.realLocation.lat},${filters.realLocation.lng}&daddr=${selectedCourt.lat},${selectedCourt.lng}&hl=vi&output=embed`
                  : `https://maps.google.com/maps?q=${selectedCourt.lat},${selectedCourt.lng}&hl=vi&z=${isZoomedToQ7 ? 16 : 14}&t=${mapType === 'satellite' ? 'k' : 'm'}&output=embed`
              }
              className="w-full h-full border-0 filter contrast-[1.03]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* Top Overlay Bar: Google Map Status & Controls */}
          <div className="relative z-10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Left Badge: Real Google Maps Location */}
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/90 shadow-xl text-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span className="text-lime-400 font-extrabold">Google Maps:</span>
                <span className="truncate max-w-[150px] sm:max-w-[200px]">{selectedCourt.name}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                ({selectedCourt.lat.toFixed(4)}, {selectedCourt.lng.toFixed(4)})
              </span>
            </div>

            {/* Right Action Controls */}
            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
              {/* Switch Map Type (Roadmap vs Satellite) */}
              <div className="flex rounded-xl bg-slate-950/90 backdrop-blur-md p-0.5 border border-slate-700 text-xs font-semibold text-slate-300 shadow-md">
                <button
                  type="button"
                  onClick={() => setMapType('roadmap')}
                  className={`px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer ${
                    mapType === 'roadmap' ? 'bg-lime-400 text-slate-950 font-black shadow-sm' : 'hover:text-white'
                  }`}
                >
                  Bản đồ
                </button>
                <button
                  type="button"
                  onClick={() => setMapType('satellite')}
                  className={`px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer ${
                    mapType === 'satellite' ? 'bg-lime-400 text-slate-950 font-black shadow-sm' : 'hover:text-white'
                  }`}
                >
                  Vệ tinh
                </button>
              </div>

              {/* Zoom Level Toggle */}
              <button 
                type="button"
                onClick={() => setIsZoomedToQ7(!isZoomedToQ7)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md text-white border border-slate-700 hover:bg-slate-800 shadow-md text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Thay đổi mức độ thu phóng"
              >
                <Maximize2 className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">{isZoomedToQ7 ? 'Zoom 16x' : 'Zoom 14x'}</span>
              </button>

              {/* Direct Google Maps Link */}
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedCourt.name}, ${selectedCourt.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#0F9D58] hover:bg-[#0b8043] text-white shadow-lg text-xs font-black flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                title="Mở trực tiếp trên ứng dụng hoặc website Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Google Maps</span>
              </a>
            </div>
          </div>

          {/* Bottom Floating Quick-Select Courts Bar on Map */}
          <div className="relative z-10 mt-auto p-3 sm:p-4 pointer-events-none">
            <div className="pointer-events-auto bg-slate-950/92 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <Navigation className="w-3.5 h-3.5 text-lime-400" />
                  <span>Chọn nhanh sân để định vị vị trí:</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.lat},${selectedCourt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-lime-400 hover:text-lime-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Chỉ đường trên Google Maps</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {COURTS_DATA.slice(0, 4).map((court) => {
                  const isSelected = court.id === selectedCourt.id;
                  return (
                    <button
                      key={court.id}
                      type="button"
                      onClick={() => handleCourtClick(court)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/25 scale-[1.02]'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-lime-400'}`} />
                      <span>{court.name.replace('Sân Pickleball ', '')}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'bg-slate-950/20 text-slate-900 font-extrabold' : 'bg-slate-800 text-slate-400'}`}>
                        {court.district}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BỐ CỤC DỌC: THẺ THÔNG TIN CHI TIẾT CỤM SÂN ĐANG CHỌN */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-lime-400 shadow-xl space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-lime-400 text-slate-950 text-xs font-black uppercase">
                Đã Chọn Trên Bản Đồ
              </span>
              <span className="text-xs text-slate-500 font-semibold">Mã sân: #{selectedCourt.id.replace('court-', '').toUpperCase()}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mt-1 font-['Lexend',sans-serif]">
              {selectedCourt.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-lime-600 shrink-0" />
              <span>{selectedCourt.address}</span>
            </p>

            {/* Google Maps Quick Links */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedCourt.name}, ${selectedCourt.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-[#0F9D58]" />
                <span>Xem trên Google Maps</span>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.lat},${selectedCourt.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-50 hover:bg-lime-100 text-lime-800 text-xs font-bold border border-lime-200 transition-colors"
              >
                <Navigation className="w-3 h-3 text-lime-600" />
                <span>Chỉ đường từ vị trí của bạn</span>
              </a>
            </div>
          </div>

          {/* Price Tag & CTA */}
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Bảng giá niêm yết</span>
            <span className="text-2xl sm:text-3xl font-black text-lime-600">
              {selectedCourt.pricePerHour.toLocaleString('vi-VN')} đ
              <span className="text-xs font-normal text-slate-500">/giờ</span>
            </span>
          </div>
        </div>

        {/* Amenities Grid (Tiện ích sân bãi) */}
        <div className="pt-2 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 block font-['Lexend',sans-serif]">
            Tiện ích sân bãi:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {selectedCourt.amenities.map((am, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-black shadow-sm">
                <Check className="w-3.5 h-3.5 text-lime-600 shrink-0 stroke-[3]" />
                <span className="font-black truncate tracking-wide">{am}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real photos gallery preview */}
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2">Hình ảnh thực tế cụm {selectedCourt.name}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {selectedCourt.gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${selectedCourt.name} angle ${i}`}
                referrerPolicy="no-referrer"
                className="w-full h-28 rounded-xl object-cover border border-slate-200 hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* Action Buttons to Next Step */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-slate-600">
            Lịch trống Thứ 7: <strong className="text-lime-600 font-bold">Còn 3 khung giờ</strong> (bao gồm 17:00 - 19:00)
          </div>

          <button
            id="btn-view-schedule"
            onClick={handleProceedToBooking}
            className="px-6 sm:px-8 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm sm:text-base transition-all duration-200 shadow-lg shadow-lime-400/20 flex items-center gap-2 group cursor-pointer hover:scale-[1.01]"
          >
            <span>Xem Lịch Trống & Đặt Sân</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

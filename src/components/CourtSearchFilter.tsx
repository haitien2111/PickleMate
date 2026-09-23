import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Calendar, 
  Clock, 
  Check, 
  RotateCcw,
  SlidersHorizontal,
  X,
  MapPin
} from 'lucide-react';

export interface RealLocation {
  name: string;
  lat: number;
  lng: number;
  source: 'gps' | 'preset' | 'custom';
  accuracy?: number;
}

export interface FilterState {
  province: string;
  district: string;
  ward: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  priceRange: string;
  realLocation?: RealLocation | null;
  maxDistanceKm?: number;
}

// Danh sách các mốc vị trí thực tế phổ biến tại TP.HCM để người dùng chọn nhanh
export const REAL_LANDMARKS: RealLocation[] = [
  { name: 'Crescent Mall & Phú Mỹ Hưng (Quận 7)', lat: 10.7293, lng: 106.7219, source: 'preset' },
  { name: 'Khu dân cư Him Lam / Lotte Mart (Quận 7)', lat: 10.7455, lng: 106.6998, source: 'preset' },
  { name: 'Landmark 81 / Vinhomes Central Park (Bình Thạnh)', lat: 10.7950, lng: 106.7218, source: 'preset' },
  { name: 'Chợ Bến Thành & Phố đi bộ Nguyễn Huệ (Quận 1)', lat: 10.7719, lng: 106.7044, source: 'preset' },
  { name: 'Khu đô thị Sala & Thủ Thiêm (TP. Thủ Đức)', lat: 10.7686, lng: 106.7208, source: 'preset' },
  { name: 'Thảo Điền / Metro An Phú (TP. Thủ Đức)', lat: 10.8038, lng: 106.7371, source: 'preset' },
  { name: 'Vạn Hạnh Mall & Kỳ Hòa (Quận 10)', lat: 10.7702, lng: 106.6698, source: 'preset' },
  { name: 'Sân bay Quốc Tế Tân Sơn Nhất (Tân Bình)', lat: 10.8184, lng: 106.6588, source: 'preset' },
  { name: 'CLB Thể thao Rạch Miễu / Phan Xích Long (Phú Nhuận)', lat: 10.7963, lng: 106.6896, source: 'preset' },
];

// Hàm tính khoảng cách giữa 2 tọa độ theo km (Haversine Formula)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Phân loại các phường/xã theo Quận/Huyện tương ứng (sắp xếp theo bảng chữ cái A-Z)
export const DISTRICT_WARDS_MAP: Record<string, string[]> = {
  'Bình Thạnh': [
    'Phường 1',
    'Phường 2',
    'Phường 3',
    'Phường 11',
    'Phường 13',
    'Phường 15',
    'Phường 19',
    'Phường 22',
    'Phường 25',
    'Phường 26',
    'Phường 27',
    'Phường 28',
  ],
  'Phú Nhuận': [
    'Phường 1',
    'Phường 2',
    'Phường 3',
    'Phường 5',
    'Phường 7',
    'Phường 8',
    'Phường 9',
    'Phường 10',
    'Phường 11',
    'Phường 15',
    'Phường 17',
  ],
  'Quận 1': [
    'Bến Nghé',
    'Bến Thành',
    'Cầu Kho',
    'Cầu Ông Lãnh',
    'Cô Giang',
    'Đa Kao',
    'Nguyễn Cư Trinh',
    'Nguyễn Thái Bình',
    'Phạm Ngũ Lão',
    'Tân Định',
  ],
  'Quận 2': [
    'An Khánh',
    'An Lợi Đông',
    'An Phú',
    'Bình An',
    'Bình Khánh',
    'Bình Trưng Đông',
    'Bình Trưng Tây',
    'Cát Lái',
    'Thạnh Mỹ Lợi',
    'Thảo Điền',
    'Thủ Thiêm',
  ],
  'Quận 7': [
    'Bình Thuận',
    'Phú Mỹ',
    'Phú Thuận',
    'Tân Hưng',
    'Tân Kiểng',
    'Tân Phong',
    'Tân Phú',
    'Tân Quy',
    'Tân Thuận Đông',
    'Tân Thuận Tây',
  ],
  'Quận 10': [
    'Phường 1',
    'Phường 2',
    'Phường 4',
    'Phường 5',
    'Phường 6',
    'Phường 7',
    'Phường 8',
    'Phường 9',
    'Phường 10',
    'Phường 11',
    'Phường 12',
    'Phường 13',
    'Phường 14',
    'Phường 15',
  ],
  'TP. Thủ Đức': [
    'An Khánh',
    'Bình Chiểu',
    'Bình Thọ',
    'Hiệp Bình Chánh',
    'Hiệp Bình Phước',
    'Hiệp Phú',
    'Linh Chiểu',
    'Linh Đông',
    'Linh Tây',
    'Linh Trung',
    'Linh Xuân',
    'Phước Bình',
    'Phước Long A',
    'Phước Long B',
    'Tam Bình',
    'Tam Phú',
    'Tăng Nhơn Phú A',
    'Tăng Nhơn Phú B',
    'Thảo Điền',
    'Thủ Thiêm',
    'Trường Thọ',
  ],
};

interface CourtSearchFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

export const CourtSearchFilter: React.FC<CourtSearchFilterProps> = ({ 
  onFilterChange,
  className = '' 
}) => {
  // Region filters
  const [province, setProvince] = useState('Toàn quốc');
  const [district, setDistrict] = useState('Tất cả');
  const [ward, setWard] = useState('Tất cả');

  // Time filters
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Calendar popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(8); // 8 is September (0-indexed)
  const calendarRef = useRef<HTMLDivElement>(null);

  // Price pill filter
  const [activePriceRange, setActivePriceRange] = useState('Tất cả');

  // Vị trí thực tế của người dùng (GPS hoặc Mốc địa danh thực tế)
  const [realLocation, setRealLocation] = useState<RealLocation | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = Tất cả

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Close calendar popover on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCalendarOpen]);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const dateObj = new Date(y, m - 1, d);
      const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = dayNames[dateObj.getDay()];
      return `${dayName}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    } catch {
      return dateStr;
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  // Monday as 0, Sunday as 6:
  const startDayOffset = (firstDay + 6) % 7;

  const handleSelectDay = (day: number) => {
    const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setBookingDate(formatted);
    notifyChange({ bookingDate: formatted });
    setIsCalendarOpen(false);
  };

  const handleQuickSelect = (dateStr: string) => {
    setBookingDate(dateStr);
    const [y, m] = dateStr.split('-').map(Number);
    setViewYear(y);
    setViewMonth(m - 1);
    notifyChange({ bookingDate: dateStr });
    setIsCalendarOpen(false);
  };

  const priceOptions = [
    { id: 'all', label: 'Tất cả' },
    { id: 'under100', label: 'Dưới 100k' },
    { id: '100-150', label: '100k - 150k' },
    { id: '150-200', label: '150k - 200k' },
    { id: '200-300', label: '200k - 300k' },
    { id: 'over300', label: 'Trên 300k' },
  ];

  const handlePriceClick = (label: string) => {
    setActivePriceRange(label);
    notifyChange({ priceRange: label });
  };

  const notifyChange = (updated: Partial<FilterState>) => {
    if (onFilterChange) {
      onFilterChange({
        province: updated.province ?? province,
        district: updated.district ?? district,
        ward: updated.ward ?? ward,
        bookingDate: updated.bookingDate ?? bookingDate,
        startTime: updated.startTime ?? startTime,
        endTime: updated.endTime ?? endTime,
        priceRange: updated.priceRange ?? activePriceRange,
        realLocation: updated.realLocation !== undefined ? updated.realLocation : realLocation,
        maxDistanceKm: updated.maxDistanceKm !== undefined ? updated.maxDistanceKm : maxDistanceKm,
      });
    }
  };

  const handleReset = () => {
    setProvince('Toàn quốc');
    setDistrict('Tất cả');
    setWard('Tất cả');
    setBookingDate('');
    setStartTime('');
    setEndTime('');
    setActivePriceRange('Tất cả');
    setIsCalendarOpen(false);
    setRealLocation(null);
    setMaxDistanceKm(0);
    if (onFilterChange) {
      onFilterChange({
        province: 'Toàn quốc',
        district: 'Tất cả',
        ward: 'Tất cả',
        bookingDate: '',
        startTime: '',
        endTime: '',
        priceRange: 'Tất cả',
        realLocation: null,
        maxDistanceKm: 0,
      });
    }
  };

  return (
    <section 
      id="pickleball-court-search-filter"
      className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 text-left font-['Lexend',sans-serif] ${className}`}
    >
      {/* Header bar of filter */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-lime-100 text-[#0b1320] flex items-center justify-center border border-lime-300 shadow-xs shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-[#84cc16]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0b1320] tracking-tight">
              Bộ Lọc Tìm Kiếm Sân Pickleball
            </h2>
          </div>
        </div>

        <button
          id="btn-reset-court-filters"
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0b1320] py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors"
          title="Đặt lại tất cả bộ lọc"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-[#84cc16] transition-colors" />
          <span className="hidden sm:inline">Đặt lại</span>
        </button>
      </div>

      {/* 3 Phần xếp dọc, cách nhau một khoảng margin thoáng đãng */}
      <div className="space-y-6 sm:space-y-7">
        
        {/* =========================================================================
            PHẦN 1: LỌC THEO KHU VỰC
            ========================================================================= */}
        <div id="filter-section-region" className="space-y-2.5 sm:space-y-3">
          {/* Tiêu đề H3: "Lọc theo khu vực" (Chữ màu Xanh Navy) */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#84cc16] rounded-full inline-block"></span>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1320] tracking-tight">
              Lọc theo khu vực
            </h3>
          </div>

          {/* Bố cục: Lưới 3 cột (Grid 3 columns) có khoảng cách gap đều nhau */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
            {/* Cột 1: Label "Tỉnh thành". Bên dưới là ô Dropdown hiển thị "Toàn quốc" + icon mũi tên trỏ xuống */}
            <div className="space-y-1.5">
              <label 
                htmlFor="filter-select-province" 
                className="block text-xs sm:text-sm font-semibold text-[#0b1320]"
              >
                Tỉnh thành
              </label>
              <div className="relative">
                <select
                  id="filter-select-province"
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    notifyChange({ province: e.target.value });
                  }}
                  className="w-full appearance-none bg-white text-xs sm:text-sm font-medium text-[#0b1320] border border-slate-200 rounded-xl px-3.5 py-2.5 pr-9 hover:border-[#84cc16] focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all cursor-pointer shadow-2xs"
                >
                  <option value="Toàn quốc">Toàn quốc</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Cột 2: Label "Quận huyện". Bên dưới là ô Dropdown hiển thị "Tất cả" - Sắp xếp theo thứ tự bảng chữ cái */}
            <div className="space-y-1.5">
              <label 
                htmlFor="filter-select-district" 
                className="block text-xs sm:text-sm font-semibold text-[#0b1320]"
              >
                Quận huyện
              </label>
              <div className="relative">
                <select
                  id="filter-select-district"
                  value={district}
                  onChange={(e) => {
                    const newDistrict = e.target.value;
                    setDistrict(newDistrict);
                    let newWard = ward;
                    if (newDistrict !== 'Tất cả') {
                      const validWards = DISTRICT_WARDS_MAP[newDistrict] || [];
                      if (!validWards.includes(ward)) {
                        newWard = 'Tất cả';
                        setWard('Tất cả');
                      }
                    }
                    notifyChange({ district: newDistrict, ward: newWard });
                  }}
                  className="w-full appearance-none bg-white text-xs sm:text-sm font-medium text-[#0b1320] border border-slate-200 rounded-xl px-3.5 py-2.5 pr-9 hover:border-[#84cc16] focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all cursor-pointer shadow-2xs"
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Bình Thạnh">Bình Thạnh</option>
                  <option value="Phú Nhuận">Phú Nhuận</option>
                  <option value="Quận 1">Quận 1</option>
                  <option value="Quận 2">Quận 2</option>
                  <option value="Quận 7">Quận 7</option>
                  <option value="Quận 10">Quận 10</option>
                  <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Cột 3: Label "Phường xã". Phân loại theo Quận/Huyện tương ứng và sắp xếp bảng chữ cái */}
            <div className="space-y-1.5">
              <label 
                htmlFor="filter-select-ward" 
                className="block text-xs sm:text-sm font-semibold text-[#0b1320]"
              >
                Phường xã {district !== 'Tất cả' && <span className="text-[11px] font-normal text-slate-500">({district})</span>}
              </label>
              <div className="relative">
                <select
                  id="filter-select-ward"
                  value={ward}
                  onChange={(e) => {
                    setWard(e.target.value);
                    notifyChange({ ward: e.target.value });
                  }}
                  className="w-full appearance-none bg-white text-xs sm:text-sm font-medium text-[#0b1320] border border-slate-200 rounded-xl px-3.5 py-2.5 pr-9 hover:border-[#84cc16] focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all cursor-pointer shadow-2xs"
                >
                  {district === 'Tất cả' ? (
                    <>
                      <option value="Tất cả">Tất cả</option>
                      {Object.entries(DISTRICT_WARDS_MAP).map(([distName, wards]) => (
                        <optgroup key={distName} label={distName}>
                          {wards.map((w) => (
                            <option key={`${distName}-${w}`} value={w}>
                              {w} ({distName})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="Tất cả">Tất cả</option>
                      {(DISTRICT_WARDS_MAP[district] || []).map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PHẦN 2: THỜI GIAN ĐẶT SÂN (MỚI)
            ========================================================================= */}
        <div id="filter-section-time" className="space-y-2.5 sm:space-y-3">
          {/* Tiêu đề H3: "Thời gian đặt sân" (Chữ màu Xanh Navy) */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#84cc16] rounded-full inline-block"></span>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1320] tracking-tight">
              Thời gian đặt sân
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-lime-100 text-lime-800 px-2 py-0.5 rounded-md border border-lime-300">
              Mới
            </span>
          </div>

          {/* Bố cục: Lưới 3 cột tương tự phần trên */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
            
            {/* Cột 1 (Ngày chơi): Label "Ngày đặt sân". Datepicker hiển thị text "Chọn ngày" + icon Lịch màu Xanh Lime ở bên phải */}
            <div className="space-y-1.5">
              <label 
                htmlFor="filter-input-date" 
                className="block text-xs sm:text-sm font-semibold text-[#0b1320]"
              >
                Ngày đặt sân
              </label>
              <div 
                ref={calendarRef}
                className="relative"
              >
                <div 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="flex items-center justify-between w-full bg-white text-xs sm:text-sm font-medium text-[#0b1320] border border-slate-200 rounded-xl px-3.5 py-2.5 hover:border-[#84cc16] focus-within:border-[#84cc16] focus-within:ring-2 focus-within:ring-[#84cc16]/20 transition-all cursor-pointer shadow-2xs"
                >
                  <input
                    id="filter-input-date"
                    type="text"
                    readOnly
                    value={bookingDate ? formatDisplayDate(bookingDate) : ''}
                    placeholder="Chọn ngày"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#0b1320] placeholder:text-slate-400 placeholder:font-normal focus:outline-none cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {bookingDate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookingDate('');
                          notifyChange({ bookingDate: '' });
                        }}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Xóa ngày đã chọn"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <Calendar className="w-4 h-4 text-[#84cc16]" />
                  </div>
                </div>

                {/* Popover lịch trực quan cho phép người dùng xem và chọn ngày tháng */}
                {isCalendarOpen && (
                  <div 
                    id="calendar-dropdown-panel"
                    className="absolute z-50 left-0 sm:left-0 top-full mt-2 w-76 sm:w-80 max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 text-[#0b1320] animate-in fade-in zoom-in-95"
                  >
                    {/* Header: Tháng / Năm + Nút điều hướng */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (viewMonth === 0) {
                            setViewMonth(11);
                            setViewYear((y) => y - 1);
                          } else {
                            setViewMonth((m) => m - 1);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0b1320] transition-colors"
                        title="Tháng trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="text-sm font-bold text-[#0b1320]">
                        {monthNames[viewMonth]} / {viewYear}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (viewMonth === 11) {
                            setViewMonth(0);
                            setViewYear((y) => y + 1);
                          } else {
                            setViewMonth((m) => m + 1);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0b1320] transition-colors"
                        title="Tháng sau"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Pick Chips */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      <button
                        type="button"
                        onClick={() => handleQuickSelect('2026-09-14')}
                        className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg border text-center transition-all ${
                          bookingDate === '2026-09-14'
                            ? 'bg-[#84cc16] border-[#84cc16] text-[#0b1320] font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#84cc16] hover:bg-lime-50'
                        }`}
                      >
                        Hôm nay (14/09)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickSelect('2026-09-15')}
                        className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg border text-center transition-all ${
                          bookingDate === '2026-09-15'
                            ? 'bg-[#84cc16] border-[#84cc16] text-[#0b1320] font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#84cc16] hover:bg-lime-50'
                        }`}
                      >
                        Ngày mai (15/09)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickSelect('2026-09-19')}
                        className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg border text-center transition-all ${
                          bookingDate === '2026-09-19'
                            ? 'bg-[#84cc16] border-[#84cc16] text-[#0b1320] font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#84cc16] hover:bg-lime-50'
                        }`}
                      >
                        Thứ 7 (19/09)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickSelect('2026-09-20')}
                        className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg border text-center transition-all ${
                          bookingDate === '2026-09-20'
                            ? 'bg-[#84cc16] border-[#84cc16] text-[#0b1320] font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#84cc16] hover:bg-lime-50'
                        }`}
                      >
                        Chủ nhật (20/09)
                      </button>
                    </div>

                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                        <span 
                          key={d} 
                          className={`text-[11px] font-bold py-1 ${i >= 5 ? 'text-lime-600' : 'text-slate-400'}`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Day cells grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: startDayOffset }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="w-8 h-8 sm:w-9 sm:h-9" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const dayNumber = idx + 1;
                        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                        const isSelected = bookingDate === dateStr;
                        const isToday = viewYear === 2026 && viewMonth === 8 && dayNumber === 14;

                        return (
                          <button
                            key={`day-${dayNumber}`}
                            type="button"
                            onClick={() => handleSelectDay(dayNumber)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 text-xs font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#84cc16] text-[#0b1320] font-black shadow-md ring-2 ring-[#84cc16]/40 scale-105'
                                : isToday
                                ? 'border border-[#84cc16] text-[#0b1320] font-bold bg-lime-50 hover:bg-lime-100'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-[#0b1320]'
                            }`}
                          >
                            {dayNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingDate('');
                          notifyChange({ bookingDate: '' });
                          setIsCalendarOpen(false);
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                      >
                        Bỏ chọn ngày
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(false)}
                        className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cột 2 (Giờ bắt đầu): Label "Từ giờ". Ô chọn giờ hiển thị placeholder "00:00" kèm icon Đồng hồ */}
            <div className="space-y-1.5">
              <label 
                htmlFor="filter-input-start-time" 
                className="block text-xs sm:text-sm font-semibold text-[#0b1320]"
              >
                Từ giờ
              </label>
              <div className="relative">
                <input
                  id="filter-input-start-time"
                  type="time"
                  value={startTime}
                  placeholder="00:00"
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    notifyChange({ startTime: e.target.value });
                  }}
                  className="w-full bg-white text-xs sm:text-sm font-medium text-[#0b1320] border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 hover:border-[#84cc16] focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all cursor-pointer shadow-2xs"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <Clock className="w-4 h-4 text-[#84cc16]" />
                </div>
              </div>
            </div>

            {/* Cột 3 (Giờ kết thúc): Label "Đến giờ". Ô chọn giờ hiển thị placeholder "00:00" kèm icon Đồng hồ */}
            <div className="space-y-1.5">
              <label 
                htmlFor="filter-input-end-time" 
                className="block text-xs sm:text-sm font-semibold text-[#0b1320]"
              >
                Đến giờ
              </label>
              <div className="relative">
                <input
                  id="filter-input-end-time"
                  type="time"
                  value={endTime}
                  placeholder="00:00"
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    notifyChange({ endTime: e.target.value });
                  }}
                  className="w-full bg-white text-xs sm:text-sm font-medium text-[#0b1320] border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 hover:border-[#84cc16] focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 focus:outline-none transition-all cursor-pointer shadow-2xs"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <Clock className="w-4 h-4 text-[#84cc16]" />
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* =========================================================================
            PHẦN 3: KHOẢNG GIÁ (TÍNH THEO GIỜ)
            ========================================================================= */}
        <div id="filter-section-price" className="space-y-2.5 sm:space-y-3">
          {/* Tiêu đề H3: "Khoảng giá (tính trên 1 giờ)" (Chữ màu Xanh Navy) */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#84cc16] rounded-full inline-block"></span>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1320] tracking-tight flex items-baseline gap-1.5">
              <span>Khoảng giá</span>
              <span className="text-xs sm:text-sm font-medium text-slate-500">(tính trên 1 giờ)</span>
            </h3>
          </div>

          {/* Bố cục: Dạng Flex wrap, khoảng cách gap vừa phải */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {priceOptions.map((opt) => {
              const isActive = activePriceRange === opt.label;

              return (
                <button
                  key={opt.id}
                  id={`filter-pill-price-${opt.id}`}
                  type="button"
                  onClick={() => handlePriceClick(opt.label)}
                  className={`group relative rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer select-none overflow-hidden ${
                    isActive
                      ? 'bg-[#84cc16] border-2 border-[#84cc16] text-[#0b1320] font-extrabold shadow-sm ring-2 ring-[#84cc16]/30'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-[#84cc16] hover:text-[#0b1320]'
                  }`}
                >
                  {/* Dải ruy-băng / badge chéo ở góc trên cùng bên phải chứa icon dấu tick */}
                  {isActive && (
                    <span 
                      className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#0b1320] text-[#8eff00] rounded-bl-md flex items-center justify-center shadow-xs"
                      title="Đang được chọn"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}

                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};


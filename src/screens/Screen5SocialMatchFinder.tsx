import React, { useState } from 'react';
import { ScreenId, SocialMatch, UserProfile, BookingState } from '../types';
import { SOCIAL_MATCHES } from '../data/mockData';
import { CreateMatchModal } from '../components/CreateMatchModal';
import { 
  Users, 
  MapPin, 
  Clock, 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  ShieldCheck,
  Award,
  ChevronLeft,
  PlusCircle,
  RotateCcw,
  Check,
  Zap,
  Calendar,
  FilterX
} from 'lucide-react';

interface Screen5SocialMatchFinderProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectMatch: (match: SocialMatch) => void;
  user?: UserProfile | null;
  onRestrictedAction?: (action: () => void, prompt?: string) => void;
  bookingState?: BookingState | null;
}

export const Screen5SocialMatchFinder: React.FC<Screen5SocialMatchFinderProps> = ({
  onNavigate,
  onSelectMatch,
  user,
  onRestrictedAction,
  bookingState,
}) => {
  // Lịch đặt sân trước đó (từ bookingState hoặc phiên đặt sân gần nhất)
  const [savedBooking] = useState<{
    courtName: string;
    district: string;
    date: string;
    timeSlot: string;
  }>(() => {
    if (bookingState?.court) {
      return {
        courtName: bookingState.court.name,
        district: bookingState.court.district,
        date: bookingState.date,
        timeSlot: bookingState.timeSlot,
      };
    }
    return {
      courtName: 'Sân Swin Pickleball Q7',
      district: 'Quận 7',
      date: 'Tối nay',
      timeSlot: '19:30 - 21:30',
    };
  });

  const bookedCourtName = savedBooking.courtName;
  const bookedDistrict = savedBooking.district;
  const bookedTimeSlot = savedBooking.timeSlot;

  // Các state bộ lọc: Mặc định TRỐNG ('Tất cả') để người dùng tự do chọn thời gian
  const [districtFilter, setDistrictFilter] = useState<string>('Tất cả');
  const [timeFilter, setTimeFilter] = useState<string>('Tất cả');
  const [customSpecificTime, setCustomSpecificTime] = useState<string>('');
  const [duprRange, setDuprRange] = useState<string>('Tất cả');
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customMatches, setCustomMatches] = useState<SocialMatch[]>([]);

  // Hàm chuyển về chế độ Mặc định trống (tự chọn thời gian)
  const handleResetToDefaultBlank = () => {
    setDistrictFilter('Tất cả');
    setTimeFilter('Tất cả');
    setCustomSpecificTime('');
    setDuprRange('Tất cả');
    setSearchKeywords('');
  };

  const handleMatchCardClick = (match: SocialMatch) => {
    onSelectMatch(match);
    onNavigate(6);
  };

  const handleCreateMatchSuccess = (data: {
    courtName: string;
    date: string;
    startTime: string;
    endTime: string;
    slotsNeeded: number;
    duprLevel: string;
    notes: string;
  }) => {
    const newMatch: SocialMatch = {
      id: `match-custom-${Date.now()}`,
      title: `Kèo giao lưu ${data.courtName}`,
      courtName: data.courtName,
      district: 'Quận 7',
      time: `${data.startTime} - ${data.endTime}, ${data.date}`,
      duprRequirement: data.duprLevel,
      duprMin: 2.0,
      duprMax: 4.5,
      totalSlots: data.slotsNeeded + 1,
      joinedSlots: 1,
      totalCourtFee: 180000,
      pricePerSlot: 45000,
      format: 'Đôi Nam Nữ / Tự do',
      host: {
        name: user?.name || 'Khách',
        dupr: user?.dupr || '3.5',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      participants: [
        {
          name: user?.name || 'Khách',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          dupr: user?.dupr || '3.5',
          isHost: true,
          hasPaid: true,
        },
      ],
    };
    setCustomMatches((prev) => [newMatch, ...prev]);
  };

  const allMatches = [...customMatches, ...SOCIAL_MATCHES];

  const filteredMatches = allMatches.filter((m) => {
    // 1. Lọc theo khu vực
    if (districtFilter === 'sync_court') {
      if (m.district !== bookedDistrict) return false;
    } else if (districtFilter !== 'Tất cả' && m.district !== districtFilter) {
      return false;
    }

    // 2. Lọc theo thời gian
    if (timeFilter === 'sync_time') {
      const matchTimeLower = m.time.toLowerCase();
      const isEvening = matchTimeLower.includes('tối') || 
        m.time.includes('18:') || m.time.includes('19:') || m.time.includes('20:') || m.time.includes('21:');
      if (!isEvening) return false;
    } else if (timeFilter !== 'Tất cả') {
      const matchTimeLower = m.time.toLowerCase();
      if (timeFilter === 'Tối nay') {
        const isEvening = matchTimeLower.includes('tối') || 
          m.time.includes('18:') || m.time.includes('19:') || m.time.includes('20:') || m.time.includes('21:');
        if (!isEvening) return false;
      } else if (timeFilter === 'Chiều nay') {
        const isAfternoon = matchTimeLower.includes('chiều') || 
          m.time.includes('14:') || m.time.includes('15:') || m.time.includes('16:') || m.time.includes('17:');
        if (!isAfternoon) return false;
      } else if (timeFilter === 'Sáng mai') {
        const isMorning = matchTimeLower.includes('sáng') || 
          m.time.includes('06:') || m.time.includes('07:') || m.time.includes('08:') || m.time.includes('09:') || m.time.includes('10:');
        if (!isMorning) return false;
      } else if (timeFilter === 'Cuối tuần') {
        const isWeekend = matchTimeLower.includes('thứ 7') || matchTimeLower.includes('chủ nhật') || matchTimeLower.includes('cuối tuần');
        if (!isWeekend) return false;
      } else if (timeFilter === 'custom' && customSpecificTime) {
        if (!m.time.includes(customSpecificTime)) return false;
      }
    }

    // 3. Lọc theo DUPR
    if (duprRange === 'sync_dupr') {
      const userDuprNum = parseFloat(user?.dupr || '3.2');
      if (m.duprMin > userDuprNum + 0.5 || m.duprMax < userDuprNum - 0.7) return false;
    } else if (duprRange !== 'Tất cả') {
      if (duprRange === '1.0 - 2.5' && m.duprMin > 2.5) return false;
      if (duprRange === '2.5 - 3.5' && (m.duprMin > 3.5 || m.duprMax < 2.5)) return false;
      if (duprRange === '3.5+' && m.duprMax < 3.5) return false;
    }

    return true;
  });

  const isAnyFilterActive = districtFilter !== 'Tất cả' || timeFilter !== 'Tất cả' || duprRange !== 'Tất cả' || customSpecificTime !== '';

  return (
    <div className="space-y-6">
      {/* Top context header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => onNavigate(1)}>Trang chủ</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Ghép Kèo Giao Lưu</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif] mt-0.5">
            Sàn Ghép Kèo Giao Lưu & Thi Đấu DUPR
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="open-create-match-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo kèo giao lưu mới</span>
          </button>
        </div>
      </div>

      {/* THANH LỌC KÈO NGANG: LỰA CHỌN TỰ ĐỘNG ĐIỀN ĐỒNG BỘ NẰM TRONG TỪNG PHẦN, KHÔNG CẦN BUTTON RIÊNG */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Bộ lọc tìm kèo giao lưu
            </span>
          </div>
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetToDefaultBlank}
              className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại bộ lọc trống</span>
            </button>
          )}
        </div>

        {/* 3 CỘT BỘ LỌC CHI TIẾT - TÍCH HỢP TỰ ĐỘNG ĐIỀN TRONG TỪNG PHẦN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Phần 1: Vị trí khu vực */}
          <div className={`p-3 rounded-2xl border transition-all ${
            districtFilter === 'sync_court'
              ? 'bg-emerald-50/50 border-emerald-300'
              : districtFilter !== 'Tất cả'
              ? 'bg-cyan-50/50 border-cyan-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">
                1. Vị trí khu vực
              </label>
              {districtFilter === 'sync_court' ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                  Đồng bộ sân
                </span>
              ) : districtFilter !== 'Tất cả' ? (
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-1.5 py-0.2 rounded">
                  Đang lọc
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full text-xs font-extrabold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Tất cả">Tất cả khu vực TP.HCM (Mặc định trống)</option>
                <option value="sync_court" className="font-bold text-emerald-700 bg-emerald-50">
                  ⚡ Tự động điền theo sân đã đặt: {bookedDistrict} ({bookedCourtName})
                </option>
                <option value="Quận 7">Quận 7</option>
                <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                <option value="Quận 10">Quận 10</option>
                <option value="Bình Thạnh">Bình Thạnh</option>
                <option value="Quận 1">Quận 1</option>
              </select>
            </div>
          </div>

          {/* Phần 2: Khung thời gian */}
          <div className={`p-3 rounded-2xl border transition-all ${
            timeFilter === 'sync_time'
              ? 'bg-emerald-50/50 border-emerald-300'
              : timeFilter !== 'Tất cả'
              ? 'bg-lime-50/50 border-lime-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">
                2. Khung thời gian
              </label>
              {timeFilter === 'sync_time' ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                  Đồng bộ lịch
                </span>
              ) : timeFilter !== 'Tất cả' ? (
                <span className="text-[10px] font-bold text-lime-800 bg-lime-200 px-1.5 py-0.2 rounded">
                  Tự chọn
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime-600 shrink-0" />
              <select
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value);
                  if (e.target.value !== 'custom') setCustomSpecificTime('');
                }}
                className="w-full text-xs font-extrabold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Tất cả">Tất cả khung giờ (Mặc định trống - Tự do)</option>
                <option value="sync_time" className="font-bold text-emerald-700 bg-emerald-50">
                  ⚡ Tự động điền & đồng bộ lịch sân: {bookedTimeSlot}
                </option>
                <option value="Tối nay">Tối nay (Sau 18:00 - 22:00)</option>
                <option value="Chiều nay">Chiều nay (14:00 - 18:00)</option>
                <option value="Sáng mai">Sáng mai (08:00 - 12:00)</option>
                <option value="Cuối tuần">Cuối tuần (Thứ 7 & Chủ Nhật)</option>
                <option value="custom">Giờ cụ thể (Tự chọn...)</option>
              </select>
            </div>

            {/* Input chọn giờ cụ thể nếu người dùng chọn tùy chọn custom */}
            {timeFilter === 'custom' && (
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold">Giờ:</span>
                <input
                  type="text"
                  placeholder="VD: 19:30, 20:00..."
                  value={customSpecificTime}
                  onChange={(e) => setCustomSpecificTime(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-lime-500"
                />
              </div>
            )}
          </div>

          {/* Phần 3: Trình độ DUPR */}
          <div className={`p-3 rounded-2xl border transition-all ${
            duprRange === 'sync_dupr'
              ? 'bg-emerald-50/50 border-emerald-300'
              : duprRange !== 'Tất cả'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase block">
                3. Trình độ DUPR
              </label>
              {duprRange === 'sync_dupr' ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                  Theo DUPR
                </span>
              ) : duprRange !== 'Tất cả' ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.2 rounded">
                  Đang lọc
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                value={duprRange}
                onChange={(e) => setDuprRange(e.target.value)}
                className="w-full text-xs font-extrabold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Tất cả">Tất cả trình độ DUPR (Mặc định)</option>
                <option value="sync_dupr" className="font-bold text-emerald-700 bg-emerald-50">
                  ⚡ Tự động theo DUPR của tôi (DUPR {user?.dupr || '3.2'})
                </option>
                <option value="1.0 - 5.0">DUPR 1.0 - 5.0 (Tương thích rộng)</option>
                <option value="1.0 - 2.5">DUPR 1.0 - 2.5 (Người mới chơi)</option>
                <option value="2.5 - 3.5">DUPR 2.5 - 3.5 (Cân bằng tốt)</option>
                <option value="3.5+">DUPR 3.5+ (Cạnh tranh nâng cao)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* BỐ CỤC THẺ GRID 3 CỘT (Hiển thị danh sách các trận giao lưu đang mở) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
          <span>
            Tìm thấy {filteredMatches.length} kèo giao lưu đang mở
            {districtFilter === 'sync_court'
              ? ` tại ${bookedDistrict} (Đồng bộ: ${bookedCourtName})`
              : districtFilter !== 'Tất cả'
              ? ` tại ${districtFilter}`
              : ' trên toàn hệ thống'}
            {timeFilter === 'sync_time'
              ? ` (Đồng bộ: ${bookedTimeSlot})`
              : timeFilter !== 'Tất cả'
              ? ` (${timeFilter === 'custom' ? customSpecificTime || 'Giờ cụ thể' : timeFilter})`
              : ''}
          </span>
          <span className="text-cyan-600 font-semibold">Tự động chia tiền sân (Split Payment)</span>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              Không tìm thấy kèo giao lưu phù hợp với khung thời gian & bộ lọc hiện tại
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Bạn có thể đổi sang khung giờ khác, chuyển về chế độ mặc định trống để xem tất cả kèo, hoặc tự tạo kèo mới để các đấu thủ khác vào ghép.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetToDefaultBlank}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Đặt lại bộ lọc về trống
              </button>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Tạo kèo mới khung giờ này
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMatches.map((match) => {
            const isHighlight = match.id === 'match-vietpho-20h';
            const remainingSlots = match.totalSlots - match.joinedSlots;

            return (
              <div
                key={match.id}
                onClick={() => handleMatchCardClick(match)}
                className={`group cursor-pointer rounded-3xl p-5 transition-all duration-200 border text-left flex flex-col justify-between relative overflow-hidden ${
                  isHighlight
                    ? 'bg-white border-2 border-cyan-400 shadow-xl ring-2 ring-cyan-400/20 hover:scale-[1.01]'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                {/* Top Badge */}
                {isHighlight && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Kèo Mục Tiêu 20:00</span>
                  </div>
                )}

                <div>
                  {/* Host avatar & Match Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative shrink-0">
                      <img
                        src={match.host.avatar}
                        alt={match.host.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-cyan-400"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-slate-900 text-cyan-300 text-[9px] font-black px-1 rounded border border-cyan-500">
                        {match.host.dupr}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        Chủ kèo: <strong className="text-slate-800">{match.host.name}</strong>
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-cyan-600 transition-colors line-clamp-1">
                        {match.title}
                      </h4>
                    </div>
                  </div>

                  {/* Match Info Details */}
                  <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Tên sân:
                      </span>
                      <strong className="text-slate-800">{match.courtName} ({match.district})</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        Trình độ yêu cầu:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold text-[11px] border border-amber-200">
                        {match.duprRequirement}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-500" />
                        Số suất còn trống:
                      </span>
                      <span className="font-extrabold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
                        Còn {remainingSlots} / {match.totalSlots} suất
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Split Price & Action Button */}
                <div className="mt-4 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Chia đều / người</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-cyan-600 font-mono">
                        {match.pricePerSlot.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-xs font-bold text-slate-700">VNĐ</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatchCardClick(match);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isHighlight
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Xem Kèo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

      {/* Modal Tạo Kèo Giao Lưu Mới */}
      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleCreateMatchSuccess}
        onRestrictedAction={onRestrictedAction}
        savedBooking={savedBooking}
      />
    </div>
  );
};

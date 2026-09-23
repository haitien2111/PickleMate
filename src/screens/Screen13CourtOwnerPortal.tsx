import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Users,
  Plus,
  Search,
  Check,
  X,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Filter,
  BarChart3,
  Smartphone,
  Sparkles,
  RefreshCw,
  Sliders,
  LogOut,
  CreditCard,
  Download,
  CheckCheck,
  BadgeAlert,
  Info,
  Zap,
  Star,
  Award,
  Shield,
  ChevronDown,
  ChevronUp,
  Calculator,
  HelpCircle,
  Activity,
  PlayCircle,
  Layers,
  ArrowUpRight,
  Headphones,
  CheckCircle
} from 'lucide-react';

interface Screen13CourtOwnerPortalProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

// Initial mock data for court owner
interface CourtItem {
  id: string;
  name: string;
  type: 'Trong nhà' | 'Ngoài trời có mái' | 'Tiêu chuẩn thi đấu';
  status: 'available' | 'occupied' | 'maintenance' | 'closed';
  currentMatch?: string;
  hourlyRateOffPeak: number;
  hourlyRatePeak: number;
}

interface BookingItem {
  id: string;
  courtName: string;
  customerName: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: 'deposit_paid' | 'fully_paid' | 'checked_in' | 'pending_confirm' | 'cancelled';
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paymentMethod: 'VietQR' | 'Ví PickleWallet' | 'Tiền mặt tại quầy';
  createdAt: string;
}

export const Screen13CourtOwnerPortal: React.FC<Screen13CourtOwnerPortalProps> = ({
  user,
  onNavigate,
}) => {
  // View states: 'landing' | 'register' | 'pending' | 'login' | 'dashboard'
  const [viewMode, setViewMode] = useState<'landing' | 'register' | 'pending' | 'login' | 'dashboard'>('landing');

  // Trạng thái xác thực chủ sân: chỉ khi đăng nhập hoặc đăng ký thành công mới xem được giao diện quản lý và thông tin cá nhân của sân
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);

  // Interactive Revenue Calculator for Court Owner Landing
  const [calcCourtCount, setCalcCourtCount] = useState<number>(4);
  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(180000);
  const [calcDailyHours, setCalcDailyHours] = useState<number>(10);
  const [calcOccupancyRate, setCalcOccupancyRate] = useState<number>(75);

  // FAQ Accordion index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Helper bảo vệ: Kiểm tra quyền đăng nhập/đăng ký của chủ sân trước khi mở Dashboard hoặc thông tin sân
  const handleRequireOwnerAuth = (action: () => void, promptReason?: string) => {
    if (!isOwnerAuthenticated) {
      setAuthPromptMessage(
        promptReason || 'Chỉ chủ sân đã đăng nhập hoặc đăng ký mới có quyền xem giao diện quản lý sân và thông tin cá nhân của sân.'
      );
      setViewMode('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    action();
  };

  // Helper đăng xuất chủ sân
  const handleLogout = () => {
    setIsOwnerAuthenticated(false);
    setViewMode('landing');
    setAuthPromptMessage(null);
    showToast('Đã đăng xuất tài khoản quản trị sân. Chuyển về giao diện trang chủ.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to jump directly into a dashboard tab from the landing page
  const openDashboardTab = (tab: 'courts' | 'bookings' | 'checkin' | 'revenue') => {
    handleRequireOwnerAuth(() => {
      setDashboardTab(tab);
      setViewMode('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 'Vui lòng đăng nhập hoặc hoàn tất đăng ký chủ sân để truy cập Bàn quản trị & Thông tin cơ sở.');
  };

  // Register multi-step: 1 -> 6 (Step 1: Account, 2: OTP, 3: Owner Profile, 4: Facility Info, 5: Courts & Pricing, 6: Verify Documents)
  const [regStep, setRegStep] = useState<number>(1);
  const [otpInput, setOtpInput] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  // Register Form Data
  const [regForm, setRegForm] = useState({
    // Step 1: Account
    fullName: user?.name || 'Nguyễn Hữu Toàn',
    phone: user?.phone || '0912 345 678',
    email: user?.email || 'toan.pickleswin@gmail.com',
    password: '',
    // Step 3: Owner Profile
    idCardNumber: '079093001892',
    bankAccountNumber: '19038291048201',
    bankName: 'Techcombank - Ngân hàng Kỹ Thương',
    bankAccountHolder: 'NGUYEN HUU TOAN',
    // Step 4: Facility Info
    facilityName: 'Sân Pickleball Swin Club Tân Bình',
    city: 'Hồ Chí Minh',
    district: 'Quận Tân Bình',
    address: 'Số 18 Đường Bạch Đằng, Phường 2, Tân Bình, TP.HCM',
    courtCount: 4,
    amenities: ['Đèn LED thi đấu ban đêm', 'Căng tin đồ uống & thức ăn nhẹ', 'Phòng thay đồ & tắm nóng lạnh', 'Bãi đỗ xe ô tô miễn phí', 'Cho thuê vợt & bóng', 'Máy bắn bóng tự động'],
    // Step 5: Courts & Pricing
    openingHour: '06:00',
    closingHour: '23:00',
    peakStart: '17:00',
    peakEnd: '21:00',
    offPeakPrice: 150000,
    peakPrice: 220000,
    // Step 6: Documents
    licenseUploaded: true,
    idCardFrontUploaded: true,
    idCardBackUploaded: true,
  });

  // Login Form Data
  const [loginForm, setLoginForm] = useState({
    identifier: 'toan.pickleswin@gmail.com',
    password: 'password123',
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard Active Tab: 'courts' | 'bookings' | 'checkin' | 'revenue'
  const [dashboardTab, setDashboardTab] = useState<'courts' | 'bookings' | 'checkin' | 'revenue'>('courts');

  // Notification toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Mock Courts State
  const [courts, setCourts] = useState<CourtItem[]>([
    {
      id: 'court-1',
      name: 'Sân 1 (Center Court VIP)',
      type: 'Tiêu chuẩn thi đấu',
      status: 'occupied',
      currentMatch: 'Kèo DUPR 3.5 (18:00 - 20:00)',
      hourlyRateOffPeak: 180000,
      hourlyRatePeak: 250000,
    },
    {
      id: 'court-2',
      name: 'Sân 2 (Mái che chống chói)',
      type: 'Ngoài trời có mái',
      status: 'available',
      hourlyRateOffPeak: 150000,
      hourlyRatePeak: 220000,
    },
    {
      id: 'court-3',
      name: 'Sân 3 (Thảm US Open Pro)',
      type: 'Trong nhà',
      status: 'available',
      hourlyRateOffPeak: 160000,
      hourlyRatePeak: 230000,
    },
    {
      id: 'court-4',
      name: 'Sân 4 (Cụm giao lưu đôi)',
      type: 'Ngoài trời có mái',
      status: 'maintenance',
      hourlyRateOffPeak: 140000,
      hourlyRatePeak: 200000,
    },
  ]);

  // Mock Bookings State
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: 'BK-9921',
      courtName: 'Sân 1 (Center Court VIP)',
      customerName: 'Hoàng Nam Pickle',
      customerPhone: '0908 123 456',
      date: 'Hôm nay',
      timeSlot: '18:00 - 20:00 (2h)',
      status: 'checked_in',
      totalAmount: 500000,
      depositAmount: 250000,
      remainingAmount: 0,
      paymentMethod: 'VietQR',
      createdAt: '14/09 09:30',
    },
    {
      id: 'BK-9922',
      courtName: 'Sân 2 (Mái che chống chói)',
      customerName: 'Trần Văn Kiên',
      customerPhone: '0912 888 999',
      date: 'Hôm nay',
      timeSlot: '20:00 - 22:00 (2h)',
      status: 'deposit_paid',
      totalAmount: 440000,
      depositAmount: 220000,
      remainingAmount: 220000,
      paymentMethod: 'Ví PickleWallet',
      createdAt: '14/09 14:15',
    },
    {
      id: 'BK-9923',
      courtName: 'Sân 3 (Thảm US Open Pro)',
      customerName: 'Nguyễn Thị Mai',
      customerPhone: '0987 654 321',
      date: 'Hôm nay',
      timeSlot: '19:00 - 21:00 (2h)',
      status: 'pending_confirm',
      totalAmount: 460000,
      depositAmount: 230000,
      remainingAmount: 230000,
      paymentMethod: 'VietQR',
      createdAt: 'Hôm nay 15:40',
    },
    {
      id: 'BK-9924',
      courtName: 'Sân 1 (Center Court VIP)',
      customerName: 'Lê Minh Tuấn',
      customerPhone: '0933 222 111',
      date: 'Ngày mai',
      timeSlot: '07:00 - 09:00 (2h)',
      status: 'fully_paid',
      totalAmount: 360000,
      depositAmount: 360000,
      remainingAmount: 0,
      paymentMethod: 'VietQR',
      createdAt: 'Hôm nay 11:10',
    },
  ]);

  // Check-in search & QR scanner state
  const [checkinQuery, setCheckinQuery] = useState<string>('');
  const [scannedBooking, setScannedBooking] = useState<BookingItem | null>(null);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);

  // Revenue filter: 'today' | 'week' | 'month'
  const [revenueFilter, setRevenueFilter] = useState<'today' | 'week' | 'month'>('week');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000000');

  // Handlers for Court actions
  const toggleCourtStatus = (courtId: string) => {
    setCourts((prev) =>
      prev.map((c) => {
        if (c.id === courtId) {
          const nextStatus: CourtItem['status'] =
            c.status === 'available'
              ? 'closed'
              : c.status === 'closed'
              ? 'available'
              : c.status === 'maintenance'
              ? 'available'
              : 'available';
          showToast(`Đã đổi trạng thái ${c.name} sang: ${nextStatus === 'available' ? 'Mở đón khách' : nextStatus === 'closed' ? 'Tạm đóng' : 'Bảo trì'}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Handlers for Booking actions
  const handleConfirmBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'deposit_paid' } : b))
    );
    showToast(`Đã xác nhận đơn đặt #${bookingId} thành công!`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    showToast(`Đã hủy đơn #${bookingId} và hệ thống tự động hoàn cọc theo chính sách.`);
  };

  // Check-in Action
  const handlePerformCheckin = (booking: BookingItem) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: 'checked_in', remainingAmount: 0 } : b))
    );
    setScannedBooking((prev) => (prev && prev.id === booking.id ? { ...prev, status: 'checked_in', remainingAmount: 0 } : prev));
    showToast(`✓ Check-in thành công cho khách ${booking.customerName} tại ${booking.courtName}!`);
  };

  // Search for check-in
  const handleSearchCheckin = () => {
    if (!checkinQuery.trim()) {
      showToast('Vui lòng nhập Mã booking hoặc SĐT khách hàng');
      return;
    }
    const found = bookings.find(
      (b) =>
        b.id.toLowerCase().includes(checkinQuery.toLowerCase()) ||
        b.customerPhone.includes(checkinQuery) ||
        b.customerName.toLowerCase().includes(checkinQuery.toLowerCase())
    );
    if (found) {
      setScannedBooking(found);
    } else {
      showToast('Không tìm thấy đơn đặt sân phù hợp.');
      setScannedBooking(null);
    }
  };

  // Simulated QR scan
  const handleTriggerSimulatedScan = () => {
    setIsScanningActive(true);
    setTimeout(() => {
      setIsScanningActive(false);
      const target = bookings.find((b) => b.status === 'deposit_paid') || bookings[0];
      setScannedBooking(target);
      showToast(`📸 Quét mã QR thành công! Tìm thấy đơn #${target.id}`);
    }, 1200);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.identifier || !loginForm.password) {
      setLoginError('Vui lòng điền đầy đủ tài khoản và mật khẩu');
      return;
    }
    setLoginError(null);
    setIsOwnerAuthenticated(true);
    setAuthPromptMessage(null);
    showToast('Đăng nhập thành công vào Hệ thống Quản trị Sân!');
    setViewMode('dashboard');
  };

  return (
    <div className="space-y-6 font-['Lexend',sans-serif]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-lime-400 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-lime-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* =========================================================================
          TOP OWNER PORTAL SWITCHER BAR (Thanh điều hướng nhanh Cổng Chủ Sân)
          ========================================================================= */}
      <div 
        id="owner-portal-switcher-bar"
        className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center font-black shrink-0 shadow-sm border border-slate-800">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Cổng Đối Tác Chủ Sân PickleMate
              </span>
              <span className="px-2 py-0.5 rounded-md bg-lime-100 text-lime-800 text-[10px] font-black uppercase border border-lime-300">
                Partner OS 4.0
              </span>
              {isOwnerAuthenticated ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Đã đăng nhập chủ sân
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold uppercase border border-amber-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Chưa đăng nhập
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">
              {isOwnerAuthenticated ? (
                <>
                  Cơ sở đang quản lý: <strong className="text-slate-800">{regForm.facilityName}</strong> • {regForm.district}, {regForm.city}
                </>
              ) : (
                <>
                  Giao diện trang chủ cho đối tác chủ sân • <span className="text-lime-700 font-semibold">Đăng nhập/Đăng ký để xem quản lý sân & thông tin cơ sở</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="btn-switch-owner-landing"
            type="button"
            onClick={() => {
              setViewMode('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'landing'
                ? 'bg-slate-900 text-lime-400 shadow-sm font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Trang Chủ Chủ Sân</span>
          </button>

          <button
            id="btn-switch-owner-dashboard"
            type="button"
            onClick={() => {
              handleRequireOwnerAuth(() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 'Chỉ chủ sân đã đăng nhập hoặc hoàn tất đăng ký mới có quyền xem giao diện quản lý sân và thông tin cá nhân của sân.');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'dashboard'
                ? 'bg-slate-900 text-lime-400 shadow-sm font-black'
                : isOwnerAuthenticated
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title={isOwnerAuthenticated ? 'Mở Bàn Quản Trị Sân' : 'Cần đăng nhập hoặc đăng ký để vào Bàn Quản Trị'}
          >
            {isOwnerAuthenticated ? (
              <BarChart3 className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>Bàn Quản Trị (Dashboard)</span>
            {isOwnerAuthenticated ? (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-lime-400 text-slate-950 font-black">
                4 Sân
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-300">
                Khóa
              </span>
            )}
          </button>

          <button
            id="btn-switch-owner-register"
            type="button"
            onClick={() => {
              setViewMode('register');
              setRegStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'register'
                ? 'bg-lime-400 text-slate-950 font-black shadow-xs'
                : 'bg-lime-50 text-lime-900 hover:bg-lime-100 border border-lime-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Đăng Ký Sân Mới</span>
          </button>

          {!isOwnerAuthenticated ? (
            <button
              id="btn-switch-owner-login"
              type="button"
              onClick={() => {
                setAuthPromptMessage(null);
                setViewMode('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              title="Đăng nhập tài khoản quản trị sân"
            >
              <Lock className="w-3.5 h-3.5 text-lime-400" />
              <span>Đăng nhập</span>
            </button>
          ) : (
            <button
              id="btn-switch-owner-logout"
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 border border-rose-200"
              title="Đăng xuất tài khoản chủ sân"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          )}

          <button
            id="btn-switch-player-view"
            type="button"
            onClick={() => onNavigate(2)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1 border border-slate-200/60"
            title="Xem giao diện đặt sân của người chơi (User Mode)"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Xem Khách chơi</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: TRANG CHỦ DÀNH CHO CHỦ SÂN (COURT OWNER HOME PORTAL & HUB)
          ========================================================================= */}
      {viewMode === 'landing' && (
        <div id="court-owner-home-portal" className="space-y-8 animate-in fade-in duration-300">
          
          {/* SECTION 1: HERO DISPLAY BANNER (High-Impact Modern Tech) */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl p-6 sm:p-10 lg:p-12">
            {/* Background Decorative Gradient Orbs */}
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/15 text-lime-400 text-xs font-black border border-lime-400/30 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-lime-400" />
                <span>Nền Tảng Quản Lý & Tối Ưu Doanh Thu Sân Pickleball</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Vận Hành Sân Thông Minh, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-200">
                  Hạn Chế Hủy Lịch
                </span> & Tối Đa Hóa Doanh Thu
              </h1>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-3xl">
                PickleMate Court OS cung cấp giải pháp chuyển đổi số toàn diện cho các cụm sân Pickleball: 
                tự động giữ cọc VietQR Napas247, check-in quét mã QR siêu tốc 1 giây tại quầy lễ tân, 
                đồng bộ lịch trống chống trùng giờ và kết nối hơn 50.000 vận động viên trên toàn quốc.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-btn-enter-dashboard"
                  type="button"
                  onClick={() => {
                    handleRequireOwnerAuth(() => {
                      setViewMode('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 'Chỉ chủ sân đã đăng nhập hoặc hoàn tất đăng ký mới có quyền truy cập Bàn điều khiển quản trị và thông tin cá nhân của sân.');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-lime-400/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  {isOwnerAuthenticated ? (
                    <BarChart3 className="w-4 h-4 text-slate-950" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-950" />
                  )}
                  <span>
                    {isOwnerAuthenticated ? 'Vào Bàn Điều Khiển Quản Trị' : 'Đăng nhập Quản Trị Sân'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  id="hero-btn-register-partner"
                  type="button"
                  onClick={() => {
                    setViewMode('register');
                    setRegStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4 text-lime-400" />
                  <span>Đăng Ký Sân Mới</span>
                </button>

                {!isOwnerAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthPromptMessage(null);
                      setViewMode('login');
                    }}
                    className="px-4 py-3.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer underline flex items-center gap-1"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Đăng nhập lễ tân</span>
                  </button>
                )}
              </div>

              {/* Key Proof Metrics */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-lime-400">150+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Cụm sân đối tác</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">98.6%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Lấp đầy giờ cao điểm</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-lime-400">0 đ</div>
                  <div className="text-[11px] text-slate-400 font-medium">Phí cài đặt & bảo trì</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Giữ cọc tự động VietQR</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-black text-lime-400">1 Giây</div>
                  <div className="text-[11px] text-slate-400 font-medium">Check-in QR tại quầy</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: LIVE FACILITY SNAPSHOT & QUICK ACTIONS WIDGET (Bảo mật tuyệt đối: Chỉ hiển thị khi chủ sân đã đăng nhập) */}
          {isOwnerAuthenticated && (
            <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-lime-500"></span>
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>Bảng Tình Trạng Cơ Sở Trực Tiếp:</span>
                      <span className="text-lime-400">{regForm.facilityName}</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cập nhật thời gian thực hôm nay • Lễ tân ca: {regForm.fullName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openDashboardTab('courts')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-lime-400 text-xs font-bold border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>Mở Toàn Bộ Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center font-black">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Trạng thái sân</div>
                    <div className="text-sm sm:text-base font-black text-white">
                      {courts.filter((c) => c.status === 'occupied').length} đang chơi / {courts.length} sân
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Doanh thu hôm nay</div>
                    <div className="text-sm sm:text-base font-black text-lime-400 font-mono">
                      2.150.000 đ
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Đơn đặt hôm nay</div>
                    <div className="text-sm sm:text-base font-black text-white">
                      {bookings.length} lượt booking
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center font-black">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Đánh giá cơ sở</div>
                    <div className="text-sm sm:text-base font-black text-white">
                      4.9 / 5.0 (128 vote)
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Direct Launch Shortcut Cards into Dashboard Functional Modules */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Truy Cập Nhanh Các Phân Khu Nghiệp Vụ Của Chủ Sân:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 1. Sân & Lịch */}
                  <button
                    type="button"
                    onClick={() => openDashboardTab('courts')}
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left transition-all hover:border-lime-400 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="p-2 rounded-xl bg-lime-400 text-slate-950 font-black">
                        <Calendar className="w-4 h-4" />
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-lime-400 transition-colors" />
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-lime-400 transition-colors">
                      1. Quản lý Sân & Bảng Giá
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      Đóng/Mở sân tức thì, chỉnh giá giờ vàng & giờ thường
                    </p>
                  </button>

                  {/* 2. Quản lý Booking */}
                  <button
                    type="button"
                    onClick={() => openDashboardTab('bookings')}
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left transition-all hover:border-lime-400 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="p-2 rounded-xl bg-cyan-400 text-slate-950 font-black">
                        <Users className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-black bg-lime-400 text-slate-950 px-1.5 py-0.5 rounded">
                        2 đơn mới
                      </span>
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-lime-400 transition-colors">
                      2. Quản lý Đơn Đặt Sân
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      Duyệt đơn, kiểm tra trạng thái cọc VietQR & huỷ lịch
                    </p>
                  </button>

                  {/* 3. Check-in QR */}
                  <button
                    type="button"
                    onClick={() => openDashboardTab('checkin')}
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left transition-all hover:border-lime-400 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black">
                        <QrCode className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        1 chạm quét
                      </span>
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-lime-400 transition-colors">
                      3. Quầy Check-in Mã QR
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      Quét camera mã vé khách hàng, đối soát tất toán 1 giây
                    </p>
                  </button>

                  {/* 4. Doanh thu */}
                  <button
                    type="button"
                    onClick={() => openDashboardTab('revenue')}
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left transition-all hover:border-lime-400 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="p-2 rounded-xl bg-emerald-400 text-slate-950 font-black">
                        <TrendingUp className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-semibold text-lime-400 font-mono">
                        Rút 24/7
                      </span>
                    </div>
                    <div className="text-xs font-black text-white group-hover:text-lime-400 transition-colors">
                      4. Báo Cáo Doanh Thu & Rút Tiền
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      Biểu đồ doanh thu ngày/tuần/tháng, tạo lệnh rút tiền
                    </p>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: 4 CORE VALUE PILLARS (Giải pháp giải quyết bài toán nhức nhối) */}
          <section className="space-y-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-lime-700 uppercase tracking-wider bg-lime-100 px-3 py-1 rounded-full border border-lime-300">
                Lợi Thế Vượt Trội
              </span>
              <h2 className="text-[23px] font-black text-slate-900">
                4 Giá Trị Đột Phá Giúp Cụm Sân Tối Đa Hóa Công Suất
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pillar 1 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-lime-400 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-lime-400/20 text-lime-800 flex items-center justify-center font-black">
                    <CreditCard className="w-6 h-6 text-lime-700" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    1. Thu Cọc VietQR Tự Động 100%
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Khách đặt sân bắt buộc cọc 50% hoặc 100% qua chuẩn VietQR Napas247 hoặc Ví PickleWallet. Hệ thống tự động xác nhận sau 2s, loại bỏ rủi ro hủy lịch đột xuất và tối ưu công suất khung giờ vàng.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-lime-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Hạn chế tối đa hủy lịch giờ chót</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 text-cyan-800 flex items-center justify-center font-black">
                    <QrCode className="w-6 h-6 text-cyan-700" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    2. Check-in QR Siêu Tốc 1s Tại Quầy
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Khách đến chỉ cần xuất trình mã QR trên điện thoại. Lễ tân quét bằng camera hoặc máy đọc là lập tức kiểm tra vé, thông báo số sân và số tiền còn lại phải thu mà không cần lật sổ ghi chép.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-cyan-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Tiết kiệm 80% thời gian lễ tân</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-800 flex items-center justify-center font-black">
                    <Users className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    3. Lấp Đầy Giờ Vắng Bằng Kèo DUPR
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tự động kết nối hơn 50.000 người chơi có nhu cầu ghép kèo DUPR 2.5 - 4.5. Các khung giờ vắng (sáng 8h-11h, trưa 13h-16h) được lấp đầy, tăng công suất khai thác thêm 35-45%.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-amber-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Khai thác tối đa khung giờ trống</span>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-800 flex items-center justify-center font-black">
                    <TrendingUp className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    4. Đối Soát Minh Bạch & Rút Tiền 24/7
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Báo cáo trực quan từng giờ, phân tích chính xác sân nào mang lại doanh thu cao nhất. Tiền cọc tích lũy an toàn và hỗ trợ lệnh rút tức thì về mọi ngân hàng tại Việt Nam không mất phí.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Dòng tiền minh bạch, an toàn</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: INTERACTIVE REVENUE & PROFIT CALCULATOR */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold border border-lime-300">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Công Cụ Dự Tính Doanh Thu</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                  Ước Tính Doanh Thu & Lợi Nhuận Tăng Thêm Của Cụm Sân Bạn
                </h3>
                <p className="text-xs text-slate-500">
                  Kéo các thanh trượt để mô phỏng doanh thu dựa trên quy mô và giá thuê thực tế của cơ sở bạn.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Doanh thu ước tính / tháng:</span>
                <span className="text-2xl sm:text-3xl font-black text-lime-600 font-mono">
                  {(
                    Math.round((calcCourtCount * calcHourlyRate * calcDailyHours * (calcOccupancyRate / 100) * 30) / 1000000)
                  ).toLocaleString()}{' '}
                  <span className="text-sm font-bold text-slate-700">triệu VNĐ</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sliders Control Panel */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Số lượng sân */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Số lượng sân hoạt động:</span>
                    <span className="text-slate-950 font-black bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      {calcCourtCount} sân
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={calcCourtCount}
                    onChange={(e) => setCalcCourtCount(parseInt(e.target.value) || 1)}
                    className="w-full accent-lime-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 sân</span>
                    <span>4 sân</span>
                    <span>8 sân</span>
                    <span>12 sân</span>
                  </div>
                </div>

                {/* 2. Giá thuê trung bình */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Giá thuê trung bình mỗi giờ:</span>
                    <span className="text-slate-950 font-black bg-slate-100 px-2.5 py-0.5 rounded-lg font-mono">
                      {calcHourlyRate.toLocaleString('vi-VN')} đ/h
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="350000"
                    step="10000"
                    value={calcHourlyRate}
                    onChange={(e) => setCalcHourlyRate(parseInt(e.target.value) || 100000)}
                    className="w-full accent-lime-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>100.000 đ</span>
                    <span>180.000 đ</span>
                    <span>250.000 đ</span>
                    <span>350.000 đ</span>
                  </div>
                </div>

                {/* 3. Số giờ hoạt động trung bình mỗi ngày */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Số giờ mở cửa trung bình / ngày:</span>
                    <span className="text-slate-950 font-black bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      {calcDailyHours} giờ / ngày
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="16"
                    step="1"
                    value={calcDailyHours}
                    onChange={(e) => setCalcDailyHours(parseInt(e.target.value) || 6)}
                    className="w-full accent-lime-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>6 giờ</span>
                    <span>10 giờ</span>
                    <span>14 giờ</span>
                    <span>16 giờ</span>
                  </div>
                </div>

                {/* 4. Tỷ lệ lấp đầy sân kỳ vọng */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Tỷ lệ lấp đầy sân (Occupancy):</span>
                    <span className="text-lime-800 font-black bg-lime-100 px-2.5 py-0.5 rounded-lg">
                      {calcOccupancyRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    step="5"
                    value={calcOccupancyRate}
                    onChange={(e) => setCalcOccupancyRate(parseInt(e.target.value) || 40)}
                    className="w-full accent-lime-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>40% (Thấp)</span>
                    <span>60% (Trung bình)</span>
                    <span>75% (Tiêu chuẩn)</span>
                    <span>95% (Giờ vàng tối ưu)</span>
                  </div>
                </div>
              </div>

              {/* Calculated Outputs Cards */}
              <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-lime-400 uppercase tracking-wider block">
                    Hiệu Quả Đem Lại Bởi PickleMate OS:
                  </span>

                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="text-xs text-slate-400">Doanh thu tăng thêm từ lấp giờ vắng:</div>
                    <div className="text-lg font-black text-lime-400 font-mono">
                      +{(
                        Math.round((calcCourtCount * calcHourlyRate * calcDailyHours * (calcOccupancyRate / 100) * 30 * 0.28) / 1000000)
                      ).toLocaleString()}{' '}
                      triệu VNĐ <span className="text-xs font-semibold text-slate-300">(+28%)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                      <div className="text-[11px] text-slate-400">Lượt khách / tháng</div>
                      <div className="text-base font-black text-white">
                        {Math.round((calcCourtCount * calcDailyHours * (calcOccupancyRate / 100) * 30) / 1.5).toLocaleString()} lượt
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                      <div className="text-[11px] text-slate-400">Tiết kiệm lễ tân</div>
                      <div className="text-base font-black text-white">
                        ~{Math.round(((calcCourtCount * calcDailyHours * (calcOccupancyRate / 100) * 30) / 1.5) * 0.12)} giờ / tháng
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-lime-400/10 border border-lime-400/30 text-xs text-lime-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
                    <span>Thu cọc tự động bảo vệ 100% dòng tiền của {calcCourtCount} sân</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('register');
                    setRegStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Bắt Đầu Đăng Ký Cụm Sân Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>



          {/* SECTION 6: SIMPLE 3-STEP ONBOARDING PROCESS */}
          <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-lime-400 uppercase tracking-wider bg-lime-400/20 px-3 py-1 rounded-full border border-lime-400/30">
                Quy Trình Tham Gia
              </span>
              <h2 className="text-[21px] font-black text-white">
                3 Bước Đơn Giản Để Đưa Sân Của Bạn Lên Bản Đồ PickleMate
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 font-black text-lg flex items-center justify-center">
                  1
                </div>
                <h3 className="text-sm font-black text-white">Đăng ký thông tin cơ sở</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Điền tên sân, địa chỉ, số lượng sân con, bảng giá giờ thường và giờ vàng theo form trực quan trong 3 phút.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 font-black text-lg flex items-center justify-center">
                  2
                </div>
                <h3 className="text-sm font-black text-white">Thẩm định & Cấp quyền trong 2h</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chuyên viên hỗ trợ liên hệ kích hoạt, gắn huy hiệu "Sân Xác Minh Uy Tín" và cấp tài khoản lễ tân miễn phí.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 font-black text-lg flex items-center justify-center">
                  3
                </div>
                <h3 className="text-sm font-black text-white">Đón khách & Nhận cọc tự động</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sân hiển thị ngay trên hệ thống định vị GPS cho người chơi đặt chỗ và tiền cọc tự động chuyển vào ví quản trị.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setViewMode('register');
                  setRegStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-lime-400/25 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Bắt Đầu Đăng Ký Sân Mới</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* SECTION 7: REAL OWNER TESTIMONIALS */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Các Chủ Sân Nói Gì Về PickleMate?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Testimonial 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "Từ khi áp dụng giữ cọc VietQR của PickleMate, cụm 4 sân của tôi không còn tình trạng khách hủy lịch sát giờ. Lễ tân chỉ cần đưa điện thoại quét mã QR khách tới sân là xong."
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-lime-400 font-bold flex items-center justify-center text-xs">
                    HT
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Anh Nguyễn Hữu Toàn</div>
                    <div className="text-[11px] text-slate-500">Chủ sân Swin Club (Tân Bình)</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "Khung giờ 13h - 16h trước đây thường bỏ trống thì nay được PickleMate kết nối các hội nhóm tìm kèo DUPR tới chơi kín lịch, doanh thu tăng thêm gần 40 triệu mỗi tháng."
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-lime-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                    H
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Chị Mai Hương</div>
                    <div className="text-[11px] text-slate-500">Quản lý Cụm sân D-Pickleball (Quận 7)</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "Rút tiền về tài khoản ngân hàng siêu nhanh chỉ trong vài giây. Cuối tháng không còn phải ngồi tính sổ hay so từng dòng sao kê chuyển khoản nữa."
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                    VH
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Anh Vũ Hoàng</div>
                    <div className="text-[11px] text-slate-500">Chủ sân VietPickle (Sala Thủ Đức)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: FAQ ACCORDION CHO CHỦ SÂN */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                Giải Đáp Thắc Mắc
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Câu Hỏi Thường Gặp Của Chủ Sân
              </h2>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {[
                {
                  q: 'PickleMate có thu phí khởi tạo hoặc phần cứng ban đầu không?',
                  a: 'Hoàn toàn không. PickleMate miễn phí 100% chi phí khởi tạo, cấu hình lịch sân và duy trì phần mềm. Bạn chỉ cần điện thoại hoặc máy tính bảng đang có sẵn là có thể sử dụng ngay.',
                },
                {
                  q: 'Tiền cọc của khách hàng được chuyển về tài khoản chủ sân như thế nào?',
                  a: 'Mỗi khi khách đặt sân và thanh toán cọc thành công qua VietQR Napas247 hoặc Ví PickleWallet, tiền cọc sẽ được ghi nhận ngay vào số dư ví đối tác của cơ sở. Chủ sân có thể tạo lệnh rút về tài khoản ngân hàng bất kỳ lúc nào 24/7.',
                },
                {
                  q: 'Nếu khách hủy lịch đặt sân thì tiền cọc xử lý ra sao?',
                  a: 'PickleMate áp dụng chính sách bảo vệ chủ sân: Nếu khách hủy trước 12 tiếng, hệ thống hỗ trợ dời lịch. Nếu khách hủy muộn trong vòng 12 tiếng hoặc không đến sân, tiền cọc được giữ lại cho chủ sân để bù đắp chi phí vận hành.',
                },
                {
                  q: 'Nhân viên lễ tân hoặc bảo vệ có thể sử dụng được chức năng Check-in không?',
                  a: 'Có. Hệ thống có phân quyền tài khoản Lễ tân: Nhân viên chỉ có quyền quét mã QR check-in, xem số sân và số tiền cần thu còn lại mà không xem được các báo cáo tài chính bảo mật của chủ sân.',
                },
                {
                  q: 'Sân của tôi có thể kết hợp vừa khách cố định (theo tháng) vừa khách vãng lai không?',
                  a: 'Hoàn toàn được. Trong Bàn Quản Trị, bạn có thể dễ dàng khóa các khung giờ cố định của hội nhóm quen, hệ thống sẽ chỉ mở các khung giờ còn lại cho khách mới đặt trên ứng dụng.',
                },
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 9: BOTTOM CALL TO ACTION BANNER */}
          <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-lime-400/40 p-8 sm:p-12 text-white text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-lime-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                Đồng Hành Cùng 150+ Cụm Sân Hàng Đầu
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                Sẵn Sàng Số Hóa & Tăng Trưởng Doanh Thu Cơ Sở Của Bạn?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Đăng ký ngay hôm nay để nhận bộ Standee QR Check-in để bàn miễn phí và tiếp cận hơn 50.000 người chơi Pickleball tại Việt Nam.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('register');
                    setRegStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xl shadow-lime-400/25 hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Đăng Ký Cơ Sở Mới Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleRequireOwnerAuth(() => {
                      setViewMode('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 'Chỉ chủ sân đã đăng nhập hoặc hoàn tất đăng ký mới có quyền truy cập Bàn quản trị và thông tin cá nhân của sân.');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isOwnerAuthenticated ? (
                    <BarChart3 className="w-4 h-4 text-lime-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{isOwnerAuthenticated ? 'Vào Bàn Quản Trị' : 'Đăng nhập Quản Trị Sân'}</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: LUỒNG ĐĂNG KÝ CHỦ SÂN (Đầy đủ các bước theo đặc tả)
          ========================================================================= */}
      {viewMode === 'register' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
          {/* Header & Back */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (regStep > 1) {
                  setRegStep(regStep - 1);
                } else {
                  setViewMode(isOwnerAuthenticated ? 'dashboard' : 'landing');
                }
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>
                {regStep === 1 
                  ? (isOwnerAuthenticated ? 'Quay lại Dashboard Quản trị' : 'Quay lại Trang Chủ Chủ Sân') 
                  : 'Bước trước'}
              </span>
            </button>
            <span className="text-xs font-bold text-slate-500">
              Bước {regStep} / 6
            </span>
          </div>

          {/* Step Progress Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2 text-[11px] font-bold text-slate-700">
              <span className={regStep >= 1 ? 'text-lime-700' : 'text-slate-400'}>1. Tài khoản</span>
              <span className={regStep >= 2 ? 'text-lime-700' : 'text-slate-400'}>2. OTP</span>
              <span className={regStep >= 3 ? 'text-lime-700' : 'text-slate-400'}>3. Hồ sơ chủ sân</span>
              <span className={regStep >= 4 ? 'text-lime-700' : 'text-slate-400'}>4. Cơ sở sân</span>
              <span className={regStep >= 5 ? 'text-lime-700' : 'text-slate-400'}>5. Giá & Lịch</span>
              <span className={regStep >= 6 ? 'text-lime-700' : 'text-slate-400'}>6. Giấy tờ</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-500 transition-all duration-300 rounded-full"
                style={{ width: `${(regStep / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            
            {/* ----------------- BƯỚC 1: NHẬP THÔNG TIN TÀI KHOẢN ----------------- */}
            {regStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Bước 1: Nhập thông tin tài khoản</h2>
                  <p className="text-xs text-slate-500 mt-1">Thông tin này dùng để đăng nhập và nhận thông báo biến động đặt sân.</p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên chủ sân / Người quản lý *</label>
                    <input
                      type="text"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      placeholder="Ví dụ: Nguyễn Hữu Toàn"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại di động *</label>
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email đăng ký quản trị *</label>
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="toan.pickleswin@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu khởi tạo *</label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={regForm.password || 'Matkhau@123'}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Tối thiểu 8 ký tự"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRegStep(2);
                    showToast('Đã gửi mã xác thực OTP 6 số về số điện thoại ' + regForm.phone);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Tiếp tục: Nhận mã xác thực OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ----------------- BƯỚC 2: MÃ XÁC THỰC OTP ----------------- */}
            {regStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Bước 2: Xác thực mã OTP</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Hệ thống đã gửi mã OTP 6 số đến SĐT <strong>{regForm.phone}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                  <div className="flex justify-center gap-2">
                    {['8', '2', '6', '1', '9', '4'].map((digit, idx) => (
                      <div
                        key={idx}
                        className="w-11 h-12 rounded-xl bg-white border-2 border-lime-500 flex items-center justify-center text-lg font-black text-slate-900 shadow-xs"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Mã xác thực có hiệu lực trong 02:45 phút. <button onClick={() => showToast('Đã gửi lại mã OTP mới!')} className="text-lime-600 font-bold hover:underline cursor-pointer">Gửi lại mã</button>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setRegStep(3);
                    showToast('Xác thực OTP thành công!');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Xác nhận & Tạo hồ sơ Chủ Sân</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ----------------- BƯỚC 3: TẠO HỒ SƠ CHỦ SÂN & TÀI KHOẢN NHẬN TIỀN ----------------- */}
            {regStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Bước 3: Tạo hồ sơ Chủ sân & Tài khoản nhận tiền</h2>
                  <p className="text-xs text-slate-500 mt-1">Dùng để đối soát và tự động nhận tiền cọc đặt sân qua VietQR Napas.</p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Số CMND / Căn cước công dân (CCCD) *</label>
                    <input
                      type="text"
                      value={regForm.idCardNumber}
                      onChange={(e) => setRegForm({ ...regForm, idCardNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Ngân hàng thụ hưởng *</label>
                      <input
                        type="text"
                        value={regForm.bankName}
                        onChange={(e) => setRegForm({ ...regForm, bankName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Số tài khoản ngân hàng *</label>
                      <input
                        type="text"
                        value={regForm.bankAccountNumber}
                        onChange={(e) => setRegForm({ ...regForm, bankAccountNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 font-mono focus:outline-none focus:border-lime-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tên chủ tài khoản (Viết hoa không dấu) *</label>
                    <input
                      type="text"
                      value={regForm.bankAccountHolder}
                      onChange={(e) => setRegForm({ ...regForm, bankAccountHolder: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-lime-500 uppercase"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setRegStep(4)}
                  className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Tiếp tục: Nhập thông tin cơ sở sân</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ----------------- BƯỚC 4: THÔNG TIN CƠ SỞ SÂN ----------------- */}
            {regStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Bước 4: Nhập thông tin cơ sở sân</h2>
                  <p className="text-xs text-slate-500 mt-1">Thông tin cơ sở sẽ được hiển thị công khai trên ứng dụng đặt sân.</p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tên cơ sở / Cụm sân *</label>
                    <input
                      type="text"
                      value={regForm.facilityName}
                      onChange={(e) => setRegForm({ ...regForm, facilityName: e.target.value })}
                      placeholder="Ví dụ: Sân Pickleball Swin Club Tân Bình"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Tỉnh / Thành phố *</label>
                      <input
                        type="text"
                        value={regForm.city}
                        onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Quận / Huyện *</label>
                      <input
                        type="text"
                        value={regForm.district}
                        onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ chi tiết cơ sở *</label>
                    <input
                      type="text"
                      value={regForm.address}
                      onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                      placeholder="Số nhà, tên đường, phường..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng sân con hoạt động *</label>
                    <div className="flex items-center gap-3">
                      {[2, 4, 6, 8, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRegForm({ ...regForm, courtCount: num })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            regForm.courtCount === num
                              ? 'bg-slate-900 text-lime-400 border-slate-900 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {num} sân
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Tiện ích tại cơ sở sân</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        'Đèn LED thi đấu ban đêm',
                        'Căng tin đồ uống & thức ăn nhẹ',
                        'Phòng thay đồ & tắm nóng lạnh',
                        'Bãi đỗ xe ô tô miễn phí',
                        'Cho thuê vợt & bóng',
                        'Máy bắn bóng tự động',
                      ].map((item) => (
                        <label key={item} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-slate-800">
                          <input
                            type="checkbox"
                            defaultChecked={regForm.amenities.includes(item)}
                            className="rounded text-lime-600 focus:ring-lime-500"
                          />
                          <span className="text-[11px] font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setRegStep(5)}
                  className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Tiếp tục: Thiết lập sân, giá & lịch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ----------------- BƯỚC 5: THIẾT LẬP SÂN, GIÁ & LỊCH HOẠT ĐỘNG ----------------- */}
            {regStep === 5 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Bước 5: Thiết lập sân, giá & lịch hoạt động</h2>
                  <p className="text-xs text-slate-500 mt-1">Cài đặt khung giờ mở cửa, khung giờ vàng (Peak) và giá niêm yết theo giờ.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Giờ mở cửa *</label>
                      <input
                        type="time"
                        value={regForm.openingHour}
                        onChange={(e) => setRegForm({ ...regForm, openingHour: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Giờ đóng cửa *</label>
                      <input
                        type="time"
                        value={regForm.closingHour}
                        onChange={(e) => setRegForm({ ...regForm, closingHour: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Khung giờ vàng (Peak hours)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-500 block mb-1">Bắt đầu Peak:</span>
                        <input
                          type="time"
                          value={regForm.peakStart}
                          onChange={(e) => setRegForm({ ...regForm, peakStart: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block mb-1">Kết thúc Peak:</span>
                        <input
                          type="time"
                          value={regForm.peakEnd}
                          onChange={(e) => setRegForm({ ...regForm, peakEnd: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[11px] text-slate-500 block mb-1">Giá giờ thường (Off-peak / giờ):</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                        <input
                          type="number"
                          value={regForm.offPeakPrice}
                          onChange={(e) => setRegForm({ ...regForm, offPeakPrice: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                        />
                        <span className="text-xs">đ</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-lime-50/50 border border-lime-200">
                      <span className="text-[11px] text-slate-500 block mb-1">Giá giờ vàng (Peak / giờ):</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                        <input
                          type="number"
                          value={regForm.peakPrice}
                          onChange={(e) => setRegForm({ ...regForm, peakPrice: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-1.5 rounded-lg border border-lime-300 text-xs font-bold"
                        />
                        <span className="text-xs">đ</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setRegStep(6)}
                  className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Tiếp tục: Tải hồ sơ xác minh</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ----------------- BƯỚC 6: TẢI HỒ SƠ XÁC MINH & NÚT GỬI ĐĂNG KÝ ----------------- */}
            {regStep === 6 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Bước 6: Tải hồ sơ xác minh cơ sở</h2>
                  <p className="text-xs text-slate-500 mt-1">Hồ sơ pháp lý giúp cơ sở được gắn huy hiệu "Sân Xác Minh Uy Tín".</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-lime-500 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-700 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Giấy phép đăng ký kinh doanh / Quyết định thành lập CLB</h4>
                        <p className="text-[11px] text-emerald-600 font-semibold">✓ Đã đính kèm: GiayPhepKinhDoanh_Swin.pdf (1.4MB)</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold">
                      Thay đổi
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-lime-500 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Ảnh chụp CCCD 2 mặt của người đại diện</h4>
                        <p className="text-[11px] text-emerald-600 font-semibold">✓ Đã tải lên 2 ảnh mặt trước & mặt sau</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold">
                      Thay đổi
                    </button>
                  </div>
                </div>

                {/* Cam kết */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  Bằng việc nhấn "Gửi Đăng Ký Đối Tác", bạn cam kết thông tin cơ sở sân là chính xác và đồng ý với Quy chế hoạt động & Đối soát cọc sân của PickleMate VN.
                </div>

                <button
                  id="btn-submit-owner-registration"
                  onClick={() => {
                    setViewMode('pending');
                    showToast('Đã gửi hồ sơ đăng ký đối tác thành công!');
                  }}
                  className="w-full py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-lime-400/25 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                  <span>Gửi Đăng Ký Hợp Tác Sân PickleMate</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: MÀN HÌNH CHỜ XÉT DUYỆT & KÍCH HOẠT TÀI KHOẢN
          ========================================================================= */}
      {viewMode === 'pending' && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-lime-100 text-lime-700 flex items-center justify-center border-2 border-lime-400 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold uppercase tracking-wider">
              Hồ sơ đang chờ thẩm định • Mã hồ sơ #PM-OWNER-2026
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              PickleMate đang xét duyệt cơ sở của bạn!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chuyên viên vận hành đối tác đang tiến hành kiểm tra thông tin pháp lý và cơ sở vật chất của <strong>{regForm.facilityName}</strong>. Thời gian xử lý dự kiến từ 2 - 4 giờ làm việc.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Người liên hệ:</span>
              <strong className="text-slate-900">{regForm.fullName} ({regForm.phone})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cơ sở:</span>
              <strong className="text-slate-900">{regForm.facilityName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hotline hỗ trợ chủ sân:</span>
              <strong className="text-lime-700 font-bold">1900 8899 (Nhánh 2)</strong>
            </div>
          </div>

          {/* Quick Action to Activate & Enter Dashboard */}
          <div className="space-y-2 pt-2">
            <button
              id="btn-simulate-activate"
              onClick={() => {
                setIsOwnerAuthenticated(true);
                setAuthPromptMessage(null);
                showToast('🎉 Chúc mừng! Hồ sơ đối tác đã được phê duyệt & kích hoạt!');
                setViewMode('dashboard');
              }}
              className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>[Mô phỏng] Duyệt & Kích hoạt tài khoản ngay → Chuyển đến Dashboard</span>
            </button>

            <button
              onClick={() => setViewMode('landing')}
              className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
            >
              Quay lại Trang Chủ Chủ Sân
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: FORM ĐĂNG NHẬP CHỦ SÂN (Court Owner Login)
          ========================================================================= */}
      {viewMode === 'login' && (
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setViewMode('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại Trang Chủ Chủ Sân</span>
            </button>
            <button
              onClick={() => {
                setViewMode('register');
                setRegStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-lime-700 hover:underline cursor-pointer"
            >
              Chưa có tài khoản? Đăng ký
            </button>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Đăng nhập Quản trị Sân</h2>
              <p className="text-xs text-slate-500">Dành riêng cho chủ cụm sân và nhân viên lễ tân đối tác</p>
            </div>

            {authPromptMessage && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-amber-950 font-bold">Quyền truy cập bảo mật:</strong>
                  <span>{authPromptMessage}</span>
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email hoặc Số điện thoại *</label>
                <input
                  type="text"
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                  placeholder="toan.pickleswin@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu *</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-lime-600" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Đã gửi liên kết khôi phục mật khẩu vào email của bạn.'); }} className="text-lime-700 font-bold hover:underline">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                id="btn-owner-login-submit"
                className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>Đăng nhập vào Dashboard Sân</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Nút điền nhanh tài khoản mẫu */}
            <div className="pt-2 border-t border-slate-100 text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setLoginForm({ identifier: 'toan.pickleswin@gmail.com', password: 'password123' });
                  setIsOwnerAuthenticated(true);
                  setAuthPromptMessage(null);
                  setViewMode('dashboard');
                  showToast('Đăng nhập thành công với tài khoản mẫu Sân Swin!');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
              >
                ⚡ Điền nhanh tài khoản mẫu & Vào Dashboard (Demo 1 chạm)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: MÀN HÌNH CHÍNH CHỦ SÂN (COURT OWNER DASHBOARD)
          Có 4 phân khu chức năng:
          a. Quản lý sân & lịch
          b. Quản lý Booking
          c. Check-in khách
          d. Theo dõi doanh thu
          ========================================================================= */}
      {viewMode === 'dashboard' && !isOwnerAuthenticated && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center border-2 border-amber-300 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-black uppercase tracking-wider">
              Khu Vực Quản Trị Bảo Mật
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Yêu Cầu Đăng Nhập / Đăng Ký Chủ Sân
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chỉ khi chủ sân đăng nhập hoặc hoàn tất đăng ký mới được phép xem giao diện quản lý sân, danh sách đặt chỗ, quầy check-in mã QR, báo cáo doanh thu và thông tin cá nhân của cụm sân. Nếu không đăng nhập hoặc đăng ký, bạn chỉ xem được giao diện trang chủ dành cho chủ sân.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthPromptMessage('Vui lòng đăng nhập để mở Bàn quản trị cơ sở của bạn.');
                setViewMode('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Lock className="w-4 h-4" />
              <span>Đăng Nhập Chủ Sân Ngay</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('register');
                setRegStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Ký Sân Mới</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setViewMode('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
            >
              ← Quay lại Giao diện Trang chủ cho chủ sân
            </button>
          </div>
        </div>
      )}

      {viewMode === 'dashboard' && isOwnerAuthenticated && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Dashboard Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0">
                SW
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white">{regForm.facilityName}</h2>
                  <span className="px-2 py-0.5 rounded-md bg-lime-400/20 text-lime-400 text-[10px] font-black uppercase border border-lime-400/30">
                    Đối tác chính thức
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  <span>{regForm.address} • 4 sân hoạt động</span>
                </p>
              </div>
            </div>

            {/* Quick Actions: Add Facility, Switch to Player View & Logout */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => {
                  setViewMode('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                title="Về Trang Chủ Cổng Chủ Sân"
              >
                <Building2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Trang Chủ Chủ Sân</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('register');
                  setRegStep(1);
                }}
                className="px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Đăng ký thêm cơ sở hoặc cụm sân mới"
              >
                <Plus className="w-3.5 h-3.5 text-slate-950" />
                <span>+ Đăng ký Cơ sở Mới</span>
              </button>

              <button
                onClick={() => onNavigate(2)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                title="Xem giao diện đặt sân dưới góc nhìn của người chơi"
              >
                <Eye className="w-3.5 h-3.5 text-lime-400" />
                <span>Xem giao diện Khách chơi (User Mode)</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-800/40 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Dashboard Navigation Tabs (4 Phân khu chính theo yêu cầu đề bài) */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setDashboardTab('courts')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                dashboardTab === 'courts'
                  ? 'bg-slate-900 text-lime-400 shadow-md font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Quản lý sân & lịch</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">4 sân</span>
            </button>

            <button
              onClick={() => setDashboardTab('bookings')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                dashboardTab === 'bookings'
                  ? 'bg-slate-900 text-lime-400 shadow-md font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản lý Booking</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-lime-400 text-slate-950 font-black">
                {bookings.filter((b) => b.status === 'deposit_paid' || b.status === 'pending_confirm').length} mới
              </span>
            </button>

            <button
              onClick={() => setDashboardTab('checkin')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                dashboardTab === 'checkin'
                  ? 'bg-slate-900 text-lime-400 shadow-md font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Check-in khách (QR / SĐT)</span>
            </button>

            <button
              onClick={() => setDashboardTab('revenue')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                dashboardTab === 'revenue'
                  ? 'bg-slate-900 text-lime-400 shadow-md font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Theo dõi doanh thu</span>
            </button>
          </div>

          {/* =========================================================================
              PHÂN KHU A: QUẢN LÝ SÂN & LỊCH
              ========================================================================= */}
          {dashboardTab === 'courts' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Danh sách các sân con & Trạng thái tức thì</h3>
                  <p className="text-xs text-slate-500">Xem/Sửa trạng thái sân, đóng/mở sân tức thì, cài đặt giá giờ thường và giờ vàng.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Khung giờ hoạt động:</span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-900">
                    {regForm.openingHour} - {regForm.closingHour} (Peak: {regForm.peakStart} - {regForm.peakEnd})
                  </span>
                </div>
              </div>

              {/* Grid 4 Courts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      court.status === 'occupied'
                        ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                        : court.status === 'available'
                        ? 'bg-white border-slate-200 shadow-sm'
                        : court.status === 'maintenance'
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-slate-100 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{court.name}</h4>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {court.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Giá Off-peak: <strong className="text-slate-800 font-mono">{court.hourlyRateOffPeak.toLocaleString()}đ</strong> • Giá Peak: <strong className="text-slate-800 font-mono">{court.hourlyRatePeak.toLocaleString()}đ/h</strong>
                        </p>
                      </div>

                      {/* Trạng thái Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shrink-0 ${
                          court.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : court.status === 'occupied'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : court.status === 'maintenance'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {court.status === 'available' ? '● Đang trống' : court.status === 'occupied' ? '● Đang chơi' : court.status === 'maintenance' ? 'Bảo trì' : 'Đang đóng'}
                      </span>
                    </div>

                    {court.currentMatch && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-100/60 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Trận hiện tại: <strong>{court.currentMatch}</strong></span>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleCourtStatus(court.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          court.status === 'closed'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        {court.status === 'closed' ? 'Mở lại sân này' : 'Tạm đóng sân'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showToast(`Cài đặt giá và khung giờ cho ${court.name} đã được lưu.`)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Chỉnh sửa giá
                        </button>
                        <button
                          onClick={() => {
                            const newStatus: CourtItem['status'] = court.status === 'maintenance' ? 'available' : 'maintenance';
                            setCourts((prev) => prev.map((c) => (c.id === court.id ? { ...c, status: newStatus } : c)));
                            showToast(`Đã chuyển ${court.name} sang: ${newStatus === 'maintenance' ? 'Bảo trì sửa chữa' : 'Sẵn sàng hoạt động'}`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          {court.status === 'maintenance' ? 'Hết bảo trì' : 'Báo bảo trì'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PHÂN KHU B: QUẢN LÝ BOOKING
              ========================================================================= */}
          {dashboardTab === 'bookings' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Danh sách đơn đặt sân (Bookings)</h3>
                  <p className="text-xs text-slate-500">Xem trạng thái cọc / thanh toán đầy đủ, hủy hoặc xác nhận đặt sân theo thời gian thực.</p>
                </div>
                <button
                  onClick={() => showToast('Mở form tạo đơn đặt sân thủ công cho khách vãng lai gọi điện')}
                  className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Booking thủ công</span>
                </button>
              </div>

              {/* Bảng danh sách Bookings */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Mã đơn</th>
                        <th className="px-4 py-3">Sân & Thời gian</th>
                        <th className="px-4 py-3">Khách hàng & SĐT</th>
                        <th className="px-4 py-3">Tổng tiền & Cọc</th>
                        <th className="px-4 py-3">Trạng thái</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">
                            #{booking.id}
                            <span className="block text-[10px] font-normal text-slate-400">{booking.createdAt}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 block">{booking.courtName}</span>
                            <span className="text-[11px] text-slate-500">{booking.date} • {booking.timeSlot}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 block">{booking.customerName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{booking.customerPhone}</span>
                          </td>
                          <td className="px-4 py-3 font-mono">
                            <strong className="text-slate-900 block">{booking.totalAmount.toLocaleString()}đ</strong>
                            <span className="text-[10px] text-emerald-600">Đã cọc: {booking.depositAmount.toLocaleString()}đ ({booking.paymentMethod})</span>
                            {booking.remainingAmount > 0 && (
                              <span className="text-[10px] text-amber-700 block font-bold">Còn thiếu: {booking.remainingAmount.toLocaleString()}đ</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                booking.status === 'checked_in'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : booking.status === 'fully_paid'
                                  ? 'bg-cyan-100 text-cyan-800'
                                  : booking.status === 'deposit_paid'
                                  ? 'bg-blue-100 text-blue-800'
                                  : booking.status === 'pending_confirm'
                                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {booking.status === 'checked_in'
                                ? 'Đã Check-in'
                                : booking.status === 'fully_paid'
                                ? 'Đã trả 100%'
                                : booking.status === 'deposit_paid'
                                ? 'Đã cọc 50%'
                                : booking.status === 'pending_confirm'
                                ? 'Chờ xác nhận'
                                : 'Đã hủy'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-1.5">
                            {booking.status === 'pending_confirm' && (
                              <button
                                onClick={() => handleConfirmBooking(booking.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Xác nhận
                              </button>
                            )}

                            {booking.status !== 'checked_in' && booking.status !== 'cancelled' && (
                              <>
                                <button
                                  onClick={() => {
                                    setDashboardTab('checkin');
                                    setScannedBooking(booking);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-[11px] cursor-pointer"
                                >
                                  Check-in
                                </button>
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-rose-600 font-bold text-[11px] cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PHÂN KHU C: CHECK-IN KHÁCH (QR CODE HOẶC TÌM THEO SĐT/MÃ BOOKING)
              ========================================================================= */}
          {dashboardTab === 'checkin' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-black text-slate-900">Check-in khách tại quầy lễ tân</h3>
                <p className="text-xs text-slate-500">Quét mã QR trên màn hình ứng dụng người chơi hoặc tìm nhanh theo Số điện thoại / Mã Booking.</p>
              </div>

              {/* Công cụ quét & tìm kiếm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cách 1: Quét mã QR */}
                <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 text-center space-y-4 shadow-md flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-black">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm">Quét mã QR từ điện thoại khách</h4>
                    <p className="text-[11px] text-slate-400">Khách mở ứng dụng PickleMate đưa mã vé QR để quét kiểm tra.</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={handleTriggerSimulatedScan}
                      disabled={isScanningActive}
                      className="w-full py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {isScanningActive ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Đang quét camera...</span>
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          <span>Mở Camera Quét mã QR</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Cách 2: Tìm theo SĐT hoặc Mã Booking */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 text-slate-900 space-y-4 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm">Tìm kiếm theo SĐT hoặc Mã vé</h4>
                    <p className="text-[11px] text-slate-500">Tra cứu thông tin đặt sân trong trường hợp khách hết pin hoặc không mở được app.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checkinQuery}
                      onChange={(e) => setCheckinQuery(e.target.value)}
                      placeholder="Nhập SĐT hoặc ví dụ: BK-9922"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-lime-500"
                    />
                    <button
                      onClick={handleSearchCheckin}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-lime-400 font-bold text-xs hover:bg-slate-800 cursor-pointer"
                    >
                      Tra cứu
                    </button>
                  </div>
                </div>
              </div>

              {/* Kết quả Check-in */}
              {scannedBooking && (
                <div className="p-6 rounded-3xl bg-white border-2 border-lime-400 shadow-xl space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-lime-600" />
                      <h4 className="font-black text-base text-slate-900">Chi tiết đơn đặt sân #{scannedBooking.id}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      {scannedBooking.status === 'checked_in' ? '✓ ĐÃ CHECK-IN' : 'Chờ Check-in'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Tên khách hàng:</span>
                      <strong className="text-slate-900">{scannedBooking.customerName}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Số điện thoại:</span>
                      <strong className="text-slate-900 font-mono">{scannedBooking.customerPhone}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Sân & Khung giờ:</span>
                      <strong className="text-slate-900">{scannedBooking.courtName}</strong>
                      <span className="block text-[10px] text-slate-500">{scannedBooking.timeSlot}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Số tiền còn phải thu:</span>
                      <strong className={`font-mono text-sm ${scannedBooking.remainingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {scannedBooking.remainingAmount > 0 ? `${scannedBooking.remainingAmount.toLocaleString()}đ (Thu tại quầy)` : 'Đã thanh toán 100%'}
                      </strong>
                    </div>
                  </div>

                  {scannedBooking.status !== 'checked_in' ? (
                    <button
                      id="btn-confirm-checkin"
                      onClick={() => handlePerformCheckin(scannedBooking)}
                      className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-400/25 cursor-pointer transition-all"
                    >
                      <CheckCheck className="w-5 h-5 text-slate-950" />
                      <span>Xác nhận Khách Đã Vào Sân (Hoàn tất Check-in)</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-xs">
                      Khách hàng này đã hoàn tất check-in và đang thi đấu trên sân.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              PHÂN KHU D: THEO DÕI DOANH THU & RÚT TIỀN
              ========================================================================= */}
          {dashboardTab === 'revenue' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Báo cáo & Thống kê Doanh thu</h3>
                  <p className="text-xs text-slate-500">Doanh thu tự động đối soát qua VietQR Napas 24/7 và ký quỹ an toàn.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setRevenueFilter('today')}
                      className={`px-3 py-1 rounded-lg ${revenueFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      Hôm nay
                    </button>
                    <button
                      onClick={() => setRevenueFilter('week')}
                      className={`px-3 py-1 rounded-lg ${revenueFilter === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      Tuần này
                    </button>
                    <button
                      onClick={() => setRevenueFilter('month')}
                      className={`px-3 py-1 rounded-lg ${revenueFilter === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      Tháng này
                    </button>
                  </div>

                  <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Rút tiền về Bank</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-medium text-slate-500">Tổng doanh thu ({revenueFilter === 'today' ? 'Hôm nay' : revenueFilter === 'week' ? '7 ngày qua' : 'Tháng này'})</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {revenueFilter === 'today' ? '2.450.000' : revenueFilter === 'week' ? '18.320.000' : '74.800.000'} <span className="text-xs font-bold font-sans">VNĐ</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">↑ +24% so với kỳ trước</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-medium text-slate-500">Số lượt đặt sân (Bookings)</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {revenueFilter === 'today' ? '6 lượt' : revenueFilter === 'week' ? '48 lượt' : '196 lượt'}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Tỷ lệ lấp đầy đạt 82%</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-medium text-slate-500">Số dư ví khả dụng rút</span>
                  <div className="text-2xl font-black text-emerald-600 font-mono">
                    12.850.000 <span className="text-xs font-bold font-sans">VNĐ</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Tài khoản {regForm.bankName.split(' - ')[0]} •••8201</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-medium text-slate-500">Tỷ lệ khách quay lại</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    68.4%
                  </div>
                  <span className="text-[11px] text-cyan-600 font-bold">Điểm đánh giá: 4.9/5.0 ★</span>
                </div>
              </div>

              {/* Revenue Chart Visual Bar */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Biểu đồ doanh thu 7 ngày gần nhất</h4>
                  <span className="text-xs text-slate-500 font-medium">Đơn vị: Triệu VNĐ</span>
                </div>

                <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 px-2">
                  {[
                    { day: 'Th 2', val: 1.8, h: '45%' },
                    { day: 'Th 3', val: 2.2, h: '55%' },
                    { day: 'Th 4', val: 1.9, h: '48%' },
                    { day: 'Th 5', val: 2.8, h: '70%' },
                    { day: 'Th 6', val: 3.6, h: '88%' },
                    { day: 'Th 7', val: 4.2, h: '100%' },
                    { day: 'CN', val: 3.9, h: '92%' },
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.val}M
                      </span>
                      <div
                        style={{ height: bar.h }}
                        className="w-full max-w-[36px] bg-slate-900 group-hover:bg-lime-400 rounded-xl transition-all shadow-xs"
                      />
                      <span className="text-[11px] font-bold text-slate-600">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lịch sử rút tiền */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Lịch sử rút tiền gần đây</h4>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">Rút về Techcombank - 19038291048201</strong>
                      <span className="text-[10px] text-slate-400">12/09/2026 16:30 • Mã GD #WD-8819</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-slate-900 font-mono text-sm block">-10.000.000 VNĐ</strong>
                      <span className="text-[10px] text-emerald-600 font-bold">✓ Đã chuyển khoản thành công</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">Rút về Techcombank - 19038291048201</strong>
                      <span className="text-[10px] text-slate-400">05/09/2026 10:15 • Mã GD #WD-8710</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-slate-900 font-mono text-sm block">-15.000.000 VNĐ</strong>
                      <span className="text-[10px] text-emerald-600 font-bold">✓ Đã chuyển khoản thành công</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Rút tiền */}
          {isWithdrawModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-slate-900">Rút tiền doanh thu về ngân hàng</h4>
                  <button onClick={() => setIsWithdrawModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-slate-500">Tài khoản nhận tiền:</span>
                  <p className="font-bold text-slate-900">{regForm.bankName}</p>
                  <p className="font-mono text-slate-700">{regForm.bankAccountNumber} - {regForm.bankAccountHolder}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số tiền muốn rút (VNĐ)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base font-bold text-slate-900 focus:outline-none focus:border-lime-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Khả dụng: 12.850.000 VNĐ • Miễn phí giao dịch Napas</span>
                </div>

                <button
                  onClick={() => {
                    setIsWithdrawModalOpen(false);
                    showToast(`✓ Đã tạo lệnh rút ${parseInt(withdrawAmount).toLocaleString()}đ về tài khoản ${regForm.bankAccountNumber}. Tiền sẽ về trong 1-3 phút.`);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                >
                  Xác nhận Rút tiền ngay
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Zap,
  Activity,
  ChevronLeft
} from 'lucide-react';

interface Screen14PlayerAuthProps {
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess?: (user: Partial<UserProfile>) => void;
}

export const Screen14PlayerAuth: React.FC<Screen14PlayerAuthProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('0909123456');
  const [loginPassword, setLoginPassword] = useState('picklemate2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      showToast('Vui lòng nhập đầy đủ Email/SĐT và Mật khẩu');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Đăng nhập thành công! Chào mừng bạn quay trở lại với PickleMate.');
      if (onLoginSuccess) {
        onLoginSuccess({
          name: 'Hoàng Long',
          dupr: '3.85',
        });
      }
      setTimeout(() => {
        onNavigate(1); // Navigate back to Homepage
      }, 1200);
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regLastName.trim() || !regFirstName.trim()) {
      showToast('Vui lòng nhập đầy đủ Họ và Tên');
      return;
    }
    if (!regPhone.trim()) {
      showToast('Vui lòng nhập Số điện thoại hợp lệ');
      return;
    }
    if (!regEmail.trim()) {
      showToast('Vui lòng nhập địa chỉ Email');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Đăng ký thành công! Chào mừng ${regLastName} ${regFirstName} đến với PickleMate.`);
      if (onLoginSuccess) {
        onLoginSuccess({
          name: regFirstName,
          lastName: regLastName,
          dupr: 'Unrated (Mới)',
        });
      }
      setTimeout(() => {
        onNavigate(2); // Go directly to Court Search
      }, 1200);
    }, 900);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-2 font-['Lexend',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A1128] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-lime-400 flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => onNavigate(1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0A1128] transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại Trang chủ</span>
        </button>
      </div>

      {/* Split Screen Container */}
      <div className="min-h-[640px] lg:min-h-[700px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 flex flex-col lg:flex-row bg-white">
        
        {/* =========================================================================
            CỘT TRÁI (Branding / Image Banner - 40% width)
            ========================================================================= */}
        <div className="lg:w-[40%] relative min-h-[300px] sm:min-h-[360px] lg:min-h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white overflow-hidden bg-[#0A1128]">
          
          {/* Background Image with Dark Navy Gradient Overlay */}
          <img
            src="/assets/pickleball-hero-match.jpg"
            alt="Pickleball Players Action"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
          />

          {/* Deep Navy Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/85 to-[#0A1128]/60 backdrop-blur-[0.5px]" />

          {/* Top Branding Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1128]/80 border border-lime-400/40 text-lime-400 text-xs font-black tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Dành Riêng Cho Người Chơi (Player)</span>
            </div>
          </div>

          {/* Centered Content: Logo & Slogan */}
          <div className="relative z-10 my-auto py-8 text-center sm:text-left space-y-4">
            {/* Big Bold PickleMate Logo in Lime Green */}
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-lime-400 text-[#0A1128] flex items-center justify-center font-black text-2xl shadow-lg shadow-lime-400/30 shrink-0">
                P
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-lime-400 font-['Lexend',sans-serif] drop-shadow-sm">
                PickleMate
              </h1>
            </div>

            {/* Slogan */}
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide leading-snug">
              &ldquo;Chạm đam mê, nối nhịp đấu&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed font-normal">
              Nền tảng Pickleball chuyên nghiệp tại Việt Nam: Đặt sân Swin, D-Court, V-Pickle trong 30 giây, tự động ghép kèo DUPR thông minh và mua sắm vợt chính hãng.
            </p>

            {/* 3 Quick Value Highlights */}
            <div className="pt-2 hidden sm:flex flex-col gap-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-lime-400" />
                </div>
                <span>Giữ chỗ tức thì qua VietQR, không sợ trùng lịch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-3 h-3 text-lime-400" />
                </div>
                <span>Cập nhật & đồng bộ điểm số DUPR tự động</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3 h-3 text-lime-400" />
                </div>
                <span>Chợ vợt qua kiểm định Pickle-Verify 100%</span>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof */}
          <div className="relative z-10 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces" alt="Player 1" className="w-6 h-6 rounded-full border border-slate-900 object-cover" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=faces" alt="Player 2" className="w-6 h-6 rounded-full border border-slate-900 object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=faces" alt="Player 3" className="w-6 h-6 rounded-full border border-slate-900 object-cover" />
              </div>
              <span className="font-bold text-white">85.000+ người chơi</span>
            </div>
            <span className="text-lime-400 font-bold">★ 4.9/5 đánh giá</span>
          </div>

          {/* Decorative neon light accent */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-lime-500/15 blur-3xl pointer-events-none" />
        </div>

        {/* =========================================================================
            CỘT PHẢI (Authentication Form - 60% width)
            ========================================================================= */}
        <div className="lg:w-[60%] bg-white flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md space-y-6">
            
            {/* Header & Tabs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight font-['Lexend',sans-serif]">
                  Chào mừng đến với PickleMate
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {activeTab === 'login' 
                    ? 'Đăng nhập vào tài khoản người chơi của bạn' 
                    : 'Tạo tài khoản mới để bắt đầu ghép kèo và đặt sân'}
                </p>
              </div>

              {/* Tab Toggle: "Đăng nhập" & "Đăng ký" */}
              <div className="flex border-b border-slate-200 gap-8">
                <button
                  type="button"
                  id="tab-btn-login"
                  onClick={() => setActiveTab('login')}
                  className={`pb-3 text-base sm:text-lg font-black transition-all cursor-pointer relative ${
                    activeTab === 'login'
                      ? 'text-[#0A1128] border-b-[3px] border-lime-400'
                      : 'text-slate-400 hover:text-slate-600 border-b-[3px] border-transparent'
                  }`}
                >
                  Đăng nhập
                </button>

                <button
                  type="button"
                  id="tab-btn-register"
                  onClick={() => setActiveTab('register')}
                  className={`pb-3 text-base sm:text-lg font-black transition-all cursor-pointer relative ${
                    activeTab === 'register'
                      ? 'text-[#0A1128] border-b-[3px] border-lime-400'
                      : 'text-slate-400 hover:text-slate-600 border-b-[3px] border-transparent'
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>

            {/* =====================================================================
                GIAO DIỆN FORM ĐĂNG NHẬP (Mặc định hiển thị)
                ===================================================================== */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-200">
                {/* Input 1: Email hoặc Số điện thoại (kèm icon user) */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0A1128]">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="login-input-identifier"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="0909 123 456 hoặc player@picklemate.vn"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-400/20 shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Input 2: Mật khẩu (kèm icon con mắt ẩn/hiện) */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0A1128]">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="login-input-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn"
                      className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-400/20 shadow-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Cụm phụ: Flex justify-between (Ghi nhớ & Quên mật khẩu) */}
                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      id="login-remember-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-lime-500 focus:ring-lime-400 cursor-pointer accent-lime-500"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => showToast('Liên kết đặt lại mật khẩu đã được gửi đến số điện thoại của bạn.')}
                    className="font-bold text-lime-600 hover:text-lime-700 hover:underline cursor-pointer transition-colors"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* Nút bấm chính: "Đăng nhập" (Rộng 100%, Nền Xanh Lime, chữ Xanh Navy in đậm) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="btn-player-submit-login"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-lime-400 hover:bg-lime-300 active:bg-lime-500 text-[#0A1128] font-black text-sm sm:text-base tracking-wide shadow-lg shadow-lime-400/25 transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0A1128] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Đăng nhập</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Divider: "Hoặc tiếp tục với" */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs text-slate-500 uppercase tracking-wider">
                    <span className="bg-white px-3 font-semibold text-slate-400">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div>

                {/* Social Login: Google & Zalo */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="btn-social-google"
                    onClick={() => {
                      showToast('Đang đăng nhập bằng tài khoản Google...');
                      setTimeout(() => {
                        if (onLoginSuccess) onLoginSuccess({ name: 'Google Player' });
                        onNavigate(1);
                      }, 1000);
                    }}
                    className="h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all hover:border-slate-300 cursor-pointer"
                  >
                    {/* Google SVG Logo */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    id="btn-social-zalo"
                    onClick={() => {
                      showToast('Đang kết nối xác thực qua Zalo OA...');
                      setTimeout(() => {
                        if (onLoginSuccess) onLoginSuccess({ name: 'Zalo Player' });
                        onNavigate(1);
                      }, 1000);
                    }}
                    className="h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all hover:border-slate-300 cursor-pointer"
                  >
                    {/* Zalo Icon */}
                    <div className="w-5 h-5 rounded-md bg-[#0068FF] text-white flex items-center justify-center font-black text-[10px] tracking-tight">
                      Z
                    </div>
                    <span>Zalo</span>
                  </button>
                </div>

                {/* Dưới cùng căn giữa: Dòng text chuyển sang Portal Chủ sân */}
                <div className="pt-4 text-center">
                  <p className="text-xs sm:text-sm text-slate-600">
                    Bạn là đối tác/chủ sân?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate(13)}
                      className="font-black text-lime-600 hover:text-lime-700 hover:underline cursor-pointer transition-colors"
                    >
                      Đi tới Portal Chủ sân
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* =====================================================================
                GIAO DIỆN FORM ĐĂNG KÝ (Khi click vào tab Đăng ký)
                ===================================================================== */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-200">
                {/* Hàng 1: 2 ô Input "Họ" và "Tên" (chia đôi cột) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[#0A1128]">
                      Họ *
                    </label>
                    <input
                      type="text"
                      id="reg-input-lastname"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Nguyễn"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-400/20 shadow-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[#0A1128]">
                      Tên *
                    </label>
                    <input
                      type="text"
                      id="reg-input-firstname"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Văn Anh"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-400/20 shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Hàng 2: Input "Số điện thoại" */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0A1128]">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      id="reg-input-phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-400/20 shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Hàng 3: Input "Email" */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0A1128]">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="reg-input-email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="player@picklemate.vn"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-400/20 shadow-xs"
                      required
                    />
                  </div>
                </div>

                {/* Hàng 4: Input "Mật khẩu" */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0A1128]">
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      id="reg-input-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự bảo mật"
                      className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-400/20 shadow-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showRegPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Nút bấm chính: "Đăng ký tài khoản" (Rộng 100%, Nền Xanh Lime, chữ Xanh Navy in đậm) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="btn-player-submit-register"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-lime-400 hover:bg-lime-300 active:bg-lime-500 text-[#0A1128] font-black text-sm sm:text-base tracking-wide shadow-lg shadow-lime-400/25 transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0A1128] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#0A1128]" />
                        <span>Đăng ký tài khoản</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Text dưới cùng: Điều khoản và Chính sách */}
                <p className="text-[11px] text-slate-500 text-center leading-relaxed pt-1">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Điều khoản Dịch vụ PickleMate VN'); }} className="text-slate-700 font-semibold hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Chính sách Bảo mật PickleMate VN'); }} className="text-slate-700 font-semibold hover:underline">
                    Chính sách bảo mật
                  </a>{' '}
                  của PickleMate.
                </p>

                {/* Dưới cùng căn giữa: Dòng text chuyển sang Portal Chủ sân */}
                <div className="pt-2 text-center border-t border-slate-100">
                  <p className="text-xs sm:text-sm text-slate-600">
                    Bạn là đối tác/chủ sân?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate(13)}
                      className="font-black text-lime-600 hover:text-lime-700 hover:underline cursor-pointer transition-colors"
                    >
                      Đi tới Portal Chủ sân
                    </button>
                  </p>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
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
  X,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userProfile?: Partial<UserProfile>) => void;
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  promptMessage = 'Vui lòng đăng nhập để hoàn tất thao tác này',
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

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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
      showToast('Đăng nhập thành công! Đang tiếp tục tác vụ của bạn...');
      setTimeout(() => {
        onLoginSuccess({
          name: 'Anna',
          lastName: 'Nguyễn',
          dupr: '3.85',
        });
      }, 500);
    }, 600);
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
      setTimeout(() => {
        onLoginSuccess({
          name: regFirstName,
          lastName: regLastName,
          dupr: 'Unrated (Mới)',
        });
      }, 500);
    }, 700);
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Toast Notification inside modal */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-60 bg-[#0A1128] text-white px-5 py-3 rounded-2xl shadow-2xl border border-lime-400 flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Card with Split Screen Layout */}
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row my-auto max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          type="button"
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-xs"
          title="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* =========================================================================
            CỘT TRÁI (Branding / Image Banner - 38% width trên desktop, ẩn hoặc gọn trên mobile)
            ========================================================================= */}
        <div className="hidden md:flex md:w-[40%] relative min-h-[520px] flex-col justify-between p-8 text-white overflow-hidden bg-[#0A1128]">
          {/* Background Image with Dark Navy Gradient Overlay */}
          <img
            src="/assets/pickleball-hero-match.jpg"
            alt="Pickleball Action"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
          />

          {/* Deep Navy Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/85 to-[#0A1128]/60 backdrop-blur-[0.5px]" />

          {/* Top Branding Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/80 border border-lime-400/40 text-lime-400 text-[11px] font-black tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>PickleMate Member</span>
            </div>
          </div>

          {/* Centered Content: Logo & Slogan */}
          <div className="relative z-10 my-auto py-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-lime-400 text-[#0A1128] flex items-center justify-center font-black text-xl shadow-md shadow-lime-400/30 shrink-0">
                P
              </div>
              <h2 className="text-2xl font-black tracking-tight text-lime-400 font-['Lexend',sans-serif]">
                PickleMate
              </h2>
            </div>

            <p className="text-base font-bold text-white tracking-wide leading-snug">
              &ldquo;Chạm đam mê, nối nhịp đấu&rdquo;
            </p>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Đăng nhập để giữ chỗ sân trong 30s, kết nối kèo DUPR thông minh và mua sắm vợt chính hãng có bảo vệ ký quỹ.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-[11px] text-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                  <Zap className="w-2.5 h-2.5 text-lime-400" />
                </div>
                <span>Giữ chỗ tức thì qua VietQR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-2.5 h-2.5 text-lime-400" />
                </div>
                <span>Xếp hạng và cập nhật DUPR tự động</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5 text-lime-400" />
                </div>
                <span>Chợ vợt kiểm định ký quỹ an toàn 100%</span>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof */}
          <div className="relative z-10 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-bold text-white">85.000+ người chơi</span>
            <span className="text-lime-400 font-bold">★ 4.9/5 đánh giá</span>
          </div>
        </div>

        {/* =========================================================================
            CỘT PHẢI (Authentication Form - 60% width)
            ========================================================================= */}
        <div className="flex-1 p-5 sm:p-8 md:p-10 flex flex-col justify-center overflow-y-auto max-h-[88vh]">
          <div className="w-full max-w-md mx-auto space-y-4">
            
            {/* THÔNG BÁO NHỎ: "Vui lòng đăng nhập để hoàn tất thao tác này" */}
            <div 
              id="auth-modal-prompt-banner"
              className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-xl flex items-center gap-2.5 text-amber-900 text-xs font-bold shadow-xs animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="leading-snug">{promptMessage}</span>
            </div>

            {/* Header & Tabs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight font-['Lexend',sans-serif]">
                  {activeTab === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký thành viên mới'}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeTab === 'login' 
                    ? 'Đăng nhập để tiếp tục hành động của bạn liền mạch' 
                    : 'Tạo tài khoản nhanh chóng chỉ mất chưa đầy 30 giây'}
                </p>
              </div>

              {/* Tab Toggle: "Đăng nhập" & "Đăng ký" */}
              <div className="flex border-b border-slate-200 gap-6">
                <button
                  type="button"
                  id="modal-tab-login"
                  onClick={() => setActiveTab('login')}
                  className={`pb-2.5 text-sm sm:text-base font-black transition-all cursor-pointer relative ${
                    activeTab === 'login'
                      ? 'text-[#0A1128] border-b-[3px] border-lime-400'
                      : 'text-slate-400 hover:text-slate-600 border-b-[3px] border-transparent'
                  }`}
                >
                  Đăng nhập
                </button>

                <button
                  type="button"
                  id="modal-tab-register"
                  onClick={() => setActiveTab('register')}
                  className={`pb-2.5 text-sm sm:text-base font-black transition-all cursor-pointer relative ${
                    activeTab === 'register'
                      ? 'text-[#0A1128] border-b-[3px] border-lime-400'
                      : 'text-slate-400 hover:text-slate-600 border-b-[3px] border-transparent'
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>

            {/* FORM ĐĂNG NHẬP */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-in fade-in duration-150">
                {/* Email / SĐT */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0A1128]">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="modal-login-identifier"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="0909 123 456 hoặc anna@picklemate.vn"
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-lime-500 focus:ring-3 focus:ring-lime-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Mật khẩu */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0A1128]">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="modal-login-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-lime-500 focus:ring-3 focus:ring-lime-400/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-lime-500 focus:ring-lime-400 cursor-pointer accent-lime-500"
                    />
                    <span>Ghi nhớ</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => showToast('Đã gửi mã khôi phục mật khẩu qua tin nhắn SMS.')}
                    className="font-bold text-lime-600 hover:text-lime-700 hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="modal-login-submit-btn"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-lime-400 hover:bg-lime-300 active:bg-lime-500 text-[#0A1128] font-black text-xs sm:text-sm tracking-wide shadow-md shadow-lime-400/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#0A1128] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Đăng nhập & Tiếp tục</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Social Login */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] text-slate-400 uppercase tracking-wider">
                    <span className="bg-white px-2 font-bold">Hoặc đăng nhập nhanh</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Đang kết nối tài khoản Google...');
                      setTimeout(() => {
                        onLoginSuccess({ name: 'Google Player', dupr: '3.85' });
                      }, 700);
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Đang kết nối qua Zalo...');
                      setTimeout(() => {
                        onLoginSuccess({ name: 'Zalo Player', dupr: '3.85' });
                      }, 700);
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <div className="w-4 h-4 rounded-md bg-[#0068FF] text-white flex items-center justify-center font-black text-[9px]">
                      Z
                    </div>
                    <span>Zalo</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM ĐĂNG KÝ */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 animate-in fade-in duration-150">
                {/* Họ & Tên */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#0A1128]">Họ *</label>
                    <input
                      type="text"
                      id="modal-reg-lastname"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Nguyễn"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-lime-500 focus:ring-3 focus:ring-lime-400/20"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#0A1128]">Tên *</label>
                    <input
                      type="text"
                      id="modal-reg-firstname"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Văn Anh"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-lime-500 focus:ring-3 focus:ring-lime-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0A1128]">Số điện thoại *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      id="modal-reg-phone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-lime-500 focus:ring-3 focus:ring-lime-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0A1128]">Email *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      id="modal-reg-email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="player@picklemate.vn"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-lime-500 focus:ring-3 focus:ring-lime-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Mật khẩu */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0A1128]">Mật khẩu *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      id="modal-reg-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-lime-500 focus:ring-3 focus:ring-lime-400/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="modal-reg-submit-btn"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-lime-400 hover:bg-lime-300 active:bg-lime-500 text-[#0A1128] font-black text-xs sm:text-sm tracking-wide shadow-md shadow-lime-400/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#0A1128] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#0A1128]" />
                      <span>Đăng ký & Tiếp tục ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

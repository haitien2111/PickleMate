import React, { useState, useEffect, useRef } from 'react';
import { ScreenId } from '../types';
import { 
  X, 
  ExternalLink, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  Sparkles,
  Camera,
  UploadCloud,
  Link as LinkIcon,
  Upload,
  Sliders,
  RotateCcw,
  Check
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (screen: ScreenId) => void;
}

interface ModalContent {
  title: string;
  category: string;
  body: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Logo customization state (synchronized with localStorage)
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('picklemate_custom_logo') || null;
    } catch {
      return null;
    }
  });

  const [pickleIconType, setPickleIconType] = useState<'ball' | 'paddle' | 'combo' | 'none'>(() => {
    try {
      return (localStorage.getItem('picklemate_pickle_icon_type') as any) || 'combo';
    } catch {
      return 'combo';
    }
  });

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [activeLogoTab, setActiveLogoTab] = useState<'upload' | 'url'>('upload');
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen to storage events to keep logo in sync across Header & Footer
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'picklemate_custom_logo') {
        setCustomLogo(e.newValue);
      }
      if (e.key === 'picklemate_pickle_icon_type') {
        setPickleIconType((e.newValue as any) || 'combo');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getPickleIconSrc = (type: 'ball' | 'paddle' | 'combo' | 'none') => {
    switch (type) {
      case 'paddle':
        return '/assets/pickleball-paddle.svg';
      case 'combo':
        return '/assets/pickleball-paddle-ball.svg';
      case 'ball':
      default:
        return '/assets/pickleball-ball.svg';
    }
  };

  const handlePickleIconChange = (type: 'ball' | 'paddle' | 'combo' | 'none') => {
    setPickleIconType(type);
    try {
      localStorage.setItem('picklemate_pickle_icon_type', type);
      window.dispatchEvent(new StorageEvent('storage', { key: 'picklemate_pickle_icon_type', newValue: type }));
    } catch {}
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomLogo(dataUrl);
      try {
        localStorage.setItem('picklemate_custom_logo', dataUrl);
        window.dispatchEvent(new StorageEvent('storage', { key: 'picklemate_custom_logo', newValue: dataUrl }));
      } catch {}
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsLogoModalOpen(false);
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleDropLogo = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrlInput.trim()) return;
    setCustomLogo(logoUrlInput.trim());
    try {
      localStorage.setItem('picklemate_custom_logo', logoUrlInput.trim());
      window.dispatchEvent(new StorageEvent('storage', { key: 'picklemate_custom_logo', newValue: logoUrlInput.trim() }));
    } catch {}
    setLogoUrlInput('');
    setIsLogoModalOpen(false);
  };

  const handleResetLogo = () => {
    setCustomLogo(null);
    setPickleIconType('combo');
    try {
      localStorage.removeItem('picklemate_custom_logo');
      localStorage.setItem('picklemate_pickle_icon_type', 'combo');
      window.dispatchEvent(new StorageEvent('storage', { key: 'picklemate_custom_logo', newValue: null }));
      window.dispatchEvent(new StorageEvent('storage', { key: 'picklemate_pickle_icon_type', newValue: 'combo' }));
    } catch {}
  };

  const handleLinkClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  const openInfoModal = (title: string, category: string, bodyText: string) => {
    setActiveModal({
      title,
      category,
      body: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>{bodyText}</p>
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-[#334155] text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-lime-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Tiêu chuẩn vận hành PickleMate VN 2026</span>
            </div>
            <p>Mọi quy định được áp dụng đồng bộ trên toàn bộ hệ sinh thái đặt sân, ghép kèo DUPR và sàn thương mại điện tử vợt Pickleball.</p>
          </div>
        </div>
      )
    });
  };

  const handleDownloadApp = (platform: 'ios' | 'android') => {
    setDownloadNotice(platform === 'ios' ? 'Đang mở liên kết App Store...' : 'Đang mở liên kết Google Play...');
    setTimeout(() => {
      setDownloadNotice(null);
      setActiveModal({
        title: platform === 'ios' ? 'Tải ứng dụng PickleMate trên App Store' : 'Tải ứng dụng PickleMate trên Google Play',
        category: 'ỨNG DỤNG DI ĐỘNG',
        body: (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8eff00]/10 border border-[#8eff00]/40 flex items-center justify-center text-[#8eff00]">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">PickleMate VN Mobile App</h4>
              <p className="text-xs text-slate-400 mt-1">Phiên bản 2.4.0 • Hỗ trợ iOS 15+ & Android 10+</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-[#334155] text-left text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-lime-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Đặt sân nhanh 1 chạm với thanh toán VietQR Napas 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-lime-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thông báo ghép kèo DUPR và kết nối tay vợt trong bán kính 5km</span>
              </div>
              <div className="flex items-center gap-2 text-lime-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Bảo chứng thanh toán ký quỹ Escrow 100% an toàn</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Quét mã QR trên màn hình hoặc tìm kiếm "PickleMate VN" trên chợ ứng dụng để cài đặt ngay.
            </p>
          </div>
        )
      });
    }, 400);
  };

  return (
    <footer 
      id="picklemate-main-footer" 
      className="w-full bg-[#0b1320] text-white border-t border-[#334155] font-['Lexend',sans-serif] select-none relative z-30"
    >
      {/* Container chính */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14 space-y-10 sm:space-y-12">
        
        {/* =========================================================================
            1. TOP HEADER BAR: Logo bên trái & Nút tải ứng dụng bên phải
            ========================================================================= */}
        <div 
          id="footer-top-header-bar"
          className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#334155]"
        >
          {/* Left: PickleMate VN Brand Logo with Custom Logo support and quick edit trigger */}
          <div className="flex items-center gap-2">
            <div 
              id="footer-brand-logo-container"
              onClick={() => onNavigate?.(1)}
              className="flex items-center gap-3 cursor-pointer group transition-transform duration-150 hover:scale-[1.02]"
              title="Về Trang chủ PickleMate VN"
            >
              {customLogo ? (
                <div className="flex items-center gap-2.5">
                  {/* Icon bóng/vợt nếu được chọn */}
                  {pickleIconType !== 'none' && (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border border-[#334155] flex items-center justify-center p-1.5 shadow-md group-hover:border-[#8eff00] transition-colors shrink-0">
                      <img 
                        src={getPickleIconSrc(pickleIconType)} 
                        alt="Pickleball Icon" 
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>
                  )}
                  <img 
                    src={customLogo} 
                    alt="PickleMate Custom Logo" 
                    className="h-10 sm:h-11 max-w-[200px] object-contain transition-all duration-150 rounded"
                  />
                </div>
              ) : (
                <>
                  {/* Logo Emblem Icon */}
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border border-[#334155] flex items-center justify-center p-1.5 shadow-md group-hover:border-[#8eff00] transition-colors">
                    <img 
                      src={getPickleIconSrc(pickleIconType === 'none' ? 'combo' : pickleIconType)} 
                      alt="PickleMate VN Emblem" 
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                    <Sparkles className="w-3 h-3 text-[#8eff00] absolute -top-1 -right-1" />
                  </div>

                  {/* Typography */}
                  <div className="flex items-baseline tracking-tight">
                    <span className="font-black text-white text-2xl sm:text-3xl tracking-tight">Pickle</span>
                    <span className="font-black text-[#8eff00] text-2xl sm:text-3xl ml-0.5 tracking-tight">Mate</span>
                    <span className="ml-2 font-black uppercase text-[10px] sm:text-xs tracking-widest bg-slate-900 text-[#8eff00] border border-[#8eff00]/40 px-2 py-0.5 rounded-md shadow-sm">
                      VN
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: CTA Tải ứng dụng di động */}
          <div 
            id="footer-app-download-cta"
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto justify-center md:justify-end px-4 py-3 sm:px-5 sm:py-3 rounded-2xl bg-lime-400/10 border border-lime-400/40 hover:border-lime-400/70 shadow-lg shadow-lime-500/10 backdrop-blur-xs transition-all"
          >
            <span className="text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 shrink-0">
              <Smartphone className="w-4 h-4 text-[#8eff00]" />
              <span className="text-slate-100">Tải ứng dụng di động:</span>
            </span>

            <div className="flex items-center gap-2.5">
              {/* App Store Badge */}
              <button
                id="footer-btn-download-appstore"
                onClick={() => handleDownloadApp('ios')}
                className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-lime-400/30 hover:border-[#8eff00] hover:bg-slate-900 transition-all duration-200 shadow-sm cursor-pointer"
                title="Tải ứng dụng trên Apple App Store"
              >
                {/* Apple SVG Logo */}
                <svg className="w-5 h-5 fill-white group-hover:fill-[#8eff00] transition-colors shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.98-12.24-14.7-5.7-8.59-10.14-18.49-13.33-29.69-3.19-11.2-4.79-21.84-4.79-31.93 0-14.1 3.51-25.76 10.53-34.98 7.02-9.22 15.82-13.95 26.4-14.19 5.02 0 10.42 1.34 16.19 4.02 5.77 2.68 9.38 4.08 10.83 4.2 1.9-.34 5.7-1.84 11.41-4.5 5.71-2.66 10.84-3.83 15.39-3.52 11.38.78 20.61 4.75 27.68 11.91-10.05 6.14-14.96 14.65-14.73 25.53.23 8.37 3.39 15.42 9.48 21.14 6.09 5.72 13.25 9.06 21.48 10.02-2.12 6.37-4.79 12.65-8.01 18.84zm-37.47-111.4c0 5.48-1.9 10.74-5.7 15.78-4.7 6.14-10.73 9.77-18.09 10.88-.11-1.34-.17-2.45-.17-3.34 0-5.36 2.05-10.71 6.14-16.05 4.09-5.34 9.5-8.86 16.23-10.56.9 1.12 1.41 2.21 1.59 3.29z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Download on the</span>
                  <span className="block text-xs font-bold text-white group-hover:text-[#8eff00] transition-colors mt-0.5">App Store</span>
                </div>
              </button>

              {/* Google Play Badge */}
              <button
                id="footer-btn-download-googleplay"
                onClick={() => handleDownloadApp('android')}
                className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-lime-400/30 hover:border-[#8eff00] hover:bg-slate-900 transition-all duration-200 shadow-sm cursor-pointer"
                title="Tải ứng dụng trên Google Play"
              >
                {/* Google Play SVG Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 512 512">
                  <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
                  <path fill="#34A853" d="M47 31.9L265.2 250 47 468.1V31.9z" />
                  <path fill="#FBBC04" d="M325.3 265.7l60.1 60.1L104.6 487l220.7-221.3z" />
                  <path fill="#EA4335" d="M465 241.6L385.4 196l-60.1 38.3 60.1 38.3 79.6-45.6c9.9-5.7 9.9-19.7 0-25.4z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">GET IT ON</span>
                  <span className="block text-xs font-bold text-white group-hover:text-[#8eff00] transition-colors mt-0.5">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. NAVIGATION LINKS AREA: 3 Cột ngăn cách bởi nét đứt dọc (subtle/dotted lines)
            ========================================================================= */}
        <div 
          id="footer-nav-links-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0"
        >
          {/* COLUMN 1: PICKLEMATE */}
          <div 
            id="footer-nav-col-picklemate"
            className="md:pr-8 md:border-r md:border-dotted md:border-[#334155] space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-wider text-[#8eff00] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#8eff00] rounded-sm inline-block"></span>
              PICKLEMATE
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  id="footer-link-about"
                  onClick={(e) => handleLinkClick(e, () => onNavigate?.(1))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Giới thiệu PickleMate</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-news"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('Tin tức & Sự kiện Pickleball', 'TIN TỨC', 'Cập nhật tin tức giải đấu PPA Tour, DUPR Vietnam Championship và các hoạt động phong trào sôi động nhất.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Tin tức</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-blog"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('PickleMate Blog', 'BLOG CHUYÊN SÂU', 'Kho kiến thức kỹ thuật dink, drive, chiến thuật đánh đôi, đánh đơn và bài tập rèn luyện thể lực pickleball chuẩn quốc tế.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Blog</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-careers"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('Cơ hội nghề nghiệp tại PickleMate VN', 'TUYỂN DỤNG', 'Gia nhập đội ngũ công nghệ thể thao hàng đầu Việt Nam. Chúng tôi liên tục tìm kiếm các vị trí Software Engineer, Sport Community Manager và Pickleball Specialist.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Tuyển dụng</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-court-owner-register"
                  onClick={(e) => handleLinkClick(e, () => onNavigate?.(13))}
                  className="text-[#8eff00] hover:text-white transition-colors duration-150 text-left font-bold flex items-center gap-1.5 group pt-1"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">ĐĂNG KÝ CHỦ SÂN</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#8eff00]/20 text-[#8eff00] font-black border border-[#8eff00]/40">
                    PORTAL
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: DÀNH CHO NGƯỜI CHƠI */}
          <div 
            id="footer-nav-col-players"
            className="md:px-8 md:border-r md:border-dotted md:border-[#334155] space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-wider text-[#8eff00] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#8eff00] rounded-sm inline-block"></span>
              DÀNH CHO NGƯỜI CHƠI
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  id="footer-link-quick-booking"
                  onClick={(e) => handleLinkClick(e, () => onNavigate?.(2))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Đặt sân nhanh</span>
                </button>
              </li>

              <li>
                <button
                  id="footer-link-social-match"
                  onClick={(e) => handleLinkClick(e, () => onNavigate?.(5))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Ghép kèo giao lưu</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-used-paddles"
                  onClick={(e) => handleLinkClick(e, () => onNavigate?.(7))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Chợ vợt cũ</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-picklemate-store"
                  onClick={(e) => handleLinkClick(e, () => onNavigate?.(9))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Cửa hàng PickleMate</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HỖ TRỢ */}
          <div 
            id="footer-nav-col-support"
            className="md:pl-8 space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-wider text-[#8eff00] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#8eff00] rounded-sm inline-block"></span>
              HỖ TRỢ
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  id="footer-link-support-center"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('Trung tâm hỗ trợ 24/7', 'HỖ TRỢ TRỰC TUYẾN', 'Tổng đài chăm sóc khách hàng: 1900-8888 (8:00 - 22:00 hàng ngày). Email hỗ trợ: hotro@picklemate.vn.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Trung tâm hỗ trợ</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-booking-guide"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('Hướng dẫn đặt sân & giữ chỗ', 'HƯỚNG DẪN', '1. Chọn cụm sân & khung giờ mong muốn.\n2. Quét mã VietQR thanh toán 1-chạm.\n3. Nhận mã PIN check-in sân trực tiếp trên ứng dụng.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Hướng dẫn đặt sân</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-matchmaking-guide"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('Hướng dẫn ghép kèo DUPR & Chia tiền sân', 'HƯỚNG DẪN', 'Tạo hoặc tham gia phòng ghép kèo theo trình độ DUPR từ 2.5 đến 5.0+. Hệ thống tự động chia đều tiền sân và hoàn lại nếu không đủ người.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Hướng dẫn ghép kèo</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-payment-policy"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('Chính sách thanh toán an toàn', 'THANH TOÁN', 'Hỗ trợ VietQR Napas 24/7, thẻ tín dụng/ghi nợ nội địa & quốc tế, và ví điện tử PickleMate Pay tích hợp cơ chế bảo vệ Escrow ký quỹ trung gian.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Chính sách thanh toán</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-return-policy"
                  onClick={(e) => handleLinkClick(e, () => openInfoModal('Chính sách đổi / trả vợt kiểm định', 'ĐỔI TRẢ & BẢO HÀNH', 'Đổi trả miễn phí trong 48 giờ nếu sản phẩm vợt cũ không đúng tình trạng mô tả hoặc không vượt qua bài kiểm tra chuyên môn 7 bước của PickleMate.'))}
                  className="text-slate-300 hover:text-[#8eff00] transition-colors duration-150 text-left font-normal flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-150">Chính sách đổi/trả</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================================================
            3. LEGAL LINKS SECTION: Dòng liên kết pháp lý nhỏ màu xám nhạt, ngăn cách bởi |
            ========================================================================= */}
        <div 
          id="footer-legal-links-section"
          className="pt-8 border-t border-[#334155] text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-2.5 text-[11px] sm:text-xs text-slate-400 font-normal leading-relaxed max-w-5xl mx-auto">
            <button
              id="legal-link-support-plan"
              onClick={() => openInfoModal('Kế hoạch Hỗ trợ người dùng', 'CHÍNH SÁCH', 'Cam kết phản hồi hỗ trợ trong vòng 15 phút đối với các sự cố đặt sân và hoàn tiền tức thì khi có xác nhận hủy hợp lệ.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Kế hoạch Hỗ trợ người dùng
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-terms"
              onClick={() => openInfoModal('Điều khoản Sử dụng Dịch vụ PickleMate', 'ĐIỀU KHOẢN', 'Quy định các quyền lợi, nghĩa vụ của hội viên khi tham gia đặt sân, mua bán thiết bị và thi đấu phong trào trên nền tảng PickleMate.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Điều khoản Sử dụng
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-privacy"
              onClick={() => openInfoModal('Chính sách Bảo mật Thông tin', 'BẢO MẬT', 'Cam kết bảo vệ tuyệt đối dữ liệu định danh, lịch sử giao dịch và xếp hạng DUPR của người dùng theo tiêu chuẩn an ninh dữ liệu cấp cao.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Chính sách Bảo mật
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-cookies"
              onClick={() => openInfoModal('Chính sách Cookie', 'COOKIES', 'Sử dụng cookie và bộ nhớ cục bộ để tối ưu hóa phiên đăng nhập, giỏ hàng phụ kiện và cài đặt giao diện ưa thích của bạn.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Chính sách Cookie
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-payment-terms"
              onClick={() => openInfoModal('Điều khoản Thanh toán & Ký quỹ', 'THANH TOÁN', 'Toàn bộ dòng tiền giao dịch mua vợt và đặt cọc được giữ an toàn tại tài khoản ủy thác Escrow cho đến khi đơn hàng hoàn tất nghiệm thu.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Điều khoản Thanh toán
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-refund"
              onClick={() => openInfoModal('Chính sách Hoàn tiền Tức thì', 'HOÀN TIỀN', 'Hủy sân trước 4 tiếng: hoàn 100% về ví PickleMate hoặc tài khoản ngân hàng nguồn. Hủy do thời tiết mưa bão: bảo lưu miễn phí 100%.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Chính sách Hoàn tiền
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-community"
              onClick={() => openInfoModal('Quy tắc Cộng đồng Pickleball Văn minh', 'VĂN HÓA SÂN ĐẤU', 'Tôn trọng bạn chơi, đúng giờ, bảo đảm tinh thần thể thao cao thượng (Fair-play) và tuân thủ quyết định của trọng tài giải đấu.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Quy tắc Cộng đồng
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-consent"
              onClick={() => openInfoModal('Tùy chọn Chấp thuận Dữ liệu', 'QUYỀN RIÊNG TƯ', 'Bạn hoàn toàn có quyền chủ động bật/tắt quyền truy cập định vị sân gần bạn và thông báo ghép kèo trận đấu mới.')}
              className="hover:text-[#8eff00] transition-colors"
            >
              Tùy chọn Chấp thuận
            </button>
            <span className="text-[#334155] select-none">|</span>

            <button
              id="legal-link-do-not-sell"
              onClick={() => openInfoModal('Chính sách Không Bán Thông tin Cá nhân', 'QUYỀN RIÊNG TƯ', 'PickleMate VN cam kết không bao giờ bán, cho thuê hoặc chia sẻ dữ liệu cá nhân của người chơi cho bên thứ ba vì mục đích quảng cáo rác.')}
              className="hover:text-[#8eff00] transition-colors whitespace-normal text-slate-300"
            >
              Không bán hoặc Chia sẻ Thông tin Cá nhân của tôi
            </button>
          </div>
        </div>

        {/* =========================================================================
            4. SOCIAL MEDIA ICONS & COPYRIGHT
            ========================================================================= */}
        <div 
          id="footer-social-and-copyright"
          className="space-y-6 pt-2 text-center"
        >
          {/* Centered horizontal row of dark circular icon buttons with hover effects */}
          <div 
            id="footer-social-icons-row"
            className="flex items-center justify-center gap-3 sm:gap-4"
          >
            {/* 1. Facebook */}
            <a
              id="footer-social-facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#0e1726] border border-[#334155] flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#8eff00] hover:border-[#8eff00] hover:shadow-[0_0_15px_rgba(142,255,0,0.35)] transition-all duration-200"
              title="Theo dõi PickleMate trên Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* 2. Instagram */}
            <a
              id="footer-social-instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#0e1726] border border-[#334155] flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#8eff00] hover:border-[#8eff00] hover:shadow-[0_0_15px_rgba(142,255,0,0.35)] transition-all duration-200"
              title="Theo dõi PickleMate trên Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* 3. TikTok */}
            <a
              id="footer-social-tiktok"
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#0e1726] border border-[#334155] flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#8eff00] hover:border-[#8eff00] hover:shadow-[0_0_15px_rgba(142,255,0,0.35)] transition-all duration-200"
              title="Theo dõi PickleMate trên TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>

            {/* 4. X (Twitter) */}
            <a
              id="footer-social-twitter"
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#0e1726] border border-[#334155] flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#8eff00] hover:border-[#8eff00] hover:shadow-[0_0_15px_rgba(142,255,0,0.35)] transition-all duration-200"
              title="Theo dõi PickleMate trên X (Twitter)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* 5. YouTube */}
            <a
              id="footer-social-youtube"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#0e1726] border border-[#334155] flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#8eff00] hover:border-[#8eff00] hover:shadow-[0_0_15px_rgba(142,255,0,0.35)] transition-all duration-200"
              title="Kênh YouTube chính thức PickleMate VN"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Copyright string at the bottom center */}
          <div id="footer-copyright-text" className="pt-2">
            <p className="text-center text-slate-400 text-xs sm:text-sm font-medium tracking-wide">
              Picklemate VN® © 2026.
            </p>
          </div>
        </div>

      </div>

      {/* Thông báo tạm khi bấm tải App */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl border border-[#8eff00] shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-[#8eff00] animate-ping" />
          <span className="text-xs font-semibold">{downloadNotice}</span>
        </div>
      )}

      {/* Interactive Modal cho Legal & Information links */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-[#0b1320] border border-[#334155] w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#334155] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8eff00] bg-[#8eff00]/10 px-2 py-0.5 rounded">
                  {activeModal.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeModal.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>{activeModal.body}</div>

            <div className="pt-3 border-t border-[#334155] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-[#8eff00] hover:text-slate-950 text-white font-semibold text-xs rounded-xl transition-all duration-150"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          MODAL: TẢI VÀ THAY ĐỔI LOGO PICKLEMATE
          ========================================================================= */}
      {isLogoModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsLogoModalOpen(false)}
        >
          <div 
            className="bg-[#0b1320] border border-[#334155] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-white animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#334155] bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8eff00]/15 text-[#8eff00] flex items-center justify-center border border-[#8eff00]/40">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white font-['Lexend',sans-serif]">
                    Cập nhật Logo PickleMate của bạn
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tải ảnh từ máy tính hoặc dán liên kết URL (áp dụng cho cả Header & Footer)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsLogoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Tabs */}
              <div className="flex bg-slate-900/90 p-1 rounded-xl gap-1 border border-[#334155]">
                <button
                  type="button"
                  onClick={() => setActiveLogoTab('upload')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeLogoTab === 'upload' ? 'bg-[#8eff00] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Tải ảnh từ máy tính</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoTab('url')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeLogoTab === 'url' ? 'bg-[#8eff00] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Link ảnh (URL)</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              {/* Tab 1: Upload File */}
              {activeLogoTab === 'upload' && (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDropLogo}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragging 
                      ? 'border-[#8eff00] bg-[#8eff00]/10' 
                      : 'border-[#334155] hover:border-[#8eff00]/60 bg-slate-950/60 hover:bg-slate-950'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-[#334155] flex items-center justify-center text-[#8eff00] shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Bấm vào đây để chọn tệp ảnh</p>
                    <p className="text-xs text-slate-400">hoặc kéo thả tệp ảnh logo của bạn vào vùng này (PNG, JPG, SVG, WebP)</p>
                  </div>
                  <button 
                    type="button"
                    className="mt-1 px-4 py-2 bg-[#8eff00] hover:bg-[#8eff00]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Chọn tệp ảnh</span>
                  </button>
                </div>
              )}

              {/* Tab 2: URL Input */}
              {activeLogoTab === 'url' && (
                <form onSubmit={handleApplyUrl} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300">Nhập đường dẫn trực tuyến (URL ảnh):</label>
                  <input 
                    type="url"
                    placeholder="https://example.com/picklemate-logo.png"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    className="w-full bg-slate-950 border border-[#334155] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8eff00]"
                  />
                  <button
                    type="submit"
                    disabled={!logoUrlInput.trim()}
                    className="w-full py-2.5 bg-[#8eff00] hover:bg-[#8eff00]/90 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow"
                  >
                    Áp dụng logo này
                  </button>
                </form>
              )}

              {/* TÙY CHỌN BIỂU TƯỢNG VỢT / BÓNG PICKLEBALL */}
              <div className="bg-slate-950 p-4 rounded-xl border border-[#334155] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8eff00]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Biểu Tượng Kèm Theo Logo</span>
                  </div>
                  <span className="text-[11px] text-[#8eff00] font-semibold">Tùy chọn</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('combo')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'combo'
                        ? 'border-[#8eff00] bg-[#8eff00]/15 ring-2 ring-[#8eff00]/40'
                        : 'border-[#334155] bg-slate-900/80 hover:bg-slate-800'
                    }`}
                  >
                    <img src="/assets/pickleball-paddle-ball.svg" alt="Combo" className="w-7 h-7 object-contain drop-shadow" />
                    <span className="text-[10px] font-bold text-center text-white">Vợt & Bóng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('paddle')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'paddle'
                        ? 'border-[#8eff00] bg-[#8eff00]/15 ring-2 ring-[#8eff00]/40'
                        : 'border-[#334155] bg-slate-900/80 hover:bg-slate-800'
                    }`}
                  >
                    <img src="/assets/pickleball-paddle.svg" alt="Vợt" className="w-7 h-7 object-contain drop-shadow" />
                    <span className="text-[10px] font-bold text-center text-white">Cây Vợt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('ball')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'ball'
                        ? 'border-[#8eff00] bg-[#8eff00]/15 ring-2 ring-[#8eff00]/40'
                        : 'border-[#334155] bg-slate-900/80 hover:bg-slate-800'
                    }`}
                  >
                    <img src="/assets/pickleball-ball.svg" alt="Bóng" className="w-7 h-7 object-contain drop-shadow" />
                    <span className="text-[10px] font-bold text-center text-white">Quả Bóng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('none')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'none'
                        ? 'border-[#8eff00] bg-[#8eff00]/15 ring-2 ring-[#8eff00]/40'
                        : 'border-[#334155] bg-slate-900/80 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-400">🚫</span>
                    <span className="text-[10px] font-bold text-center text-white">Chỉ Logo</span>
                  </button>
                </div>
              </div>

              {/* SUCCESS NOTICE */}
              {uploadSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Đã cập nhật Logo thành công!</span>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-[#334155] flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetLogo}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-[#334155] hover:border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục Logo gốc</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

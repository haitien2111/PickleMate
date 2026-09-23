import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Wallet, 
  ChevronDown, 
  ShieldCheck, 
  Flame, 
  MapPin, 
  Calendar, 
  Users, 
  User,
  Sparkles, 
  HelpCircle, 
  Menu, 
  X, 
  Bell,
  MessageSquare,
  CheckCircle2,
  Ticket,
  BadgeCheck,
  Camera,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  UploadCloud,
  Sliders,
  ZoomIn,
  ZoomOut,
  Plus,
  Minus,
  LogOut,
  Send,
  ChevronLeft,
  Maximize2,
  Building2,
  LogIn
} from 'lucide-react';
import { ScreenId, UserProfile } from '../types';
import { ChatModal, INITIAL_CONVERSATIONS, ConversationItem, ChatMessage } from './ChatModal';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  user: UserProfile | null;
  isLoggedIn?: boolean;
  cartCount: number;
  onOpenWallet: () => void;
  onOpenCart: () => void;
  onLogout?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  user,
  isLoggedIn = false,
  cartCount,
  onOpenWallet,
  onOpenCart,
  onLogout,
  onOpenAuthModal,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);
  
  // Chat & Messages state
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string>('conv-1');
  const [dropdownActiveConvId, setDropdownActiveConvId] = useState<string | null>(null);
  const [dropdownInputText, setDropdownInputText] = useState('');
  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);

  const unreadMsgCount = conversations.reduce((acc, c) => acc + c.unread, 0);

  const handleSendMessage = (convId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: text.trim(),
      timestamp: timeStr,
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, newMsg] } : c))
    );

    // Auto-reply simulation after 1.2 seconds
    setTimeout(() => {
      const now2 = new Date();
      const replyTime = `${now2.getHours().toString().padStart(2, '0')}:${now2.getMinutes().toString().padStart(2, '0')}`;
      setConversations((prev) => {
        const target = prev.find((c) => c.id === convId);
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'other',
          text: target?.autoReplyText || 'Dạ vâng bác, em đã nhận được tin nhắn nhé!',
          timestamp: replyTime,
          isRead: true,
        };
        return prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, replyMsg] } : c));
      });
    }, 1200);
  };

  const handleMarkRead = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unread: 0 } : c))
    );
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('TẤT CẢ');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [activeLogoTab, setActiveLogoTab] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);

  // Logo sizing state (in pixels)
  const [logoHeight, setLogoHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('picklemate_logo_height');
      return saved ? parseInt(saved, 10) : 40;
    } catch {
      return 40;
    }
  });

  const handleLogoHeightChange = (newHeight: number) => {
    const clamped = Math.min(Math.max(newHeight, 24), 84);
    setLogoHeight(clamped);
    try {
      localStorage.setItem('picklemate_logo_height', clamped.toString());
    } catch {}
  };

  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('picklemate_custom_logo') || null;
    } catch {
      return null;
    }
  });

  // Biểu tượng bóng hoặc vợt Pickleball đi kèm logo
  const [pickleIconType, setPickleIconType] = useState<'ball' | 'paddle' | 'combo' | 'none'>(() => {
    try {
      return (localStorage.getItem('picklemate_pickle_icon_type') as any) || 'ball';
    } catch {
      return 'ball';
    }
  });

  // Sync with footer or external changes to custom logo
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

  const handlePickleIconChange = (type: 'ball' | 'paddle' | 'combo' | 'none') => {
    setPickleIconType(type);
    try {
      localStorage.setItem('picklemate_pickle_icon_type', type);
    } catch {}
  };

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

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomLogo(dataUrl);
      try {
        localStorage.setItem('picklemate_custom_logo', dataUrl);
      } catch {
        // storage quota
      }
      setIsLogoModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDropLogo = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (logoUrlInput.trim()) {
      setCustomLogo(logoUrlInput.trim());
      try {
        localStorage.setItem('picklemate_custom_logo', logoUrlInput.trim());
      } catch {}
      setLogoUrlInput('');
      setIsLogoModalOpen(false);
    }
  };

  const handleResetLogo = () => {
    setCustomLogo(null);
    try {
      localStorage.removeItem('picklemate_custom_logo');
    } catch {}
    setIsLogoModalOpen(false);
  };

  const subFilters = [
    { label: 'TẤT CẢ', screen: 1 as ScreenId },
    { label: 'ĐẶT SÂN', screen: 2 as ScreenId },
    { label: 'GHÉP KÈO', screen: 5 as ScreenId },
    { label: 'CHỢ VỢT CŨ', screen: 7 as ScreenId },
    { label: 'CỬA HÀNG', screen: 9 as ScreenId },
    { label: 'DÀNH CHO CHỦ SÂN', screen: 13 as ScreenId, isOwnerTab: true },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('chủ sân') || q.includes('đăng ký sân') || q.includes('quản lý sân') || q.includes('owner')) {
      onNavigate(13);
    } else if (q.includes('sân') || q.includes('swin') || q.includes('quận')) {
      onNavigate(2);
    } else if (q.includes('kèo') || q.includes('dupr') || q.includes('ghép') || q.includes('chơi')) {
      onNavigate(5);
    } else if (q.includes('vợt') || q.includes('zocker') || q.includes('pass') || q.includes('mua')) {
      onNavigate(7);
    } else if (q.includes('custom') || q.includes('laser') || q.includes('khắc')) {
      onNavigate(9);
    } else {
      onNavigate(2);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg select-none font-sans">
      
      {/* =========================================================================
          TIER 2: MAIN NAVIGATION BAR (Slate-900 + Slanted PickleMate Logo + Slanted Shop)
          ========================================================================= */}
      <div className="w-full bg-slate-900 text-white flex items-stretch justify-between relative shadow-md">
        
        {/* LEFT BADGE: Slanted White Container with "PickleMate" Logo */}
        <div 
          onClick={() => onNavigate(1)}
          className="relative bg-white cursor-pointer select-none shrink-0 flex items-center pl-4 sm:pl-8 pr-8 sm:pr-12 py-2 sm:py-2.5 transition-transform duration-150"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 84% 100%, 0% 100%)',
          }}
          title="PickleMate - Bấm để về Trang chủ"
        >
          {customLogo ? (
            <div className="flex items-center gap-2 pr-2">
              {/* Hình ảnh quả bóng hoặc vợt Pickleball thêm vào logo */}
              {pickleIconType !== 'none' && (
                <img 
                  src={getPickleIconSrc(pickleIconType)} 
                  alt={pickleIconType === 'paddle' ? 'Vợt Pickleball' : pickleIconType === 'combo' ? 'Vợt & Bóng Pickleball' : 'Quả bóng Pickleball'} 
                  style={{ height: `${Math.max(22, Math.round(logoHeight * 0.9))}px`, width: 'auto' }}
                  className="object-contain shrink-0 transition-all duration-150 drop-shadow-sm hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
              )}
              <img 
                src={customLogo} 
                alt="PickleMate Logo" 
                style={{ height: `${logoHeight}px`, maxHeight: '84px', width: 'auto' }}
                className="object-contain transition-all duration-150" 
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 pr-2">
              {/* Hình ảnh quả bóng hoặc vợt Pickleball chất lượng cao */}
              <img 
                src={getPickleIconSrc(pickleIconType === 'none' ? 'combo' : pickleIconType)}
                alt="Pickleball Emblem"
                style={{ 
                  height: `${Math.max(26, Math.round(logoHeight * 0.92))}px`, 
                  width: `${Math.max(26, Math.round(logoHeight * 0.92))}px` 
                }}
                className="object-contain shrink-0 drop-shadow-sm transition-all duration-150 hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Brand Typography: Pickle (Dark Slate) + Mate (Lime Green) */}
              <div 
                className="flex items-baseline font-['Lexend',sans-serif] tracking-tight transition-all duration-150"
                style={{ fontSize: `${Math.max(16, Math.round(logoHeight * 0.62))}px`, lineHeight: 1 }}
              >
                <span className="font-black text-slate-950">Pickle</span>
                <span className="font-black text-lime-600 ml-0.5">Mate</span>
                <span 
                  className="font-black uppercase bg-slate-950 text-lime-400 px-1 py-0.2 rounded ml-1 tracking-widest hidden sm:inline"
                  style={{ fontSize: `${Math.max(9, Math.round(logoHeight * 0.25))}px` }}
                >
                  VN
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Search Bar + Slanted Neon Lime SHOP Button */}
        <div className="flex items-center">
          
          {/* Quick Search Input on Desktop */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center relative mr-2 sm:mr-3"
          >
            <input 
              type="text" 
              placeholder="Tìm sân, kèo DUPR, vợt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/90 text-white placeholder-slate-400 text-xs rounded-full pl-8 pr-3 py-1.5 w-44 lg:w-52 border border-slate-700 focus:outline-none focus:border-lime-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-lime-400 lg:hidden mr-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* SLANTED NEON LIME "SHOP & CART" BUTTON (PickleMate Brand Color) */}
          <div
            onClick={onOpenCart}
            className="relative bg-lime-400 hover:bg-lime-300 text-slate-950 font-black cursor-pointer select-none flex items-center px-6 sm:px-9 py-3 transition-all duration-150 h-full shadow-md group"
            style={{
              clipPath: 'polygon(16% 0, 100% 0, 100% 100%, 0% 100%)',
            }}
            title="Giỏ Hàng & Chợ Vợt Kiểm Định"
          >
            <div className="flex items-center gap-2 pl-2 sm:pl-3">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-slate-950 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm sm:text-base font-black tracking-wider uppercase font-['Lexend',sans-serif]">
                  GIỎ HÀNG
                </span>
                <span className="text-[9px] font-bold text-slate-900 hidden sm:inline">
                  ESCROW CHECKOUT
                </span>
              </div>

              {/* Cart Badge counter */}
              {cartCount > 0 && (
                <span className="ml-1 bg-slate-950 text-lime-400 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>


      {/* =========================================================================
          HÀNG TIỆN ÍCH (TIỆN ÍCH + DANH MỤC + TIỆN ÍCH CÁ NHÂN: PROFILE, THÔNG BÁO, TIN NHẮN, TRỢ GIÚP)
          ========================================================================= */}
      <div className="tien-ich-bar w-full bg-slate-100 border-b border-slate-200 px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs font-black text-slate-800 relative z-30">
        
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-0.5 shrink-0">
          {/* Quick Sub-Filter Pills */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {subFilters.map((filter) => {
              const isActive = currentScreen === filter.screen || activeFilter === filter.label;
              const isOwner = filter.screen === 13;

              return (
                <button
                  key={filter.label}
                  id={isOwner ? 'header-nav-court-owner' : undefined}
                  onClick={() => {
                    setActiveFilter(filter.label);
                    onNavigate(filter.screen);
                  }}
                  className={`tien-ich-item px-3 py-1 text-xs font-black tracking-wider uppercase transition-all rounded-md flex items-center gap-1.5 font-['Lexend',sans-serif] whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-lime-400 shadow-sm font-black'
                      : isOwner
                      ? 'text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200/90 font-black border border-emerald-300/80'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 font-extrabold'
                  }`}
                >
                  {isOwner && <Building2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{filter.label}</span>
                  {isOwner && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-600 text-white font-black">
                      PORTAL
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Utility Icons (Được chuyển xuống chung hàng tiện ích: Profile, Thông báo, Tin nhắn, Hỗ trợ) */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto pl-2 shrink-0">
          
          {/* 1. HỒ SƠ CÁ NHÂN (PROFILE) */}
          <div className="relative">
            {!isLoggedIn || !user ? (
              <button 
                onClick={onOpenAuthModal ? onOpenAuthModal : () => onNavigate(14)}
                className="px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-[#0A1128] text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-[1.02] border border-lime-400"
                title="Đăng nhập / Đăng ký tài khoản"
                id="header-profile-btn"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0A1128]" />
                <span>Đăng nhập / Đăng ký</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                    setShowMessages(false);
                  }}
                  className={`p-1 sm:px-2.5 sm:py-1 rounded-xl transition-all relative flex items-center justify-center gap-2 text-xs font-bold cursor-pointer border ${
                    showUserMenu ? 'bg-slate-900 text-lime-400 font-black shadow-xs border-slate-900' : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200 border-slate-300 bg-white/80'
                  }`}
                  title="Hồ sơ và Xếp hạng DUPR"
                  id="header-profile-btn"
                >
                  <img 
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={user?.name || 'Anna'} 
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-lime-400 shrink-0"
                  />
                  <span className="hidden sm:inline font-black text-slate-900">{user?.name || 'Anna'}</span>
                  <span className="hidden md:inline-flex items-center text-[10px] bg-slate-900 text-lime-400 px-1.5 py-0.5 rounded-md font-black shadow-xs">
                    DUPR {user?.dupr || '3.85'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && user && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in duration-150"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div 
                      onClick={() => onNavigate(11)}
                      className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-lime-50 rounded-lg mb-2 cursor-pointer transition-colors border border-transparent hover:border-lime-200"
                      title="Xem Hồ sơ & Xếp hạng DUPR"
                    >
                      <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="User" className="w-10 h-10 rounded-lg object-cover ring-2 ring-lime-500" />
                      <div>
                        <p className="font-bold text-xs text-slate-900">
                          {user?.lastName ? `${user.lastName} ${user.name}` : (user?.name || 'Người chơi')}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          DUPR: {user?.dupr || '3.5'} (Đã xác minh)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-semibold">
                      <button 
                        onClick={() => onNavigate(11)}
                        className="w-full text-left px-2.5 py-2 rounded-lg bg-lime-50 hover:bg-lime-100 text-slate-900 font-bold flex items-center justify-between border border-lime-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-950" />
                          <span>Hồ sơ và Xếp hạng</span>
                        </span>
                        <span className="text-[10px] bg-lime-400 text-slate-950 px-1.5 py-0.5 rounded font-black">DUPR {user?.dupr || '3.5'}</span>
                      </button>

                      <button 
                        onClick={onOpenWallet}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-lime-50 text-slate-800 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <Wallet className="w-4 h-4 text-emerald-600" />
                          Pickle Wallet:
                        </span>
                        <strong className="text-emerald-700 font-mono">{(user?.walletBalance || 0).toLocaleString('vi-VN')} đ</strong>
                      </button>
                      
                      <button 
                        onClick={() => onNavigate(4)}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4 text-blue-600" />
                        <span>Vé đặt sân Swin Q7 (17:00)</span>
                      </button>

                      <button 
                        onClick={() => onNavigate(6)}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                      >
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span>Kèo ghép tối nay (20:00)</span>
                      </button>

                      <button 
                        onClick={() => onNavigate(10)}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Đơn kiểm định RPM Q2 Cotton Candy (Ký quỹ)</span>
                      </button>

                      {user?.role === 'court_owner' && (
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate(13);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-between font-bold"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            <span>Cổng Đối Tác & Chủ Sân</span>
                          </div>
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">QUẢN LÝ</span>
                        </button>
                      )}

                      <div className="pt-1.5 border-t border-slate-100 space-y-1">
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            if (onLogout) {
                              onLogout();
                            } else {
                              onNavigate(14);
                            }
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 flex items-center gap-2 font-semibold transition-colors"
                          id="header-logout-btn"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 2. THÔNG BÁO (NOTIFICATIONS) - Chỉ hiển thị khi người dùng đã đăng nhập tài khoản */}
          {isLoggedIn && user && (
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                  setShowUserMenu(false);
                }}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors relative flex items-center justify-center cursor-pointer ${
                  showNotifications ? 'bg-slate-900 text-lime-400' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                }`}
                title="Thông báo"
                id="header-notifications-btn"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-lime-500 text-slate-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none border border-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div 
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-0 z-50 animate-in fade-in duration-150 overflow-hidden"
                >
                  <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-lime-400" />
                      <span className="font-bold text-xs uppercase tracking-wider">Thông báo của bạn</span>
                    </div>
                    {unreadNotifCount > 0 && (
                      <button 
                        onClick={() => setUnreadNotifCount(0)}
                        className="text-[10px] text-lime-400 hover:underline font-bold"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {/* Notification item 1 */}
                    <div 
                      onClick={() => {
                        onNavigate(4);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-lime-50/60 transition-colors cursor-pointer flex gap-3 items-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-lime-100 text-lime-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Ticket className="w-4 h-4 text-lime-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900">Đặt sân thành công!</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">Sân số 2 Swin Q7 (17:00 - 19:00 hôm nay). Mã vé #PM-9921.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">5 phút trước</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0 mt-2"></span>
                    </div>

                    {/* Notification item 2 */}
                    <div 
                      onClick={() => {
                        onNavigate(6);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-lime-50/60 transition-colors cursor-pointer flex gap-3 items-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Flame className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900">Có đối thủ ghép DUPR 3.2 mới</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">Huy Hoàng vừa mời bạn vào kèo Đôi nam tối nay tại Swin Pickleball Q7.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">22 phút trước</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0 mt-2"></span>
                    </div>

                    {/* Notification item 3 */}
                    <div 
                      onClick={() => {
                        onNavigate(10);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-lime-50/60 transition-colors cursor-pointer flex gap-3 items-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900">Kiểm định vợt RPM Q2 Cotton Candy thành công</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">Chuyên gia PickleMate đã xác thực độ nảy 97%, đạt chuẩn ký quỹ Escrow bảo mật.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">1 giờ trước</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0 mt-2"></span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => {
                        onNavigate(4);
                        setShowNotifications(false);
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-slate-950"
                    >
                      Xem lịch sử hoạt động →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. TIN NHẮN (MESSAGES) - Chỉ hiển thị khi người dùng đã đăng nhập tài khoản */}
          {isLoggedIn && user && (
            <div className="relative">
              <button 
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors relative flex items-center justify-center cursor-pointer ${
                showMessages ? 'bg-slate-900 text-lime-400' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
              title="Tin nhắn"
              id="header-messages-btn"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMsgCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-lime-500 text-slate-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none border border-white">
                  {unreadMsgCount}
                </span>
              )}
            </button>

            {/* Messages Dropdown */}
            {showMessages && (
              <div 
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-0 z-50 animate-in fade-in duration-150 overflow-hidden"
              >
                {dropdownActiveConvId ? (
                  /* ================= Inline Active Chat View ================= */
                  (() => {
                    const activeDropdownConv = conversations.find(c => c.id === dropdownActiveConvId) || conversations[0];
                    return (
                      <div className="flex flex-col h-96">
                        {/* Chat Header */}
                        <div className="bg-slate-900 text-white px-3 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setDropdownActiveConvId(null)}
                              className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                              title="Quay lại danh sách tin nhắn"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="relative">
                              {activeDropdownConv.avatar ? (
                                <img
                                  src={activeDropdownConv.avatar}
                                  alt={activeDropdownConv.name}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-800 text-lime-400 flex items-center justify-center font-bold text-[10px]">
                                  PM
                                </div>
                              )}
                              {activeDropdownConv.online && (
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-slate-900"></span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{activeDropdownConv.name}</p>
                              <p className="text-[10px] text-lime-400 truncate">{activeDropdownConv.role}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setIsChatModalOpen(true);
                                setActiveChatId(activeDropdownConv.id);
                                setShowMessages(false);
                              }}
                              className="text-slate-400 hover:text-white p-1 rounded"
                              title="Mở toàn màn hình"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setShowMessages(false)}
                              className="text-slate-400 hover:text-white p-1 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Messages scroll list */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50 text-xs">
                          {activeDropdownConv.messages.map((m) => (
                            <div
                              key={m.id}
                              className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`px-3 py-1.5 rounded-2xl max-w-[80%] leading-relaxed ${
                                  m.sender === 'me'
                                    ? 'bg-slate-900 text-white rounded-br-xs'
                                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-xs'
                                }`}
                              >
                                {m.text}
                              </div>
                              <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
                            </div>
                          ))}
                        </div>

                        {/* Inline Chat Input */}
                        <div className="p-2 border-t border-slate-200 bg-white">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Nhập tin nhắn..."
                              value={dropdownInputText}
                              onChange={(e) => setDropdownInputText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (dropdownInputText.trim()) {
                                    handleSendMessage(activeDropdownConv.id, dropdownInputText.trim());
                                    setDropdownInputText('');
                                  }
                                }
                              }}
                              className="flex-1 bg-slate-100 text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:bg-white"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (dropdownInputText.trim()) {
                                  handleSendMessage(activeDropdownConv.id, dropdownInputText.trim());
                                  setDropdownInputText('');
                                }
                              }}
                              disabled={!dropdownInputText.trim()}
                              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                                dropdownInputText.trim()
                                  ? 'bg-lime-500 text-slate-950 hover:bg-lime-400 cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                              title="Gửi tin nhắn"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* ================= Conversations List View ================= */
                  <>
                    <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-lime-400" />
                        <span className="font-bold text-xs uppercase tracking-wider">Tin nhắn & Trò chuyện</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadMsgCount > 0 && (
                          <button 
                            onClick={() => {
                              setConversations(prev => prev.map(c => ({ ...c, unread: 0 })));
                            }}
                            className="text-[10px] text-lime-400 hover:underline font-bold"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsChatModalOpen(true);
                            setShowMessages(false);
                          }}
                          className="text-slate-400 hover:text-white p-1 rounded"
                          title="Mở toàn màn hình"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {conversations.map((conv) => {
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        return (
                          <div 
                            key={conv.id}
                            onClick={() => {
                              setDropdownActiveConvId(conv.id);
                              handleMarkRead(conv.id);
                            }}
                            className="p-3 hover:bg-lime-50/50 transition-colors cursor-pointer flex gap-3 items-center"
                          >
                            <div className="relative shrink-0">
                              {conv.avatar ? (
                                <img 
                                  src={conv.avatar} 
                                  alt={conv.name} 
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-lime-400 flex items-center justify-center font-black text-xs">
                                  PM
                                </div>
                              )}
                              {conv.online && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-900 truncate">{conv.name}</p>
                                <span className="text-[10px] text-slate-400">{lastMsg?.timestamp || ''}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                                {lastMsg ? (lastMsg.sender === 'me' ? `Bạn: ${lastMsg.text}` : lastMsg.text) : 'Bấm để nhắn tin'}
                              </p>
                            </div>
                            {conv.unread > 0 && (
                              <span className="w-2.5 h-2.5 rounded-full bg-lime-500 shrink-0"></span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setIsChatModalOpen(true);
                          setShowMessages(false);
                        }}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-lime-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Mở hộp thư chat đầy đủ để trả lời tin nhắn →</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          )}

          {/* 4. HỖ TRỢ (SUPPORT) */}
          <button 
            onClick={() => onNavigate(1)}
            className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            title="Hỗ trợ & Trợ giúp"
            id="header-support-btn"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>


      {/* =========================================================================
          MOBILE COLLAPSIBLE MENU
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b-2 border-lime-400 p-4 text-white space-y-3 animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Tìm sân, kèo, vợt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-xs rounded-lg pl-8 pr-3 py-2 border border-slate-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button 
              onClick={() => { onNavigate(1); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${currentScreen === 1 ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-slate-100'}`}
            >
              TRANG CHỦ
            </button>
            <button 
              onClick={() => { onNavigate(2); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${currentScreen === 2 ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-slate-100'}`}
            >
              ĐẶT SÂN
            </button>
            <button 
              onClick={() => { onNavigate(5); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${currentScreen === 5 ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-lime-400 font-extrabold'}`}
            >
              GHÉP KÈO
            </button>
            <button 
              onClick={() => { onNavigate(7); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${currentScreen === 7 ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-slate-100'}`}
            >
              CHỢ VỢT CŨ
            </button>
            <button 
              onClick={() => { onNavigate(9); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${currentScreen === 9 ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-slate-100'}`}
            >
              CỬA HÀNG
            </button>
            <button 
              onClick={() => { onNavigate(13); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left col-span-2 flex items-center justify-between ${currentScreen === 13 ? 'bg-lime-400 text-slate-950 font-black' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold'}`}
            >
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-lime-400" />
                <span>DÀNH CHO CHỦ SÂN</span>
              </div>
              <span className="text-[10px] bg-lime-400 text-slate-950 px-2 py-0.5 rounded font-black">
                ĐĂNG KÝ / QUẢN LÝ
              </span>
            </button>
            {!isLoggedIn || !user ? (
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal();
                  else onNavigate(14);
                }}
                className="p-2.5 col-span-2 bg-lime-400 hover:bg-lime-300 text-slate-950 rounded-xl text-left flex items-center justify-between font-black transition-all shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <LogIn className="w-4 h-4 text-slate-950" />
                  <span>ĐĂNG NHẬP / ĐĂNG KÝ (PLAYER)</span>
                </div>
                <span className="text-[10px] bg-slate-950 text-lime-400 px-2 py-0.5 rounded font-black">
                  BẮT ĐẦU
                </span>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => { onNavigate(11); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-lg text-left flex items-center justify-between ${currentScreen === 11 ? 'bg-lime-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-100'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-lime-400" />
                    <span>HỒ SƠ ({user?.name || 'Cá nhân'})</span>
                  </div>
                  <span className="text-[10px] bg-slate-950 text-lime-400 px-1.5 py-0.5 rounded font-black">DUPR {user?.dupr || '3.5'}</span>
                </button>
                <button 
                  onClick={() => { onOpenWallet(); setMobileMenuOpen(false); }}
                  className="p-2.5 bg-slate-800 text-emerald-400 rounded-lg text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>PICKLE WALLET</span>
                  </div>
                  <span className="font-mono text-white text-[10px]">{(user?.walletBalance || 0).toLocaleString('vi-VN')} đ</span>
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                    else onNavigate(14);
                  }}
                  className="p-2.5 col-span-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded-lg text-left flex items-center justify-between font-bold border border-rose-800/50"
                >
                  <div className="flex items-center gap-1.5">
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>ĐĂNG XUẤT</span>
                  </div>
                  <span className="text-[10px] bg-rose-800 text-white px-2 py-0.5 rounded font-bold">
                    LOGOUT
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TẢI VÀ THAY ĐỔI LOGO PICKLEMATE
          ========================================================================= */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center border border-lime-400/30">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white">Cập nhật Logo PickleMate</h3>
                  <p className="text-xs text-slate-400">Chọn ảnh từ thiết bị của bạn hoặc dán đường dẫn link ảnh</p>
                </div>
              </div>
              <button 
                onClick={() => setIsLogoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">

              {/* Tabs */}
              <div className="flex bg-slate-800/80 p-1 rounded-xl gap-1 border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setActiveLogoTab('upload')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeLogoTab === 'upload' ? 'bg-lime-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Tải ảnh từ máy tính</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoTab('url')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeLogoTab === 'url' ? 'bg-lime-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
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
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragging 
                      ? 'border-lime-400 bg-lime-400/10' 
                      : 'border-slate-700 hover:border-lime-400/60 bg-slate-950/50 hover:bg-slate-950'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-lime-400 shadow-inner">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Bấm vào đây để chọn ảnh từ máy tính</p>
                    <p className="text-xs text-slate-400">hoặc kéo thả ảnh logo vào vùng này (PNG, JPG, SVG, WebP)</p>
                  </div>
                  <button 
                    type="button"
                    className="mt-2 px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Chọn tệp ảnh từ máy tính</span>
                  </button>
                </div>
              )}

              {/* Tab 2: URL Input */}
              {activeLogoTab === 'url' && (
                <form onSubmit={handleApplyUrl} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300">Nhập đường dẫn trực tuyến (URL ảnh):</label>
                  <div className="relative">
                    <input 
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!logoUrlInput.trim()}
                    className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow"
                  >
                    Áp dụng logo này
                  </button>
                </form>
              )}

              {/* THÊM HÌNH ẢNH QUẢ BÓNG HOẶC VỢT PICKLEBALL VÀO LOGO */}
              <div className="bg-slate-950 p-4 rounded-xl border border-lime-400/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-lime-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Hình Ảnh Pickleball Thêm Vào Logo</span>
                  </div>
                  <span className="text-[11px] text-lime-400 font-semibold">Tùy chọn hiển thị</span>
                </div>

                {/* Selection Cards for Ball / Paddle / Combo / None */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('ball')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'ball'
                        ? 'border-lime-400 bg-lime-400/15 ring-2 ring-lime-400/40'
                        : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img 
                      src="/assets/pickleball-ball.svg" 
                      alt="Quả bóng Pickleball" 
                      className="w-8 h-8 object-contain drop-shadow" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-bold text-center text-white">Quả bóng 3D</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('paddle')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'paddle'
                        ? 'border-lime-400 bg-lime-400/15 ring-2 ring-lime-400/40'
                        : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img 
                      src="/assets/pickleball-paddle.svg" 
                      alt="Vợt Pickleball" 
                      className="w-8 h-8 object-contain drop-shadow" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-bold text-center text-white">Vợt Pro Carbon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('combo')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'combo'
                        ? 'border-lime-400 bg-lime-400/15 ring-2 ring-lime-400/40'
                        : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img 
                      src="/assets/pickleball-paddle-ball.svg" 
                      alt="Vợt & Bóng kết hợp" 
                      className="w-8 h-8 object-contain drop-shadow" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-bold text-center text-white">Vợt & Bóng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePickleIconChange('none')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      pickleIconType === 'none'
                        ? 'border-lime-400 bg-lime-400/15 ring-2 ring-lime-400/40'
                        : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400 text-xs">
                      ✕
                    </div>
                    <span className="text-[11px] font-bold text-center text-slate-400">Không kèm</span>
                  </button>
                </div>

                {/* Quick 1-click Preset to use directly as Standalone Custom Logo */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-bold">Đặt làm logo chính:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLogo('/assets/pickleball-ball.svg');
                      try { localStorage.setItem('picklemate_custom_logo', '/assets/pickleball-ball.svg'); } catch {}
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>🟢 Dùng Quả bóng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLogo('/assets/pickleball-paddle.svg');
                      try { localStorage.setItem('picklemate_custom_logo', '/assets/pickleball-paddle.svg'); } catch {}
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>🏓 Dùng Vợt Pro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLogo('/assets/pickleball-paddle-ball.svg');
                      try { localStorage.setItem('picklemate_custom_logo', '/assets/pickleball-paddle-ball.svg'); } catch {}
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>🎾 Dùng Vợt & Bóng</span>
                  </button>
                </div>
              </div>

              {/* Sizing Controller Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-lime-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Chỉnh Kích Thước Logo</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-lime-400/20 text-lime-400 font-mono font-black text-xs border border-lime-400/40 shadow-sm">
                    {logoHeight} px
                  </span>
                </div>

                {/* Range Slider with +/- buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLogoHeightChange(logoHeight - 4)}
                    disabled={logoHeight <= 24}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
                    title="Thu nhỏ 4px"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="range"
                    min={24}
                    max={84}
                    step={2}
                    value={logoHeight}
                    onChange={(e) => handleLogoHeightChange(parseInt(e.target.value, 10))}
                    className="w-full accent-lime-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleLogoHeightChange(logoHeight + 4)}
                    disabled={logoHeight >= 84}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
                    title="Phóng to 4px"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase mr-1">Cỡ sẵn:</span>
                  {[
                    { label: 'Nhỏ', size: 30 },
                    { label: 'Tiêu chuẩn', size: 40 },
                    { label: 'Lớn', size: 52 },
                    { label: 'Rất lớn', size: 64 },
                    { label: 'Cực đại', size: 76 },
                  ].map((preset) => (
                    <button
                      key={preset.size}
                      type="button"
                      onClick={() => handleLogoHeightChange(preset.size)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        logoHeight === preset.size
                          ? 'bg-lime-400 text-slate-950 shadow-md ring-2 ring-lime-400/50'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
                      }`}
                    >
                      {preset.label} ({preset.size}px)
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Preview */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>Xem trước thực tế (Chiều cao: {logoHeight}px):</span>
                  {customLogo && (
                    <span className="text-lime-400 font-medium">Đang dùng logo tùy chỉnh</span>
                  )}
                </div>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center min-h-[80px] border border-slate-200 overflow-hidden">
                  {customLogo ? (
                    <div className="flex items-center gap-2">
                      {pickleIconType !== 'none' && (
                        <img 
                          src={getPickleIconSrc(pickleIconType)} 
                          alt="Icon Pickleball" 
                          style={{ height: `${Math.max(22, Math.round(logoHeight * 0.9))}px`, width: 'auto' }}
                          className="object-contain shrink-0 drop-shadow-sm" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <img 
                        src={customLogo} 
                        alt="Preview Logo" 
                        style={{ height: `${logoHeight}px`, maxHeight: '84px', width: 'auto' }}
                        className="object-contain transition-all duration-150" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img 
                        src={getPickleIconSrc(pickleIconType === 'none' ? 'combo' : pickleIconType)}
                        alt="Pickleball Emblem"
                        style={{ 
                          height: `${Math.max(26, Math.round(logoHeight * 0.92))}px`, 
                          width: `${Math.max(26, Math.round(logoHeight * 0.92))}px` 
                        }}
                        className="object-contain shrink-0 drop-shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div 
                        className="flex items-baseline font-['Lexend',sans-serif] tracking-tight transition-all duration-150"
                        style={{ fontSize: `${Math.max(16, Math.round(logoHeight * 0.62))}px`, lineHeight: 1 }}
                      >
                        <span className="font-black text-slate-950">Pickle</span>
                        <span className="font-black text-lime-600 ml-0.5">Mate</span>
                        <span 
                          className="font-black uppercase bg-slate-950 text-lime-400 px-1 py-0.2 rounded ml-1 tracking-widest hidden sm:inline"
                          style={{ fontSize: `${Math.max(9, Math.round(logoHeight * 0.25))}px` }}
                        >
                          VN
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetLogo}
                className="px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục logo mặc định</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PickleMate Full Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        user={user}
        initialConvId={activeChatId}
        conversations={conversations}
        onSendMessage={handleSendMessage}
        onMarkRead={handleMarkRead}
      />

    </header>
  );
};

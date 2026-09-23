import React from 'react';
import { ScreenId, Court } from '../types';
import { COURTS_DATA } from '../data/mockData';
import { 
  Calendar, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  Activity, 
  Zap,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Building2,
  Send,
  CreditCard,
  MessageSquare,
  Unlink,
  Heart,
  Check,
  Camera,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Sliders,
  X,
  Layers,
  Save
} from 'lucide-react';

interface Screen1HomeProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen1Home: React.FC<Screen1HomeProps> = ({ onNavigate }) => {
  const [showGuideDetails, setShowGuideDetails] = React.useState(false);

  // Custom Image & Format State for DUPR Mockup with LocalStorage Persistence
  const STORAGE_KEY = 'picklemate_dupr_image_config';
  const defaultDuprImage = 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=600&q=80';

  // Load saved configuration from localStorage
  const getSavedConfig = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          url: parsed.url || defaultDuprImage,
          fit: parsed.fit || 'cover',
          height: parsed.height || 'h-28',
          radius: parsed.radius || 'rounded-xl',
          filter: parsed.filter || 'none',
        };
      }
    } catch (e) {
      console.error('Failed to parse saved image config:', e);
    }
    return {
      url: defaultDuprImage,
      fit: 'cover' as const,
      height: 'h-28' as const,
      radius: 'rounded-xl' as const,
      filter: 'none' as const,
    };
  };

  const initialConfig = getSavedConfig();
  const [duprMockupImage, setDuprMockupImage] = React.useState<string>(initialConfig.url);
  const [imageFit, setImageFit] = React.useState<'cover' | 'contain' | 'fill'>(initialConfig.fit as any);
  const [imageHeight, setImageHeight] = React.useState<'h-28' | 'h-32' | 'h-36'>(initialConfig.height as any);
  const [imageRadius, setImageRadius] = React.useState<'rounded-xl' | 'rounded-2xl' | 'rounded-lg'>(initialConfig.radius as any);
  const [imageFilter, setImageFilter] = React.useState<'none' | 'vibrant' | 'warm' | 'sharp'>(initialConfig.filter as any);
  const [showImageModal, setShowImageModal] = React.useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = React.useState<string>('');
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);
  const [imageToast, setImageToast] = React.useState<string | null>(null);
  const [isSaved, setIsSaved] = React.useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Function to explicitly persist configuration to localStorage
  const saveImageChanges = (customSettings?: {
    url?: string;
    fit?: 'cover' | 'contain' | 'fill';
    height?: 'h-28' | 'h-32' | 'h-36';
    radius?: 'rounded-xl' | 'rounded-2xl' | 'rounded-lg';
    filter?: 'none' | 'vibrant' | 'warm' | 'sharp';
  }) => {
    const configToSave = {
      url: customSettings?.url ?? duprMockupImage,
      fit: customSettings?.fit ?? imageFit,
      height: customSettings?.height ?? imageHeight,
      radius: customSettings?.radius ?? imageRadius,
      filter: customSettings?.filter ?? imageFilter,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
      setIsSaved(true);
      setImageToast('Đã lưu hình ảnh & định dạng vừa chỉnh sửa thành công!');
      setTimeout(() => setImageToast(null), 3500);
    } catch (error) {
      console.error('Error saving image:', error);
      setImageToast('Không thể lưu vào bộ nhớ cục bộ.');
      setTimeout(() => setImageToast(null), 3000);
    }
  };

  // Auto-persist whenever the user modifies settings
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const configToSave = {
          url: duprMockupImage,
          fit: imageFit,
          height: imageHeight,
          radius: imageRadius,
          filter: imageFilter,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
        setIsSaved(true);
      } catch (e) {
        console.error('Auto save error:', e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [duprMockupImage, imageFit, imageHeight, imageRadius, imageFilter]);

  const pickleballPresets = [
    {
      id: 'preset-1',
      title: 'Trận đôi ngoài trời',
      desc: 'Khoảnh khắc đánh đôi thi đấu rực rỡ',
      url: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'preset-2',
      title: 'Vợt & Bóng chuyên dụng',
      desc: 'Dụng cụ thể thao chuẩn thi đấu',
      url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'preset-3',
      title: 'Pha Smash chuyên nghiệp',
      desc: 'Cú đập bóng dứt điểm uy lực',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'preset-4',
      title: 'Cụm sân thi đấu ban đêm',
      desc: 'Ánh sáng hiện đại chuẩn giải đấu',
      url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'preset-5',
      title: 'Kỹ thuật giao bóng',
      desc: 'Tư thế giao bóng dưới tay chuẩn luật',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'preset-6',
      title: 'Giao lưu CLB DUPR',
      desc: 'Không khí giao lưu kết nối sôi động',
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageToast('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).');
      setTimeout(() => setImageToast(null), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const newUrl = e.target.result as string;
        setDuprMockupImage(newUrl);
        saveImageChanges({ url: newUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const applyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    const newUrl = customUrlInput.trim();
    setDuprMockupImage(newUrl);
    saveImageChanges({ url: newUrl });
    setCustomUrlInput('');
  };

  const getFilterClass = () => {
    switch (imageFilter) {
      case 'vibrant':
        return 'saturate-150 contrast-105';
      case 'warm':
        return 'sepia-[0.2] contrast-105 brightness-105';
      case 'sharp':
        return 'contrast-125 brightness-95';
      default:
        return '';
    }
  };

  const coreFeatures = [
    {
      title: 'Đặt Sân Nhanh',
      desc: 'Xem lịch trống Real-time 24/7, giữ chỗ 1 chạm và thanh toán cọc VietQR siêu tốc.',
      screen: 2 as ScreenId,
      icon: Calendar,
      badge: 'Real-time VietQR',
      color: 'from-lime-500/20 to-lime-500/5',
      borderColor: 'border-lime-500/40 hover:border-lime-400',
      iconBg: 'bg-lime-400 text-slate-950',
      btnText: 'Tìm Sân Trống',
    },
    {
      title: 'Ghép Kèo Giao Lưu',
      desc: 'Tìm bạn chơi cân tài theo điểm DUPR chuẩn, tự động chia tiền sân thông minh.',
      screen: 5 as ScreenId,
      icon: Users,
      badge: 'DUPR Auto Match',
      color: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      iconBg: 'bg-cyan-400 text-slate-950',
      btnText: 'Xem Các Kèo Mở',
    },
    {
      title: 'Chợ Vợt Cũ',
      desc: 'Sàn pass vợt cũ an toàn 100% với dịch vụ chuyên viên kiểm định và thanh toán ký quỹ.',
      screen: 7 as ScreenId,
      icon: ShoppingBag,
      badge: 'Escrow Bảo Vệ',
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      iconBg: 'bg-emerald-400 text-slate-950',
      btnText: 'Khám Phá Chợ Vợt Cũ',
    },
    {
      title: 'Cửa Hàng',
      desc: 'Custom Lab 2D trực quan: Khắc tên Laser màu bạc, phối màu grip, tạo dấu ấn độc bản.',
      screen: 9 as ScreenId,
      icon: Sparkles,
      badge: 'Cửa hàng 2D',
      color: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      iconBg: 'bg-amber-400 text-slate-950',
      btnText: 'Vào Cửa Hàng',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* Layer 1: Pickleball paddle and neon ball striking on blue court (Hình ảnh người chơi và cú đánh bóng sống động) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/pickleball-hero-match.jpg"
            alt="Cú đánh bóng Pickleball trên sân đấu xanh dương"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[15%_center] sm:object-[20%_45%] lg:object-[25%_40%] scale-100 transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Layer 2: Tone màu xanh dương đồng bộ với website (Gradient từ trái sang phải để giữ văn bản rõ nét và tôn hình ảnh player) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950 via-slate-900/90 md:via-blue-950/80 to-blue-900/40"></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950 via-transparent to-blue-950/40"></div>

        {/* Layer 3: Hiệu ứng ánh sáng xanh dương (blue/cyan) & hoa văn lưới pickleball */}
        <div className="absolute inset-0 z-[2] opacity-40 pointer-events-none">
          <div className="absolute -top-10 right-20 w-[32rem] h-[32rem] bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-full lg:max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-4 h-4 fill-current" />
            <span>Hệ sinh thái Thể thao & Công nghệ Pickleball tiên phong</span>
          </div>

          <h1 className="text-[40px] leading-[41px] font-black tracking-tight text-[#78d700] font-['Lexend',sans-serif]">
            PickleMate -
            <span className="block text-[50px] leading-[42px] text-white italic border-black mt-2 whitespace-nowrap">
              CHẠM ĐAM MÊ, NỐI NHỊP ĐẤU
            </span>
          </h1>

          <p className="mt-5 text-[16px] text-white max-w-2xl leading-relaxed font-normal">
            Tối ưu mọi điểm chạm trải nghiệm: <strong className="font-normal text-white">Đặt sân trực tuyến</strong>, <strong className="font-normal text-white">kết nối người chơi</strong>, <strong className="font-normal text-white whitespace-nowrap">giao dịch bảo mật</strong> và <strong className="font-normal text-white">chế tác vợt mang đậm dấu ấn riêng</strong>.
          </p>

          {/* 2 CTA Buttons as explicitly required */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              id="cta-booking"
              onClick={() => onNavigate(2)}
              className="px-7 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm sm:text-base transition-all duration-200 shadow-xl shadow-lime-400/25 flex items-center gap-2.5 group cursor-pointer hover:scale-[1.02]"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              <span>Đặt Sân Nhanh</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="cta-matchmaking"
              onClick={() => onNavigate(5)}
              className="px-7 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-white border border-slate-700 font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2.5 cursor-pointer hover:scale-[1.02]"
            >
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Ghép Kèo Giao Lưu</span>
              <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-700">
                DUPR Auto
              </span>
            </button>
          </div>

          {/* Trust stats */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <p className="text-[30px] leading-[32px] font-black text-white">150+</p>
              <p className="text-xs text-slate-400 font-medium">Cụm sân chuẩn thi đấu</p>
            </div>
            <div>
              <p className="text-[30px] leading-[32px] font-black text-lime-400">45.000+</p>
              <p className="text-xs text-slate-400 font-medium">Tay vợt đồng bộ DUPR</p>
            </div>
            <div>
              <p className="text-[30px] leading-[32px] font-black text-cyan-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Ký quỹ bảo vệ Escrow</p>
            </div>
            <div>
              <p className="text-[30px] leading-[32px] font-black text-amber-400">1-Touch</p>
              <p className="text-xs text-slate-400 font-medium">VietQR Napas 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid 4 Core Feature Cards */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                onClick={() => onNavigate(feat.screen)}
                className={`group cursor-pointer p-6 rounded-2xl bg-white border ${feat.borderColor} shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feat.color} rounded-bl-full pointer-events-none`}></div>
                
                <div>
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-xl ${feat.iconBg} flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-lime-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-lime-600">
                  <span>{feat.btnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Guides Section - Cẩm nang luật chơi bằng Tiếng Việt kết hợp thuật ngữ chuyên ngành */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
          <div className="max-w-2xl">
            {/* Tag Cẩm nang */}
            <div className="inline-block bg-[#B8ECF9] text-[#053849] font-black text-xs px-2.5 py-1 rounded tracking-wide mb-3">
              Cẩm nang Pickleball
            </div>
            
            {/* Tiêu đề Tiếng Việt font Lexend dày không chân */}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug font-['Lexend',sans-serif]">
              Cách chơi Pickleball - 7 quy tắc đơn giản cho người mới bắt đầu
            </h3>
            
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Cẩm nang luật chơi cơ bản nhất dành cho người mới: Luật 2 lần nảy bóng (Two-Bounce Rule), khu vực cấm bắt vô-lê Non-Volley Zone (Kitchen), kỹ thuật giao bóng dưới tay hợp lệ và cách tính điểm chuẩn quốc tế.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowGuideDetails(!showGuideDetails)}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-lime-400" />
              <span>{showGuideDetails ? 'Thu gọn 7 quy tắc' : 'Đọc ngay 7 quy tắc'}</span>
              {showGuideDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Khối 7 quy tắc khi mở rộng */}
        {showGuideDetails && (
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center mb-2">1</span>
              <h4 className="font-extrabold text-sm text-slate-900 font-['Lexend',sans-serif]">Giao bóng dưới tay (Underhand Serve)</h4>
              <p className="text-xs text-slate-600 mt-1">Mặt vợt phải tiếp xúc bóng ở vị trí dưới rốn/thắt lưng, bóng đi chéo sân và qua khỏi vạch Kitchen của đối thủ.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center mb-2">2</span>
              <h4 className="font-extrabold text-sm text-slate-900 font-['Lexend',sans-serif]">Luật 2 lần chạm đất (Two-Bounce Rule)</h4>
              <p className="text-xs text-slate-600 mt-1">Cả bên nhận giao bóng và bên giao bóng đều phải để bóng nảy 1 lần trên sân trước khi thực hiện cú đánh trả đầu tiên.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center mb-2">3</span>
              <h4 className="font-extrabold text-sm text-slate-900 font-['Lexend',sans-serif]">Vùng cấm bắt vô-lê (Kitchen / Non-Volley Zone)</h4>
              <p className="text-xs text-slate-600 mt-1">Khu vực 7ft (2.13m) mỗi bên lưới nghiêm cấm đánh bóng trên không (Volley) nếu chân chạm hoặc đứng trong vạch Kitchen.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center mb-2">4</span>
              <h4 className="font-extrabold text-sm text-slate-900 font-['Lexend',sans-serif]">Chỉ ghi điểm khi cầm giao bóng (Side-Out Scoring)</h4>
              <p className="text-xs text-slate-600 mt-1">Đội giao bóng thắng pha bóng (Rally) mới được cộng điểm. Nếu phạm lỗi (Fault), quyền giao bóng sẽ đổi lượt sang đối phương.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center mb-2">5</span>
              <h4 className="font-extrabold text-sm text-slate-900 font-['Lexend',sans-serif]">Hô rõ tỷ số trước mỗi cú giao bóng</h4>
              <p className="text-xs text-slate-600 mt-1">Ở thể thức đánh đôi gồm 3 con số: Điểm bên giao - Điểm bên nhận - Số thứ tự người giao bóng (1 hoặc 2).</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center mb-2">6-7</span>
              <h4 className="font-extrabold text-sm text-slate-900 font-['Lexend',sans-serif]">Thi đấu đến 11 điểm, cách biệt tối thiểu 2 điểm</h4>
              <p className="text-xs text-slate-600 mt-1">Ván đấu kết thúc khi một bên đạt 11 điểm và dẫn trước tối thiểu 2 điểm so với đối thủ (Win by 2).</p>
            </div>
          </div>
        )}
      </section>

      {/* SECTION: TÍNH NĂNG NỔI BẬT (FEATURE HIGHLIGHTS) - Bố cục chuẩn thiết kế tham chiếu */}
      <section className="w-full max-w-7xl mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
          {/* CỘT 1: DUPR INTEGRATION */}
          <div className="flex flex-col h-full group">
            {/* 1. Khu vực Hình ảnh Mockup lơ lửng (Visual Area) */}
            <div className="h-72 relative flex items-center justify-center">
              {/* Hình SVG dạng khối nước (blob) màu xanh/lime nhạt làm nền */}
              <svg 
                viewBox="0 0 200 200" 
                className="absolute w-72 h-72 text-cyan-50/90 fill-current -z-0 opacity-90 scale-110 pointer-events-none transition-transform duration-300 group-hover:scale-115"
              >
                <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C86.9,14.6,81.2,29.1,72.6,41.9C64,54.7,52.5,65.8,39.3,72.7C26.1,79.6,11.2,82.4,-3.2,87.9C-17.6,93.4,-31.6,101.6,-43.8,97.3C-56,93,-66.4,76.2,-74.6,60.8C-82.8,45.4,-88.8,31.4,-90.7,16.8C-92.6,2.2,-90.4,-13,-84.6,-26.7C-78.8,-40.4,-69.4,-52.6,-57.4,-60.7C-45.4,-68.8,-30.8,-72.8,-16,-75.4C-1.2,-78,13.6,-79.2,28.4,-77.8C43.2,-76.4,58,-72.4,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>

              {/* Khung hình ảnh chất lượng cao trực tiếp (Cố định, không cho phép chỉnh sửa) */}
              <div 
                id="mockup-dupr-image-box"
                className={`relative ${imageRadius} overflow-hidden shadow-2xl border-2 border-slate-200/90 bg-white w-64 max-w-full z-10 select-none`}
              >
                {/* Vùng ảnh chính */}
                <div className={`relative ${imageHeight} w-full overflow-hidden bg-slate-100`}>
                  <img 
                    src={duprMockupImage} 
                    alt="Người chơi Pickleball" 
                    className={`w-full h-full object-${imageFit} ${getFilterClass()}`}
                  />

                  {/* Badge DUPR tích hợp */}
                  <div className="absolute bottom-2.5 right-2.5 bg-lime-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-lime-300 pointer-events-none">
                    <span>Gửi điểm lên DUPR</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Divider: Thẻ <hr> dày 2px, màu Xanh Lime */}
            <hr className="border-0 border-b-2 border-lime-400 my-6 w-full" />

            {/* 3. Nội dung Text */}
            <div className="flex-1 flex flex-col justify-between text-[15px] leading-[22.5px]">
              <div className="md:min-h-[10.5rem] flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 font-['Lexend',sans-serif] md:min-h-[4rem] flex items-start">
                  Tích hợp hệ thống DUPR
                </h3>
                <p className="text-slate-600 mt-3 mb-6 text-[15px] leading-[22.5px] md:min-h-[4.5rem] flex items-start">
                  Yêu cầu ID DUPR khi đăng ký tham gia. Sau buổi chơi, dễ dàng gửi điểm số lên hệ thống DUPR chỉ với một chạm.
                </p>
              </div>

              <ul className="space-y-3 pt-1 flex-1 flex flex-col justify-start">
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Yêu cầu ID DUPR khi đăng ký</span>
                </li>
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Gửi điểm số trực tiếp lên DUPR</span>
                </li>
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Tự động xác thực và cập nhật điểm</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 2: CHAT BUILT FOR PICKLEBALL */}
          <div className="flex flex-col h-full group">
            {/* 1. Khu vực Hình ảnh Mockup lơ lửng (Visual Area) */}
            <div className="h-72 relative flex items-center justify-center">
              {/* Hình SVG dạng khối nước (blob) màu xanh/lime nhạt làm nền */}
              <svg 
                viewBox="0 0 200 200" 
                className="absolute w-72 h-72 text-cyan-50/90 fill-current -z-0 opacity-90 scale-110 pointer-events-none transition-transform duration-300 group-hover:scale-115"
              >
                <path d="M49.2,-69.1C62.7,-61.7,71.7,-46.9,76.5,-31.2C81.3,-15.5,81.9,1.1,77.7,16.5C73.4,31.9,64.3,46,51.8,56.8C39.4,67.6,23.5,75,-0.6,75.9C-24.8,76.7,-49.6,71,-63.9,57.7C-78.2,44.4,-82.1,23.5,-80.7,4.3C-79.3,-14.9,-72.6,-32.4,-60.8,-45.5C-48.9,-58.5,-32,-67.2,-15.5,-71.2C1.1,-75.2,35.6,-76.5,49.2,-69.1Z" transform="translate(100 100)" />
              </svg>

              {/* Khung điện thoại iPhone: border dày màu Navy, bo góc rounded-[2.5rem] */}
              <div className="w-52 h-64 bg-white rounded-[2.5rem] border-[6px] border-slate-900 shadow-xl overflow-hidden relative flex flex-col justify-start p-2.5 pt-6 space-y-2 z-10 select-none">
                {/* Dynamic Island */}
                <div className="w-14 h-3 bg-slate-900 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2 z-20" />

                {/* Các dòng chat tiếng Việt */}
                {/* 1. Bong bóng bên phải: "Mọi người ơi, sân còn ướt không?" */}
                <div className="flex items-end justify-end gap-1">
                  <div className="bg-lime-400 text-slate-950 text-[8.5px] font-semibold px-2.5 py-1.5 rounded-2xl rounded-tr-none max-w-[78%] leading-tight shadow-2xs">
                    Mọi người ơi, sân còn ướt không?
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80" 
                    alt="Male Avatar" 
                    className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-slate-900"
                  />
                </div>

                {/* 2. Bong bóng bên trái: "Mình đang ở sân rồi - khô ráo đánh tốt nhé!" */}
                <div className="flex items-end justify-start gap-1">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" 
                    alt="Female Avatar" 
                    className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="bg-slate-100 text-slate-800 text-[8.5px] font-medium px-2.5 py-1.5 rounded-2xl rounded-tl-none max-w-[78%] leading-tight shadow-2xs">
                    Mình đang ở sân rồi - khô ráo đánh tốt nhé!
                  </div>
                </div>

                {/* 3. Bong bóng bên phải: "Ai mang thêm lưới dự phòng được không?" */}
                <div className="flex items-end justify-end gap-1">
                  <div className="bg-lime-400 text-slate-950 text-[8.5px] font-semibold px-2.5 py-1.5 rounded-2xl rounded-tr-none max-w-[78%] leading-tight shadow-2xs">
                    Ai mang thêm lưới dự phòng được không?
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80" 
                    alt="Male Avatar" 
                    className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-slate-900"
                  />
                </div>

                {/* 4. Bong bóng bên trái: "Mình đang tới rồi - có mang 1 lưới nhé!" */}
                <div className="flex items-end justify-start gap-1 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" 
                    alt="Male Avatar" 
                    className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="bg-slate-100 text-slate-800 text-[8.5px] font-medium px-2.5 py-1.5 rounded-2xl rounded-tl-none max-w-[78%] leading-tight shadow-2xs relative">
                    Mình đang tới rồi - có mang 1 lưới nhé!
                    <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full shadow-md p-0.5 border border-slate-200 flex items-center justify-center">
                      <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                    </div>
                  </div>
                </div>

                {/* 5. Bong bóng bên phải: "Tuyệt quá! Mình tới sau 10 phút nữa." */}
                <div className="flex items-end justify-end gap-1">
                  <div className="bg-lime-400 text-slate-950 text-[8.5px] font-semibold px-2.5 py-1.5 rounded-2xl rounded-tr-none max-w-[78%] leading-tight shadow-2xs">
                    Tuyệt quá! Mình tới sau 10 phút nữa.
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80" 
                    alt="Male Avatar" 
                    className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 2. Divider: Thẻ <hr> dày 2px, màu Xanh Lime */}
            <hr className="border-0 border-b-2 border-lime-400 my-6 w-full" />

            {/* 3. Nội dung Text */}
            <div className="flex-1 flex flex-col justify-between text-[15px] leading-[22.5px]">
              <div className="md:min-h-[10.5rem] flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 font-['Lexend',sans-serif] md:min-h-[4rem] flex items-start">
                  Trò chuyện trực tiếp
                </h3>
                <p className="text-slate-600 mt-3 mb-6 text-[15px] leading-[22.5px] md:min-h-[4.5rem] flex items-start">
                  Nhắn tin cho toàn bộ người chơi đã xác nhận, gửi tin nhắn trực tiếp (DM), hoặc thảo luận trong nhóm kèo đấu.
                </p>
              </div>

              <ul className="space-y-3 pt-1 flex-1 flex flex-col justify-start">
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Chat nhóm tích hợp tính năng admin</span>
                </li>
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Trò chuyện với tất cả người chơi trong kèo</span>
                </li>
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Nhắn tin trực tiếp (DM) cho bạn chơi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 3: PAYMENT COLLECTION */}
          <div className="flex flex-col h-full group">
            {/* 1. Khu vực Hình ảnh Mockup lơ lửng (Visual Area) */}
            <div className="h-72 relative flex items-center justify-center">
              {/* Hình SVG dạng khối nước (blob) màu xanh/lime nhạt làm nền */}
              <svg 
                viewBox="0 0 200 200" 
                className="absolute w-72 h-72 text-cyan-50/90 fill-current -z-0 opacity-90 scale-110 pointer-events-none transition-transform duration-300 group-hover:scale-115"
              >
                <path d="M47.8,-69.3C60.5,-61.8,68.4,-46.3,74.2,-30.5C80,-14.7,83.7,1.4,80.1,16.2C76.4,31,65.3,44.5,52.4,55.1C39.5,65.7,24.8,73.4,8.5,75.4C-7.8,77.3,-25.6,73.5,-39.8,64.5C-54,55.5,-64.5,41.2,-71.4,25.3C-78.3,9.4,-81.5,-8.1,-76.3,-23.1C-71,-38.1,-57.3,-50.7,-42.6,-57.7C-27.9,-64.7,-14,-66.1,1.5,-68.2C17,-70.3,35,-76.8,47.8,-69.3Z" transform="translate(100 100)" />
              </svg>

              {/* Bảng Form thanh toán (Mô phỏng Stripe) */}
              <div className="w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 relative z-10 select-none">
                {/* Top Tabs */}
                <div className="grid grid-cols-2 gap-1 mb-2">
                  <div className="text-[8px] font-bold text-slate-400 py-1 text-center rounded-lg border border-transparent">
                    Apple Pay
                  </div>
                  <div className="border border-slate-900 bg-slate-50 text-slate-900 rounded-lg text-[8px] font-bold py-1 px-1.5 flex items-center justify-center gap-1 shadow-2xs">
                    <CreditCard className="w-2.5 h-2.5 text-slate-900" />
                    <span>Thẻ</span>
                  </div>
                </div>

                {/* Card number */}
                <div className="mb-1.5">
                  <span className="text-[7.5px] font-bold text-slate-500 block mb-0.5">Số thẻ</span>
                  <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 flex items-center justify-between text-[8.5px] font-mono text-slate-800 shadow-2xs">
                    <span>1234 1234 1234 1234</span>
                    <div className="flex items-center gap-0.5 opacity-60">
                      <span className="text-[7px] font-black text-blue-700">VISA</span>
                      <div className="flex -space-x-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expiration & CVC */}
                <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                  <div>
                    <span className="text-[7.5px] font-bold text-slate-500 block mb-0.5">Hết hạn</span>
                    <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[8.5px] font-mono text-slate-400 shadow-2xs">
                      MM / YY
                    </div>
                  </div>
                  <div>
                    <span className="text-[7.5px] font-bold text-slate-500 block mb-0.5">CVC</span>
                    <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[8.5px] font-mono text-slate-400 shadow-2xs">
                      CVC
                    </div>
                  </div>
                </div>

                {/* Country Dropdown */}
                <div className="mb-2">
                  <span className="text-[7.5px] font-bold text-slate-500 block mb-0.5">Quốc gia</span>
                  <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 flex items-center justify-between text-[8.5px] text-slate-600 shadow-2xs">
                    <span>Việt Nam</span>
                    <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                  </div>
                </div>

                {/* Nút bấm to màu Xanh Navy: "Thanh toán & tham gia" */}
                <div className="w-full py-1.5 bg-slate-900 text-lime-400 hover:bg-slate-800 font-bold text-[9.5px] rounded-xl text-center shadow-md transition-colors">
                  Thanh toán & tham gia
                </div>
                <p className="text-[7px] text-slate-400 text-center font-medium mt-1">
                  Bảo mật bởi Stripe
                </p>
              </div>

              {/* Các thành phần lơ lửng bên ngoài Form (absolute, z-20, shadow-2xl) */}
              {/* Góc trái: Khối pill màu đen có icon logo Apple và chữ "Pay" */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-black text-white px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1 border border-slate-800 hover:scale-105 transition-transform duration-200">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.42-6-9.5-10.74-20.08-14.23-31.74-3.48-11.66-5.23-22.78-5.23-33.36 0-14.36 3.73-26.33 11.2-35.91 7.46-9.58 16.73-14.49 27.81-14.73 4.9.01 10.37 1.25 16.42 3.72 6.05 2.47 10.05 3.75 12 3.84 1.49 0 5.48-1.32 11.96-3.95 6.48-2.63 11.83-3.83 16.06-3.62 12.39.81 22.25 5.58 29.58 14.3-10.79 6.53-16.07 15.54-15.84 27.02.23 9.07 3.65 16.65 10.26 22.73 6.61 6.08 14.54 9.61 23.79 10.59-2.58 8.01-5.77 16.14-9.57 24.38zM119.22 31.84c0-7.39 2.65-14.3 7.95-20.73 5.3-6.43 11.89-10.42 19.78-11.97.94 7.61-1.39 14.88-6.99 21.8-5.6 6.92-12.51 11.22-20.74 12.9z"/>
                </svg>
                <span className="font-semibold text-xs tracking-tight">Pay</span>
              </div>

              {/* Góc phải trên: Khối pill viền xám, nền trắng có logo Google và chữ "Pay" */}
              <div className="absolute -right-3 top-2 z-20 bg-white text-slate-900 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xl flex items-center gap-1 font-bold text-xs hover:scale-105 transition-transform duration-200">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Pay</span>
              </div>

              {/* Cạnh phải (Xếp dọc): Một dãy các thẻ hình chữ nhật nhỏ đại diện icon */}
              <div className="absolute -right-5 bottom-3 z-20 flex flex-col gap-1">
                <div className="bg-[#006fcf] text-white font-black text-[7.5px] px-2 py-0.5 rounded shadow-md tracking-tighter text-center">
                  AMEX
                </div>
                <div className="bg-white border border-slate-200 text-[#1a1f71] font-black text-[8px] px-2 py-0.5 rounded shadow-md italic text-center">
                  VISA
                </div>
                <div className="bg-slate-900 text-white px-2 py-0.5 rounded shadow-md flex items-center justify-center gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 -ml-1.5 opacity-90" />
                </div>
                <div className="bg-white border border-slate-200 text-orange-600 font-bold text-[7px] px-1.5 py-0.5 rounded shadow-md text-center">
                  DISCOVER
                </div>
              </div>
            </div>

            {/* 2. Divider: Thẻ <hr> dày 2px, màu Xanh Lime */}
            <hr className="border-0 border-b-2 border-lime-400 my-6 w-full" />

            {/* 3. Nội dung Text */}
            <div className="flex-1 flex flex-col justify-between text-[15px] leading-[22.5px]">
              <div className="md:min-h-[10.5rem] flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 font-['Lexend',sans-serif] md:min-h-[4rem] flex items-start">
                  Thanh toán tiện lợi
                </h3>
                <p className="text-slate-600 mt-3 mb-6 text-[15px] leading-[22.5px] md:min-h-[4.5rem] flex items-start">
                  Thu tiền người chơi cho từng suất tham gia. Hoàn hảo cho các lớp tập luyện, giải đấu vòng tròn và giải phong trào.
                </p>
              </div>

              <ul className="space-y-3 pt-1 flex-1 flex flex-col justify-start">
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Hỗ trợ Apple Pay, Google Pay và thẻ</span>
                </li>
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Xử lý hoàn tiền tự động theo chính sách</span>
                </li>
                <li className="flex items-start gap-3 md:min-h-[48px]">
                  <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" />
                  <span className="text-[15px] font-semibold text-slate-800 leading-[22.5px]">Lưu phương thức thanh toán cho các lần sau</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Newly Opened Courts Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Lexend',sans-serif]">
                Cụm Sân Nổi Bật & Mới Mở
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-800 text-xs font-bold">
                Hot tại TP.HCM
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Các cụm sân đạt chuẩn thi đấu, hỗ trợ giữ chỗ và cọc tự động
            </p>
          </div>
          <button
            onClick={() => onNavigate(2)}
            className="text-xs font-bold text-lime-600 hover:text-lime-700 flex items-center gap-1 hover:underline"
          >
            <span>Xem tất cả trên Bản đồ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURTS_DATA.slice(0, 4).map((court) => (
            <div
              key={court.id}
              onClick={() => onNavigate(2)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={court.image}
                  alt={court.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  {court.isPopular && (
                    <span className="px-2 py-0.5 bg-lime-400 text-slate-950 text-[10px] font-black uppercase rounded-md shadow">
                      Phổ biến
                    </span>
                  )}
                  {court.isNew && (
                    <span className="px-2 py-0.5 bg-cyan-400 text-slate-950 text-[10px] font-black uppercase rounded-md shadow">
                      Mới mở
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md rounded-lg text-white text-[11px] font-bold flex items-center gap-1 z-10">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{court.rating} ({court.reviewCount})</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-lime-600 transition-colors line-clamp-1">
                    {court.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{court.address}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {court.amenities.slice(0, 2).map((am, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-black border border-slate-200">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Giá từ</span>
                    <span className="text-sm font-extrabold text-lime-600">
                      {court.pricePerHour.toLocaleString('vi-VN')} đ<span className="text-xs font-normal text-slate-500">/h</span>
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(2);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-lime-500 hover:text-slate-950 text-white text-xs font-bold transition-colors"
                  >
                    Xem Lịch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner with PickleMate Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border border-emerald-500/30 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>DÀNH CHO CHỦ SÂN PICKLEBALL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Tối ưu công suất lấp đầy sân & Quản lý đặt chỗ tự động 100%
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Gia nhập nền tảng PickleMate để tiếp cận hơn 50.000 người chơi, nhận cọc VietQR tự động, quản lý lịch trống và check-in QR siêu tốc không lo trùng giờ.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate(13)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg hover:shadow-lime-400/20 flex items-center justify-center gap-2"
            >
              <span>ĐĂNG KÝ CHỦ SÂN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Toast thông báo cập nhật ảnh */}
      {imageToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-lime-400/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-7 h-7 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-black">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-lime-300">{imageToast}</p>
        </div>
      )}

      {/* Modal Tùy Chỉnh & Định Dạng Hình Ảnh */}
      {showImageModal && (
        <div 
          id="image-customizer-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 p-6 sm:p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950 font-['Lexend',sans-serif]">
                    Tùy chỉnh & Định dạng Hình ảnh
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Thay đổi nguồn ảnh, tải ảnh cá nhân và điều chỉnh định dạng hiển thị cho mockup
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 pt-5">
              {/* VÙNG 1: TẢI ẢNH LÊN HOẶC DÙNG LINK */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-lime-600" />
                  <span>1. Nguồn hình ảnh mới</span>
                </h4>

                {/* Drag & Drop Upload Zone */}
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-lime-500 bg-lime-50' 
                      : 'border-slate-200 hover:border-lime-400 hover:bg-slate-50/80 bg-slate-50/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-700">
                    <Upload className="w-5 h-5 text-lime-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Kéo thả ảnh vào đây hoặc <span className="text-lime-600 underline">chọn từ thiết bị</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hỗ trợ định dạng JPG, PNG, WEBP, GIF (Khuyến nghị tỷ lệ 4:3 hoặc 16:9)
                  </p>
                </div>

                {/* Hoặc dán liên kết URL */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="Hoặc dán URL hình ảnh trực tiếp (https://...)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-lime-500 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applyCustomUrl();
                    }}
                  />
                  <button
                    type="button"
                    onClick={applyCustomUrl}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shrink-0 transition-colors cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* VÙNG 2: 6 ẢNH MẪU PICKLEBALL CÓ SẴN */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-lime-600" />
                  <span>2. Hoặc chọn nhanh từ bộ sưu tập mẫu</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pickleballPresets.map((preset) => {
                    const isSelected = duprMockupImage === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          setDuprMockupImage(preset.url);
                          saveImageChanges({ url: preset.url });
                        }}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-lime-500 shadow-md ring-2 ring-lime-400/30' 
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="h-20 w-full overflow-hidden bg-slate-100">
                          <img 
                            src={preset.url} 
                            alt={preset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-[11px] font-bold text-slate-900 truncate">{preset.title}</p>
                          <p className="text-[9px] text-slate-400 truncate">{preset.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VÙNG 3: ĐỊNH DẠNG VÀ BỐ CỤC HIỂN THỊ */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-lime-600" />
                  <span>3. Tùy chỉnh định dạng hiển thị</span>
                </h4>

                {/* 1. Chế độ cắt vừa (Object Fit) */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Chế độ căn chỉnh hình ảnh (Object Fit):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'cover', label: 'Cắt vừa khung (Cover)' },
                      { key: 'contain', label: 'Đầy đủ ảnh (Contain)' },
                      { key: 'fill', label: 'Co giãn (Fill)' },
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setImageFit(mode.key as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          imageFit === mode.key
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Chiều cao khung ảnh (Height) */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Kích thước / Chiều cao khung ảnh:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'h-28', label: 'Chuẩn (112px)' },
                      { key: 'h-32', label: 'Vừa (128px)' },
                      { key: 'h-36', label: 'Rộng (144px)' },
                    ].map((height) => (
                      <button
                        key={height.key}
                        type="button"
                        onClick={() => setImageHeight(height.key as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          imageHeight === height.key
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {height.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Độ bo góc (Corner Radius) */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Độ bo tròn góc ảnh:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'rounded-xl', label: 'Bo góc vừa (12px)' },
                      { key: 'rounded-2xl', label: 'Bo góc lớn (16px)' },
                      { key: 'rounded-lg', label: 'Bo góc nhỏ (8px)' },
                    ].map((radius) => (
                      <button
                        key={radius.key}
                        type="button"
                        onClick={() => setImageRadius(radius.key as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          imageRadius === radius.key
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {radius.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Bộ lọc sắc thái màu (Color Filters) */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Bộ lọc màu sắc (Filter Tone):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'none', label: 'Tự nhiên (Gốc)' },
                      { key: 'vibrant', label: 'Sống động' },
                      { key: 'warm', label: 'Tông ấm áp' },
                      { key: 'sharp', label: 'Sắc nét cao' },
                    ].map((flt) => (
                      <button
                        key={flt.key}
                        type="button"
                        onClick={() => setImageFilter(flt.key as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          imageFilter === flt.key
                            ? 'bg-lime-400 text-slate-950 border-lime-500 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {flt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* VÙNG 4: XEM TRƯỚC THỜI GIAN THỰC (LIVE PREVIEW) */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-lime-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Xem trước định dạng áp dụng</span>
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {imageFit.toUpperCase()} • {imageHeight.replace('h-', '')} • {imageRadius.replace('rounded-', '')} • {imageFilter}
                  </p>
                </div>
                <div className={`w-28 ${imageHeight} ${imageRadius} overflow-hidden border-2 border-lime-400/80 shadow-lg shrink-0`}>
                  <img 
                    src={duprMockupImage} 
                    alt="Preview" 
                    className={`w-full h-full object-${imageFit} ${getFilterClass()}`}
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem(STORAGE_KEY);
                  } catch (e) {
                    console.error('Failed to clear storage:', e);
                  }
                  setIsSaved(false);
                  setDuprMockupImage(defaultDuprImage);
                  setImageFit('cover');
                  setImageHeight('h-28');
                  setImageRadius('rounded-xl');
                  setImageFilter('none');
                  setImageToast('Đã khôi phục ảnh & định dạng gốc!');
                  setTimeout(() => setImageToast(null), 3000);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Khôi phục mặc định</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveImageChanges();
                    setShowImageModal(false);
                  }}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu hình ảnh & Hoàn tất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

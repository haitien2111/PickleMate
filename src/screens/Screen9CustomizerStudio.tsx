import React, { useState } from 'react';
import { ScreenId, Paddle, CustomLaserSettings } from '../types';
import rpmCottonCandyNewImg from '../assets/images/paddles/rpm_cotton_candy_new.svg';
import joolaPerseusImg from '../assets/images/paddles/joola_perseus.svg';
import selkirkInviktaImg from '../assets/images/paddles/selkirk_invikta.svg';
import crbn1xImg from '../assets/images/paddles/crbn_1x.svg';
import franklinProImg from '../assets/images/paddles/franklin_pro.svg';
import engagePursuitImg from '../assets/images/paddles/engage_pursuit.svg';
import honoluluJ2kImg from '../assets/images/paddles/honolulu_j2k.svg';
import zockerAspireImg from '../assets/images/paddles/zocker_aspire.svg';
import { 
  ChevronLeft, ArrowRight, Check, CheckCircle2, Upload, 
  ShoppingCart, Truck, ShieldCheck, AlertTriangle, 
  CreditCard, Wallet, QrCode, Building2, Package, Sparkles,
  Sliders, CheckCircle, RotateCcw, MapPin, Phone, Clock, Home,
  XCircle, Copy, Layers, ChevronRight, Zap, Award, Star, Smartphone,
  Camera, UploadCloud
} from 'lucide-react';

interface StoreProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  level: string;
  imageUrl: string;
  specs: string;
}

const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'store-paddle-1',
    name: 'RPM Q2 Cotton Candy Limited Edition',
    brand: 'RPM',
    price: 3300000,
    originalPrice: 4200000,
    discountBadge: '-21%',
    level: 'Trung cấp (DUPR 3.0 - 4.0)',
    imageUrl: rpmCottonCandyNewImg,
    specs: 'Lõi Honeycomb 16mm • Trọng lượng 228g • Mặt Carbon Toray T700 Spin',
  },
  {
    id: 'store-paddle-2',
    name: 'Vợt Joola Ben Johns Perseus CFS 16mm Swift',
    brand: 'Joola',
    price: 4890000,
    originalPrice: 5750000,
    discountBadge: '-15%',
    level: 'Chuyên nghiệp (DUPR 4.0+)',
    imageUrl: joolaPerseusImg,
    specs: 'Charged Carbon Surface • Hyperfoam Edge Wall • PPA Pro',
  },
  {
    id: 'store-paddle-3',
    name: 'Vợt Selkirk Vanguard Power Air Invikta Pro',
    brand: 'Selkirk',
    price: 4950000,
    originalPrice: 5820000,
    discountBadge: '-15%',
    level: 'Chuyên nghiệp (DUPR 4.0+)',
    imageUrl: selkirkInviktaImg,
    specs: 'Air Dynamic Throat • ProSpin+ Texture • Lỗ khí động học',
  },
  {
    id: 'store-paddle-4',
    name: 'Vợt CRBN 1X Power Series 16mm Elongated',
    brand: 'CRBN',
    price: 4250000,
    originalPrice: 5180000,
    discountBadge: '-18%',
    level: 'Trung cấp (DUPR 3.0 - 4.0)',
    imageUrl: crbn1xImg,
    specs: 'Unibody Design • Foamed Edge Rails • Sức mạnh tối ưu',
  },
  {
    id: 'store-paddle-5',
    name: 'Vợt Franklin Sports Signature Pro PolyCore 13mm',
    brand: 'Franklin',
    price: 1850000,
    originalPrice: 2310000,
    discountBadge: '-20%',
    level: 'Mới bắt đầu (DUPR 2.0 - 3.0)',
    imageUrl: franklinProImg,
    specs: 'Polypropylene Honeycomb Core • MaxGrit Surface • Newbie',
  },
  {
    id: 'store-paddle-6',
    name: 'Vợt Engage Pursuit Pro EX 6.0 Control Master',
    brand: 'Engage',
    price: 3950000,
    originalPrice: 4650000,
    discountBadge: '-15%',
    level: 'Trung cấp (DUPR 3.0 - 4.0)',
    imageUrl: engagePursuitImg,
    specs: 'MachPro Polymer Core • Raw Toray T700 • Kiểm soát bóng',
  },
  {
    id: 'store-paddle-7',
    name: 'Vợt Honolulu J2K Carbon Pro 16mm Hybrid',
    brand: 'Honolulu',
    price: 3600000,
    originalPrice: 4200000,
    discountBadge: '-14%',
    level: 'Trung cấp (DUPR 3.0 - 4.0)',
    imageUrl: honoluluJ2kImg,
    specs: 'Raw Toray T700 • Viền bảo vệ Teal • Họa tiết sóng Hawaii',
  },
  {
    id: 'store-paddle-8',
    name: 'Vợt Zocker Aspire Speed Pro 16mm Graphite',
    brand: 'Zocker',
    price: 2150000,
    originalPrice: 2600000,
    discountBadge: '-17%',
    level: 'Mới bắt đầu (DUPR 2.0 - 3.0)',
    imageUrl: zockerAspireImg,
    specs: 'Mặt vợt sợi Graphite cao cấp • Điểm ngọt rộng • Tốc độ linh hoạt',
  },
];

interface Screen9CustomizerStudioProps {
  paddle?: Paddle;
  onNavigate: (screen: ScreenId) => void;
  onUpdateCustomization: (settings: CustomLaserSettings) => void;
  onRestrictedAction?: (action: () => void, prompt?: string) => void;
}

export const Screen9CustomizerStudio: React.FC<Screen9CustomizerStudioProps> = ({
  paddle,
  onNavigate,
  onUpdateCustomization,
  onRestrictedAction,
}) => {
  // Step Navigation:
  // 1: Chọn nguồn cung cấp vợt
  // 2: Cửa hàng vợt PickleMate (khi chọn Mua mới)
  // 3: Thiết kế vợt (Visual Customizer)
  // 4: Thanh toán (Checkout) & Theo dõi tiến độ
  // 'all': Chế độ toàn cảnh
  const [activeStepTab, setActiveStepTab] = useState<1 | 2 | 3 | 4 | 'all'>(2);

  // Bước 1: Nguồn cung cấp vợt ('picklemate': Mua mới | 'existing': Sử dụng vợt hiện có)
  const [paddleSource, setPaddleSource] = useState<'picklemate' | 'existing'>('picklemate');
  const [customUserPaddleModel, setCustomUserPaddleModel] = useState<string>('Joola Hyperion CFS 16mm Swift');

  // Bước 2: Cửa hàng vợt PickleMate (Quản lý state cho phép upload thay đổi ảnh trực tiếp trên UI)
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(STORE_PRODUCTS);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct>(STORE_PRODUCTS[0]);

  // Xử lý upload ảnh thay thế trực tiếp trên UI (Dành cho Prototype)
  const handleProductImageUpload = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Sử dụng URL.createObjectURL(file) để tạo link ảnh tạm thời
    const tempUrl = URL.createObjectURL(file);

    // Cập nhật lại imageUrl trong state của sản phẩm đó
    setStoreProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, imageUrl: tempUrl } : p
      )
    );

    // Đồng bộ ngay lập tức nếu sản phẩm này đang được chọn
    setSelectedProduct((prev) => {
      if (prev.id === productId) {
        return { ...prev, imageUrl: tempUrl };
      }
      return prev;
    });

    // Reset input value để cho phép chọn lại cùng một file nếu muốn
    e.target.value = '';
  };

  // Bước 3: Visual Customizer
  const [engravedText, setEngravedText] = useState<string>('ANNA LEE');
  const [jerseyNumber, setJerseyNumber] = useState<string>('07');
  const [signatureUploaded, setSignatureUploaded] = useState<boolean>(false);
  const [selectedLogo, setSelectedLogo] = useState<'none' | 'lightning' | 'eagle' | 'star' | 'pickleball'>('lightning');
  const [selectedFont, setSelectedFont] = useState<'Sport Bold' | 'Elegant Script' | 'Modern Sans' | 'Tech Mono'>('Sport Bold');
  const [fontSize, setFontSize] = useState<number>(24);
  const [engravePosition, setEngravePosition] = useState<'bottom-right' | 'center' | 'side-edge' | 'neck'>('bottom-right');
  const [laserFinish, setLaserFinish] = useState<'silver' | 'gold' | 'neon'>('silver');

  // Bước 4: Thanh toán (Checkout) & Giả lập
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'vnpay' | 'zalopay' | 'vietqr' | 'wallet'>('vietqr');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [simulationScenario, setSimulationScenario] = useState<'success' | 'failed'>('success');
  const [orderCode, setOrderCode] = useState<string>('#PM-LASER-8829');
  const [isCopiedOrderCode, setIsCopiedOrderCode] = useState<boolean>(false);
  const [trackingStep, setTrackingStep] = useState<number>(1); // 1: Đã tiếp nhận -> 2: Đang khắc -> 3: Đóng gói -> 4: Đang giao -> 5: Hoàn thành
  const [isReceiptConfirmed, setIsReceiptConfirmed] = useState<boolean>(false);

  // Bảng chi phí tổng kết
  const laserEngraveFee = 80000;
  const paddlePrice = paddleSource === 'picklemate' ? selectedProduct.price : 0;
  const shippingFee = paddleSource === 'picklemate' && paddlePrice > 2000000 ? 0 : 30000;
  const totalAmount = paddlePrice + laserEngraveFee + shippingFee;

  // Lọc sản phẩm cửa hàng (dựa trên state storeProducts có thể cập nhật ảnh)
  const filteredProducts = storeProducts.filter((prod) => {
    if (selectedBrand !== 'all' && prod.brand !== selectedBrand) return false;
    if (selectedPriceRange === 'under-2.5m' && prod.price >= 2500000) return false;
    if (selectedPriceRange === '2.5m-4.5m' && (prod.price < 2500000 || prod.price > 4500000)) return false;
    if (selectedPriceRange === 'over-4.5m' && prod.price <= 4500000) return false;
    if (selectedLevel !== 'all' && prod.level !== selectedLevel) return false;
    return true;
  });

  // Chuyển tab mượt mà
  const handleSwitchTab = (tab: 1 | 2 | 3 | 4 | 'all') => {
    setActiveStepTab(tab);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Bước 1 -> Lựa chọn A: Mua vợt mới -> Chuyển sang Bước 2 (Cửa hàng)
  const handleSelectOptionA = () => {
    setPaddleSource('picklemate');
    setActiveStepTab(2);
  };

  // Bước 1 -> Lựa chọn B: Sử dụng vợt hiện có -> Bỏ qua cửa hàng, chuyển thẳng Bước 3 (Visual Customizer)
  const handleSelectOptionB = () => {
    setPaddleSource('existing');
    setActiveStepTab(3);
  };

  // Bước 2: Chọn vợt từ cửa hàng -> Chuyển sang Bước 3 (Thiết kế vợt)
  const handleSelectStoreProduct = (prod: StoreProduct) => {
    setSelectedProduct(prod);
    setPaddleSource('picklemate');
    setActiveStepTab(3);
  };

  // Bước 3: Xác nhận thiết kế & Chuyển đến thanh toán
  const handleConfirmDesign = () => {
    onUpdateCustomization({
      enabled: true,
      text: `${engravedText} ${jerseyNumber ? `#${jerseyNumber}` : ''}`,
      font: selectedFont,
      position: engravePosition,
      fontSize,
      laserStyle: laserFinish,
      overwrapColor: 'Lime Neon',
    });
    setActiveStepTab(4);
  };

  // Bước 4: Xử lý thanh toán giả lập
  const handleCompletePayment = () => {
    const doPayment = () => {
      setOrderStatus('processing');
      setTimeout(() => {
        if (simulationScenario === 'success') {
          setOrderStatus('success');
          setTrackingStep(1);
        } else {
          setOrderStatus('failed');
        }
      }, 700);
    };

    if (onRestrictedAction) {
      onRestrictedAction(doPayment, 'Vui lòng đăng nhập để xác nhận đơn & thanh toán');
    } else {
      doPayment();
    }
  };

  // Thử lại thanh toán khi thất bại
  const handleRetryPayment = () => {
    setOrderStatus('idle');
  };

  // Đổi phương thức thanh toán khác khi thất bại
  const handleChangePaymentMethod = (method?: 'momo' | 'vnpay' | 'zalopay' | 'vietqr' | 'wallet') => {
    if (method) {
      setPaymentMethod(method);
    }
    setOrderStatus('idle');
  };

  // Sao chép mã theo dõi đơn hàng
  const handleCopyOrderCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(orderCode);
      setIsCopiedOrderCode(true);
      setTimeout(() => setIsCopiedOrderCode(false), 2000);
    }
  };

  // Helper font class
  const getFontFamily = () => {
    switch (selectedFont) {
      case 'Sport Bold':
        return 'font-black tracking-wider uppercase font-["Lexend",sans-serif]';
      case 'Elegant Script':
        return 'font-serif italic tracking-wide';
      case 'Tech Mono':
        return 'font-mono font-bold tracking-widest';
      case 'Modern Sans':
      default:
        return 'font-sans font-bold tracking-normal';
    }
  };

  // Helper vị trí khắc trên mặt vợt preview
  const getPositionStyles = () => {
    switch (engravePosition) {
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center';
      case 'side-edge':
        return 'top-1/2 right-4 -translate-y-1/2 rotate-90 origin-center text-right';
      case 'neck':
        return 'bottom-5 left-1/2 -translate-x-1/2 text-center';
      case 'bottom-right':
      default:
        return 'bottom-7 right-6 text-right';
    }
  };

  // 5 bước quy trình theo dõi trạng thái đơn hàng
  const TRACKING_STAGES = [
    { step: 1, title: 'Đã tiếp nhận', time: '10:15 - Hôm nay', desc: 'Kiểm duyệt cấu hình thiết kế hợp lệ' },
    { step: 2, title: 'Đang khắc', time: '11:30 - Hôm nay', desc: 'Laser sợi quang 0.01mm Toray T700' },
    { step: 3, title: 'Đóng gói', time: 'Dự kiến 14:00', desc: 'Kiểm định chất lượng & hút chân không' },
    { step: 4, title: 'Đang giao', time: 'Dự kiến 16:30', desc: 'Hỏa tốc Express 2h nội thành' },
    { step: 5, title: 'Hoàn thành', time: 'Dự kiến 18:00', desc: 'Bàn giao khách hàng & kích hoạt bảo hành' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Thanh điều hướng nhanh quy trình Custom Studio & Cửa hàng vợt */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="tab-btn-step-1"
            onClick={() => handleSwitchTab(1)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStepTab === 1
                ? 'bg-slate-900 text-lime-400 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Nguồn vợt</span>
          </button>

          <button
            id="tab-btn-step-2"
            onClick={() => handleSwitchTab(2)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStepTab === 2
                ? 'bg-slate-900 text-lime-400 shadow-sm ring-2 ring-lime-400/30'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center text-[10px] font-black">2</span>
            <span>Cửa Hàng Vợt PickleMate</span>
          </button>

          <button
            id="tab-btn-step-3"
            onClick={() => handleSwitchTab(3)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStepTab === 3
                ? 'bg-slate-900 text-lime-400 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">3</span>
            <span>Visual Customizer</span>
          </button>

          <button
            id="tab-btn-step-4"
            onClick={() => handleSwitchTab(4)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStepTab === 4
                ? 'bg-slate-900 text-lime-400 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">4</span>
            <span>Thanh toán & Theo dõi</span>
          </button>
        </div>

        <button
          id="tab-btn-step-all"
          onClick={() => handleSwitchTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeStepTab === 'all'
              ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Xem toàn cảnh 4 bước</span>
        </button>
      </div>
      {/* =========================================================================
          BƯỚC 1: TRANG CHỌN NGUỒN CUNG CẤP VỢT
          ========================================================================= */}
      {(activeStepTab === 'all' || activeStepTab === 1) && (
        <section 
          id="step-1-source" 
          className="space-y-6 pt-2 scroll-mt-28"
        >
          {/* 2 LỰA CHỌN DẠNG THẺ (CARD) LỚN, TRỰC QUAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LỰA CHỌN A: MUA VỢT MỚI TRÊN PICKLEMATE / MUA TỪ PICKLE-TRADE */}
            <div
              onClick={handleSelectOptionA}
              className={`p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-300 relative flex flex-col justify-between border-2 group hover:shadow-xl ${
                paddleSource === 'picklemate'
                  ? 'border-lime-500 bg-gradient-to-br from-lime-50/60 to-white shadow-lg ring-2 ring-lime-400/30'
                  : 'border-slate-200 bg-white hover:border-lime-400 shadow-sm'
              }`}
            >
              {paddleSource === 'picklemate' && (
                <div className="absolute top-5 right-5 text-slate-950 bg-lime-400 rounded-full p-1.5 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-['Lexend',sans-serif] mt-0.5">
                      Mua vợt mới trên PickleMate / Mua từ Pickle-Trade
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lựa chọn từ kho vợt chính hãng 100% (Zocker, Joola, Selkirk, CRBN...) hoặc vợt tuyển chọn từ sàn Pickle-Trade. Vợt mới được đưa trực tiếp vào buồng Laser Lab ngay sau khi xuất kho.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bảo hành chính hãng 100% & Kiểm định bề mặt Toray Carbon</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Miễn phí vận chuyển nội thành cho đơn hàng từ 2.000.000 đ</span>
                  </div>
                </div>

                {/* Vợt hiện đang chọn nếu có */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mẫu gợi ý sẵn có:</span>
                  <strong className="text-slate-900 font-bold">{selectedProduct.name}</strong>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOptionA();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-lime-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm group-hover:bg-lime-400 group-hover:text-slate-950"
                >
                  <span>Khám phá Cửa Hàng Vợt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LỰA CHỌN B: SỬ DỤNG VỢT HIỆN CÓ CỦA BẠN */}
            <div
              onClick={handleSelectOptionB}
              className={`p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-300 relative flex flex-col justify-between border-2 group hover:shadow-xl ${
                paddleSource === 'existing'
                  ? 'border-lime-500 bg-gradient-to-br from-lime-50/60 to-white shadow-lg ring-2 ring-lime-400/30'
                  : 'border-slate-200 bg-white hover:border-lime-400 shadow-sm'
              }`}
            >
              {paddleSource === 'existing' && (
                <div className="absolute top-5 right-5 text-slate-950 bg-lime-400 rounded-full p-1.5 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-['Lexend',sans-serif] mt-0.5">
                      Sử dụng vợt hiện có của bạn
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Gửi cây vợt bạn đang sử dụng đến xưởng Pickle-Custom Lab hoặc mang trực tiếp tới trạm ký gửi Pick-Station. Hệ thống sẽ bỏ qua cửa hàng và chuyển thẳng tới trang thiết kế.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Sparkles className="w-4 h-4 text-lime-600 shrink-0" />
                    <span>Giá vợt: <strong>0 VNĐ</strong> • Chỉ thanh toán phí khắc Laser 80.000 VNĐ</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Clock className="w-4 h-4 text-lime-600 shrink-0" />
                    <span>Thời gian gia công hỏa tốc hoàn tất trong 24 giờ</span>
                  </div>
                </div>

                {/* Nhập tên dòng vợt khách đang có */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5 text-xs">
                  <label className="text-slate-600 font-bold block">
                    Nhập tên dòng vợt hiện tại của bạn:
                  </label>
                  <input
                    type="text"
                    value={customUserPaddleModel}
                    onChange={(e) => setCustomUserPaddleModel(e.target.value)}
                    placeholder="VD: Joola Hyperion CFS 16mm, Selkirk..."
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-xs focus:border-lime-500 outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOptionB();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Bỏ qua cửa hàng & Thiết kế ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          BƯỚC 2: TRANG CỬA HÀNG VỢT PICKLEMATE (CHỈ KHI CHỌN LỰA CHỌN A Ở BƯỚC 1)
          ========================================================================= */}
      {(activeStepTab === 'all' || activeStepTab === 2) && (
        <section 
          id="step-2-store" 
          className="space-y-6 pt-2 scroll-mt-28"
        >
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                Trang Cửa Hàng Vợt PickleMate
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                (Chỉ khả dụng khi chọn Lựa chọn A: Mua vợt mới). Chọn cây vợt bạn ưng ý để bắt đầu cá nhân hóa.
              </p>
            </div>

            <button
              onClick={() => handleSwitchTab(1)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Đổi sang dùng vợt hiện có</span>
            </button>
          </div>

          {/* Bộ lọc sản phẩm */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-slate-700">Bộ lọc:</span>
            
            {/* Thương hiệu */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-1.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">Tất cả thương hiệu</option>
              <option value="RPM">RPM</option>
              <option value="Honolulu">Honolulu</option>
              <option value="Zocker">Zocker</option>
              <option value="Joola">Joola</option>
              <option value="Selkirk">Selkirk</option>
              <option value="CRBN">CRBN</option>
              <option value="Franklin">Franklin</option>
              <option value="Engage">Engage</option>
            </select>

            {/* Khoảng giá */}
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-3 py-1.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">Mọi mức giá</option>
              <option value="under-2.5m">Dưới 2.500.000 đ</option>
              <option value="2.5m-4.5m">Từ 2.500.000 - 4.500.000 đ</option>
              <option value="over-4.5m">Trên 4.500.000 đ</option>
            </select>

            {/* Trình độ */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">Tất cả trình độ DUPR</option>
              <option value="Mới bắt đầu (DUPR 2.0 - 3.0)">Mới bắt đầu (DUPR 2.0 - 3.0)</option>
              <option value="Trung cấp (DUPR 3.0 - 4.0)">Trung cấp (DUPR 3.0 - 4.0)</option>
              <option value="Chuyên nghiệp (DUPR 4.0+)">Chuyên nghiệp (DUPR 4.0+)</option>
            </select>

            <span className="ml-auto text-slate-500 font-medium">
              Tìm thấy <strong>{filteredProducts.length}</strong> mẫu vợt
            </span>
          </div>

          {/* DANH SÁCH SẢN PHẨM VỢT DẠNG LƯỚI (GRID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const isSelected = selectedProduct.id === prod.id && paddleSource === 'picklemate';
              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative group ${
                    isSelected 
                      ? 'border-2 border-lime-500 ring-2 ring-lime-400/30 shadow-md' 
                      : 'border-slate-200'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-20 bg-lime-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Đang chọn</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Image Header: Khối nền xám chứa ảnh vợt của từng Thẻ Sản Phẩm với Overlay Upload */}
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group/image-header">
                      {/* Thẻ ảnh vợt */}
                      <img
                        id={`paddle-store-img-${prod.id}`}
                        src={prod.imageUrl}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/image-header:scale-105"
                      />

                      {/* Badge giảm giá (Nền Đỏ, chữ Trắng) - Đặt z-20 để không bị lớp Overlay che khuất */}
                      <span className="absolute top-3 left-3 z-20 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs pointer-events-none select-none">
                        {prod.discountBadge}
                      </span>

                      {/* Lớp Overlay Tương tác: Nền đen mờ 40% (bg-black/40) hiện ra khi người dùng di chuột vào (hover) */}
                      <label
                        htmlFor={`file-input-${prod.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover/image-header:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-white"
                        title="Thay đổi hình ảnh vợt"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 flex items-center justify-center text-white shadow-md transform transition-transform duration-200 hover:scale-110">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-bold text-white tracking-wide drop-shadow-sm select-none">
                          Thay đổi hình ảnh
                        </span>
                        <span className="text-[10px] text-white/90 font-medium bg-black/30 px-2 py-0.5 rounded-full select-none">
                          Tải ảnh từ máy tính
                        </span>
                      </label>

                      {/* Thẻ input file ẩn được trigger khi người dùng click vào Overlay */}
                      <input
                        id={`file-input-${prod.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleProductImageUpload(prod.id, e)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Thông tin vợt */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {prod.brand} • {prod.level}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mt-0.5 font-['Lexend',sans-serif]">
                        {prod.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {prod.specs}
                      </p>
                    </div>

                    {/* Giá tiền */}
                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-base sm:text-lg font-black text-slate-900 font-['Lexend',sans-serif]">
                          {prod.price.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-xs text-slate-400 line-through ml-2">
                          {prod.originalPrice.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* NÚT: "Chọn & Cá nhân hóa ngay" (kèm chú thích phí khắc: 80.000 VNĐ) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Phí khắc Laser:</span>
                      <strong className="text-lime-700 bg-lime-100 px-2 py-0.5 rounded font-black">
                        +80.000 VNĐ
                      </strong>
                    </div>

                    <button
                      onClick={() => handleSelectStoreProduct(prod)}
                      className="w-full py-3 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-lime-400/20 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Chọn & Cá nhân hóa ngay</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          BƯỚC 3: TRANG THIẾT KẾ VỢT (VISUAL CUSTOMIZER)
          (Chia đôi màn hình Split-screen + Real-time preview + Bảng chi phí)
          ========================================================================= */}
      {(activeStepTab === 'all' || activeStepTab === 3) && (
        <section 
          id="step-3-customizer" 
          className="space-y-6 pt-2 scroll-mt-28"
        >
          {/* Section Heading */}
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                Trang Thiết Kế Vợt (Visual Customizer)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Đang cấu hình khắc laser cho:{' '}
                <strong className="text-slate-900">
                  {paddleSource === 'picklemate' ? selectedProduct.name : customUserPaddleModel}
                </strong>{' '}
                ({paddleSource === 'picklemate' ? 'Mua mới trên PickleMate' : 'Vợt hiện có của bạn'})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSwitchTab(paddleSource === 'picklemate' ? 2 : 1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Quay lại {paddleSource === 'picklemate' ? 'Cửa Hàng' : 'Chọn Nguồn Vợt'}</span>
              </button>
            </div>
          </div>

          {/* BỐ CỤC CHIA ĐÔI MÀN HÌNH (SPLIT SCREEN) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ===================================================================
                BÊN TRÁI (PREVIEW): HIỂN THỊ MÔ PHỎNG CÂY VỢT REAL-TIME
                =================================================================== */}
            <div className="lg:col-span-6 bg-slate-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col items-center justify-between shadow-2xl relative overflow-hidden border-2 border-slate-800 min-h-[580px]">
              
              {/* Background ambient lighting */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-lime-500/10 to-transparent pointer-events-none"></div>
              
              {/* Top status of paddle preview */}
              <div className="w-full flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse"></span>
                  <span className="font-mono text-lime-400 font-bold uppercase tracking-wider text-[11px]">
                    Live Simulation 1:1
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                  Mặt Carbon Toray T700
                </span>
              </div>

              {/* REAL-TIME PADDLE GRAPHIC CANVAS */}
              <div className="my-6 relative flex flex-col items-center justify-center w-full max-w-[340px] select-none">
                
                {/* Paddle Head */}
                <div className="w-64 sm:w-72 h-80 sm:h-88 rounded-[44px] bg-gradient-to-b from-[#181d24] via-[#0f1318] to-[#1a1f26] border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4">
                  
                  {/* Toray Carbon Texture Pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none"></div>

                  {/* Brand subtle watermark top */}
                  <div className="relative z-10 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 pt-1">
                    <span>{paddleSource === 'picklemate' ? selectedProduct.brand : 'CUSTOM LAB'}</span>
                    <span className="text-lime-400/80">PRO 16MM</span>
                  </div>

                  {/* CENTER LOGO WATERMARK */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-700/20 font-black text-6xl pointer-events-none uppercase tracking-widest">
                    PM
                  </div>

                  {/* REAL-TIME ENGRAVED CONTENT DISPLAY */}
                  <div className={`absolute z-20 transition-all duration-200 pointer-events-none ${getPositionStyles()}`}>
                    
                    {/* Logo Icon if selected */}
                    {selectedLogo !== 'none' && (
                      <div className="flex items-center justify-center mb-1">
                        {selectedLogo === 'lightning' && <Zap className="w-6 h-6 text-lime-400 fill-lime-400/20" />}
                        {selectedLogo === 'eagle' && <Award className="w-6 h-6 text-amber-400" />}
                        {selectedLogo === 'star' && <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />}
                        {selectedLogo === 'pickleball' && <Sparkles className="w-6 h-6 text-cyan-400" />}
                      </div>
                    )}

                    {/* Signature icon if uploaded */}
                    {signatureUploaded && (
                      <div className="text-[11px] font-serif italic text-lime-300/90 mb-0.5 border-b border-lime-400/50 pb-0.5">
                        ~ {engravedText || 'Anna Lee'} Signature ~
                      </div>
                    )}

                    {/* Text / Name & Jersey Number */}
                    <div 
                      className={`${getFontFamily()} transition-all leading-tight ${
                        laserFinish === 'gold'
                          ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]'
                          : laserFinish === 'neon'
                          ? 'text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.6)]'
                          : 'text-slate-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                      }`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {engravedText || 'ANNA LEE'}
                    </div>

                    {/* Số áo hiển thị kèm */}
                    {jerseyNumber && (
                      <div className="font-mono font-black text-xs text-lime-400 tracking-widest mt-0.5">
                        #{jerseyNumber}
                      </div>
                    )}

                  </div>

                  {/* Bottom Paddle Edge Specs */}
                  <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-slate-500 pb-1">
                    <span>USAP APPROVED</span>
                    <span>T700 RAW FIBER</span>
                  </div>
                </div>

                {/* Paddle Throat / Neck */}
                <div className="w-16 h-7 bg-gradient-to-b from-[#1a1f26] to-[#0f1318] border-x-2 border-slate-700 relative z-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-lime-400/80 tracking-widest">TORAY</span>
                </div>

                {/* Handle / Grip */}
                <div className="w-12 h-28 bg-[#1e293b] rounded-b-2xl border-2 border-slate-700 shadow-xl relative overflow-hidden flex flex-col justify-around py-2">
                  <div className="w-full h-1.5 bg-lime-400/80 -rotate-12 scale-125"></div>
                  <div className="w-full h-1.5 bg-lime-400/80 -rotate-12 scale-125"></div>
                  <div className="w-full h-1.5 bg-lime-400/80 -rotate-12 scale-125"></div>
                  <div className="w-full h-1.5 bg-lime-400/80 -rotate-12 scale-125"></div>
                  <div className="absolute bottom-0 inset-x-0 h-3 bg-slate-950 flex items-center justify-center">
                    <span className="text-[7px] font-black text-lime-400">PM</span>
                  </div>
                </div>

              </div>

              {/* Bottom live indicator */}
              <p className="text-xs text-slate-400 text-center max-w-sm mt-1 z-10">
                Nét khắc mô phỏng thực tế với độ sâu tia Laser 0.01mm, không làm thay đổi trọng lượng và điểm cân bằng vợt.
              </p>

            </div>

            {/* ===================================================================
                BÊN PHẢI (BẢNG ĐIỀU KHIỂN - CONTROL PANEL): CÁC Ô NHẬP & TÙY CHỌN
                =================================================================== */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-5">
              
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-900 font-['Lexend',sans-serif]">
                  Bảng Điều Khiển Khắc Laser
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tùy chỉnh thông tin người chơi, phông chữ và vị trí hiển thị
                </p>
              </div>

              {/* Ô NHẬP VĂN BẢN (TÊN, BIỆT DANH) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Tên hoặc Biệt danh khắc lên vợt:</span>
                  <span className="text-[10px] text-slate-400 font-mono">{engravedText.length}/16 ký tự</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={engravedText}
                  onChange={(e) => setEngravedText(e.target.value.toUpperCase())}
                  placeholder="VD: ANNA LEE, MINH TRIỆU..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 outline-none uppercase font-mono"
                />
              </div>

              {/* Ô NHẬP SỐ ÁO (JERSEY NUMBER) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Số áo thi đấu (Tùy chọn):
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-500 px-3 py-2 bg-slate-100 rounded-xl">#</span>
                  <input
                    type="text"
                    maxLength={3}
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="VD: 07, 10, 99"
                    className="w-32 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:border-lime-500 outline-none font-mono"
                  />
                  <span className="text-xs text-slate-400">Hiển thị góc chữ số áo</span>
                </div>
              </div>

              {/* NÚT UPLOAD CHỮ KÝ / LOGO */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Upload Chữ ký cá nhân hoặc chọn Logo thi đấu:
                </label>
                
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {[
                    { id: 'none', label: 'Không logo', icon: null },
                    { id: 'lightning', label: 'Sấm sét', icon: Zap },
                    { id: 'eagle', label: 'Đại bàng', icon: Award },
                    { id: 'star', label: 'Ngôi sao', icon: Star },
                    { id: 'pickleball', label: 'Bóng Pickle', icon: Sparkles },
                  ].map((lg) => {
                    const Icon = lg.icon;
                    const isSelected = selectedLogo === lg.id;
                    return (
                      <button
                        key={lg.id}
                        type="button"
                        onClick={() => setSelectedLogo(lg.id as any)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-900 text-lime-400 border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {Icon ? <Icon className="w-3.5 h-3.5" /> : <span className="text-xs">✕</span>}
                        <span className="truncate">{lg.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => setSignatureUploaded(!signatureUploaded)}
                  className={`w-full py-2.5 px-3 rounded-xl border border-dashed text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    signatureUploaded
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{signatureUploaded ? '✓ Đã tải: Chữ ký cá nhân (.PNG / .SVG)' : 'Tải lên Chữ ký hoặc Logo riêng (.PNG, .SVG)'}</span>
                </button>
              </div>

              {/* DROPDOWN CHỌN FONT CHỮ */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chọn Phông chữ khắc:
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-lime-500 outline-none cursor-pointer"
                >
                  <option value="Sport Bold">Phông Sport Bold (Năng động thể thao, góc cạnh)</option>
                  <option value="Elegant Script">Phông Elegant Script (Thư pháp thanh lịch, chữ ký)</option>
                  <option value="Modern Sans">Phông Modern Sans (Hiện đại tối giản, dễ đọc)</option>
                  <option value="Tech Mono">Phông Tech Mono (Kỹ thuật số công nghệ cao)</option>
                </select>
              </div>

              {/* THANH TRƯỢT CHỈNH KÍCH THƯỚC */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Kích thước chữ khắc:</span>
                  <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={36}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-lime-500"
                />
              </div>

              {/* VỊ TRÍ KHẮC */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Vị trí khắc trên mặt vợt:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'bottom-right', label: 'Góc dưới phải' },
                    { id: 'center', label: 'Giữa mặt vợt' },
                    { id: 'side-edge', label: 'Dọc cạnh viền' },
                    { id: 'neck', label: 'Cổ vợt' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setEngravePosition(pos.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        engravePosition === pos.id
                          ? 'bg-slate-900 text-lime-400 border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Màu ánh Laser */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Màu ánh nét khắc Laser:
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'silver', label: 'Bạc phản quang' },
                    { id: 'gold', label: 'Vàng Titan' },
                    { id: 'neon', label: 'Xanh Neon' },
                  ].map((fin) => (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => setLaserFinish(fin.id as any)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border cursor-pointer ${
                        laserFinish === fin.id
                          ? 'bg-slate-900 text-lime-400 border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {fin.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ===================================================================
              HIỂN THỊ BẢNG CHI PHÍ TỔNG KẾT BÊN DƯỚI & NÚT XÁC NHẬN
              =================================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-['Lexend',sans-serif] pb-2 border-b border-slate-100">
              Bảng Chi Phí Tổng Kết
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              
              {/* Giá vợt */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-xs">Giá vợt gia công:</span>
                <strong className="text-base font-black text-slate-900 font-['Lexend',sans-serif] block mt-1">
                  {paddleSource === 'picklemate' 
                    ? `${selectedProduct.price.toLocaleString('vi-VN')} đ` 
                    : '0 VNĐ (Sử dụng vợt hiện có)'
                  }
                </strong>
                <span className="text-[11px] text-slate-400">
                  {paddleSource === 'picklemate' ? selectedProduct.name : customUserPaddleModel}
                </span>
              </div>

              {/* Phí khắc */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-xs">Phí khắc Laser:</span>
                <strong className="text-base font-black text-lime-700 font-['Lexend',sans-serif] block mt-1">
                  80.000 VNĐ
                </strong>
                <span className="text-[11px] text-slate-400">
                  Nội dung: "{engravedText}" {jerseyNumber && `(#${jerseyNumber})`}
                </span>
              </div>

              {/* Tổng thanh toán tạm tính */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-xs">Tổng thanh toán tạm tính:</span>
                <strong className="text-xl sm:text-2xl font-black text-lime-400 font-['Lexend',sans-serif] block mt-0.5">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </strong>
                <span className="text-[10px] text-slate-400">
                  {shippingFee === 0 ? '✓ Đã gồm freeship nội thành' : `+ ${shippingFee.toLocaleString('vi-VN')} đ phí ship`}
                </span>
              </div>

            </div>

            {/* NÚT: "Xác nhận thiết kế & Chuyển đến thanh toán" */}
            <div className="pt-2">
              <button
                onClick={handleConfirmDesign}
                className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>Xác nhận thiết kế & Chuyển đến thanh toán</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </section>
      )}

      {/* =========================================================================
          BƯỚC 4: TRANG THANH TOÁN (CHECKOUT) & LOGIC GIẢ LẬP
          ========================================================================= */}
      {(activeStepTab === 'all' || activeStepTab === 4) && (
        <section 
          id="step-4-checkout" 
          className="space-y-6 pt-2 scroll-mt-28"
        >
          {/* Section Heading */}
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                Trang Thanh Toán (Checkout)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Ký quỹ lưu ký an toàn Pickle-Escrow • Cam kết hoàn thành và giao hàng trong 24 giờ.
              </p>
            </div>

            {/* Test Simulation Controls */}
            <div className="bg-slate-100 rounded-2xl p-2 border border-slate-200 flex items-center gap-2 text-xs shrink-0 self-start sm:self-auto">
              <span className="font-bold text-slate-700 pl-1 text-[11px]">Kịch bản giả lập:</span>
              <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => { setSimulationScenario('success'); setOrderStatus('idle'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    simulationScenario === 'success'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Kiểm thử kịch bản thành công"
                >
                  <Check className="w-3 h-3" />
                  <span>Thành công</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSimulationScenario('failed'); setOrderStatus('idle'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    simulationScenario === 'failed'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Kiểm thử kịch bản lỗi thanh toán"
                >
                  <XCircle className="w-3 h-3" />
                  <span>Thất bại</span>
                </button>
              </div>
            </div>
          </div>

          {/* CẢNH BÁO NỔI BẬT: SẢN PHẨM THIẾT KẾ THEO YÊU CẦU RIÊNG, YÊU CẦU THANH TOÁN TRƯỚC 100%, KHÔNG ÁP DỤNG COD */}
          <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 text-amber-950 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-700 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-red-700 font-black text-sm sm:text-base uppercase font-['Lexend',sans-serif]">
                Sản phẩm thiết kế theo yêu cầu riêng, yêu cầu thanh toán trước 100%, không áp dụng COD.
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                Cây vợt được khắc Laser sợi quang theo thông tin tên và số áo độc bản của bạn. Ngay sau khi nhận thanh toán qua cổng điện tử, đơn hàng sẽ được kích hoạt chuyển trạng thái vào dây chuyền xưởng Laser Lab. PickleMate cam kết bảo hành 1 đổi 1 nếu nét khắc không đúng với bản mô phỏng.
              </p>
            </div>
          </div>

          {/* TRƯỜNG HỢP: THANH TOÁN THẤT BẠI -> THÔNG BÁO LỖI ĐỂ THỬ LẠI HOẶC ĐỔI PHƯƠNG THỨC KHÁC */}
          {orderStatus === 'failed' && (
            <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in zoom-in-95">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-red-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0">
                    <XCircle className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-200/80 px-2 py-0.5 rounded">
                      Mã lỗi: #ERR-PAY-04 (Giao dịch bị từ chối / Timeout)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Lexend',sans-serif] mt-0.5">
                      Thanh Toán Không Thành Công
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-700 bg-white px-3.5 py-1.5 rounded-xl border border-red-200">
                  Tài khoản của bạn chưa bị trừ tiền
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-red-200 space-y-2 text-xs sm:text-sm text-slate-700">
                <p className="leading-relaxed">
                  Giao dịch thanh toán chưa thể hoàn tất do <strong className="text-red-700">số dư không đủ</strong> hoặc <strong className="text-red-700">phiên xác thực ngân hàng đã hết hạn</strong>. Bạn có thể bấm <strong>"Thử lại thanh toán"</strong> hoặc <strong>"Đổi phương thức khác"</strong> (MoMo, VNPay, ZaloPay, VietQR, Pickle Wallet).
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-slate-500 text-xs">
                  <span>Đơn hàng chờ: <strong>{paddleSource === 'picklemate' ? selectedProduct.name : customUserPaddleModel}</strong></span>
                  <span>Tổng tiền: <strong className="text-red-600">{totalAmount.toLocaleString('vi-VN')} đ</strong></span>
                </div>
              </div>

              {/* 2 NÚT HÀNH ĐỘNG THEO YÊU CẦU: Thử lại hoặc Đổi phương thức khác */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleRetryPayment}
                  className="py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
                >
                  <RotateCcw className="w-4 h-4 text-lime-400" />
                  <span>Thử lại thanh toán</span>
                </button>

                <button
                  onClick={() => handleChangePaymentMethod()}
                  className="py-3.5 px-5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-lime-400/25 hover:scale-[1.01]"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>Đổi phương thức thanh toán khác</span>
                </button>
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP: ĐANG XỬ LÝ THANH TOÁN */}
          {orderStatus === 'processing' && (
            <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-md text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-lime-400 border-t-slate-900 animate-spin mx-auto"></div>
              <h4 className="text-base font-black text-slate-900 font-['Lexend',sans-serif]">
                Đang kết nối cổng thanh toán {paymentMethod.toUpperCase()}...
              </h4>
              <p className="text-xs text-slate-500">
                Vui lòng không đóng trang trong giây lát. Hệ thống đang bảo lưu đơn hàng của bạn.
              </p>
            </div>
          )}

          {/* TRƯỜNG HỢP: FORM THANH TOÁN TIÊU CHUẨN (KHI CHƯA LỖI VÀ CHƯA THÀNH CÔNG) */}
          {orderStatus !== 'failed' && orderStatus !== 'success' && orderStatus !== 'processing' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* CỘT TRÁI: CÁC PHƯƠNG THỨC THANH TOÁN CHO PHÉP CHỌN (MOMO, VNPAY, ZALOPAY, VIETQR, HOẶC PICKLE WALLET) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 font-['Lexend',sans-serif]">
                  Phương Thức Thanh Toán
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      id: 'vietqr',
                      title: 'VietQR - Quét mã Chuyển khoản 24/7 (Khuyên dùng)',
                      desc: 'Tự động duyệt trong 3 giây. Hỗ trợ hơn 40 app ngân hàng.',
                      icon: QrCode,
                      badge: 'Phổ biến',
                    },
                    {
                      id: 'momo',
                      title: 'Ví MoMo (QR Code / Tự động chuyển app)',
                      desc: 'Thanh toán bảo mật nhanh chóng qua ví điện tử MoMo.',
                      icon: Smartphone,
                      badge: 'MoMo',
                    },
                    {
                      id: 'vnpay',
                      title: 'Cổng VNPay-QR (Ngân hàng & Ví VNPay)',
                      desc: 'Quét mã VNPAY nhận thêm ưu đãi hoàn tiền 20.000 đ.',
                      icon: Building2,
                      badge: 'VNPay',
                    },
                    {
                      id: 'zalopay',
                      title: 'Ví ZaloPay',
                      desc: 'Thanh toán 1-chạm liên kết trực tiếp với ứng dụng Zalo.',
                      icon: CreditCard,
                      badge: 'ZaloPay',
                    },
                    {
                      id: 'wallet',
                      title: 'Pickle Wallet (Ví Ký Quỹ PickleMate)',
                      desc: 'Số dư khả dụng: 500.000 đ. Ký quỹ an toàn tuyệt đối.',
                      icon: Wallet,
                      badge: 'Số dư ví',
                    },
                  ].map((pm) => {
                    const isChecked = paymentMethod === pm.id;
                    const Icon = pm.icon;
                    return (
                      <label
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'border-2 border-lime-500 bg-lime-50/40 shadow-xs'
                            : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_option"
                          checked={isChecked}
                          onChange={() => setPaymentMethod(pm.id as any)}
                          className="mt-1 w-4 h-4 text-lime-600 focus:ring-lime-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-slate-900">
                              {pm.title}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {pm.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {pm.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* CỘT PHẢI: TÓM TẮT THÔNG TIN ĐƠN HÀNG VÀ TỔNG TIỀN CẦN THANH TOÁN */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5">
                <h3 className="text-lg font-black text-slate-900 font-['Lexend',sans-serif] pb-2 border-b border-slate-100">
                  Tóm Tắt Đơn Hàng & Tổng Tiền
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  
                  {/* Sản phẩm */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">
                        {paddleSource === 'picklemate' ? selectedProduct.name : customUserPaddleModel}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {paddleSource === 'picklemate' ? 'Mua mới trên PickleMate' : 'Vợt gửi gia công'}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900 font-['Lexend',sans-serif]">
                      {paddlePrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {/* Phí khắc laser */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="font-bold text-slate-700">Phí khắc Laser cá nhân hóa</span>
                      <p className="text-[11px] text-slate-400">"{engravedText}" • {selectedFont}</p>
                    </div>
                    <span className="font-extrabold text-slate-900 font-['Lexend',sans-serif]">
                      {laserEngraveFee.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {/* Phí vận chuyển */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="font-bold text-slate-700">Phí giao hàng bảo hiểm</span>
                      <p className="text-[11px] text-slate-400">
                        {shippingFee === 0 ? 'Freeship đơn hàng trên 2 triệu' : 'Giao hàng hỏa tốc nội thành'}
                      </p>
                    </div>
                    <span className={`font-extrabold ${shippingFee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} đ`}
                    </span>
                  </div>

                  {/* Dòng Tổng tiền */}
                  <div className="pt-4 border-t-2 border-slate-900 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900 uppercase">
                        Tổng tiền thanh toán:
                      </span>
                      <p className="text-[11px] text-slate-500">Đã bao gồm VAT & Ký quỹ an toàn</p>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-red-600 font-['Lexend',sans-serif]">
                      {totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                </div>

                {/* NÚT "XÁC NHẬN ĐƠN & THANH TOÁN" */}
                <button
                  onClick={handleCompletePayment}
                  className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>Xác nhận đơn & Thanh toán ({totalAmount.toLocaleString('vi-VN')} đ)</span>
                </button>

              </div>

            </div>
          )}

          {/* ===================================================================
              THÀNH CÔNG -> HIỂN THỊ MÀN HÌNH THÔNG BÁO ĐẶT HÀNG THÀNH CÔNG
              KÈM MÃ THEO DÕI TRẠNG THÁI ĐƠN HÀNG (5 BƯỚC)
              =================================================================== */}
          {orderStatus === 'success' && (
            <div className="space-y-6">
              
              {/* MÀN HÌNH THÔNG BÁO ĐẶT HÀNG THÀNH CÔNG */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 border-2 border-lime-400 shadow-2xl space-y-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-800">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-lime-400/30">
                      <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-950 text-lime-400 border border-lime-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Ký quỹ an toàn 100% • Đặt hàng thành công</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white font-['Lexend',sans-serif]">
                        Đặt Hàng & Khắc Laser Thành Công!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Đơn hàng cá nhân hóa của bạn đã được tiếp nhận và chuyển đến dây chuyền xưởng Pickle-Custom Lab.
                      </p>
                    </div>
                  </div>

                  {/* MÃ THEO DÕI TRẠNG THÁI ĐƠN HÀNG */}
                  <div className="bg-slate-900/90 border border-lime-400/40 rounded-2xl p-4 shrink-0 flex flex-col gap-2 min-w-[240px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Mã theo dõi trạng thái đơn hàng:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xl font-black text-lime-400 tracking-wider">
                        {orderCode}
                      </span>
                      <button
                        onClick={handleCopyOrderCode}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                        title="Sao chép mã đơn"
                      >
                        {isCopiedOrderCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-lime-400" />
                            <span className="text-lime-400 text-[11px]">Đã chép!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Chép mã</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Thời gian: 10:15 hôm nay</span>
                      <span className="text-lime-400 font-bold">Hỏa tốc 24H</span>
                    </div>
                  </div>
                </div>

                {/* Tóm tắt thông tin gói */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Cây vợt:</span>
                    <strong className="text-white text-sm font-bold block mt-0.5">
                      {paddleSource === 'picklemate' ? selectedProduct.name : customUserPaddleModel}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Nội dung khắc Laser:</span>
                    <strong className="text-lime-400 text-sm font-black block mt-0.5 font-mono">
                      "{engravedText}" {jerseyNumber && `(#${jerseyNumber})`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Đã thanh toán:</span>
                    <strong className="text-white text-sm font-black block mt-0.5">
                      {totalAmount.toLocaleString('vi-VN')} đ ({paymentMethod.toUpperCase()})
                    </strong>
                  </div>
                </div>

              </div>

              {/* TIẾN TRÌNH THEO DÕI ĐƠN HÀNG 5 BƯỚC: (ĐÃ TIẾP NHẬN -> ĐANG KHẮC -> ĐÓNG GÓI -> ĐANG GIAO -> HOÀN THÀNH) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Real-time Tracking
                    </span>
                    <h3 className="text-xl font-black text-slate-900 font-['Lexend',sans-serif]">
                      Tiến Độ Gia Công & Giao Hàng (5 Bước)
                    </h3>
                  </div>

                  {/* Thanh nút bấm mô phỏng 5 bước */}
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-600 font-bold pl-1">Mô phỏng bước:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setTrackingStep(s)}
                          className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            trackingStep === s
                              ? 'bg-slate-900 text-lime-400 ring-2 ring-lime-400 shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stepper 5 bước */}
                <div className="grid grid-cols-5 gap-2 relative py-4">
                  {TRACKING_STAGES.map((st, idx) => {
                    const isCompleted = trackingStep > st.step;
                    const isCurrent = trackingStep === st.step;
                    const isUpcoming = trackingStep < st.step;

                    return (
                      <div key={st.step} className="flex flex-col items-center text-center relative group">
                        
                        {/* Đường nối */}
                        {idx < TRACKING_STAGES.length - 1 && (
                          <div 
                            className={`absolute top-4 left-1/2 w-full h-1 -z-0 transition-all duration-500 ${
                              trackingStep > st.step ? 'bg-lime-400' : 'bg-slate-200'
                            }`}
                          />
                        )}

                        {/* Icon hình tròn */}
                        <div className="relative z-10 mb-2">
                          {isCompleted && (
                            <div className="w-8 h-8 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center shadow-md">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          )}
                          {isCurrent && (
                            <div className="w-8 h-8 rounded-full border-2 border-lime-500 bg-white text-slate-900 flex items-center justify-center font-black shadow-md ring-4 ring-lime-400/25">
                              <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-ping"></span>
                            </div>
                          )}
                          {isUpcoming && (
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center text-xs font-bold">
                              {st.step}
                            </div>
                          )}
                        </div>

                        {/* Tên bước */}
                        <p className={`text-xs font-['Lexend',sans-serif] ${
                          isCurrent
                            ? 'font-black text-slate-900'
                            : isCompleted
                            ? 'font-bold text-slate-800'
                            : 'font-medium text-slate-400'
                        }`}>
                          {st.title}
                        </p>

                        <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                          {st.time}
                        </p>

                      </div>
                    );
                  })}
                </div>

                {/* Trạng thái chi tiết */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                      {trackingStep}/5
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 font-['Lexend',sans-serif]">
                        Trạng thái hiện tại: {TRACKING_STAGES[trackingStep - 1].title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {TRACKING_STAGES[trackingStep - 1].desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    Xưởng: Pickle-Custom Lab (Toray T700)
                  </span>
                </div>

                {/* Nút Xác nhận nhận hàng */}
                <div>
                  {trackingStep >= 4 ? (
                    <button
                      onClick={() => {
                        setIsReceiptConfirmed(true);
                        setTrackingStep(5);
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base transition-all duration-200 shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        {isReceiptConfirmed ? '✓ Đã xác nhận nhận hàng thành công' : 'Xác nhận nhận hàng'}
                      </span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-4 px-6 rounded-2xl bg-slate-200 text-slate-400 font-bold text-base cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Clock className="w-5 h-5" />
                      <span>Xác nhận nhận hàng (Chỉ khả dụng khi hàng đang giao - Bước 4 & 5)</span>
                    </button>
                  )}
                </div>

                {/* Điều hướng kết thúc */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate(1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Home className="w-4 h-4" />
                    <span>Về Trang Chủ PickleMate</span>
                  </button>

                  <button
                    onClick={() => {
                      setOrderStatus('idle');
                      setTrackingStep(1);
                      setActiveStepTab(1);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                    <span>Tạo Đơn Khắc Vợt Mới</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </section>
      )}

    </div>
  );
};

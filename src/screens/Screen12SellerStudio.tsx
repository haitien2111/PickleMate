import React, { useState, useRef } from 'react';
import { ScreenId, SellerListingItem, SellerOrderStatus, UserProfile } from '../types';
import paddleImg1 from '../assets/images/regenerated_image_1789473026899.jpg';
import paddleImg2 from '../assets/images/regenerated_image_1789473837933.jpg';
import paddleImg3 from '../assets/images/regenerated_image_1789473665427.jpg';
import paddleImg4 from '../assets/images/regenerated_image_1789473666609.jpg';
import {
  Package, Tag, ArrowRight, CheckCircle2, AlertTriangle, 
  ShieldCheck, Upload, Clock, DollarSign, Truck, 
  RefreshCw, Check, X, ChevronRight, Store, FileText, 
  Sparkles, Layers, QrCode, Building2, Phone, MapPin, 
  Wallet, Award, HelpCircle, ChevronLeft, ArrowUpRight,
  Eye, CornerDownRight, CheckCircle, Flame, Filter,
  Plus, Trash2, Camera, Image as ImageIcon
} from 'lucide-react';

interface Screen12SellerStudioProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onUpdateWallet?: (amount: number) => void;
}

// Danh sách ảnh mẫu thực tế cho việc pass vợt (mặt trước, viền, cán, mã vạch, mặt sau)
const SAMPLE_PADDLE_IMAGES = [
  paddleImg1,
  paddleImg2,
  paddleImg3,
  paddleImg4,
  'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=700&q=80',
];

// Dữ liệu mẫu ban đầu cho Seller Dashboard
const INITIAL_SELLER_LISTINGS: SellerListingItem[] = [
  {
    id: 'sell-001',
    paddleName: 'Joola Ben Johns Perseus CFS 16mm Swift',
    brand: 'Joola',
    usedTime: '4 tháng (Khoảng 25 trận)',
    conditionDescription: 'Mặt carbon Toray T700 còn rất nhám, viền cao su có 1 vết trầy nhẹ 2mm ở góc trên, không nứt ngầm, đã bọc viền bảo vệ từ ngày đầu.',
    conditionPercentage: 92,
    expectedPrice: 4200000,
    originalPrice: 5750000,
    images: [
      'https://images.unsplash.com/photo-1617083934555-563d86503f84?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&w=700&q=80',
    ],
    status: 'buyer_ordered', // Đã có người mua -> Chờ xác nhận
    createdAt: '14:20 - Hôm nay',
    buyer: {
      name: 'Trần Minh Triệu (DUPR 3.4)',
      phone: '0918 *** 892',
      address: 'Vinhomes Central Park, Bình Thạnh, TP.HCM',
      depositAmount: 4200000,
      orderedAt: '15:10 - Hôm nay',
    },
    inspectionCenter: {
      name: 'Trung tâm Kiểm định Pickle-Verify Lab Q7',
      address: 'Số 14 Đường số 7, KĐT Him Lam, P. Tân Hưng, Quận 7, TP.HCM',
      hotline: '1900 8829 (Ext 2)',
      trackingCode: 'VNPOST-PKM-882910',
      fee: 50000,
    },
    payoutSummary: {
      grossAmount: 4200000,
      inspectionFee: 50000,
      platformFee: 84000, // 2%
      netReceived: 4066000,
    }
  },
  {
    id: 'sell-002',
    paddleName: 'Selkirk Vanguard Power Air Invikta Pro',
    brand: 'Selkirk',
    usedTime: '2 tháng',
    conditionDescription: 'Đẹp 95%, không trầy xước, lỗ khí động học nguyên bản, cán còn nguyên seal lót phụ.',
    conditionPercentage: 95,
    expectedPrice: 4600000,
    originalPrice: 5800000,
    images: [
      'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=700&q=80',
    ],
    status: 'center_inspecting', // Đang kiểm định
    createdAt: 'Hôm qua',
    buyer: {
      name: 'Lê Hoàng Nam (DUPR 4.1)',
      phone: '0988 *** 123',
      address: 'Khu Đô Thị Sala, TP. Thủ Đức',
      depositAmount: 4600000,
      orderedAt: 'Hôm qua',
    },
    inspectionCenter: {
      name: 'Trung tâm Kiểm định Pickle-Verify Lab Q7',
      address: 'Số 14 Đường số 7, KĐT Him Lam, P. Tân Hưng, Quận 7, TP.HCM',
      hotline: '1900 8829',
      trackingCode: 'GRAB-PKM-11029',
      receivedAt: '09:00 - Hôm nay',
      fee: 50000,
      result: 'passed',
      reportSummary: 'Lõi Honeycomb không nứt ngầm, độ nhám ProSpin+ đạt 95% tiêu chuẩn thi đấu USAP.',
      details: {
        surfaceIntegrity: 'Độ nhám Carbon hoàn hảo, không phồng rộp',
        honeycombCore: 'Kiểm tra siêu âm không gãy vỡ hay dập lõi',
        edgeGuard: 'Viền ép khít chặt chẽ, không rung lỏng',
        weightAndBalance: '228g (Chuẩn sai số ±2g của Selkirk)'
      }
    },
    payoutSummary: {
      grossAmount: 4600000,
      inspectionFee: 50000,
      platformFee: 92000,
      netReceived: 4458000,
    }
  },
  {
    id: 'sell-003',
    paddleName: 'CRBN 1X Power Series 16mm Elongated',
    brand: 'CRBN',
    usedTime: '6 tháng',
    conditionDescription: 'Bề mặt hơi bóng nhẹ vùng tâm vợt, viền chắc chắn, thích hợp cho ai cần vợt tập cày cuốc.',
    conditionPercentage: 86,
    expectedPrice: 3200000,
    originalPrice: 5180000,
    images: [
      'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=700&q=80',
    ],
    status: 'waiting_buyer', // Chờ người mua
    createdAt: '3 ngày trước',
  },
  {
    id: 'sell-004',
    paddleName: 'Zocker Aspire 16mm Raw Carbon Toray T700',
    brand: 'Zocker',
    usedTime: '1 tháng',
    conditionDescription: 'Mua đánh thử 3 buổi thấy nhẹ tay quá nên pass lại, mới 98%.',
    conditionPercentage: 98,
    expectedPrice: 2200000,
    originalPrice: 2930000,
    images: [
      'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&w=700&q=80',
    ],
    status: 'completed_payout', // Đã nhận tiền hoàn tất
    createdAt: 'Tuần trước',
    buyer: {
      name: 'Võ Minh Thư',
      phone: '0903 *** 456',
      address: 'Quận 1, TP.HCM',
      depositAmount: 2200000,
      orderedAt: 'Tuần trước',
    },
    payoutSummary: {
      grossAmount: 2200000,
      inspectionFee: 50000,
      platformFee: 44000,
      netReceived: 2106000,
    }
  }
];

export const Screen12SellerStudio: React.FC<Screen12SellerStudioProps> = ({
  user,
  onNavigate,
  onUpdateWallet,
}) => {
  // Tab chính của màn hình người bán:
  // 'create': Form đăng bán vợt mới
  // 'workflow': Chi tiết luồng xử lý đơn hàng tương tác (Interactive Step-by-Step Flow)
  // 'dashboard': Trang Quản lý đơn bán của tôi
  const [activeMainTab, setActiveMainTab] = useState<'create' | 'workflow' | 'dashboard'>('workflow');

  // Danh sách các đơn bán của người bán
  const [listings, setListings] = useState<SellerListingItem[]>(INITIAL_SELLER_LISTINGS);
  const [selectedListingId, setSelectedListingId] = useState<string>('sell-001');

  // Form đăng bán mới (Bước 2 trong yêu cầu)
  const [formData, setFormData] = useState({
    brand: 'Selkirk',
    modelName: 'Vanguard Power Air Invikta Pro 16mm',
    usedTime: '3 tháng (Đánh 15 trận cuối tuần)',
    conditionDescription: 'Vợt được giữ gìn cẩn thận, không có vết nứt hay mềm lõi. Có dán băng dính viền bảo vệ. Mặt carbon còn nguyên độ nhám chuẩn thi đấu.',
    conditionPercentage: 90,
    expectedPrice: 3850000,
    // Danh sách 3 - 5 ảnh thực tế của sản phẩm
    productImages: [
      SAMPLE_PADDLE_IMAGES[0],
      SAMPLE_PADDLE_IMAGES[1],
      SAMPLE_PADDLE_IMAGES[2],
    ] as string[],
    activePreviewImageIdx: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formSubmittedNotice, setFormSubmittedNotice] = useState<boolean>(false);

  // Kịch bản rẽ nhánh kiểm định tương tác (Bước 4 trong yêu cầu)
  // 'passed': Trường hợp ĐẠT
  // 'failed': Trường hợp KHÔNG ĐẠT
  const [inspectionScenario, setInspectionScenario] = useState<'passed' | 'failed'>('passed');

  // Bộ lọc trạng thái ở Dashboard
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'waiting' | 'inspecting' | 'shipping' | 'completed'>('all');

  // Thông báo toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Đơn hàng đang được chọn để xử lý theo dõi tiến độ
  const activeListing = listings.find((item) => item.id === selectedListingId) || listings[0];

  // Xử lý gửi form đăng bán vợt mới (Bước 2)
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.modelName.trim() || formData.expectedPrice <= 0) {
      showToast('Vui lòng nhập đầy đủ tên dòng vợt và mức giá mong muốn!');
      return;
    }

    if (formData.productImages.length < 3) {
      showToast('⚠️ Vui lòng cập nhật ít nhất 3 ảnh thực tế cho sản phẩm (tối đa 5 ảnh)!');
      return;
    }

    const newListing: SellerListingItem = {
      id: `sell-${Date.now().toString().slice(-4)}`,
      paddleName: `${formData.brand} ${formData.modelName}`,
      brand: formData.brand,
      usedTime: formData.usedTime,
      conditionDescription: formData.conditionDescription,
      conditionPercentage: formData.conditionPercentage,
      expectedPrice: Number(formData.expectedPrice),
      originalPrice: Math.round(Number(formData.expectedPrice) * 1.35),
      images: formData.productImages,
      status: 'waiting_buyer', // Ban đầu đưa lên chợ ở trạng thái chờ người mua
      createdAt: 'Vừa xong',
      inspectionCenter: {
        name: 'Trung tâm Kiểm định Pickle-Verify Lab Q7',
        address: 'Số 14 Đường số 7, KĐT Him Lam, P. Tân Hưng, Quận 7, TP.HCM',
        hotline: '1900 8829 (Ext 2)',
        trackingCode: `VNPOST-PKM-${Math.floor(100000 + Math.random() * 900000)}`,
        fee: 50000,
      },
      payoutSummary: {
        grossAmount: Number(formData.expectedPrice),
        inspectionFee: 50000,
        platformFee: Math.round(Number(formData.expectedPrice) * 0.02),
        netReceived: Number(formData.expectedPrice) - 50000 - Math.round(Number(formData.expectedPrice) * 0.02),
      }
    };

    setListings([newListing, ...listings]);
    setSelectedListingId(newListing.id);
    setFormSubmittedNotice(true);
    showToast('🎉 Đăng bán thành công! Sản phẩm đã được niêm yết trên Chợ Vợt Cũ.');
  };

  // Nút: Mô phỏng có người mua đặt hàng và thanh toán ký quỹ thành công (Bước 3)
  const handleSimulateBuyerOrder = () => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          return {
            ...item,
            status: 'buyer_ordered',
            buyer: {
              name: 'Nguyễn Tiến Dũng (DUPR 3.8)',
              phone: '0938 *** 771',
              address: 'Chung cư Florita, Đường D1, P. Tân Hưng, Quận 7, TP.HCM',
              depositAmount: item.expectedPrice,
              orderedAt: '15:45 - Hôm nay',
            },
          };
        }
        return item;
      })
    );
    showToast('🔔 Đã có người mua đặt cọc ký quỹ vào tài khoản Escrow an toàn!');
  };

  // Người bán bấm "Xác nhận đơn" (Bước 3)
  const handleSellerConfirmOrder = () => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          return {
            ...item,
            status: 'shipping_to_center',
          };
        }
        return item;
      })
    );
    showToast('✓ Đã xác nhận đơn! Vui lòng chuẩn bị vợt để gửi đến Trung tâm kiểm định.');
  };

  // Người bán bấm "Tôi đã gửi hàng" (Bước 3)
  const handleSellerSentPaddle = () => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          return {
            ...item,
            status: 'center_inspecting',
          };
        }
        return item;
      })
    );
    showToast('📦 Đã cập nhật trạng thái: Vợt đang trên đường / Trung tâm đang tiến hành kiểm tra.');
  };

  // Cập nhật kết quả kiểm định theo kịch bản (Bước 4)
  const handleApplyInspectionResult = (result: 'passed' | 'failed') => {
    setInspectionScenario(result);
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          if (result === 'passed') {
            return {
              ...item,
              status: 'verified_passed',
              inspectionCenter: {
                ...item.inspectionCenter!,
                result: 'passed',
                reportSummary: 'Lõi Honeycomb không nứt ngầm, cấu trúc Toray T700 nguyên vẹn, độ nhám đạt chuẩn USAP.',
                details: {
                  surfaceIntegrity: 'Mặt carbon không có nứt gãy, độ nhám ma sát bóng tốt',
                  honeycombCore: 'Chụp siêu âm phát hiện lõi hoàn toàn đặc, không dập bẹp',
                  edgeGuard: 'Viền nguyên vẹn, không rung rơ khi va đập lực mạnh',
                  weightAndBalance: 'Trọng lượng đo được: 226g (Độ lệch chuẩn < 1%)'
                }
              }
            };
          } else {
            return {
              ...item,
              status: 'verified_failed',
              inspectionCenter: {
                ...item.inspectionCenter!,
                result: 'failed',
                reportSummary: 'Phát hiện vết nứt ngầm ở lõi Honeycomb góc 2 giờ và độ bóng mòn mặt carbon vượt quá 25% so với mô tả.',
                details: {
                  surfaceIntegrity: 'Bề mặt có dấu hiệu mòn nhẵn ở sweetspot không đều',
                  honeycombCore: 'Phát hiện rạn vỡ lõi tổ ong khi đo áp lực sóng âm',
                  edgeGuard: 'Khớp nối viền có dấu hiệu hở keo nhẹ do va chạm trước đó',
                  weightAndBalance: 'Trọng lượng chuẩn nhưng phân bố trọng tâm bị lệch 3mm'
                }
              }
            };
          }
        }
        return item;
      })
    );
    showToast(result === 'passed' ? '✓ Vợt ĐẠT CHUẨN kiểm định!' : '⚠️ Vợt KHÔNG ĐẠT chuẩn mô tả!');
  };

  // Bước 4 - Nhánh ĐẠT: Chuyển sang giao hàng cho người mua
  const handleShipToBuyer = () => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          return { ...item, status: 'shipping_to_buyer' };
        }
        return item;
      })
    );
    showToast('🚚 Đang giao hàng hỏa tốc cho người mua!');
  };

  // Bước 4 - Nhánh ĐẠT: Người mua xác nhận nhận hàng
  const handleBuyerConfirmReceived = () => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          return { ...item, status: 'buyer_received' };
        }
        return item;
      })
    );
    showToast('🎉 Người mua đã nhận vợt và hoàn tất kiểm tra! Chuẩn bị giải ngân tiền.');
  };

  // Bước 4 - Nhánh ĐẠT: Giải ngân tiền vào tài khoản người bán
  const handleReceivePayout = () => {
    const netAmount = activeListing.payoutSummary?.netReceived || activeListing.expectedPrice - 100000;
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          return { ...item, status: 'completed_payout' };
        }
        return item;
      })
    );
    if (onUpdateWallet) {
      onUpdateWallet(netAmount);
    }
    showToast(`💰 Đã giải ngân thành công ${netAmount.toLocaleString('vi-VN')} đ vào ví của bạn!`);
  };

  // Bước 4 - Nhánh KHÔNG ĐẠT: Hủy giao dịch & bắt đầu gửi trả vợt về người bán
  const handleReturnPaddleToSeller = () => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === activeListing.id) {
          return { ...item, status: 'cancelled_returned' };
        }
        return item;
      })
    );
    showToast('↩️ Đã hủy giao dịch, hoàn tiền cho người mua và tạo đơn hoàn trả vợt cho bạn.');
  };

  // Thống kê người bán
  const completedCount = listings.filter((i) => i.status === 'completed_payout').length;
  const activeCount = listings.filter((i) => i.status !== 'completed_payout' && i.status !== 'cancelled_returned').length;
  const totalEarned = listings
    .filter((i) => i.status === 'completed_payout')
    .reduce((acc, curr) => acc + (curr.payoutSummary?.netReceived || 0), 0);
  const escrowPending = listings
    .filter((i) => ['buyer_ordered', 'shipping_to_center', 'center_inspecting', 'verified_passed', 'shipping_to_buyer', 'buyer_received'].includes(i.status))
    .reduce((acc, curr) => acc + (curr.expectedPrice || 0), 0);

  // Lọc danh sách ở Dashboard
  const filteredDashboardListings = listings.filter((item) => {
    if (dashboardFilter === 'waiting') return item.status === 'waiting_buyer';
    if (dashboardFilter === 'inspecting') return ['buyer_ordered', 'shipping_to_center', 'center_inspecting', 'verified_passed', 'verified_failed'].includes(item.status);
    if (dashboardFilter === 'shipping') return item.status === 'shipping_to_buyer' || item.status === 'buyer_received';
    if (dashboardFilter === 'completed') return item.status === 'completed_payout' || item.status === 'cancelled_returned';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-950 text-white border border-lime-400/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-5 h-5 text-lime-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate(7)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span>Quay lại Chợ Vợt</span>
          </button>

          <div className="h-4 w-px bg-slate-300"></div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-900 cursor-pointer" onClick={() => onNavigate(1)}>
              Trang chủ
            </span>
            <span>/</span>
            <span className="hover:text-slate-900 cursor-pointer" onClick={() => onNavigate(7)}>
              Chợ Vợt Cũ
            </span>
            <span>/</span>
            <span className="text-slate-900 font-bold">
              Kênh Người Bán (Seller Studio)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pickle-Verify & Trade • Ký Quỹ Bảo Vệ Người Bán 100%</span>
          </div>
        </div>
      </div>

      {/* Main Title & Seller Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[11px] font-black uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>Kênh Người Pass Vợt • Pickle-Verify & Trade</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Lexend',sans-serif] tracking-tight">
              Kênh Bán Vợt Cũ & Quản Lý Kiểm Định Ký Quỹ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pass vợt an toàn, không lo bom hàng. Người mua đặt cọc ký quỹ vào PickleMate, bạn gửi vợt đến Trung tâm kiểm định (50k) để được chứng nhận đạt chuẩn và nhận tiền giải ngân ngay khi giao hàng.
            </p>
          </div>

          {/* User Seller Mini Card */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 flex items-center gap-3.5 shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name || 'Người bán'}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-lime-400"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">{user?.name || 'Người bán'}</span>
                <span className="px-1.5 py-0.2 text-[10px] font-black bg-lime-400 text-slate-950 rounded">
                  DUPR {user?.dupr || '3.5'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Người bán uy tín • 4.9/5.0 ★</p>
              <span className="text-[11px] text-lime-400 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác thực CCCD & Ví
              </span>
            </div>
          </div>
        </div>

        {/* 3 Main Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveMainTab('create')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'create'
                  ? 'bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>1. Đăng Bán Vợt Mới (Form)</span>
            </button>

            <button
              onClick={() => setActiveMainTab('workflow')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer relative ${
                activeMainTab === 'workflow'
                  ? 'bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>2. Tiến Độ & Rẽ Nhánh Kiểm Định</span>
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
            </button>

            <button
              onClick={() => setActiveMainTab('dashboard')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'dashboard'
                  ? 'bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>3. Quản Lý Đơn Bán Của Tôi ({listings.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Tiền đang cọc ký quỹ:</span>
            <strong className="text-lime-400 font-black text-sm">
              {escrowPending.toLocaleString('vi-VN')} đ
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: FORM NHẬP THÔNG TIN & HÌNH ẢNH (BƯỚC 2 TRONG ĐỀ BÀI)
          ========================================================================= */}
      {activeMainTab === 'create' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-lime-400 text-[10px] font-black uppercase tracking-wider mb-1">
                <Tag className="w-3 h-3" />
                <span>Bước 2: Nhập Thông Tin & Hình Ảnh Thực Tế</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                Đăng Bán Vợt Cũ Lên Chợ Pickle-Verify
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Cung cấp hình ảnh và mô tả trung thực để vượt qua khâu kiểm định 50k một cách nhanh chóng nhất.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveMainTab('dashboard')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl self-start sm:self-auto flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xem đơn đã đăng ({listings.length})</span>
            </button>
          </div>

          {formSubmittedNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Vợt đã được đăng bán thành công!</h4>
                  <p className="text-xs text-emerald-800">
                    Sản phẩm hiện đang ở trạng thái <strong>Chờ người mua</strong> trên Chợ Vợt Cũ. Bạn có thể chuyển sang tab Tiến độ để mô phỏng kịch bản có người mua đặt cọc!
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFormSubmittedNotice(false);
                  setActiveMainTab('workflow');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shrink-0 cursor-pointer shadow-sm"
              >
                Chuyển Đến Tiến Độ Đơn
              </button>
            </div>
          )}

          {/* Form 2 cột: Bên trái là Form nhập, bên phải là Live Preview Thẻ Chợ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Form Fields - Col 7 */}
            <form onSubmit={handleCreateListing} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-lime-600" />
                  <span>Thông tin chi tiết sản phẩm</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Các mục gắn (*) là bắt buộc</span>
              </div>

              {/* 1. Tên thương hiệu & dòng vợt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Thương hiệu *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-lime-500 outline-none"
                  >
                    <option value="RPM">RPM</option>
                    <option value="Selkirk">Selkirk</option>
                    <option value="Honolulu">Honolulu</option>
                    <option value="Joola">Joola</option>
                    <option value="CRBN">CRBN</option>
                    <option value="Zocker">Zocker</option>
                    <option value="Franklin">Franklin</option>
                    <option value="Engage">Engage</option>
                    <option value="Six Zero">Six Zero</option>
                    <option value="Diadem">Diadem</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Tên dòng vợt *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.modelName}
                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    placeholder="VD: Vanguard Power Air Invikta Pro 16mm"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-lime-500 outline-none"
                  />
                </div>
              </div>

              {/* 2. Thời gian đã sử dụng & Độ mới % */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
                    <span>Thời gian đã sử dụng (tháng/năm) *</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.usedTime}
                    onChange={(e) => setFormData({ ...formData, usedTime: e.target.value })}
                    placeholder="VD: 3 tháng, 6 tháng, 1 năm..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-lime-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
                    <span>Độ mới tự đánh giá: <strong className="text-lime-700">{formData.conditionPercentage}%</strong></span>
                    <span className="text-[10px] text-slate-400 font-normal">Sẽ kiểm định lại</span>
                  </label>
                  <div className="pt-2">
                    <input
                      type="range"
                      min={70}
                      max={99}
                      step={1}
                      value={formData.conditionPercentage}
                      onChange={(e) => setFormData({ ...formData, conditionPercentage: Number(e.target.value) })}
                      className="w-full accent-lime-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>70% (Trầy xước nhiều)</span>
                      <span>85% (Khá)</span>
                      <span>99% (Like New)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Tình trạng hiện tại (Mô tả chi tiết, vết xước, viền...) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
                  <span>Tình trạng hiện tại (Mô tả chi tiết, vết xước, viền...) *</span>
                  <span className="text-[10px] text-slate-400 font-mono">{formData.conditionDescription.length}/300 ký tự</span>
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={300}
                  value={formData.conditionDescription}
                  onChange={(e) => setFormData({ ...formData, conditionDescription: e.target.value })}
                  placeholder="Mô tả kỹ bề mặt carbon, viền edge guard có cọ xát không, lõi có bị xẹp hay phát tiếng kêu lạ khi đánh bóng..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-lime-500 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* 4. Mức giá mong muốn (VNĐ) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
                  <span>Mức giá mong muốn pass (VNĐ) *</span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Giá thị trường đề xuất: 3.500.000đ - 4.200.000đ
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    step={50000}
                    min={500000}
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: Number(e.target.value) })}
                    className="w-full pl-4 pr-16 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900 focus:border-lime-500 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-500">
                    VNĐ
                  </span>
                </div>
                
                {/* Bảng tính phân bổ phí bán */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Giá người mua thanh toán ký quỹ:</span>
                    <strong className="text-slate-900">{formData.expectedPrice.toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Phí kiểm định chuyên sâu (Pickle-Verify):</span>
                    <span>-50.000 đ</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Phí sàn bảo vệ ký quỹ (2%):</span>
                    <span>-{Math.round(formData.expectedPrice * 0.02).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-xs">
                    <span>Số tiền thực nhận khi hoàn tất giao dịch:</span>
                    <span className="text-emerald-700 font-black">
                      {(formData.expectedPrice - 50000 - Math.round(formData.expectedPrice * 0.02)).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Tải lên hình ảnh thực tế của vợt (3 - 5 ảnh) */}
              <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-lime-600" />
                      <span>Hình ảnh thực tế của sản phẩm *</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Yêu cầu tối thiểu <strong>3 ảnh</strong> và tối đa <strong>5 ảnh</strong> (Mặt vợt trước, sau, cạnh viền, cán vợt, mã vạch/tem)
                    </p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                    formData.productImages.length >= 3 && formData.productImages.length <= 5
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                  }`}>
                    {formData.productImages.length}/5 ảnh {formData.productImages.length >= 3 ? '✓ Đạt chuẩn' : '(Cần thêm)'}
                  </div>
                </div>

                {/* Danh sách các ảnh đã chọn / tải lên */}
                <div className="grid grid-cols-5 gap-2.5">
                  {formData.productImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ ...formData, activePreviewImageIdx: idx })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer group transition-all ${
                        formData.activePreviewImageIdx === idx
                          ? 'border-lime-500 ring-2 ring-lime-400/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <img src={imgUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {/* Badge số thứ tự */}
                      <span className="absolute top-1 left-1 bg-slate-950/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {idx === 0 ? 'Chính' : `#${idx + 1}`}
                      </span>

                      {/* Nút xóa ảnh (chỉ hiển thị khi > 1 ảnh) */}
                      {formData.productImages.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = formData.productImages.filter((_, i) => i !== idx);
                            setFormData({
                              ...formData,
                              productImages: newImages,
                              activePreviewImageIdx: Math.max(0, idx - 1),
                            });
                            showToast('Đã xóa 1 ảnh khỏi danh sách sản phẩm');
                          }}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                          title="Xóa ảnh này"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Ô thêm ảnh mới nếu chưa đủ 5 ảnh */}
                  {formData.productImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                      className="aspect-square rounded-xl border-2 border-dashed border-lime-500/70 hover:border-lime-500 bg-lime-50/40 hover:bg-lime-50 text-slate-700 hover:text-slate-950 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer p-1"
                    >
                      <Plus className="w-5 h-5 text-lime-600" />
                      <span className="text-[10px] font-bold text-center leading-tight">Thêm ảnh</span>
                    </button>
                  )}
                </div>

                {/* Input file ẩn hỗ trợ chọn ảnh từ thiết bị */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newUrls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        newUrls.push(URL.createObjectURL(files[i]));
                      }
                      const combined = [...formData.productImages, ...newUrls].slice(0, 5);
                      setFormData({
                        ...formData,
                        productImages: combined,
                        activePreviewImageIdx: combined.length - 1,
                      });
                      showToast(`📸 Đã tải thêm ${Math.min(files.length, 5 - formData.productImages.length)} ảnh từ thiết bị!`);
                    }
                  }}
                />

                {/* Chọn nhanh ảnh mẫu bổ sung từ thư viện demo */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                    <span>Thư viện mẫu thực tế có sẵn (bấm để thêm vào sản phẩm):</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {SAMPLE_PADDLE_IMAGES.map((imgUrl, idx) => {
                      const isAdded = formData.productImages.includes(imgUrl);
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAdded || formData.productImages.length >= 5}
                          onClick={() => {
                            if (formData.productImages.length < 5) {
                              setFormData({
                                ...formData,
                                productImages: [...formData.productImages, imgUrl],
                                activePreviewImageIdx: formData.productImages.length,
                              });
                              showToast('✓ Đã thêm ảnh góc chụp thực tế vào sản phẩm!');
                            }
                          }}
                          className={`relative w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                            isAdded
                              ? 'opacity-40 border-slate-300 cursor-not-allowed'
                              : formData.productImages.length >= 5
                              ? 'opacity-40 cursor-not-allowed border-slate-300'
                              : 'border-slate-300 hover:border-lime-500 hover:scale-105 shadow-xs'
                          }`}
                        >
                          <img src={imgUrl} alt={`Mẫu ${idx + 1}`} className="w-full h-full object-cover" />
                          {isAdded && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5 text-lime-400 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Nút Hành Động: XÁC NHẬN ĐĂNG BÁN */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Phí đăng bán: <strong className="text-emerald-600">0đ Miễn phí</strong>
                </span>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-lime-400/20 hover:scale-[1.01]"
                >
                  <Tag className="w-4 h-4" />
                  <span>Xác nhận đăng bán ({formData.productImages.length} ảnh)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Live Card Preview - Col 5 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 sticky top-20">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-lime-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-lime-400">
                      Xem trước thẻ hiển thị trên chợ
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    Người mua sẽ nhìn thấy
                  </span>
                </div>

                {/* Card mockup */}
                <div className="bg-white rounded-2xl p-4 text-slate-900 space-y-3 shadow-lg">
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={formData.productImages[formData.activePreviewImageIdx] || formData.productImages[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold">
                      Độ mới: {formData.conditionPercentage}%
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                      {formData.usedTime || 'Chưa cập nhật'}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                      <ImageIcon className="w-2.5 h-2.5 text-lime-400" />
                      <span>{formData.activePreviewImageIdx + 1}/{formData.productImages.length} ảnh</span>
                    </span>
                  </div>

                  {/* Thumbnail gallery trong Preview card */}
                  <div className="flex gap-1.5 overflow-x-auto">
                    {formData.productImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, activePreviewImageIdx: idx })}
                        className={`relative w-11 h-11 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          formData.activePreviewImageIdx === idx
                            ? 'border-lime-500 ring-2 ring-lime-400/40'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-lime-100 text-lime-900 text-[10px] font-black">
                      <ShieldCheck className="w-3 h-3 text-lime-700" />
                      <span>Kiểm định PickleMate 50k</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                      {formData.brand} {formData.modelName || 'Tên dòng vợt'}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                      {formData.conditionDescription || 'Mô tả tình trạng thực tế của vợt...'}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                      <span>Người bán: <strong className="text-slate-700">{user?.name || 'Người bán'}</strong></span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-slate-900">
                        {formData.expectedPrice ? formData.expectedPrice.toLocaleString('vi-VN') : '0'} đ
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 line-through">
                      {(formData.expectedPrice * 1.35).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-lime-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Quyền lợi của người bán:</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 pl-1">
                    <li>Người mua phải thanh toán ký quỹ 100% trước khi bạn gửi hàng.</li>
                    <li>Không sợ bị tráo vợt: Trung tâm kiểm tra và niêm phong seal bảo mật.</li>
                    <li>Tiền tự động giải ngân vào ví ngay khi người mua nhận vợt.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: TIẾN ĐỘ & RẼ NHÁNH KIỂM ĐỊNH (BƯỚC 3 & BƯỚC 4 TRONG ĐỀ BÀI)
          ========================================================================= */}
      {activeMainTab === 'workflow' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header chọn đơn hàng đang theo dõi */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-lime-400 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Quy trình xử lý đơn bán hàng</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                Tiến Độ Xử Lý & Rẽ Nhánh Kiểm Định
              </h2>
              <p className="text-xs text-slate-500">
                Đang xem đơn: <strong className="text-slate-900">{activeListing.paddleName}</strong> (#{activeListing.id})
              </p>
            </div>

            {/* Selector nhanh giữa các đơn bán */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Chọn đơn:</span>
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
              >
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    #{l.id} - {l.paddleName.slice(0, 24)}... ({l.expectedPrice.toLocaleString('vi-VN')} đ)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* =====================================================================
              BƯỚC 3 TRONG ĐỀ BÀI: KHI CÓ NGƯỜI MUA & GỬI VỢT KIỂM ĐỊNH
              ===================================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center font-black">
                  3
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg font-['Lexend',sans-serif]">
                    Bước 3: Trạng thái khi có người mua & Gửi vợt kiểm định
                  </h3>
                  <p className="text-xs text-slate-500">
                    Khi người mua cọc ký quỹ thành công → Người bán nhận thông báo và gửi vợt tới Trung tâm kiểm định PickleMate
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {activeListing.status === 'waiting_buyer' && (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Đang chờ người mua đặt cọc</span>
                  </span>
                )}
                {activeListing.status === 'buyer_ordered' && (
                  <span className="px-3 py-1.5 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center gap-1.5 animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-slate-950" />
                    <span>Có người mua mới! Chờ bạn xác nhận</span>
                  </span>
                )}
                {['shipping_to_center', 'center_inspecting', 'verified_passed', 'verified_failed', 'shipping_to_buyer', 'buyer_received', 'completed_payout'].includes(activeListing.status) && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã xác nhận đơn & Gửi kiểm định</span>
                  </span>
                )}
              </div>
            </div>

            {/* Tình huống 1: Đang chờ người mua -> Cung cấp nút mô phỏng "Có người mua" */}
            {activeListing.status === 'waiting_buyer' && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-slate-800">
                    Vợt đang được hiển thị công khai trên Chợ Vợt Cũ
                  </h4>
                  <p className="text-xs text-slate-500">
                    Hệ thống sẽ gửi thông báo đẩy và SMS ngay khi có người mua bấm Mua và nộp tiền cọc vào tài khoản Escrow.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateBuyerOrder}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-lime-400 font-black text-xs flex items-center gap-2 shrink-0 cursor-pointer shadow-sm hover:scale-105 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>[Mô phỏng] Kích hoạt: Có Người Mua Đặt Cọc</span>
                </button>
              </div>
            )}

            {/* Tình huống 2: Có người mua đặt cọc -> HIỂN THỊ THÔNG BÁO "CÓ NGƯỜI MUA" & NÚT "XÁC NHẬN ĐƠN" */}
            {activeListing.status === 'buyer_ordered' && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-lime-50 to-white border-2 border-lime-400 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-lime-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-black shadow">
                      🔔
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-lime-800 bg-lime-200/80 px-2 py-0.5 rounded">
                        Thông báo khẩn
                      </span>
                      <h4 className="font-black text-slate-900 text-base sm:text-lg mt-0.5">
                        Có Người Mua! Đã Thanh Toán Ký Quỹ 100%
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500">Số tiền ký quỹ tạm giữ:</span>
                    <p className="text-base font-black text-slate-900">
                      {activeListing.buyer?.depositAmount.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>

                {/* Thông tin người mua */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Người mua:</span>
                    <strong className="text-slate-900 font-bold">{activeListing.buyer?.name}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Số điện thoại:</span>
                    <strong className="text-slate-900 font-bold">{activeListing.buyer?.phone}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Địa chỉ giao hàng dự kiến:</span>
                    <strong className="text-slate-900 font-bold">{activeListing.buyer?.address}</strong>
                  </div>
                </div>

                {/* Nút hành động: "Xác nhận đơn" */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-slate-600">
                    Bấm xác nhận để nhận mã bưu kiện và tiến hành gửi vợt tới Trung tâm kiểm định.
                  </p>

                  <button
                    onClick={handleSellerConfirmOrder}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-lime-400 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                    <span>Xác nhận đơn & Nhận hướng dẫn gửi hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tình huống 3: Sau khi bấm xác nhận đơn -> HƯỚNG DẪN "GỬI VỢT ĐẾN TRUNG TÂM KIỂM ĐỊNH" */}
            {['shipping_to_center', 'center_inspecting', 'verified_passed', 'verified_failed', 'shipping_to_buyer', 'buyer_received', 'completed_payout'].includes(activeListing.status) && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center font-black">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      Hướng Dẫn: Gửi vợt đến Trung tâm kiểm định của PickleMate
                    </h4>
                    <p className="text-xs text-slate-500">
                      Gửi qua chuyển phát nhanh hoặc mang trực tiếp tới Trung tâm kiểm định gần nhất
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mã vận đơn & Mã QR */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Mã vận đơn bưu kiện (Miễn cước gửi đi)
                    </span>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500">Mã gửi hàng:</span>
                        <p className="text-base sm:text-lg font-mono font-black text-slate-900">
                          {activeListing.inspectionCenter?.trackingCode}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800 border">
                        <QrCode className="w-8 h-8" />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Đưa mã này cho bưu tá VNPost / GrabExpress hoặc dán nhãn lên gói hàng bọc xốp chống sốc.
                    </p>
                  </div>

                  {/* Địa chỉ trung tâm kiểm định */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Địa chỉ tiếp nhận kiểm định
                    </span>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900 font-bold block">
                          {activeListing.inspectionCenter?.name}
                        </strong>
                        <span>{activeListing.inspectionCenter?.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hotline trực ca: <strong>{activeListing.inspectionCenter?.hotline}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Nút hành động: "Tôi đã gửi hàng" */}
                {activeListing.status === 'shipping_to_center' && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="text-xs text-slate-600">
                      Sau khi giao gói hàng cho shipper hoặc gửi tại bưu cục, hãy bấm nút xác nhận dưới đây:
                    </div>
                    <button
                      onClick={handleSellerSentPaddle}
                      className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Tôi đã gửi hàng</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =====================================================================
              BƯỚC 4 TRONG ĐỀ BÀI: TRANG THEO DÕI KẾT QUẢ KIỂM ĐỊNH & CÁC KỊCH BẢN RẼ NHÁNH
              ===================================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center font-black">
                  4
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg font-['Lexend',sans-serif]">
                    Bước 4: Theo Dõi Kết Quả Kiểm Định & Các Kịch Bản Rẽ Nhánh
                  </h3>
                  <p className="text-xs text-slate-500">
                    Phí kiểm định chuyên sâu: <strong>50.000 VNĐ</strong> (Siêu âm lõi Honeycomb, kiểm tra độ nhám Toray T700, quét nứt ngầm)
                  </p>
                </div>
              </div>

              {/* BỘ CHUYỂN ĐỔI KỊCH BẢN KIỂM THỬ (TESTING SCENARIOS SWITCHER) */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
                <span className="text-[10px] font-bold text-slate-500 px-2">Kiểm thử kịch bản:</span>
                <button
                  type="button"
                  onClick={() => handleApplyInspectionResult('passed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    inspectionScenario === 'passed'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>[Kịch bản 1: ĐẠT]</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyInspectionResult('failed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    inspectionScenario === 'failed'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>[Kịch bản 2: KHÔNG ĐẠT]</span>
                </button>
              </div>
            </div>

            {/* Khi vợt đang được trung tâm kiểm định */}
            {activeListing.status === 'center_inspecting' && (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Chuyên viên Pickle-Verify đang kiểm định vợt...</h4>
                    <p className="text-xs text-amber-800">
                      Đang thực hiện quy trình 4 bước: Đo độ dày 16mm, thử áp lực lõi, đo độ ma sát spin bóng và quét vết nứt viền.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApplyInspectionResult('passed')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    Xem Kịch Bản ĐẠT
                  </button>
                  <button
                    onClick={() => handleApplyInspectionResult('failed')}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    Xem Kịch Bản KHÔNG ĐẠT
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================================
                TRƯỜNG HỢP 1: VỢT ĐẠT CHUẨN (PASSED)
                =================================================================== */}
            {(inspectionScenario === 'passed' && activeListing.status !== 'center_inspecting' && activeListing.status !== 'verified_failed' && activeListing.status !== 'cancelled_returned') && (
              <div className="space-y-6">
                
                {/* Banner thông báo: VỢT ĐẠT CHUẨN */}
                <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                          Chứng nhận chính thức
                        </span>
                        <h4 className="text-lg sm:text-xl font-black text-emerald-950 mt-0.5">
                          ✓ Vợt Đạt Chuẩn Kiểm Định (Pickle-Verified Passed)
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-emerald-700">Phí kiểm định trừ vào giao dịch:</span>
                      <p className="text-sm font-black text-emerald-900">50.000 VNĐ</p>
                    </div>
                  </div>

                  {/* Báo cáo chi tiết 4 tiêu chí kiểm định */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-slate-400 text-[10px] block font-bold">1. Lõi Honeycomb:</span>
                      <strong className="text-emerald-900 block">✓ Nguyên khối 100%</strong>
                      <p className="text-[11px] text-slate-500">Không nứt ngầm, không mềm dập sweetspot.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-slate-400 text-[10px] block font-bold">2. Mặt Carbon Toray T700:</span>
                      <strong className="text-emerald-900 block">✓ Độ nhám 94% USAP</strong>
                      <p className="text-[11px] text-slate-500">Mặt vợt giữ độ ma sát chuẩn tạo xoáy bóng.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-slate-400 text-[10px] block font-bold">3. Viền Edge Guard:</span>
                      <strong className="text-emerald-900 block">✓ Ép viền khít chắc</strong>
                      <p className="text-[11px] text-slate-500">Không rung rơ khi va đập lực mạnh.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-slate-400 text-[10px] block font-bold">4. Cân nặng & Trọng tâm:</span>
                      <strong className="text-emerald-900 block">✓ Chuẩn 226g (±2g)</strong>
                      <p className="text-[11px] text-slate-500">Điểm cân bằng chuẩn thông số nhà sản xuất.</p>
                    </div>
                  </div>
                </div>

                {/* Các bước tiếp theo trong nhánh ĐẠT: Giao hàng -> Xác nhận nhận hàng -> Nhận tiền */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CornerDownRight className="w-4 h-4 text-lime-600" />
                    <span>Các bước hoàn tất giao dịch tiếp theo:</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Bước A: Giao hàng cho người mua */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      activeListing.status === 'shipping_to_buyer' || activeListing.status === 'buyer_received' || activeListing.status === 'completed_payout'
                        ? 'bg-white border-emerald-300 shadow-sm'
                        : 'bg-white/60 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Giai đoạn 1</span>
                        {['shipping_to_buyer', 'buyer_received', 'completed_payout'].includes(activeListing.status) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900">1. Giao hàng cho người mua</h5>
                      <p className="text-xs text-slate-500 mt-1">
                        Trung tâm đóng gói niêm phong seal bảo chứng và bàn giao cho shipper hỏa tốc.
                      </p>

                      {activeListing.status === 'verified_passed' && (
                        <button
                          onClick={handleShipToBuyer}
                          className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-lime-400 text-xs font-black cursor-pointer"
                        >
                          Chuyển sang "Giao hàng"
                        </button>
                      )}
                    </div>

                    {/* Bước B: Người mua xác nhận nhận hàng */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      activeListing.status === 'buyer_received' || activeListing.status === 'completed_payout'
                        ? 'bg-white border-emerald-300 shadow-sm'
                        : 'bg-white/60 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Giai đoạn 2</span>
                        {['buyer_received', 'completed_payout'].includes(activeListing.status) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900">2. Xác nhận nhận hàng</h5>
                      <p className="text-xs text-slate-500 mt-1">
                        Người mua mở hộp kiểm tra đúng seal Pickle-Verify và bấm "Đã nhận hàng thành công".
                      </p>

                      {activeListing.status === 'shipping_to_buyer' && (
                        <button
                          onClick={handleBuyerConfirmReceived}
                          className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer"
                        >
                          [Giả lập] Người mua xác nhận
                        </button>
                      )}
                    </div>

                    {/* Bước C: Nhận tiền giải ngân */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      activeListing.status === 'completed_payout'
                        ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                        : 'bg-white/60 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Giai đoạn 3</span>
                        {activeListing.status === 'completed_payout' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Wallet className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900">3. Nhận tiền (Giải ngân)</h5>
                      <p className="text-xs text-slate-500 mt-1">
                        Hệ thống giải ngân tiền từ Escrow vào ví người bán sau khi trừ phí kiểm định 50k và phí sàn.
                      </p>

                      {activeListing.status === 'buyer_received' && (
                        <button
                          onClick={handleReceivePayout}
                          className="mt-3 w-full py-2 px-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black shadow-md cursor-pointer animate-pulse"
                        >
                          Bấm Nhận Tiền Ngay
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Bảng kê chi tiết giải ngân tài chính khi hoàn tất */}
                  {activeListing.status === 'completed_payout' && (
                    <div className="p-5 rounded-2xl bg-white border border-emerald-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <h5 className="font-black text-sm text-slate-900">
                            Đã Giải Ngân Thành Công Vào Ví PickleMate Của Bạn
                          </h5>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                          Mã GD: #PAYOUT-{activeListing.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 text-[11px]">Giá bán vợt:</span>
                          <p className="font-bold text-slate-900">{activeListing.expectedPrice.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px]">Phí kiểm định:</span>
                          <p className="font-bold text-rose-600">-50.000 đ</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px]">Phí vận hành sàn (2%):</span>
                          <p className="font-bold text-rose-600">
                            -{Math.round(activeListing.expectedPrice * 0.02).toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px]">Số tiền thực nhận vào ví:</span>
                          <p className="font-black text-emerald-700 text-sm">
                            {(activeListing.expectedPrice - 50000 - Math.round(activeListing.expectedPrice * 0.02)).toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* ===================================================================
                TRƯỜNG HỢP 2: VỢT KHÔNG ĐẠT CHUẨN (FAILED)
                =================================================================== */}
            {(inspectionScenario === 'failed' || activeListing.status === 'verified_failed' || activeListing.status === 'cancelled_returned') && (
              <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-400 text-rose-950 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-200 px-2 py-0.5 rounded">
                        Biên bản kiểm tra không phù hợp
                      </span>
                      <h4 className="text-lg sm:text-xl font-black text-rose-950 mt-0.5">
                        ⚠️ Vợt Không Đạt Mô Tả / Không Đạt Chuẩn Kiểm Định
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    Kích hoạt chính sách bảo vệ ký quỹ
                  </span>
                </div>

                {/* Chi tiết nguyên nhân không đạt */}
                <div className="bg-white p-4 rounded-2xl border border-rose-200 text-xs space-y-2">
                  <span className="font-black text-rose-900 block uppercase tracking-wider text-[11px]">
                    Lý do không đạt từ chuyên viên thẩm định:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activeListing.inspectionCenter?.reportSummary || 
                      'Phát hiện vết nứt ngầm ở lõi Honeycomb góc 2 giờ và độ bóng mòn mặt carbon vượt quá 25% so với mô tả ban đầu.'}
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5 text-rose-700">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>Sai lệch độ dày và biến dạng tổ ong bên trong</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-700">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>Không đảm bảo an toàn thi đấu theo chuẩn USAP</span>
                    </div>
                  </div>
                </div>

                {/* Xử lý rẽ nhánh: HỦY GIAO DỊCH / HOÀN TIỀN & GỬI TRẢ VỢT */}
                <div className="p-4 bg-white/80 rounded-2xl border border-rose-200 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                    <RefreshCw className="w-4 h-4" />
                    <span>Quy trình xử lý tự động của hệ thống:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <strong className="block text-slate-900 mb-1">1. Phía người mua:</strong>
                      <span>Hệ thống thực hiện <strong>Hủy giao dịch & Hoàn 100% tiền ký quỹ</strong> về tài khoản của người mua theo chính sách bảo vệ người tiêu dùng.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <strong className="block text-slate-900 mb-1">2. Phía người bán (Bạn):</strong>
                      <span>Vợt sẽ được <strong>đóng gói hoàn trả lại</strong> theo địa chỉ người bán của bạn. Mã vận đơn hoàn trả: <strong className="font-mono text-slate-900">RETURN-PKM-8812</strong>.</span>
                    </div>
                  </div>

                  {activeListing.status !== 'cancelled_returned' ? (
                    <button
                      onClick={handleReturnPaddleToSeller}
                      className="mt-2 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Xác nhận hoàn trả vợt về địa chỉ của tôi</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="p-2.5 bg-rose-100 text-rose-900 rounded-xl text-center font-bold text-xs">
                      ✓ Đã tạo lệnh hoàn trả vợt. Đơn vị vận chuyển sẽ giao lại vợt cho bạn trong 24-48 giờ.
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </section>
      )}

      {/* =========================================================================
          TAB 3: QUẢN LÝ ĐƠN BÁN CỦA TÔI (SELLER DASHBOARD)
          ========================================================================= */}
      {activeMainTab === 'dashboard' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-lime-400 text-[10px] font-black uppercase tracking-wider mb-1">
                <Layers className="w-3 h-3" />
                <span>Dashboard Quản Lý</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                Quản Lý Đơn Bán Của Tôi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Theo dõi tiến độ từ lúc đăng bán, tiếp nhận người mua, kiểm định đến khi nhận tiền vào ví
              </p>
            </div>

            <button
              onClick={() => setActiveMainTab('create')}
              className="px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-md shadow-lime-400/20"
            >
              <Tag className="w-4 h-4" />
              <span>Đăng Bán Thêm Vợt Khác</span>
            </button>
          </div>

          {/* 4 Thẻ Thống Kê Nhanh (Metric Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Doanh số đã nhận
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                {totalEarned.toLocaleString('vi-VN')} đ
              </p>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {completedCount} đơn thành công
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tiền ký quỹ đang xử lý
              </span>
              <p className="text-xl sm:text-2xl font-black text-lime-600 font-['Lexend',sans-serif]">
                {escrowPending.toLocaleString('vi-VN')} đ
              </p>
              <span className="text-[11px] text-slate-500">
                Tạm giữ an toàn bởi Escrow
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Vợt đang giao dịch
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 font-['Lexend',sans-serif]">
                {activeCount} cây
              </p>
              <span className="text-[11px] text-slate-500">
                Đang chờ khách hoặc kiểm tra
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Điểm uy tín người bán
              </span>
              <div className="flex items-center gap-2">
                <p className="text-xl sm:text-2xl font-black text-amber-500 font-['Lexend',sans-serif]">
                  5.0 ★
                </p>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black">
                  DUPR VERIFIED
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">
                100% giao đúng hạn
              </span>
            </div>

          </div>

          {/* Bộ lọc Tabs trạng thái */}
          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {[
              { id: 'all', label: 'Tất cả đơn', count: listings.length },
              { 
                id: 'waiting', 
                label: 'Chờ người mua', 
                count: listings.filter((i) => i.status === 'waiting_buyer').length 
              },
              { 
                id: 'inspecting', 
                label: 'Đang kiểm định', 
                count: listings.filter((i) => ['buyer_ordered', 'shipping_to_center', 'center_inspecting', 'verified_passed', 'verified_failed'].includes(i.status)).length 
              },
              { 
                id: 'shipping', 
                label: 'Đang giao hàng', 
                count: listings.filter((i) => i.status === 'shipping_to_buyer' || i.status === 'buyer_received').length 
              },
              { 
                id: 'completed', 
                label: 'Đã hoàn tất / Nhận tiền', 
                count: listings.filter((i) => i.status === 'completed_payout' || i.status === 'cancelled_returned').length 
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDashboardFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  dashboardFilter === tab.id
                    ? 'bg-slate-900 text-lime-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  dashboardFilter === tab.id ? 'bg-lime-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* DANH SÁCH CÁC ĐƠN BÁN (TABLE / CARDS) */}
          <div className="space-y-4">
            {filteredDashboardListings.map((item) => {
              const isSelected = selectedListingId === item.id;
              
              // Helper badge trạng thái
              const renderStatusBadge = () => {
                switch (item.status) {
                  case 'waiting_buyer':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>Chờ người mua</span>
                      </span>
                    );
                  case 'buyer_ordered':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-lime-100 text-lime-900 border border-lime-300 flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3 text-lime-700" />
                        <span>Có người mua! Chờ xác nhận</span>
                      </span>
                    );
                  case 'shipping_to_center':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-blue-700" />
                        <span>Đang gửi đến TT kiểm định</span>
                      </span>
                    );
                  case 'center_inspecting':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-purple-700 animate-spin" />
                        <span>Đang kiểm định (50k)</span>
                      </span>
                    );
                  case 'verified_passed':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Đạt chuẩn kiểm định</span>
                      </span>
                    );
                  case 'shipping_to_buyer':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-200 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-sky-700" />
                        <span>Đang giao cho người mua</span>
                      </span>
                    );
                  case 'buyer_received':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-950 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-800" />
                        <span>Người mua đã nhận • Chờ giải ngân</span>
                      </span>
                    );
                  case 'completed_payout':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Đã hoàn tất • Đã nhận tiền</span>
                      </span>
                    );
                  case 'verified_failed':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-700" />
                        <span>Không đạt kiểm định</span>
                      </span>
                    );
                  case 'cancelled_returned':
                    return (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        <span>Đã hủy • Đang hoàn trả vợt</span>
                      </span>
                    );
                  default:
                    return null;
                }
              };

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl bg-white border transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:shadow-md ${
                    isSelected ? 'border-2 border-lime-500 ring-2 ring-lime-400/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.paddleName}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                      />
                      <span className="absolute bottom-1 right-1 bg-slate-950/80 text-lime-400 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <ImageIcon className="w-2.5 h-2.5" />
                        <span>{item.images.length}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">#{item.id}</span>
                        <span className="text-[10px] text-slate-400">• Đăng lúc: {item.createdAt}</span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-1">
                        {item.paddleName}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Đã dùng: <strong className="text-slate-700">{item.usedTime}</strong></span>
                        <span>•</span>
                        <span>Độ mới: <strong className="text-slate-700">{item.conditionPercentage}%</strong></span>
                        {item.buyer && (
                          <>
                            <span>•</span>
                            <span>Người mua: <strong className="text-emerald-700">{item.buyer.name}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 block">Giá mong muốn</span>
                      <strong className="text-base sm:text-lg font-black text-slate-900">
                        {item.expectedPrice.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {renderStatusBadge()}

                      <button
                        onClick={() => {
                          setSelectedListingId(item.id);
                          setActiveMainTab('workflow');
                        }}
                        className="text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Xử lý & Xem chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      )}

    </div>
  );
};

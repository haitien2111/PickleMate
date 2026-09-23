export type ScreenId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export type SellerOrderStatus = 
  | 'waiting_buyer'      // Chờ người mua
  | 'buyer_ordered'      // Đã có người mua đặt cọc ký quỹ -> Chờ xác nhận
  | 'shipping_to_center' // Người bán đang gửi hàng đến TT kiểm định
  | 'center_inspecting'  // TT Pickle-Verify đang kiểm định 50k
  | 'verified_passed'    // ĐẠT CHUẨN -> Chuẩn bị giao người mua
  | 'shipping_to_buyer'  // Đang giao cho người mua
  | 'buyer_received'     // Người mua đã nhận -> Chờ giải ngân
  | 'completed_payout'   // Hoàn tất đơn -> Đã nhận tiền vào ví
  | 'verified_failed'    // KHÔNG ĐẠT -> Hủy đơn & hoàn tiền
  | 'cancelled_returned';// Đang gửi trả vợt về người bán

export interface SellerListingItem {
  id: string;
  paddleName: string;
  brand: string;
  usedTime: string;
  conditionDescription: string;
  conditionPercentage: number;
  expectedPrice: number;
  originalPrice: number;
  images: string[];
  status: SellerOrderStatus;
  createdAt: string;
  buyer?: {
    name: string;
    phone: string;
    address: string;
    depositAmount: number;
    orderedAt: string;
  };
  inspectionCenter?: {
    name: string;
    address: string;
    hotline: string;
    trackingCode: string;
    receivedAt?: string;
    fee: number;
    result?: 'passed' | 'failed';
    reportSummary?: string;
    details?: {
      surfaceIntegrity: string;
      honeycombCore: string;
      edgeGuard: string;
      weightAndBalance: string;
    };
  };
  payoutSummary?: {
    grossAmount: number;
    inspectionFee: number;
    platformFee: number;
    netReceived: number;
  };
}

export interface UserProfile {
  name: string;
  lastName?: string;
  avatar: string;
  dupr: number;
  walletBalance: number;
  phone: string;
  address: string;
  gender?: string;
  role?: 'player' | 'court_owner';
}

export interface Court {
  id: string;
  name: string;
  district: string;
  address: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  lat: number;
  lng: number;
  amenities: string[];
  description: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
  price: number;
}

export interface BookingState {
  court: Court | null;
  date: string;
  timeSlot: string;
  isFiftyPercentDeposit: boolean;
  totalPrice: number;
  depositAmount: number;
  bookingCode: string;
  paymentComplete: boolean;
}

export interface MatchParticipant {
  name: string;
  avatar: string;
  dupr: number;
  isHost?: boolean;
  hasPaid?: boolean;
  isPlaceholder?: boolean;
}

export interface SocialMatch {
  id: string;
  title: string;
  courtName: string;
  district: string;
  time: string;
  duprRequirement: string;
  duprMin: number;
  duprMax: number;
  totalSlots: number;
  joinedSlots: number;
  totalCourtFee: number;
  pricePerSlot: number;
  host: {
    name: string;
    avatar: string;
    dupr: number;
  };
  participants: MatchParticipant[];
  format: string;
}

export interface Paddle {
  id: string;
  name: string;
  brand: string;
  conditionPercentage: number;
  price: number;
  originalPrice: number;
  isVerifiedEligible: boolean;
  verificationFee: number;
  images: string[];
  seller: {
    name: string;
    avatar: string;
    rating: number;
    salesCount: number;
    isKycVerified: boolean;
  };
  specs: {
    coreThickness: string;
    weight: string;
    surface: string;
    swingWeight: string;
  };
  description: string;
}

export interface CustomLaserSettings {
  enabled: boolean;
  text: string;
  font: string;
  position: 'bottom-right' | 'center' | 'side-edge' | 'neck';
  fontSize: number;
  signatureImage?: string;
  overwrapColor: string;
  laserStyle: 'silver' | 'gold' | 'neon';
}

export interface EscrowOrder {
  orderCode: string;
  paddle: Paddle;
  isVerificationRequested: boolean;
  customization: CustomLaserSettings;
  shippingFee: number;
  totalPrice: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  status: 'payment_pending' | 'escrow_held' | 'verifying' | 'engraving' | 'shipping' | 'completed';
  createdAt: string;
}

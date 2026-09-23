import React, { useState } from 'react';
import { 
  Camera, 
  Mail, 
  MapPin, 
  User as UserIcon, 
  Edit3, 
  MoreVertical, 
  Award, 
  CheckCircle2, 
  ChevronDown, 
  ExternalLink,
  Shield,
  ArrowRight,
  TrendingUp,
  Info,
  LogOut,
  Trash2,
  LogIn
} from 'lucide-react';
import { UserProfile, ScreenId } from '../types';

interface Screen11ProfileAndRatingsProps {
  user: UserProfile | null;
  isLoggedIn?: boolean;
  onNavigate: (screen: ScreenId) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const Screen11ProfileAndRatings: React.FC<Screen11ProfileAndRatingsProps> = ({
  user,
  isLoggedIn = false,
  onNavigate,
  onUpdateUser
}) => {
  // Form states
  const [lastName, setLastName] = useState(user?.lastName || 'Nguyễn');
  const [firstName, setFirstName] = useState(user?.name || 'Player');
  const [gender, setGender] = useState(user?.gender || 'Nam');
  const [location, setLocation] = useState(user?.address || 'Quận 7, TP. Hồ Chí Minh');
  const [duprSource, setDuprSource] = useState('DUPR Global Official System (Algorithm v2.4)');
  const [isSaved, setIsSaved] = useState(false);

  // Synchronize when user prop changes
  React.useEffect(() => {
    if (user) {
      setFirstName(user.name);
      if (user.lastName) setLastName(user.lastName);
      if (user.gender) setGender(user.gender);
      if (user.address) setLocation(user.address);
    }
  }, [user?.name, user?.lastName, user?.gender, user?.address]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser && user) {
      onUpdateUser({
        name: firstName.trim() || user?.name || 'Player',
        lastName: lastName.trim(),
        gender: gender,
        address: location.trim(),
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 bg-lime-100 text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <UserIcon className="w-8 h-8 text-slate-800" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 font-['Lexend',sans-serif]">
            Chưa có thông tin hồ sơ
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Bạn chưa đăng nhập vào PickleMate. Vui lòng đăng nhập hoặc đăng ký tài khoản Người chơi để xem thông tin và hồ sơ cá nhân, chỉ số DUPR cũng như lịch sử thi đấu của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate(14)}
              className="w-full sm:w-auto px-8 py-3.5 bg-lime-400 hover:bg-lime-300 text-[#0A1128] font-black rounded-xl text-sm transition-all shadow-sm hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              id="profile-unauth-login-btn"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập / Đăng ký ngay</span>
            </button>
            <button
              onClick={() => onNavigate(1)}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Về Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-6 font-sans">
      {/* =========================================================================
          BỐ CỤC TỔNG THỂ (SPLIT LAYOUT: 2 CỘT)
          Sidebar trái (khoảng 28%) và Main Content phải (khoảng 72%)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =======================================================================
            1. CỘT TRÁI (SIDEBAR STRUCTURE: 25% - 30% CHIỀU RỘNG, LG:COL-SPAN-4 HOẶC 3)
            ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3.5 space-y-5">
          {/* Card Sidebar Profile */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            
            {/* Cụm Avatar: Căn giữa, khối tròn lớn + nút nhỏ icon máy ảnh ở góc dưới phải */}
            <div className="relative mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-slate-100 shadow-inner bg-slate-100 flex items-center justify-center">
                <img 
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                  alt={user?.name || 'User'} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button 
                type="button"
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-slate-900 text-lime-400 border-2 border-white shadow-md flex items-center justify-center hover:bg-slate-800 hover:scale-105 transition-all"
                title="Thay đổi ảnh đại diện"
                id="sidebar-change-avatar-btn"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Cụm Thông tin: Tên in đậm + 2 dòng xếp dọc (dòng 1 text phụ, dòng 2 email) */}
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {lastName} {firstName}
            </h1>
            
            <div className="mt-2.5 space-y-1.5 w-full text-left bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600">
              {/* Dòng 1: Icon + Text phụ */}
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              {/* Dòng 2: Icon + Email */}
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">trhaitien21111@gmail.com</span>
              </div>
            </div>

            {/* Cụm Navigation: Nút menu rộng 100%, thể hiện rõ trạng thái Active */}
            <div className="w-full mt-5 pt-5 border-t border-slate-100 space-y-1.5">
              <button 
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-lime-400 text-slate-950 font-bold text-sm shadow-sm border border-lime-500/30 transition-all text-left"
                id="sidebar-nav-profile-active"
              >
                <UserIcon className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="flex-1">Hồ sơ</span>
                <span className="w-2 h-2 rounded-full bg-slate-950 shrink-0"></span>
              </button>
            </div>
          </div>

          {/* Tiện ích ví & bảo vệ người chơi hỗ trợ (Wireframe Sub-card) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span>Trạng thái tài khoản:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Đã xác thực
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Hạng DUPR toàn quốc:</span>
              <span className="font-mono font-bold text-slate-800">#1,420 VN</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Số trận đã thi đấu:</span>
              <span className="font-mono font-bold text-slate-800">28 trận (68% Win)</span>
            </div>
          </div>
        </aside>

        {/* =======================================================================
            2. CỘT PHẢI (MAIN CONTENT STRUCTURE)
            Phần A: Cụm Form Hồ sơ
            Phần B: Cụm Xếp hạng (Ratings)
            Phần C: Cụm Chi tiết Liên hệ
            ======================================================================= */}
        <main className="lg:col-span-8 xl:col-span-8.5 space-y-6">

          {/* =====================================================================
              PHẦN A: CỤM FORM HỒ SƠ
              - Tiêu đề H2: "Hồ sơ"
              - Form Grid (2 cột): Hàng 1: Họ & Tên. Hàng 2: Giới tính & Vị trí (icon Edit)
              ===================================================================== */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Hồ sơ</span>
              </h2>
              {isSaved && (
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded font-medium flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã cập nhật hồ sơ
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Form Grid 2 cột: 4 trường dữ liệu xếp thành 2 hàng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                {/* Hàng 1 - Cột 1: Ô Input cho "Họ" */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Họ
                  </label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nhập họ..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all font-medium"
                    id="profile-lastname-input"
                  />
                </div>

                {/* Hàng 1 - Cột 2: Ô Input cho "Tên" */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Tên
                  </label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nhập tên..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all font-medium"
                    id="profile-firstname-input"
                  />
                </div>

                {/* Hàng 2 - Cột 1: Ô Dropdown chọn "Giới tính" */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Giới tính
                  </label>
                  <div className="relative">
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all font-medium pr-10 cursor-pointer"
                      id="profile-gender-select"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Hàng 2 - Cột 2: Ô Text box hiển thị "Vị trí" (có icon Edit ở góc phải của ô) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Vị trí
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Khu vực hoạt động..."
                      className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all font-medium"
                      id="profile-location-input"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-800 transition-colors"
                      title="Chỉnh sửa vị trí"
                      onClick={() => {
                        const input = document.getElementById('profile-location-input');
                        input?.focus();
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Action bar for Form */}
              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  id="profile-save-btn"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </section>


          {/* =====================================================================
              PHẦN B: CỤM XẾP HẠNG (RATINGS)
              - Tiêu đề H3: "Xếp hạng"
              - Highlight Grid (lưới 2 cột):
                * Card 1: viền đứt nét. Góc trên trái Text Logo lớn, góc trên phải Badge nhỏ điểm số. Button rộng 100% phía dưới.
                * Card 2: viền liền. Góc trên phải khối Badge xoay nghiêng đè lên viền. Bên trong gồm 1 Icon, 1 Tiêu đề in đậm, 1 Text mô tả.
              - Stats Grid (lưới 4 cột): 4 ô Input trạng thái chỉ đọc (Read-only), mỗi ô có Label tiêu đề.
              - Cụm Dropdown Nguồn: 1 Label, 1 Dropdown rộng 100%, 1 dòng Text mô tả nhỏ bên dưới.
              ===================================================================== */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Xếp hạng</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">DUPR Rating System</span>
            </div>

            {/* Highlight Grid (lưới 2 cột) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Card 1: Sử dụng viền đứt nét (border-dashed)
                  - Góc trên bên trái: Text Logo lớn
                  - Góc trên bên phải: Badge nhỏ hiển thị điểm số
                  - Phía dưới cùng: Button rộng 100% */}
              <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-5 flex flex-col justify-between transition-colors bg-slate-50/40">
                <div className="flex items-start justify-between gap-2 mb-6">
                  {/* Text Logo lớn */}
                  <div>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 block font-['Lexend',sans-serif]">
                      DUPR<span className="text-lime-500">.</span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Dynamic Universal Rating
                    </span>
                  </div>

                  {/* Badge nhỏ hiển thị điểm số */}
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-lime-400 text-slate-950 font-black text-sm sm:text-base rounded-md shadow-sm border border-lime-500/30">
                    {typeof user?.dupr === 'number' ? user.dupr.toFixed(2) : (user?.dupr || '3.85')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mb-4">
                  Điểm số được tính toán tự động dựa trên kết quả các trận đấu chính thức và giao lưu trên hệ thống PickleMate.
                </div>

                {/* Button rộng 100% */}
                <button 
                  type="button"
                  onClick={() => onNavigate(5)}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-lime-400 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  id="rating-dupr-verify-btn"
                >
                  <span>Xem lịch sử thi đấu DUPR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: Sử dụng viền liền (border-solid)
                  - Góc trên cùng bên phải: khối Badge xoay nghiêng đè lên viền
                  - Bên trong: 1 Icon, 1 Tiêu đề in đậm, 1 Text mô tả */}
              <div className="relative border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between overflow-hidden">
                {/* Khối Badge xoay nghiêng đè lên viền góc trên bên phải */}
                <div className="absolute -top-1 -right-1 overflow-visible">
                  <div className="bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 shadow-md rounded-bl-lg transform rotate-2">
                    Xác thực
                  </div>
                </div>

                <div>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 text-lime-700" />
                  </div>

                  {/* Dòng Tiêu đề in đậm */}
                  <h4 className="text-base font-black text-slate-900">
                    Trình độ: Trung cấp (Intermediate)
                  </h4>

                  {/* Dòng Text mô tả bên dưới */}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Bạn đủ điều kiện tham gia các giải đấu phong trào Open DUPR 3.0 - 3.5 và các kèo ghép tranh hạng cấp Quận/Thành phố.
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Cập nhật gần nhất:</span>
                  <span className="font-mono text-slate-700">Hôm nay (12:40)</span>
                </div>
              </div>

            </div>

            {/* Stats Grid (lưới 4 cột): 4 ô Input trạng thái chỉ đọc (Read-only), mỗi ô có Label tiêu đề */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Chỉ số chi tiết (Chỉ đọc)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                
                {/* Cột 1 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Đôi Nam (Doubles)
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value="3.24"
                    className="w-full px-3 py-2 bg-slate-100/90 text-slate-900 border border-slate-200 rounded-lg text-sm font-mono font-bold select-all cursor-default"
                  />
                </div>

                {/* Cột 2 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Đơn (Singles)
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value="3.10"
                    className="w-full px-3 py-2 bg-slate-100/90 text-slate-900 border border-slate-200 rounded-lg text-sm font-mono font-bold select-all cursor-default"
                  />
                </div>

                {/* Cột 3 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Độ tin cậy (Reliability)
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value="86%"
                    className="w-full px-3 py-2 bg-slate-100/90 text-emerald-700 border border-slate-200 rounded-lg text-sm font-mono font-bold select-all cursor-default"
                  />
                </div>

                {/* Cột 4 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Số hiệp thắng (Half-win)
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value="19 / 28"
                    className="w-full px-3 py-2 bg-slate-100/90 text-slate-900 border border-slate-200 rounded-lg text-sm font-mono font-bold select-all cursor-default"
                  />
                </div>

              </div>
            </div>

            {/* Cụm Dropdown Nguồn: 1 Label, 1 Dropdown (Select box) rộng 100%, 1 dòng Text mô tả nhỏ bên dưới */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Nguồn dữ liệu xếp hạng
              </label>
              <div className="relative">
                <select 
                  value={duprSource}
                  onChange={(e) => setDuprSource(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 hover:bg-white text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 transition-all font-medium pr-10 cursor-pointer"
                  id="rating-source-select"
                >
                  <option value="DUPR Global Official System (Algorithm v2.4)">
                    DUPR Global Official System (Algorithm v2.4) - Liên đoàn Quốc tế
                  </option>
                  <option value="PickleMate Verified Local League (Vietnam)">
                    PickleMate Verified Local League (Vietnam) - Giải đấu nội bộ
                  </option>
                  <option value="USAPA Skill Assessment (Benchmark)">
                    USAPA Skill Assessment (Benchmark) - Quy chuẩn Hoa Kỳ
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Hệ thống tự động đồng bộ điểm DUPR của bạn mỗi 6 giờ từ cơ sở dữ liệu xếp hạng toàn cầu.</span>
              </p>
            </div>
          </section>


          {/* =====================================================================
              PHẦN C: CỤM CHI TIẾT LIÊN HỆ
              - Tiêu đề H3: "Chi tiết". Phía trên có đường kẻ ngang (Divider) phân cách.
              - List Layout (danh sách xếp dọc): mỗi mục nằm ngang, căn giữa chiều dọc, có viền mỏng ở đáy.
                * Hàng 1: Chia 3 phần. Trái: Tiêu đề Label. Giữa: Text nội dung + Badge trạng thái + Text Link thêm mới. Phải: Icon 3 chấm thao tác (đẩy sát lề phải).
                * Hàng 2 & 3: Chia 2 phần. Trái: Tiêu đề Label. Giữa: Text Link hành động.
              ===================================================================== */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-sm">
            
            {/* Tiêu đề H3: "Chi tiết" với đường kẻ ngang Divider phía trên */}
            <div className="pt-1 mb-5">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Chi tiết
              </h3>
            </div>

            {/* List Layout: Danh sách xếp dọc, mỗi mục nằm ngang, có viền mỏng phân cách đáy */}
            <div className="divide-y divide-slate-200">
              
              {/* Hàng 1: Chia 3 phần
                  - Trái: Tiêu đề Label
                  - Giữa: Text nội dung + Badge trạng thái + Text Link thêm mới
                  - Phải: Icon 3 chấm thao tác (đẩy sát lề phải) */}
              <div className="py-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
                {/* Trái: Tiêu đề Label */}
                <div className="w-28 sm:w-36 shrink-0 font-bold text-slate-600 uppercase tracking-wider text-xs">
                  Email
                </div>

                {/* Giữa: Text nội dung + Badge trạng thái + Text Link thêm mới */}
                <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3 text-slate-800">
                  <span className="font-medium text-slate-900">trhaitien21111@gmail.com</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Chính
                  </span>
                  <button 
                    type="button" 
                    className="text-lime-600 hover:text-lime-700 hover:underline font-bold text-xs"
                    onClick={() => alert("Mở modal thêm địa chỉ email phụ")}
                  >
                    + Thêm mới
                  </button>
                </div>

                {/* Phải: Icon 3 chấm thao tác đẩy sát lề phải */}
                <div className="shrink-0">
                  <button 
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Tùy chọn bổ sung"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hàng 2: Chia 2 phần
                  - Trái: Tiêu đề Label
                  - Giữa: Text Link hành động */}
              <div className="py-4 flex items-center gap-4 text-xs sm:text-sm">
                {/* Trái: Tiêu đề Label */}
                <div className="w-28 sm:w-36 shrink-0 font-bold text-slate-600 uppercase tracking-wider text-xs">
                  Số điện thoại
                </div>

                {/* Giữa: Text Link hành động */}
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-slate-800 font-medium">+84 908 *** 892</span>
                  <button 
                    type="button"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-bold text-xs"
                    onClick={() => alert("Mở form cập nhật số điện thoại xác minh OTP")}
                  >
                    Thay đổi số điện thoại
                  </button>
                </div>
              </div>

              {/* Hàng 3: Chia 2 phần
                  - Trái: Tiêu đề Label
                  - Giữa: Text Link hành động */}
              <div className="py-4 flex items-center gap-4 text-xs sm:text-sm">
                {/* Trái: Tiêu đề Label */}
                <div className="w-28 sm:w-36 shrink-0 font-bold text-slate-600 uppercase tracking-wider text-xs">
                  Xác minh DUPR ID
                </div>

                {/* Giữa: Text Link hành động */}
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-slate-500 font-mono">#VN-DUPR-99824</span>
                  <button 
                    type="button"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-bold text-xs flex items-center gap-1"
                    onClick={() => window.open('https://mydupr.com', '_blank')}
                  >
                    <span>Liên kết tài khoản DUPR toàn cầu</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Cụm Xóa tài khoản ở cuối cùng của trang Hồ sơ và Xếp hạng */}
          <div className="pt-2 flex justify-end">
            <button 
              type="button"
              onClick={() => {
                const confirmed = window.confirm("CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?");
                if (confirmed) {
                  alert("Yêu cầu xóa tài khoản đã được tiếp nhận.");
                  onNavigate(1);
                }
              }}
              className="px-4 py-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              id="main-delete-account-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa tài khoản</span>
            </button>
          </div>

        </main>

      </div>
    </div>
  );
};

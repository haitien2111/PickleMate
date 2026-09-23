import React, { useState } from 'react';
import { X, Search, Calendar, Plus, Minus, Check, Zap } from 'lucide-react';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (matchData: {
    courtName: string;
    date: string;
    startTime: string;
    endTime: string;
    slotsNeeded: number;
    duprLevel: string;
    notes: string;
  }) => void;
  onRestrictedAction?: (action: () => void, prompt?: string) => void;
  savedBooking?: {
    courtName: string;
    district: string;
    date: string;
    timeSlot: string;
  } | null;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  onRestrictedAction,
  savedBooking,
}) => {
  const [courtSearch, setCourtSearch] = useState('');
  const [playDate, setPlayDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('21:30');
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [duprLevel, setDuprLevel] = useState('DUPR 2.0 - 3.0');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  const handleApplyBookingSync = () => {
    if (savedBooking) {
      setCourtSearch(savedBooking.courtName);
      // parse timeslot if format "19:30 - 21:30"
      if (savedBooking.timeSlot.includes('-')) {
        const parts = savedBooking.timeSlot.split('-');
        setStartTime(parts[0].trim());
        setEndTime(parts[1].trim());
      }
      setIsSynced(true);
    }
  };

  if (!isOpen) return null;

  const handleDecreasePlayer = () => {
    if (playerCount > 1) {
      setPlayerCount((prev) => prev - 1);
    }
  };

  const handleIncreasePlayer = () => {
    if (playerCount < 8) {
      setPlayerCount((prev) => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doSubmit = () => {
      setIsSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess({
          courtName: courtSearch || 'Sân Swin Pickleball Q7',
          date: playDate,
          startTime,
          endTime,
          slotsNeeded: playerCount,
          duprLevel,
          notes,
        });
      }
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    };

    if (onRestrictedAction) {
      onRestrictedAction(doSubmit, 'Vui lòng đăng nhập để xác nhận tạo kèo giao lưu');
    } else {
      doSubmit();
    }
  };

  return (
    /* Backdrop Overlay */
    <div
      id="create-match-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        id="create-match-modal-card"
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full border border-slate-300 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Phần Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Tạo kèo giao lưu mới
          </h2>
          <button
            id="create-match-close-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md transition-colors"
            aria-label="Đóng Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Divider phân cách với phần nội dung */}
        <div className="border-t border-slate-200" />

        {/* 2. Phần Form Nhập liệu (Form Content) */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="p-6 space-y-5">
            
            {/* Lựa chọn Đồng bộ từ lịch sân đã đặt (nếu có) */}
            {savedBooking && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-emerald-900">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Tìm thấy lịch sân đã đặt:</strong> {savedBooking.courtName} ({savedBooking.timeSlot})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyBookingSync}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSynced
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {isSynced ? '✓ Đã đồng bộ' : '⚡ Tự động điền'}
                </button>
              </div>
            )}

            {/* Nhóm 1: Địa điểm (Location) */}
            <div className="space-y-1.5">
              <label
                htmlFor="court-search-input"
                className="block text-sm font-semibold text-slate-700"
              >
                Chọn sân chơi
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="court-search-input"
                  type="text"
                  value={courtSearch}
                  onChange={(e) => setCourtSearch(e.target.value)}
                  placeholder="Nhập tên sân hoặc khu vực..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Nhóm 2: Thời gian (Lưới 2 cột - Grid 2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cột 1: Ngày chơi */}
              <div className="space-y-1.5">
                <label
                  htmlFor="play-date-input"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Ngày chơi
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="play-date-input"
                    type="date"
                    value={playDate}
                    onChange={(e) => setPlayDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Cột 2: Khung giờ */}
              <div className="space-y-1.5">
                <label
                  htmlFor="start-time-input"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Khung giờ
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    id="start-time-input"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-center transition-all"
                  />
                  <span className="text-sm font-medium text-slate-500 shrink-0">
                    đến
                  </span>
                  <input
                    id="end-time-input"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-center transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Nhóm 3: Yêu cầu người chơi (Lưới 2 cột - Grid 2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cột 1: Số người cần tìm (Stepper) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Số người cần tìm
                </label>
                <div className="flex items-center h-[42px] border border-slate-300 rounded-md bg-white overflow-hidden">
                  <button
                    id="stepper-decrease-btn"
                    type="button"
                    onClick={handleDecreasePlayer}
                    className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors border-r border-slate-200"
                    aria-label="Giảm số người"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div
                    id="stepper-count-display"
                    className="flex-1 text-center font-bold text-base text-slate-900 select-none"
                  >
                    {playerCount}
                  </div>
                  <button
                    id="stepper-increase-btn"
                    type="button"
                    onClick={handleIncreasePlayer}
                    className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors border-l border-slate-200"
                    aria-label="Tăng số người"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cột 2: Trình độ yêu cầu */}
              <div className="space-y-1.5">
                <label
                  htmlFor="dupr-select-input"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Trình độ yêu cầu
                </label>
                <select
                  id="dupr-select-input"
                  value={duprLevel}
                  onChange={(e) => setDuprLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                >
                  <option value="Tất cả trình độ">Tất cả trình độ</option>
                  <option value="DUPR 2.0 - 3.0">DUPR 2.0 - 3.0</option>
                  <option value="DUPR 3.0 - 3.5">DUPR 3.0 - 3.5</option>
                  <option value="DUPR 3.5 - 4.5">DUPR 3.5 - 4.5</option>
                  <option value="DUPR 4.5+">DUPR 4.5+ (Nâng cao)</option>
                </select>
              </div>
            </div>

            {/* Nhóm 4: Ghi chú (Notes) */}
            <div className="space-y-1.5">
              <label
                htmlFor="notes-textarea"
                className="block text-sm font-semibold text-slate-700"
              >
                Ghi chú thêm (Tùy chọn)
              </label>
              <textarea
                id="notes-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Tiền sân chia đều, mang theo bóng..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none transition-all"
              />
            </div>
          </div>

          {/* 3. Phần Footer (Actions) */}
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-4 bg-slate-50/50">
            {/* Nút 1: Hủy (Dạng viền mỏng/outline) */}
            <button
              id="create-match-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>

            {/* Nút 2: Xác nhận (Khối đặc/Solid) */}
            <button
              id="create-match-submit-btn"
              type="submit"
              disabled={isSuccess}
              className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-lime-400 hover:bg-lime-500 rounded-md shadow-sm transition-colors flex items-center gap-2"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã tạo kèo thành công!</span>
                </>
              ) : (
                <span>Xác nhận tạo kèo</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

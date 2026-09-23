import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Search, 
  Phone, 
  Video, 
  CheckCheck, 
  Sparkles, 
  Paperclip, 
  Smile, 
  Circle,
  MessageSquare,
  User,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { UserProfile } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ConversationItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  unread: number;
  lastActive: string;
  messages: ChatMessage[];
  autoReplyText: string;
}

export const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    name: 'Huy Hoàng (DUPR 3.2)',
    role: 'Bạn ghép kèo Swin Q7',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    online: true,
    unread: 1,
    lastActive: 'Đang hoạt động',
    messages: [
      { id: 'm1', sender: 'other', text: 'Chào bác Tiến! Chiều nay bác có bận gì không?', timestamp: '11:45' },
      { id: 'm2', sender: 'me', text: 'Chào Hoàng, chiều nay mình rảnh sau 17h nhé!', timestamp: '11:50' },
      { id: 'm3', sender: 'other', text: 'Bác ơi tối nay 19:30 có mặt sân Swin Q7 khởi động trước nhé!', timestamp: '12:15' },
    ],
    autoReplyText: 'Dạ ok bác Tiến! Tối nay em mang thêm bóng Franklin X-40 mới, gặp bác ở sân số 2 nhé! 🔥',
  },
  {
    id: 'conv-2',
    name: 'Quốc Tuấn (Người bán vợt)',
    role: 'Người bán (Ký quỹ Escrow)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    online: true,
    unread: 1,
    lastActive: 'Vừa truy cập',
    messages: [
      { id: 'm4', sender: 'me', text: 'Chào bạn, cây Selkirk Vanguard của bạn tình trạng mặt vợt thế nào?', timestamp: '09:20' },
      { id: 'm5', sender: 'other', text: 'Dạ mặt vợt còn nguyên nhám 88%, không nứt viền, em giữ kỹ lắm ạ.', timestamp: '09:35' },
      { id: 'm6', sender: 'other', text: 'Cây Selkirk Vanguard em đã đóng gói gửi sang trung tâm kiểm định rồi bác nha.', timestamp: '10:40' },
    ],
    autoReplyText: 'Vâng bác yên tâm, bên kỹ thuật PickleMate đang kiểm định độ nảy và trọng lượng, có kết quả là gửi giao ngay cho bác ạ!',
  },
  {
    id: 'conv-3',
    name: 'PickleMate CSKH 24/7',
    role: 'Hỗ trợ khách hàng chính thức',
    avatar: '',
    online: true,
    lastActive: 'Trực tuyến 24/7',
    unread: 0,
    messages: [
      { id: 'm7', sender: 'other', text: 'Chào mừng bạn gia nhập cộng đồng PickleMate! Nếu cần hỗ trợ đặt sân hay dịch vụ ký quỹ hãy nhắn ngay.', timestamp: 'Hôm qua' },
    ],
    autoReplyText: 'Cảm ơn bạn đã phản hồi! Đội ngũ Chăm sóc Khách hàng PickleMate luôn sẵn sàng hỗ trợ bạn 24/7. Chúc bạn có những trận đấu tuyệt vời!',
  },
];

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  initialConvId?: string;
  conversations: ConversationItem[];
  onSendMessage: (convId: string, text: string) => void;
  onMarkRead: (convId: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  user,
  initialConvId,
  conversations,
  onSendMessage,
  onMarkRead,
}) => {
  const [activeId, setActiveId] = useState<string>(initialConvId || conversations[0]?.id || 'conv-1');
  const [inputMessage, setInputMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [showMobileList, setShowMobileList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialConvId) {
      setActiveId(initialConvId);
      onMarkRead(initialConvId);
    }
  }, [initialConvId]);

  useEffect(() => {
    if (isOpen) {
      onMarkRead(activeId);
      scrollToBottom();
    }
  }, [isOpen, activeId]);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputMessage.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    'Ok bạn nhé! 👍',
    'Hẹn gặp ở sân tối nay nhé! 🏓',
    'Mình đã nhận được thông tin.',
    'Cho mình xin số điện thoại nhé!',
  ];

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[620px] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">Hộp Thư Chat PickleMate</h3>
                <span className="text-[10px] bg-lime-400/20 text-lime-300 font-bold px-2 py-0.5 rounded-full border border-lime-400/30">
                  Trực tuyến
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Trò chuyện với bạn ghép kèo, người bán vợt & CSKH</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Đóng hộp thư"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Chat Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* CỘT TRÁI: Danh sách cuộc trò chuyện (Desktop luôn hiện, Mobile ẩn khi đang xem chat) */}
          <div className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r border-slate-200 bg-slate-50/70`}>
            
            {/* Search contacts */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tin nhắn, người liên hệ..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-100 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:border-lime-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Conversation list items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.map((conv) => {
                const isSelected = conv.id === activeId;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveId(conv.id);
                      onMarkRead(conv.id);
                      setShowMobileList(false);
                    }}
                    className={`p-3.5 flex gap-3 items-center cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-lime-50/80 border-l-4 border-lime-600' 
                        : 'hover:bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {conv.avatar ? (
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-900 text-lime-400 flex items-center justify-center font-black text-xs">
                          PM
                        </div>
                      )}
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${isSelected ? 'font-black text-slate-950' : 'font-bold text-slate-800'}`}>
                          {conv.name}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                          {lastMsg?.timestamp || ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMsg ? (lastMsg.sender === 'me' ? `Bạn: ${lastMsg.text}` : lastMsg.text) : 'Chưa có tin nhắn'}
                      </p>
                      <span className="text-[10px] text-slate-400 inline-block mt-0.5">{conv.role}</span>
                    </div>

                    {conv.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-lime-500 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: Khung chat chi tiết & ô trả lời tin nhắn */}
          <div className={`${showMobileList ? 'hidden' : 'flex'} md:flex flex-col flex-1 bg-white`}>
            {activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white shadow-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileList(true)}
                      className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg"
                      title="Danh sách hội thoại"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      {activeConv.avatar ? (
                        <img
                          src={activeConv.avatar}
                          alt={activeConv.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-lime-400 flex items-center justify-center font-black text-xs">
                          PM
                        </div>
                      )}
                      {activeConv.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{activeConv.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold hidden sm:inline-block">
                          {activeConv.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {activeConv.lastActive}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 text-slate-500">
                    <button 
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                      title="Gọi thoại"
                      onClick={() => alert(`Đang kết nối cuộc gọi thoại đến ${activeConv.name}...`)}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                      title="Gọi video"
                      onClick={() => alert(`Đang kết nối video call đến ${activeConv.name}...`)}
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/50">
                  <div className="text-center my-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                      Hôm nay
                    </span>
                  </div>

                  {activeConv.messages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div className="shrink-0 mt-1">
                            {activeConv.avatar ? (
                              <img
                                src={activeConv.avatar}
                                alt={activeConv.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-900 text-lime-400 flex items-center justify-center font-black text-[10px]">
                                PM
                              </div>
                            )}
                          </div>
                        )}

                        <div className={`max-w-[78%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-slate-900 text-white rounded-br-xs'
                                : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                          
                          <div className={`flex items-center gap-1.5 px-1 text-[10px] text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-lime-600" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Reply Suggestions */}
                <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Gợi ý:
                  </span>
                  {quickReplies.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(activeConv.id, q)}
                      className="text-[11px] text-slate-700 bg-slate-100 hover:bg-lime-100 hover:text-lime-900 font-medium px-2.5 py-1 rounded-lg shrink-0 border border-slate-200 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Message Input & Send Bar */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-2xl px-3.5 py-2 border border-slate-200 focus-within:border-lime-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-lime-100 transition-all">
                      <input
                        type="text"
                        placeholder={`Trả lời ${activeConv.name}... (Nhấn Enter để gửi)`}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none placeholder-slate-400"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setInputMessage((prev) => prev + ' 🏓')}
                        className="text-slate-400 hover:text-slate-600 p-1"
                        title="Thêm biểu tượng cảm xúc"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleSend}
                      disabled={!inputMessage.trim()}
                      className={`h-10 px-4 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 ${
                        inputMessage.trim()
                          ? 'bg-lime-500 hover:bg-lime-400 text-slate-950 font-black cursor-pointer shadow-lime-500/20'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                      title="Gửi tin nhắn trả lời"
                    >
                      <span>Gửi</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-bold text-slate-600">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
                <p className="text-xs text-slate-400 mt-1">Bạn có thể trả lời tin nhắn từ bạn ghép kèo hoặc người bán vợt</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

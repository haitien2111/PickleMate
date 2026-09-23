/**
 * PickleMate - Hệ sinh thái Pickleball số 1 Việt Nam
 * All-in-one Platform: Đặt Sân, Ghép Kèo DUPR, Chợ Vợt Kiểm Định & Custom Lab
 */

import React, { useState } from 'react';
import { ScreenId, Court, SocialMatch, Paddle, BookingState, CustomLaserSettings, UserProfile } from './types';
import { COURTS_DATA, SOCIAL_MATCHES, PADDLES_DATA, CURRENT_USER } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WalletModal } from './components/WalletModal';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';

import { Screen1Home } from './screens/Screen1Home';
import { Screen2CourtSearch } from './screens/Screen2CourtSearch';
import { Screen3ScheduleDetails } from './screens/Screen3ScheduleDetails';
import { Screen4QuickQRPayment } from './screens/Screen4QuickQRPayment';
import { Screen5SocialMatchFinder } from './screens/Screen5SocialMatchFinder';
import { Screen6MatchDetailSplit } from './screens/Screen6MatchDetailSplit';
import { Screen7PaddleMarketplace } from './screens/Screen7PaddleMarketplace';
import { Screen8PaddleDetail } from './screens/Screen8PaddleDetail';
import { Screen9CustomizerStudio } from './screens/Screen9CustomizerStudio';
import { Screen10EscrowCheckout } from './screens/Screen10EscrowCheckout';
import { Screen11ProfileAndRatings } from './components/Screen11ProfileAndRatings';
import { Screen12SellerStudio } from './screens/Screen12SellerStudio';
import { Screen13CourtOwnerPortal } from './screens/Screen13CourtOwnerPortal';
import { Screen14PlayerAuth } from './screens/Screen14PlayerAuth';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court>(COURTS_DATA[0]);
  const [bookingState, setBookingState] = useState<BookingState | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<SocialMatch>(SOCIAL_MATCHES[0]);
  const [selectedPaddle, setSelectedPaddle] = useState<Paddle>(PADDLES_DATA[0]);
  const [isVerificationRequested, setIsVerificationRequested] = useState<boolean>(true);
  const [customization, setCustomization] = useState<CustomLaserSettings>({
    enabled: true,
    text: 'AnnaLee',
    font: 'Sport Bold',
    position: 'bottom-right',
    fontSize: 24,
    laserStyle: 'silver',
    overwrapColor: 'Lime Neon',
  });

  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(1);

  // Auth Wall & Pending Restricted Actions
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalPrompt, setAuthModalPrompt] = useState<string>('Vui lòng đăng nhập để hoàn tất thao tác này');
  const pendingActionRef = React.useRef<(() => void) | null>(null);

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Wrapper kiểm soát các Terminal Actions (Auth Wall)
   * Nếu đã đăng nhập: Tiếp tục thực hiện hành động
   * Nếu chưa đăng nhập: Giữ lại hành động chờ, mở Auth Modal kèm thông báo
   */
  const handleRestrictedAction = (actionCallback: () => void, promptMessage?: string) => {
    if (isLoggedIn) {
      actionCallback();
    } else {
      pendingActionRef.current = actionCallback;
      setAuthModalPrompt(promptMessage || 'Vui lòng đăng nhập để hoàn tất thao tác này');
      setIsAuthModalOpen(true);
    }
  };

  /**
   * Xử lý khi đăng nhập thành công từ Auth Modal:
   * - Cập nhật state isLoggedIn = true
   * - Đóng modal
   * - Tự động tiếp tục thực hiện hành động đang bị gián đoạn (pending action)
   */
  const handleAuthModalSuccess = (profileData?: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    const updatedUser = {
      ...CURRENT_USER,
      ...profileData,
    };
    setUser(updatedUser);
    setIsAuthModalOpen(false);

    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(() => {
        action();
      }, 100);
    }
  };

  const handleConfirmBooking = (booking: BookingState) => {
    setBookingState(booking);
  };

  const handleBookingPaymentComplete = () => {
    if (bookingState) {
      setBookingState({ ...bookingState, paymentComplete: true });
    }
  };

  const handleOrderSuccess = () => {
    setCartCount(0);
  };

  const handleLoginSuccess = (profileData?: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    const updatedUser = {
      ...CURRENT_USER,
      ...profileData,
    };
    setUser(updatedUser);
    handleNavigate(11);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...(prev || CURRENT_USER),
      ...updated,
    }));
  };

  const handleUpdateWallet = (amount: number) => {
    setUser((prev) => {
      const baseUser = prev || CURRENT_USER;
      return {
        ...baseUser,
        walletBalance: baseUser.walletBalance + amount,
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-lime-400 selection:text-slate-950">
      
      {/* Fixed Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        user={user}
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout}
        onOpenAuthModal={() => {
          setAuthModalPrompt('Vui lòng đăng nhập tài khoản PickleMate');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-12">
        {currentScreen === 1 && (
          <Screen1Home onNavigate={handleNavigate} />
        )}

        {currentScreen === 2 && (
          <Screen2CourtSearch
            onNavigate={handleNavigate}
            onSelectCourt={(court) => setSelectedCourt(court)}
          />
        )}

        {currentScreen === 3 && (
          <Screen3ScheduleDetails
            court={selectedCourt}
            onNavigate={handleNavigate}
            onConfirmBooking={handleConfirmBooking}
            onRestrictedAction={handleRestrictedAction}
          />
        )}

        {currentScreen === 4 && (
          <Screen4QuickQRPayment
            booking={bookingState}
            user={user || CURRENT_USER}
            onNavigate={handleNavigate}
            onPaymentComplete={handleBookingPaymentComplete}
          />
        )}

        {currentScreen === 5 && (
          <Screen5SocialMatchFinder
            onNavigate={handleNavigate}
            onSelectMatch={(match) => setSelectedMatch(match)}
            user={user || CURRENT_USER}
            onRestrictedAction={handleRestrictedAction}
            bookingState={bookingState}
          />
        )}

        {currentScreen === 6 && (
          <Screen6MatchDetailSplit
            match={selectedMatch}
            user={user || CURRENT_USER}
            onNavigate={handleNavigate}
            onRestrictedAction={handleRestrictedAction}
          />
        )}

        {currentScreen === 7 && (
          <Screen7PaddleMarketplace
            onNavigate={handleNavigate}
            onSelectPaddle={(paddle) => setSelectedPaddle(paddle)}
          />
        )}

        {currentScreen === 8 && (
          <Screen8PaddleDetail
            paddle={selectedPaddle}
            onNavigate={handleNavigate}
            onUpdateVerification={(v) => setIsVerificationRequested(v)}
            onUpdatePaddleImages={(newImages) => {
              setSelectedPaddle((prev) => ({ ...prev, images: newImages }));
            }}
          />
        )}

        {currentScreen === 9 && (
          <Screen9CustomizerStudio
            paddle={selectedPaddle}
            onNavigate={handleNavigate}
            onUpdateCustomization={(c) => setCustomization(c)}
            onRestrictedAction={handleRestrictedAction}
          />
        )}

        {currentScreen === 10 && (
          <Screen10EscrowCheckout
            user={user || CURRENT_USER}
            paddle={selectedPaddle}
            isVerificationRequested={isVerificationRequested}
            customization={customization}
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
            onRestrictedAction={handleRestrictedAction}
          />
        )}

        {currentScreen === 11 && (
          <Screen11ProfileAndRatings
            user={user}
            isLoggedIn={isLoggedIn}
            onNavigate={handleNavigate}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {currentScreen === 12 && (
          <Screen12SellerStudio
            user={user || CURRENT_USER}
            onNavigate={handleNavigate}
            onUpdateWallet={handleUpdateWallet}
          />
        )}

        {currentScreen === 13 && (
          <Screen13CourtOwnerPortal
            user={user || CURRENT_USER}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 14 && (
          <Screen14PlayerAuth
            onNavigate={handleNavigate}
            onLoginSuccess={(updated) => handleLoginSuccess(updated)}
          />
        )}
      </main>

      {/* Responsive PickleMate VN Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        user={user || CURRENT_USER}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          handleRestrictedAction(
            () => handleNavigate(10),
            'Vui lòng đăng nhập để tiến hành thanh toán giỏ hàng'
          );
        }}
      />

      {/* Pop-up Modal Đăng nhập / Đăng ký chặn Terminal Actions */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          pendingActionRef.current = null;
        }}
        onLoginSuccess={handleAuthModalSuccess}
        promptMessage={authModalPrompt}
      />

    </div>
  );
}

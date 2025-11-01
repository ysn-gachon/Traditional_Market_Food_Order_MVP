import { useEffect, useState } from 'react';
import { MainScreen } from './components/MainScreen';
import { MarketSelection } from './components/MarketSelection';
import { MenuList } from './components/MenuList';
import { MenuDetail } from './components/MenuDetail';
import { PaymentForm } from './components/PaymentForm';
import type { MenuItem, Market } from './types/market';
import { fetchMarketsFromSupabase } from './services/marketService';
import { CartProvider, useCart } from './contexts/CartContext';
import { Analytics } from "@vercel/analytics/next"

type Screen = 'main' | 'markets' | 'menu-list' | 'menu-detail' | 'payment';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [markets, setMarkets] = useState<Market[] | null>(null);
  const [loadingMarkets, setLoadingMarkets] = useState(false);

  const selectedMarket = selectedMarketId && markets
    ? markets.find(m => m.id === selectedMarketId) || null
    : null;

  const handleStartOrder = () => {
    setCurrentScreen('markets');
  };

  useEffect(() => {
    // Fetch markets from Supabase (read-only) when app starts
    let mounted = true;
    (async () => {
      try {
        setLoadingMarkets(true);
        const ms = await fetchMarketsFromSupabase();
        if (mounted) setMarkets(ms);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch markets from Supabase', e);
      } finally {
        setLoadingMarkets(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectMarket = (marketId: string) => {
    setSelectedMarketId(marketId);
    setCurrentScreen('menu-list');
  };

  const handleSelectMenu = (menuId: string) => {
    if (selectedMarket) {
      const menuItem = selectedMarket.menuItems.find(item => item.id === menuId);
      if (menuItem) {
        setSelectedMenuItem(menuItem);
        setCurrentScreen('menu-detail');
      }
    }
  };

  const handlePayment = () => {
    setCurrentScreen('payment');
  };

  const handleBackToMenuList = () => {
    setCurrentScreen('menu-list');
  };

  const handleBackToMenuDetail = () => {
    setCurrentScreen('menu-detail');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const handleBackToMarkets = () => {
    setCurrentScreen('markets');
  };

  return (
    <CartProvider>
      <div className="dark antialiased">
      <style dangerouslySetInnerHTML={{
        __html: `
          * {
            -webkit-tap-highlight-color: transparent;
          }
          html {
            touch-action: manipulation;
          }
        `
      }} />
      
      {currentScreen === 'main' && (
        <MainScreen onStartOrder={handleStartOrder} />
      )}
      
      {currentScreen === 'markets' && (
        <MarketSelection 
          markets={markets ?? []}
          onSelectMarket={handleSelectMarket}
          onBack={handleBackToMain}
        />
      )}
      
      {currentScreen === 'menu-list' && selectedMarket && (
        <MenuList
          marketName={selectedMarket.name}
          menuItems={selectedMarket.menuItems}
          onSelectMenu={handleSelectMenu}
          onBack={handleBackToMarkets}
        />
      )}
      
      {currentScreen === 'menu-detail' && selectedMenuItem && (
        <MenuDetail
          menuItem={selectedMenuItem}
          onBack={handleBackToMenuList}
        />
      )}
      
      {currentScreen === 'payment' && (
        <PaymentForm
          onBack={handleBackToMenuList}
        />
      )}

      {/* Floating cart button */}
      <CartFloatingButton onOpenCart={() => setCurrentScreen('payment')} />
    </div>
    </CartProvider>
  );
}

function CartFloatingButton({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalQuantity } = useCart();
  if (totalQuantity === 0) return null;

  return (
    <button
      onClick={onOpenCart}
      aria-label="장바구니 열기"
      // inline style to ensure fixed positioning above other layout quirks
      style={{ position: 'fixed', top: 12, right: 12 }}
      className="z-50 bg-[#D4AF37] text-[#0A0A0A] px-4 py-3 rounded-full shadow-lg border-2 border-[#D4AF37]"
    >
      장바구니 ({totalQuantity})
    </button>
  );
}

import { useState } from 'react';
import { MainScreen } from './components/MainScreen';
import { MarketSelection } from './components/MarketSelection';
import { MenuList } from './components/MenuList';
import { MenuDetail } from './components/MenuDetail';
import { PaymentForm } from './components/PaymentForm';
import { markets } from './data/markets';
import { MenuItem } from './types/market';

type Screen = 'main' | 'markets' | 'menu-list' | 'menu-detail' | 'payment';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const selectedMarket = selectedMarketId 
    ? markets.find(m => m.id === selectedMarketId) 
    : null;

  const handleStartOrder = () => {
    setCurrentScreen('markets');
  };

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
          markets={markets}
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
          onPayment={handlePayment}
          onBack={handleBackToMenuList}
        />
      )}
      
      {currentScreen === 'payment' && selectedMenuItem && (
        <PaymentForm
          menuItem={selectedMenuItem}
          onBack={handleBackToMenuDetail}
        />
      )}
    </div>
  );
}

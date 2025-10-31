import { Card } from './ui/card';
import { Market } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface MarketSelectionProps {
  markets: Market[];
  onSelectMarket: (marketId: string) => void;
}

export function MarketSelection({ markets, onSelectMarket }: MarketSelectionProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 relative">
      {/* Art Deco Header Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      
      <div className="max-w-lg mx-auto relative">
        <div className="pt-8 pb-4">
          <div className="text-center mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3" />
            <h2 className="text-[#F5F5DC] tracking-wider">시장을 선택하세요</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
          </div>
          
          <div className="space-y-4">
            {markets.map((market, index) => (
              <div key={market.id} className="relative pl-8">
                {/* Decorative line numbers - Closer for mobile */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/30 tracking-wider">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <Card
                  className="relative p-5 cursor-pointer bg-[#1A1A1A] border-2 border-[#D4AF37]/30 active:border-[#D4AF37] transition-all duration-200 overflow-hidden touch-manipulation"
                  onClick={() => onSelectMarket(market.id)}
                >
                  {/* Corner decorations - Smaller for mobile */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#D4AF37]/50" />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#D4AF37]/50" />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#D4AF37]/50" />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#D4AF37]/50" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-[#F5F5DC] tracking-wide">{market.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-1 h-1 bg-[#D4AF37] rotate-45" />
                        <p className="text-[#B8A882] tracking-wider">
                          {market.menuItems.length}개의 메뉴
                        </p>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 ml-4">
                      <div className="w-9 h-9 border-2 border-[#D4AF37] flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

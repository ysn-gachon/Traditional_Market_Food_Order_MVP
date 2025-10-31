import { Card } from './ui/card';
import { MenuItem } from '../types/market';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';

interface MenuListProps {
  marketName: string;
  menuItems: MenuItem[];
  onSelectMenu: (menuId: string) => void;
  onBack: () => void;
}

export function MenuList({ marketName, menuItems, onSelectMenu, onBack }: MenuListProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 relative pb-6">
      {/* Art Deco Header Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      
      <div className="max-w-lg mx-auto relative pt-8">
        <button
          onClick={onBack}
          className="relative z-10 p-2 flex items-center text-[#B8A882] active:text-[#D4AF37] transition-colors touch-manipulation mb-2"
        >
          <div className="w-8 h-8 border-2 border-[#D4AF37]/50 flex items-center justify-center mr-3">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="tracking-wider">뒤로가기</span>
        </button>
        <div className="text-center mb-6">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3" />
          <h2 className="text-[#F5F5DC] tracking-wider">{marketName}</h2>
          <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto my-2" />
          <p className="text-[#B8A882] tracking-wide">원하는 메뉴를 선택하세요</p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
        </div>
        
        {/* Single column for mobile */}
        <div className="space-y-5">
          {menuItems.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Menu number decoration - Smaller for mobile */}
              <div className="absolute -top-2 -left-2 z-20 w-7 h-7 bg-[#D4AF37] border-2 border-[#0A0A0A] flex items-center justify-center">
                <span className="text-[#0A0A0A] tracking-wider">{String(index + 1).padStart(2, '0')}</span>
              </div>
              
              <Card
                className="relative cursor-pointer bg-[#1A1A1A] border-2 border-[#D4AF37]/30 active:border-[#D4AF37] transition-all duration-200 overflow-hidden touch-manipulation"
                onClick={() => onSelectMenu(item.id)}
              >
                {/* Corner decorations - Smaller */}
                <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-[#D4AF37]/50 z-10" />
                <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-[#D4AF37]/50 z-10" />
                <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-[#D4AF37]/50 z-10" />
                <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-[#D4AF37]/50 z-10" />
                
                <div className="aspect-video w-full overflow-hidden bg-[#2A2A2A] relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay for art deco effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-4 relative">
                  {/* Decorative separator */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                  
                  <h3 className="text-[#F5F5DC] mt-2 tracking-wide">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1 h-1 bg-[#D4AF37] rotate-45" />
                    <p className="text-[#B8A882]">{item.store}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#D4AF37]/20">
                    <p className="text-[#D4AF37] tracking-wider">
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

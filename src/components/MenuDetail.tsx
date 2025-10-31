import { Button } from './ui/button';
import { MenuItem } from '../types/market';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';

interface MenuDetailProps {
  menuItem: MenuItem;
  onPayment: () => void;
  onBack: () => void;
}

export function MenuDetail({ menuItem, onPayment, onBack }: MenuDetailProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative">
      {/* Art Deco Header Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      
      <div className="max-w-lg mx-auto">
        <div className="bg-[#1A1A1A] min-h-screen relative">
          <button
            onClick={onBack}
            className="relative z-10 p-4 flex items-center text-[#B8A882] active:text-[#D4AF37] transition-colors touch-manipulation"
          >
            <div className="w-8 h-8 border-2 border-[#D4AF37]/50 flex items-center justify-center mr-3">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="tracking-wider">뒤로가기</span>
          </button>
          
          <div className="relative">
            {/* Art Deco corner decorations - Smaller for mobile */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] z-10" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] z-10" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] z-10" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] z-10" />
            
            <div className="aspect-video w-full overflow-hidden bg-[#2A2A2A]">
              <ImageWithFallback
                src={menuItem.image}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="p-5 relative pb-6">
            {/* Decorative top border */}
            <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            
            <div className="text-center mb-5">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3" />
              <h2 className="text-[#F5F5DC] tracking-wider">{menuItem.name}</h2>
              <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto my-2" />
              <p className="text-[#B8A882] tracking-wide">{menuItem.store}</p>
            </div>
            
            {/* Price in art deco frame */}
            <div className="relative p-5 border-2 border-[#D4AF37] bg-[#0A0A0A]/50 mb-6">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              
              <p className="text-[#D4AF37] text-center tracking-widest">
                {menuItem.price.toLocaleString()}원
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
                <h3 className="text-[#F5F5DC] tracking-wider">메뉴 설명</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
              </div>
              <p className="text-[#B8A882] leading-relaxed pl-4 border-l-2 border-[#D4AF37]/30">
                {menuItem.description}
              </p>
            </div>
            
            <div className="relative">
              {/* Decorative corners around button - Smaller */}
              <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/30" />
              <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/30" />
              <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/30" />
              <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/30" />
              
              <Button
                onClick={onPayment}
                className="w-full bg-[#D4AF37] active:bg-[#FFD700] text-[#0A0A0A] py-7 border-2 border-[#D4AF37] transition-all duration-200 touch-manipulation"
                size="lg"
              >
                <span className="relative z-10 tracking-widest">결제하기</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

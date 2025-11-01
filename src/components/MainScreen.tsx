import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';

interface MainScreenProps {
  onStartOrder: () => void;
}

export function MainScreen({ onStartOrder }: MainScreenProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Image with High Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1616627152550-5aac9b71a949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMG1hcmtldHxlbnwxfHx8fDE3NjE3MTc2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          opacity: '0.15'
        }}
      />
      
      {/* Art Deco Decorative Elements - Mobile optimized */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      
      {/* Corner Decorations - Smaller for mobile */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#D4AF37]" />
      
      <div className="relative z-10 text-center space-y-6 w-full max-w-sm px-2">
        {/* Art Deco Frame - Mobile optimized */}
        <div className="relative p-6 border-2 border-[#D4AF37] bg-[#0A0A0A]/80 backdrop-blur-sm">
          {/* Inner decorative corners - Smaller */}
          <div className="absolute top-1 left-1 w-6 h-6 border-t border-l border-[#D4AF37]/50" />
          <div className="absolute top-1 right-1 w-6 h-6 border-t border-r border-[#D4AF37]/50" />
          <div className="absolute bottom-1 left-1 w-6 h-6 border-b border-l border-[#D4AF37]/50" />
          <div className="absolute bottom-1 right-1 w-6 h-6 border-b border-r border-[#D4AF37]/50" />
          
          <div className="space-y-5">
            {/* Gold geometric icon container - Smaller */}
            <div className="relative inline-block p-4 border-2 border-[#D4AF37]">
              <ShoppingBag className="w-12 h-12 text-[#D4AF37]" strokeWidth={1.5} />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
            </div>
            
            <div className="space-y-3">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
              <h1 className="text-[#F5F5DC] tracking-wider">전통시장 음식 주문</h1>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            </div>
            
            <p className="text-[#B8A882] tracking-wide leading-relaxed">
              우리 동네 전통시장의 맛있는 음식을
              <br />
              간편하게 주문하세요
            </p>
          </div>
        </div>
        
        <Button 
          onClick={onStartOrder}
          size="lg"
          className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0A0A] py-7 border-2 border-[#D4AF37] active:bg-[#FFD700] transition-all duration-300 relative overflow-hidden touch-manipulation"
        >
          <span className="relative z-10 tracking-widest">주문하기</span>
        </Button>
        
        {/* 문의 정보 섹션 */}
        <div className="relative z-10 mt-4 text-left text-sm text-[#B8A882] max-w-sm mx-auto px-3">
          <div className="p-3 border-2 border-[#D4AF37]/20 bg-[#0A0A0A]/60 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#F5F5DC] tracking-wider">문의/도움말</p>
                <p className="mt-1 text-[#B8A882]">전화: <a href="tel:+821073843271" className="text-[#D4AF37]">010-7384-3271</a></p>
                <p className="mt-1 text-[#B8A882]">인스타그램: <a href="https://instagram.com/b.u.d_official" target="_blank" rel="noreferrer" className="text-[#D4AF37]">@b.u.d_official</a></p>
                <p className="mt-1 text-[#B8A882]">전자우편: <a href="mailto:budofficial07@gmail.com" className="text-[#D4AF37]">budofficial07@gmail.com</a></p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

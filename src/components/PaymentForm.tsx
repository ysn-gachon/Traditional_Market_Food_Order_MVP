import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { MenuItem } from '../types/market';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface PaymentFormProps {
  menuItem: MenuItem;
  onBack: () => void;
}

export function PaymentForm({ menuItem, onBack }: PaymentFormProps) {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const accountNumber = '국민은행 123-456-789012';
  const operatorPhone = '010-9876-5432';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && address) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative">
        {/* Art Deco decorative elements - Mobile optimized */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]/30" />
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37]/30" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37]/30" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]/30" />
        
        <div className="max-w-sm w-full space-y-4">
          <Card className="p-6 text-center bg-[#1A1A1A] border-2 border-[#D4AF37] relative">
            {/* Corner decorations - Smaller */}
            <div className="absolute top-1 left-1 w-6 h-6 border-t border-l border-[#D4AF37]/50" />
            <div className="absolute top-1 right-1 w-6 h-6 border-t border-r border-[#D4AF37]/50" />
            <div className="absolute bottom-1 left-1 w-6 h-6 border-b border-l border-[#D4AF37]/50" />
            <div className="absolute bottom-1 right-1 w-6 h-6 border-b border-r border-[#D4AF37]/50" />
            
            <div className="relative inline-block p-3 border-2 border-[#D4AF37] mb-5">
              <CheckCircle className="w-14 h-14 text-[#D4AF37] mx-auto" strokeWidth={1.5} />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
            </div>
            
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3" />
            <h2 className="text-[#F5F5DC] mb-2 tracking-wider">주문이 접수되었습니다!</h2>
            <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto my-3" />
            <p className="text-[#B8A882] mb-6 leading-relaxed">
              입금 확인 후 조리가 시작됩니다.
              <br />
              곧 맛있는 음식을 받아보실 수 있습니다.
            </p>
            
            {/* Account Number Section */}
            <div className="mb-6 p-4 bg-[#0A0A0A]/50 border-2 border-[#D4AF37]/70 relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              
              <div className="flex items-center gap-2 justify-center mb-2">
                <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
                <h3 className="text-[#F5F5DC] tracking-wider">입금 계좌</h3>
              </div>
              <p className="text-[#D4AF37] tracking-wider break-all">{accountNumber}</p>
              <p className="text-[#B8A882] mt-1">예금주: 전통시장협회</p>
            </div>
            
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-[#D4AF37] active:bg-[#FFD700] text-[#0A0A0A] border-2 border-[#D4AF37] py-6 transition-all touch-manipulation"
            >
              <span className="relative z-10 tracking-widest">처음으로 돌아가기</span>
            </Button>
          </Card>
          
          {/* Contact Information Card */}
          <Card className="p-5 bg-[#1A1A1A] border-2 border-[#D4AF37]/50 relative">
            <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-[#D4AF37]/50" />
            <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-[#D4AF37]/50" />
            <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-[#D4AF37]/50" />
            <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-[#D4AF37]/50" />
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
              <h3 className="text-[#F5F5DC] tracking-wider">문의 / 운영</h3>
            </div>
            <div className="pl-3 border-l-2 border-[#D4AF37]/30">
              <p className="text-[#B8A882] mb-1">운영자 전화번호</p>
              <a 
                href={`tel:${operatorPhone}`}
                className="text-[#D4AF37] tracking-wider hover:text-[#FFD700] transition-colors"
              >
                {operatorPhone}
              </a>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
          
          <div className="p-5 pb-6">
            <div className="text-center mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3" />
              <h2 className="text-[#F5F5DC] tracking-wider">결제 정보 입력</h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
            </div>
            
            <Card className="p-5 mb-5 bg-[#0A0A0A] border-2 border-[#D4AF37]/50 relative">
              <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#D4AF37]/50" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#D4AF37]/50" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#D4AF37]/50" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#D4AF37]/50" />
              
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
                <h3 className="text-[#F5F5DC] tracking-wider">주문 메뉴</h3>
              </div>
              <div className="pl-3 border-l-2 border-[#D4AF37]/30">
                <p className="text-[#F5F5DC]">{menuItem.name}</p>
                <p className="text-[#B8A882] mt-1">{menuItem.store}</p>
                <p className="text-[#D4AF37] mt-2 tracking-wider">
                  {menuItem.price.toLocaleString()}원
                </p>
              </div>
            </Card>
            
            <Card className="p-5 mb-6 bg-[#0A0A0A] border-2 border-[#D4AF37]/70 relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D4AF37]" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#D4AF37]" />
              
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
                <h3 className="text-[#F5F5DC] tracking-wider">입금 계좌</h3>
              </div>
              <div className="pl-3 border-l-2 border-[#D4AF37]">
                <p className="text-[#D4AF37] tracking-wider break-all">{accountNumber}</p>
                <p className="text-[#B8A882] mt-1">
                  예금주: 전통시장협회
                </p>
              </div>
            </Card>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#F5F5DC] tracking-wider">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-[#2A2A2A] border-2 border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#B8A882]/50 focus:border-[#D4AF37] transition-colors h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#F5F5DC] tracking-wider">배달 주소</Label>
                <Textarea
                  id="address"
                  placeholder="배달받으실 주소를 입력해주세요"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="bg-[#2A2A2A] border-2 border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#B8A882]/50 focus:border-[#D4AF37] transition-colors resize-none"
                />
              </div>
              
              <div className="relative pt-3">
                <div className="absolute -top-1 -left-2 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/30" />
                <div className="absolute -top-1 -right-2 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/30" />
                <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/30" />
                <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/30" />
                
                <Button
                  type="submit"
                  className="w-full bg-[#D4AF37] active:bg-[#FFD700] text-[#0A0A0A] py-7 border-2 border-[#D4AF37] transition-all duration-200 touch-manipulation"
                  size="lg"
                >
                  <span className="relative z-10 tracking-widest">주문 완료</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

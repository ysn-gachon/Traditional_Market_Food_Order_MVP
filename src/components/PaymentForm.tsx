import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface PaymentFormProps {
  onBack: () => void;
}

export function PaymentForm({ onBack }: PaymentFormProps) {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const { items, subtotal, MIN_ORDER, clear, updateQuantity, removeItem } = useCart();

  const accountNumber = '토스뱅크 1000-4346-1571';
  const operatorPhone = '010-7384-3271';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!phone || !address) return setErrorMessage('전화번호와 주소를 입력해주세요.');
    if (subtotal < MIN_ORDER) return setErrorMessage('최소 주문금액을 채워주세요.');
    if (items.length === 0) return setErrorMessage('장바구니에 상품이 없습니다.');

    setIsSubmitting(true);

    try {
      const payload = {
        cust_phone: phone,
        cust_address: address,
        items: items.map(({ item, quantity }) => ({
          menu_id: Number(item.id),
          quantity,
          unit_price: item.price
        }))
      };

      const resp = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Don't assume the response is JSON (some server errors/pages may return HTML).
      const contentType = resp.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        try {
          data = await resp.json();
        } catch (parseErr) {
          // Malformed JSON from server
          const txt = await resp.text();
          setErrorMessage(`서버 응답을 파싱하지 못했습니다: ${txt.slice(0, 200)}`);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Non-JSON response (HTML or plain text). Surface the text for easier debugging.
        const txt = await resp.text();
        if (!resp.ok) {
          setErrorMessage(`서버 오류: ${txt.slice(0, 200)}`);
          setIsSubmitting(false);
          return;
        }
        // If it's OK but not JSON, treat as unexpected
        setErrorMessage(`서버가 예상한 형식(JSON)을 반환하지 않았습니다.`);
        setIsSubmitting(false);
        return;
      }

      if (!resp.ok) {
        setErrorMessage(data?.error || '주문 생성에 실패했습니다.');
        setIsSubmitting(false);
        return;
      }

      // success
      setCreatedOrderId(data.order_id ?? null);
      setIsSubmitted(true);
      clear();
    } catch (err: any) {
      setErrorMessage(String(err?.message || err));
    } finally {
      setIsSubmitting(false);
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
            {createdOrderId && (
              <p className="text-[#B8A882] mb-2">주문번호: <span className="text-[#D4AF37]">{createdOrderId}</span></p>
            )}
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
              <p className="text-[#B8A882] mt-1">예금주: 김현도</p>
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
              <h3 className="text-[#F5F5DC] tracking-wider">문의</h3>
            </div>
            <div className="pl-3 border-l-2 border-[#D4AF37]/30 space-y-1">
              <p className="text-[#B8A882] mb-1">전화</p>
              <a
                href={`tel:${operatorPhone}`}
                className="text-[#D4AF37] tracking-wider hover:text-[#FFD700] transition-colors block"
              >
                {operatorPhone}
              </a>
              <p className="text-[#B8A882] mb-1">인스타그램</p>
              <a href="https://instagram.com/b.u.d_official" target="_blank" rel="noreferrer" className="text-[#D4AF37] tracking-wider hover:text-[#FFD700] transition-colors block">@b.u.d_official</a>
              <p className="text-[#B8A882] mb-1">전자우편</p>
              <a href="mailto:budofficial07@gmail.com" className="text-[#D4AF37] tracking-wider hover:text-[#FFD700] transition-colors block">budofficial07@gmail.com</a>
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
              <div className="pl-3 border-l-2 border-[#D4AF37]/30 space-y-2">
                {items.length === 0 ? (
                  <p className="text-[#B8A882]">장바구니에 상품이 없습니다.</p>
                ) : (
                  items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 py-2">
                      <div>
                        <p className="text-[#F5F5DC]">{item.name}</p>
                        <p className="text-[#B8A882] text-sm">{item.store}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-[#0F0F0F] border-2 border-[#D4AF37]/30 rounded">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, quantity - 1))}
                            className="px-3 py-2 text-[#B8A882]"
                            aria-label={`감소 ${item.name}`}
                          >
                            -
                          </button>
                          <div className="px-4 py-2 text-[#F5F5DC]">{quantity}</div>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="px-3 py-2 text-[#B8A882]"
                            aria-label={`증가 ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-[#D4AF37] w-28 text-right">{(item.price * quantity).toLocaleString()}원</div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-[#FF6B6B] flex items-center gap-2"
                          aria-label={`삭제 ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" /> 삭제
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
                  예금주: 김현도로
                </p>
              </div>
            </Card>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#F5F5DC] tracking-wider">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-7384-3271"
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
                
                <div className="mb-3 flex items-center justify-between text-[#B8A882]">
                  <div className="text-sm">총 합계: <span className="text-[#D4AF37]">{subtotal.toLocaleString()}원</span></div>
                  <div className="text-sm text-right">최소 주문금액: <span className="text-[#D4AF37]">{MIN_ORDER.toLocaleString()}원</span></div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || subtotal < MIN_ORDER || items.length === 0}
                  className="w-full bg-[#D4AF37] active:bg-[#FFD700] text-[#0A0A0A] py-7 border-2 border-[#D4AF37] transition-all duration-200 touch-manipulation disabled:opacity-50"
                  size="lg"
                >
                  <span className="relative z-10 tracking-widest">주문 완료</span>
                </Button>
                {subtotal < MIN_ORDER && (
                  <p className="mt-2 text-sm text-[#B8A882]">최소주문금액 {MIN_ORDER.toLocaleString()}원입니다. { (MIN_ORDER - subtotal) > 0 ? `${(MIN_ORDER - subtotal).toLocaleString()}원 더 담아주세요.` : '' }</p>
                )}
                {errorMessage && (
                  <p className="mt-2 text-sm text-[#FF6B6B]">{errorMessage}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

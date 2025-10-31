import { Market } from '../types/market';

export const markets: Market[] = [
  {
    id: 'hyundai',
    name: '현대시장',
    menuItems: [
      {
        id: 'h1',
        name: '떡볶이',
        store: '할머니 떡볶이',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1573470571028-a0ca7a723959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dGVva2Jva2tpJTIwa29yZWFuJTIwZm9vZHxlbnwxfHx8fDE3NjE2NDI4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '매콤달콤한 떡볶이입니다. 어묵과 삶은 계란이 포함되어 있습니다. 할머니가 30년간 이어온 전통의 맛!'
      },
      {
        id: 'h2',
        name: '김밥',
        store: '맛있는 김밥천국',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1759153820013-0e42a58ac2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraW1iYXAlMjBrb3JlYW4lMjByb2xsfGVufDF8fHx8MTc2MTczOTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '신선한 재료로 만든 김밥입니다. 당근, 시금치, 단무지, 계란 등이 들어가 있습니다.'
      },
      {
        id: 'h3',
        name: '치킨강정',
        store: '옛날통닭',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1687966699414-095ca9c35593?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmcmllZCUyMGNoaWNrZW58ZW58MXx8fHwxNzYxNzI2NTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '바삭한 튀김옷에 달콤한 양념이 듬뿍! 주문 즉시 조리하여 따뜻하게 배달해드립니다.'
      },
      {
        id: 'h4',
        name: '잡채',
        store: '엄마손 반찬',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBub29kbGVzfGVufDF8fHx8MTc2MTY1MTI5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '야채와 고기가 듬뿍 들어간 영양만점 잡채입니다. 명절 맛 그대로!'
      }
    ]
  },
  {
    id: 'seongnam',
    name: '성남중앙공설시장',
    menuItems: [
      {
        id: 's1',
        name: '순대국밥',
        store: '할매순대국',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1628532429788-c35922b5e6c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBzdHJlZXQlMjBmb29kfGVufDF8fHx8MTc2MTczOTEyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '진한 국물과 신선한 순대가 들어간 든든한 한 끼! 새우젓과 다대기가 함께 제공됩니다.'
      },
      {
        id: 's2',
        name: '비빔밥',
        store: '시장할머니 비빔밥',
        price: 7000,
        image: 'https://images.unsplash.com/photo-1675604551031-42050bf8eba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtYXJrZXQlMjBmb29kfGVufDF8fHx8MTc2MTczOTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '다양한 나물과 고추장이 어우러진 맛있는 비빔밥입니다. 계란후라이가 올라갑니다.'
      },
      {
        id: 's3',
        name: '튀김 모듬',
        store: '바삭튀김',
        price: 6000,
        image: 'https://images.unsplash.com/photo-1628532429788-c35922b5e6c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBzdHJlZXQlMjBmb29kfGVufDF8fHx8MTc2MTczOTEyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '고구마, 김말이, 오징어 등 다양한 튀김이 들어있습니다. 즉석에서 튀겨드립니다!'
      },
      {
        id: 's4',
        name: '만두',
        store: '손만두집',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1573470571028-a0ca7a723959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dGVva2Jva2tpJTIwa29yZWFuJTIwZm9vZHxlbnwxfHx8fDE3NjE2NDI4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '직접 빚은 손만두입니다. 고기와 야채가 꽉 차 있어요. 찐만두와 군만두 중 선택 가능!'
      }
    ]
  }
];

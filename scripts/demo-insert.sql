-- 1) markets에 '테스트시장'이 없으면 추가
INSERT INTO markets (market_name)
SELECT '테스트시장'
WHERE NOT EXISTS (SELECT 1 FROM markets WHERE market_name = '테스트시장');

-- 2) '테스트 분식'과 '테스트 반찬가게'를 추가 (market_id는 위에서 생성/존재한 레코드 사용)
INSERT INTO stores (market_id, store_name, min_order_amount)
SELECT market_id, '테스트 분식', 0 FROM markets WHERE market_name = '테스트시장'
UNION ALL
SELECT market_id, '테스트 반찬가게', 5000 FROM markets WHERE market_name = '테스트시장';

-- 3) menus 추가 (stores에 방금 추가된 store_name 기준으로 삽입)
INSERT INTO menus (store_id, menu_name, price, image_url, description)
SELECT s.store_id, '테스트 떡볶이', 5000, 'https://images.unsplash.com/photo-1573470571028-a0ca7a723959', '데모용 매콤달콤 떡볶이'
FROM stores s
JOIN markets m ON s.market_id = m.market_id
WHERE m.market_name = '테스트시장' AND s.store_name = '테스트 분식';

INSERT INTO menus (store_id, menu_name, price, image_url, description)
SELECT s.store_id, '테스트 김밥', 3000, 'https://images.unsplash.com/photo-1759153820013-0e42a58ac2c9', '데모용 김밥'
FROM stores s
JOIN markets m ON s.market_id = m.market_id
WHERE m.market_name = '테스트시장' AND s.store_name = '테스트 분식';

INSERT INTO menus (store_id, menu_name, price, image_url, description)
SELECT s.store_id, '테스트 반찬 세트', 8000, 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7', '데모용 반찬패키지'
FROM stores s
JOIN markets m ON s.market_id = m.market_id
WHERE m.market_name = '테스트시장' AND s.store_name = '테스트 반찬가게';

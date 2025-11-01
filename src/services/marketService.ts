import { supabase } from '../lib/supabaseClient';
import type { Market, MenuItem } from '../types/market';

type SupabaseMenu = {
  menu_id: number;
  menu_name: string;
  price: number;
  image_url?: string | null;
  description?: string | null;
};

type SupabaseStore = {
  store_id: number;
  store_name: string;
  menus: SupabaseMenu[];
};

type SupabaseMarket = {
  market_id: number;
  market_name: string;
  stores: SupabaseStore[];
};

export async function fetchMarketsFromSupabase(): Promise<Market[]> {
  const { data, error } = await supabase
    .from('markets')
    .select(`market_id, market_name, stores(store_id, store_name, menus(menu_id, menu_name, price, image_url, description))`);

  if (error) {
    throw error;
  }

  const markets = (data as SupabaseMarket[]).map((m) => {
    const menuItems: MenuItem[] = [];
    (m.stores || []).forEach((s) => {
      (s.menus || []).forEach((menu) => {
        menuItems.push({
          id: String(menu.menu_id),
          name: menu.menu_name,
          store: s.store_name,
          price: menu.price,
          image: menu.image_url ?? '',
          description: menu.description ?? '',
        });
      });
    });

    return {
      id: String(m.market_id),
      name: m.market_name,
      menuItems,
    } as Market;
  });

  return markets;
}

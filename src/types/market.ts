export interface MenuItem {
  id: string;
  name: string;
  store: string;
  price: number;
  image: string;
  description: string;
}

export interface Market {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

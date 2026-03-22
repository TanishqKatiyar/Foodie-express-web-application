export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  featured: boolean;
  menu?: MenuItem[];
  mapsUrl?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "Preparing" | "Out for delivery" | "Delivered";
  createdAt: string;
  restaurantId: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  address?: string;
  phone?: string;
}

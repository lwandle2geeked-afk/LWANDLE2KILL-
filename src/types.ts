export type CategoryType = 'all' | 'tees' | 'hoodies' | 'denim' | 'jackets' | 'accessories';

export interface ProductColor {
  name: string;
  hex: string;
  isChrome?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  brand?: string;
  brandSource?: 'pinterest' | 'shein' | 'temu' | 'hellstar' | 'chrome_hearts' | 'stussy' | 'balenciaga' | 'rick_owens' | 'corteiz' | 'sp5der' | 'essentials' | 'trapstar' | 'bape' | 'limitless';
  sourceBadge?: string;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'sold_out';
  stockCount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  fit: string;
  gsm?: string;
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  trackingCode: string;
  estimatedDelivery: string;
  appliedPromo?: string;
}

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  tagline: string;
  image: string;
  itemCount: number;
}

export interface LookbookHotspot {
  id: string;
  productId: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  label: string;
  itemType: string;
}

export interface LookbookLook {
  id: string;
  lookNumber: string;
  title: string;
  subtitle: string;
  issue: string;
  season: string;
  location: string;
  editorialStory: string;
  photographer: string;
  model: string;
  heroImage: string;
  detailImages: string[];
  productIds: string[];
  hotspots: LookbookHotspot[];
  stylingTips: string[];
  tags: string[];
  curatorQuote: string;
}

export type TabType = 'home' | 'shop' | 'lookbook' | 'new' | 'cart' | 'account';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'cart' | 'wishlist';
  image?: string;
}

export interface StorySlide {
  id: string;
  image: string;
  headline: string;
  subtext: string;
  taggedProductId?: string;
  duration?: number;
}

export interface ClothingStory {
  id: string;
  title: string;
  badge: string;
  coverImage: string;
  hasUnseen: boolean;
  slides: StorySlide[];
}

export interface CommunityFit {
  id: string;
  userHandle: string;
  userAvatar: string;
  userCity: string;
  image: string;
  modelMeasurements: {
    height: string;
    weight: string;
    sizeWorn: string;
    fitType: string;
  };
  stylingNotes: string;
  taggedProductIds: string[];
  likesCount: number;
}

export interface UpcomingDrop {
  id: string;
  title: string;
  collection: string;
  releaseDate: string;
  countdownTargetHours: number;
  price: number;
  image: string;
  editionLimit: string;
  gsm?: string;
  isRaffle: boolean;
  description: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  hours: string;
  phone: string;
  image: string;
  status: 'Open Today' | 'VIP Appointments Only';
  coordinates: string;
}

export type { CurrencyCode, CurrencyInfo, UserLocationData } from './data/currencies';


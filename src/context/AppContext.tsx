import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, Order, CategoryType, TabType, ToastMessage, ProductColor, ShippingAddress, CurrencyCode, CurrencyInfo, UserLocationData } from '../types';
import { PRODUCTS, PROMO_CODES } from '../data/products';
import { CURRENCIES, formatCurrencyAmount, detectUserLocationAndCurrency } from '../data/currencies';
import { playAddToCartSound, playCyberClickSound, playSuccessChime } from '../utils/audio';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  selectedCategoryFilter: CategoryType;
  setSelectedCategoryFilter: (cat: CategoryType) => void;
  selectedBrandFilter: string;
  setSelectedBrandFilter: (brand: string) => void;
  navigateToBrand: (brand: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  discountAmount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  cartTotal: number;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  
  // Search & Checkout
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  
  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: string) => Order;
  lastOrderPlaced: Order | null;
  setLastOrderPlaced: (order: Order | null) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (msg: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Settings & Helpers
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  savedAddresses: ShippingAddress[];
  addSavedAddress: (addr: ShippingAddress) => void;
  
  // Dynamic Global Currency & Location System
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  activeCurrencyInfo: CurrencyInfo;
  currencyMode: 'auto' | 'manual';
  setCurrencyMode: (mode: 'auto' | 'manual') => void;
  userLocation: UserLocationData;
  detectAndApplyLocationCurrency: () => Promise<UserLocationData>;
  showCurrencyCode: boolean;
  setShowCurrencyCode: (show: boolean) => void;
  formatPrice: (amount: number, options?: { showCode?: boolean; customCurrency?: CurrencyCode }) => string;
  getCurrencySymbol: () => string;
  isCurrencySwitcherOpen: boolean;
  setIsCurrencySwitcherOpen: (open: boolean) => void;
  
  // Pull to refresh simulation
  isRefreshing: boolean;
  handlePullRefresh: () => Promise<void>;
  
  // Direct Quick Navigation
  navigateToCategory: (cat: CategoryType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING_FEE = 15;

const DEFAULT_ADDRESSES: ShippingAddress[] = [
  {
    fullName: 'Alex Vance',
    email: 'alex.vance@limitless.drop',
    phone: '+1 (555) 942-8821',
    addressLine1: '742 Evergreen Cyberway, Apt 4B',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90013',
    country: 'United States',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'LM-83921',
    date: '2026-08-18',
    items: [
      {
        id: 'mock-order-item-1',
        productId: 'lm-01',
        product: PRODUCTS[0],
        selectedSize: 'L',
        selectedColor: PRODUCTS[0].colors[0],
        quantity: 1,
      },
      {
        id: 'mock-order-item-2',
        productId: 'lm-08',
        product: PRODUCTS[7],
        selectedSize: 'ONE SIZE',
        selectedColor: PRODUCTS[7].colors[0],
        quantity: 1,
      },
    ],
    subtotal: 126,
    discount: 25.2,
    shippingFee: 0,
    total: 100.8,
    status: 'In Transit',
    shippingAddress: DEFAULT_ADDRESSES[0],
    paymentMethod: 'Apple Pay',
    trackingCode: 'CYBER-TRK-9921448',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    appliedPromo: 'LIMITLESS20',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryType>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  
  // Stored state with local fallback
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'initial-cart-item',
          productId: 'lm-01',
          product: PRODUCTS[0],
          selectedSize: 'L',
          selectedColor: PRODUCTS[0].colors[0],
          quantity: 1,
        }
      ];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_wishlist');
      return saved ? JSON.parse(saved) : ['lm-01', 'lm-04'];
    } catch {
      return ['lm-01', 'lm-04'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>('LIMITLESS20');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrderPlaced, setLastOrderPlaced] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // User location detection & Currency state
  const [userLocation, setUserLocation] = useState<UserLocationData>(() => {
    return detectUserLocationAndCurrency();
  });

  const [currencyMode, setCurrencyModeState] = useState<'auto' | 'manual'>(() => {
    try {
      const savedMode = localStorage.getItem('limitless_currency_mode');
      return savedMode === 'manual' ? 'manual' : 'auto';
    } catch {
      return 'auto';
    }
  });

  const [showCurrencyCode, setShowCurrencyCodeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('limitless_show_currency_code');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('limitless_currency') as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        return saved;
      }
      // If no saved preference, use detected location currency
      const detected = detectUserLocationAndCurrency();
      return detected.matchedCurrency || 'USD';
    } catch {
      return 'USD';
    }
  });

  const [isCurrencySwitcherOpen, setIsCurrencySwitcherOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeCurrencyInfo: CurrencyInfo = useMemo(() => {
    return CURRENCIES[currency] || CURRENCIES.USD;
  }, [currency]);

  // Sync Currency preferences to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('limitless_currency', currency);
    } catch {
      // Ignore
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_currency_mode', currencyMode);
    } catch {
      // Ignore
    }
  }, [currencyMode]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_show_currency_code', JSON.stringify(showCurrencyCode));
    } catch {
      // Ignore
    }
  }, [showCurrencyCode]);

  const setCurrency = (newCurrency: CurrencyCode) => {
    if (!CURRENCIES[newCurrency]) return;
    playCyberClickSound(soundEnabled);
    setCurrencyState(newCurrency);
    setCurrencyModeState('manual');
    const info = CURRENCIES[newCurrency];
    showToast({
      title: 'CURRENCY UPDATED',
      description: `Active billing & pricing set to ${info.flag} ${info.code} (${info.name})`,
      type: 'success',
    });
  };

  const setCurrencyMode = (mode: 'auto' | 'manual') => {
    setCurrencyModeState(mode);
    if (mode === 'auto') {
      const detected = detectUserLocationAndCurrency();
      setUserLocation(detected);
      setCurrencyState(detected.matchedCurrency);
    }
  };

  const setShowCurrencyCode = (show: boolean) => {
    setShowCurrencyCodeState(show);
  };

  const detectAndApplyLocationCurrency = async (): Promise<UserLocationData> => {
    playCyberClickSound(soundEnabled);
    
    // Check if navigator.geolocation is accessible
    let detected = detectUserLocationAndCurrency();

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        const geoPosition = await new Promise<GeolocationPosition | null>((resolve) => {
          const timeout = setTimeout(() => resolve(null), 3000);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeout);
              resolve(pos);
            },
            () => {
              clearTimeout(timeout);
              resolve(null);
            },
            { timeout: 3000, maximumAge: 60000 }
          );
        });

        if (geoPosition) {
          detected = {
            ...detected,
            confidence: 'geolocation',
            detectedAt: new Date().toISOString(),
          };
        }
      } catch {
        // Fallback to timezone/locale detection
      }
    }

    setUserLocation(detected);
    setCurrencyState(detected.matchedCurrency);
    setCurrencyModeState('auto');

    const currInfo = CURRENCIES[detected.matchedCurrency] || CURRENCIES.USD;
    playSuccessChime(soundEnabled);
    showToast({
      title: 'LOCATION DETECTED',
      description: `📍 ${detected.regionName} → Auto-switched to ${currInfo.flag} ${currInfo.code} (${currInfo.symbol})`,
      type: 'success',
    });

    return detected;
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('limitless_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_orders', JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  const setActiveTab = (tab: TabType) => {
    playCyberClickSound(soundEnabled);
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { ...msg, id };
    setToasts((prev) => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openProductModal = (product: Product) => {
    playCyberClickSound(soundEnabled);
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    playCyberClickSound(soundEnabled);
    setSelectedProduct(null);
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: ProductColor, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.selectedSize === size && item.selectedColor.name === color.name
    );

    playAddToCartSound(soundEnabled);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${product.id}-${size}-${color.name}-${Date.now()}`,
        productId: product.id,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity,
      };
      setCart((prev) => [newItem, ...prev]);
    }

    showToast({
      title: 'ADDED TO CYBER CART',
      description: `${product.name} (${size}) × ${quantity}`,
      type: 'cart',
      image: product.images[0],
    });
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    playCyberClickSound(soundEnabled);
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    playCyberClickSound(soundEnabled);
    const item = cart.find((i) => i.id === cartItemId);
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    if (item) {
      showToast({
        title: 'REMOVED FROM CART',
        description: item.product.name,
        type: 'info',
      });
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.discountPercent) {
      discountAmount = (cartSubtotal * promo.discountPercent) / 100;
    } else if (promo.discountAmount) {
      discountAmount = Math.min(cartSubtotal, promo.discountAmount);
    }
  }

  const shippingFee = cartSubtotal === 0 || cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (PROMO_CODES[clean]) {
      setAppliedPromo(clean);
      playSuccessChime(soundEnabled);
      showToast({
        title: 'PROMO CODE APPLIED',
        description: `${clean}: ${PROMO_CODES[clean].desc}`,
        type: 'success',
      });
      return { success: true, message: `Applied ${PROMO_CODES[clean].desc}` };
    }
    return { success: false, message: 'Invalid promo code. Try LIMITLESS20 or CYBERY2K' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast({
      title: 'PROMO REMOVED',
      type: 'info',
    });
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    playCyberClickSound(soundEnabled);
    const exists = wishlist.includes(productId);
    const product = PRODUCTS.find((p) => p.id === productId);

    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      if (product) {
        showToast({
          title: 'REMOVED FROM WISHLIST',
          description: product.name,
          type: 'info',
        });
      }
    } else {
      setWishlist((prev) => [...prev, productId]);
      if (product) {
        showToast({
          title: 'SAVED TO WISHLIST',
          description: product.name,
          type: 'wishlist',
          image: product.images[0],
        });
      }
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = (shippingAddress: ShippingAddress, paymentMethod: string): Order => {
    playSuccessChime(soundEnabled);
    const newOrder: Order = {
      id: `LM-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingFee,
      total: cartTotal,
      status: 'Processing',
      shippingAddress,
      paymentMethod,
      trackingCode: `CYBER-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDelivery: '3-4 Business Days via Cyber Express',
      appliedPromo: appliedPromo || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrderPlaced(newOrder);
    clearCart();
    return newOrder;
  };

  const addSavedAddress = (addr: ShippingAddress) => {
    setSavedAddresses((prev) => [addr, ...prev]);
    showToast({
      title: 'ADDRESS SAVED',
      description: addr.addressLine1,
      type: 'success',
    });
  };

  const formatPrice = useCallback(
    (amount: number, options?: { showCode?: boolean; customCurrency?: CurrencyCode }): string => {
      const targetCurrency = options?.customCurrency || currency;
      return formatCurrencyAmount(amount, targetCurrency, {
        showCode: options?.showCode ?? showCurrencyCode,
      });
    },
    [currency, showCurrencyCode]
  );

  const getCurrencySymbol = useCallback((): string => {
    return activeCurrencyInfo.symbol.trim();
  }, [activeCurrencyInfo]);

  const handlePullRefresh = async () => {
    setIsRefreshing(true);
    playCyberClickSound(soundEnabled);
    await new Promise((res) => setTimeout(res, 900));
    setIsRefreshing(false);
    showToast({
      title: 'DROPS REFRESHED',
      description: 'Latest inventory & stock levels synced',
      type: 'info',
    });
  };

  const navigateToCategory = (cat: CategoryType) => {
    setSelectedCategoryFilter(cat);
    setActiveTab('shop');
  };

  const navigateToBrand = (brandId: string) => {
    setSelectedBrandFilter(brandId);
    setSelectedCategoryFilter('all');
    setActiveTab('shop');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        openProductModal,
        closeProductModal,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedBrandFilter,
        setSelectedBrandFilter,
        navigateToBrand,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        placeOrder,
        lastOrderPlaced,
        setLastOrderPlaced,
        toasts,
        showToast,
        removeToast,
        soundEnabled,
        setSoundEnabled,
        savedAddresses,
        addSavedAddress,
        currency,
        setCurrency,
        activeCurrencyInfo,
        currencyMode,
        setCurrencyMode,
        userLocation,
        detectAndApplyLocationCurrency,
        showCurrencyCode,
        setShowCurrencyCode,
        formatPrice,
        getCurrencySymbol,
        isCurrencySwitcherOpen,
        setIsCurrencySwitcherOpen,
        isRefreshing,
        handlePullRefresh,
        navigateToCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

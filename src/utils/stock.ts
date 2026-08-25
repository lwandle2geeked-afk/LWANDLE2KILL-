import { Product } from '../types';

export interface SizeStockInfo {
  size: string;
  count: number;
  status: 'low_stock' | 'in_stock' | 'sold_out';
  label: string;
}

export interface ProductStockInfo {
  status: 'low_stock' | 'in_stock' | 'sold_out';
  count: number;
  isLowStock: boolean;
  isSoldOut: boolean;
  badgeText: string;
  badgeSubtext: string;
  urgencyText: string;
  viewersCount: number;
  claimedPercentage: number;
  recentOrdersCount: number;
  sizeStockMap: Record<string, SizeStockInfo>;
}

/**
 * Deterministic pseudo-random helper based on product ID to keep viewer counts
 * and size stocks consistent across renders while appearing dynamic.
 */
function getDeterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Calculates dynamic stock availability, size breakdown, and urgency indicators.
 */
export function getProductStockInfo(product: Product, selectedSize?: string): ProductStockInfo {
  const hash = getDeterministicHash(product.id);
  
  // Total stock units
  const totalCount = product.stockCount ?? (product.stockStatus === 'low_stock' ? 4 : 16);
  const isBaseLowStock = product.stockStatus === 'low_stock' || totalCount <= 6;
  const isSoldOut = product.stockStatus === 'sold_out' || totalCount === 0;

  // Calculate size stock distribution
  const sizeStockMap: Record<string, SizeStockInfo> = {};
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  
  let remainingTotal = totalCount;
  sizes.forEach((size, index) => {
    // Generate realistic stock counts per size
    let sizeCount: number;
    if (isBaseLowStock) {
      // Low stock: 1 to 3 items per size, some sizes might have only 1 left
      sizeCount = Math.max(1, ((hash + index * 3) % 3) + 1);
      if (index === sizes.length - 1 && remainingTotal < sizeCount) {
        sizeCount = Math.max(1, remainingTotal);
      }
    } else {
      // In stock: 3 to 8 items per size
      sizeCount = Math.max(2, ((hash + index * 5) % 6) + 3);
    }

    const sizeStatus: 'low_stock' | 'in_stock' | 'sold_out' =
      sizeCount <= 2 ? 'low_stock' : 'in_stock';

    sizeStockMap[size] = {
      size,
      count: sizeCount,
      status: sizeStatus,
      label: sizeCount <= 2 ? `Only ${sizeCount} left` : 'In Stock',
    };
  });

  // If a specific size is selected, use that size's stock metrics
  const activeSizeStock = selectedSize && sizeStockMap[selectedSize] ? sizeStockMap[selectedSize] : null;
  const effectiveCount = activeSizeStock ? activeSizeStock.count : totalCount;
  const effectiveStatus: 'low_stock' | 'in_stock' | 'sold_out' = isSoldOut
    ? 'sold_out'
    : effectiveCount <= 5 || isBaseLowStock
    ? 'low_stock'
    : 'in_stock';

  const isLowStock = effectiveStatus === 'low_stock';

  // Dynamic live social proof metrics
  const viewersCount = 14 + (hash % 18); // e.g. 14 to 31 active viewers
  const recentOrdersCount = 4 + (hash % 9); // e.g. 4 to 12 orders today
  const claimedPercentage = isLowStock ? 82 + (hash % 14) : 45 + (hash % 25); // e.g. 82-96% claimed

  let badgeText = 'IN STOCK';
  let badgeSubtext = 'Ready to ship';
  let urgencyText = `In Stock • ${totalCount} units available`;

  if (isSoldOut) {
    badgeText = 'SOLD OUT';
    badgeSubtext = 'Join waitlist';
    urgencyText = 'Archive piece currently sold out';
  } else if (isLowStock) {
    badgeText = totalCount <= 5 ? `ONLY ${totalCount} LEFT` : 'LOW STOCK';
    badgeSubtext = 'Selling fast';
    urgencyText = `⚡ High Demand: Only ${effectiveCount} pieces left in vault`;
  } else {
    badgeText = 'IN STOCK';
    badgeSubtext = `${totalCount} units in vault`;
    urgencyText = `● In Stock & Ready to Dispatch (${totalCount} units available)`;
  }

  return {
    status: effectiveStatus,
    count: effectiveCount,
    isLowStock,
    isSoldOut,
    badgeText,
    badgeSubtext,
    urgencyText,
    viewersCount,
    claimedPercentage,
    recentOrdersCount,
    sizeStockMap,
  };
}

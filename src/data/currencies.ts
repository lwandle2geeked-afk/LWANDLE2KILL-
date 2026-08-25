export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'KRW'
  | 'SGD'
  | 'CHF'
  | 'ZAR'
  | 'AED'
  | 'HKD'
  | 'SEK'
  | 'BRL';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rate: number; // relative to 1.0 USD
  flag: string;
  region: string;
  marketHub: string;
  decimals: number;
  locale: string;
  symbolPosition: 'prefix' | 'suffix';
}

export interface UserLocationData {
  country: string;
  city?: string;
  regionName: string;
  timezone: string;
  matchedCurrency: CurrencyCode;
  confidence: 'auto_timezone' | 'auto_locale' | 'geolocation' | 'manual';
  detectedAt: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.0,
    flag: '🇺🇸',
    region: 'North America',
    marketHub: 'Los Angeles / New York',
    decimals: 2,
    locale: 'en-US',
    symbolPosition: 'prefix',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.92,
    flag: '🇪🇺',
    region: 'European Union',
    marketHub: 'Paris / Berlin / Milan',
    decimals: 2,
    locale: 'de-DE',
    symbolPosition: 'prefix',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.79,
    flag: '🇬🇧',
    region: 'United Kingdom',
    marketHub: 'London / Soho',
    decimals: 2,
    locale: 'en-GB',
    symbolPosition: 'prefix',
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    rate: 152.5,
    flag: '🇯🇵',
    region: 'Japan',
    marketHub: 'Tokyo / Harajuku & Shibuya',
    decimals: 0,
    locale: 'ja-JP',
    symbolPosition: 'prefix',
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    rate: 1.36,
    flag: '🇨🇦',
    region: 'Canada',
    marketHub: 'Toronto / Vancouver',
    decimals: 2,
    locale: 'en-CA',
    symbolPosition: 'prefix',
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.52,
    flag: '🇦🇺',
    region: 'Australia',
    marketHub: 'Sydney / Melbourne',
    decimals: 2,
    locale: 'en-AU',
    symbolPosition: 'prefix',
  },
  KRW: {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    rate: 1375.0,
    flag: '🇰🇷',
    region: 'South Korea',
    marketHub: 'Seoul / Hongdae & Seongsu',
    decimals: 0,
    locale: 'ko-KR',
    symbolPosition: 'prefix',
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    rate: 1.34,
    flag: '🇸🇬',
    region: 'Singapore',
    marketHub: 'Singapore / Orchard',
    decimals: 2,
    locale: 'en-SG',
    symbolPosition: 'prefix',
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF ',
    rate: 0.90,
    flag: '🇨🇭',
    region: 'Switzerland',
    marketHub: 'Zurich / Geneva',
    decimals: 2,
    locale: 'de-CH',
    symbolPosition: 'prefix',
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rate: 18.45,
    flag: '🇿🇦',
    region: 'South Africa',
    marketHub: 'Johannesburg / Cape Town',
    decimals: 2,
    locale: 'en-ZA',
    symbolPosition: 'prefix',
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    rate: 3.67,
    flag: '🇦🇪',
    region: 'Middle East',
    marketHub: 'Dubai / Design District',
    decimals: 2,
    locale: 'ar-AE',
    symbolPosition: 'prefix',
  },
  HKD: {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    rate: 7.82,
    flag: '🇭🇰',
    region: 'East Asia',
    marketHub: 'Hong Kong / Kowloon',
    decimals: 2,
    locale: 'zh-HK',
    symbolPosition: 'prefix',
  },
  SEK: {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: ' kr',
    rate: 10.45,
    flag: '🇸🇪',
    region: 'Scandinavia',
    marketHub: 'Stockholm / Södermalm',
    decimals: 2,
    locale: 'sv-SE',
    symbolPosition: 'suffix',
  },
  BRL: {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$ ',
    rate: 5.45,
    flag: '🇧🇷',
    region: 'South America',
    marketHub: 'São Paulo / Paulista',
    decimals: 2,
    locale: 'pt-BR',
    symbolPosition: 'prefix',
  },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

export const TOP_CURRENCIES: CurrencyCode[] = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'KRW',
  'ZAR',
];

/**
 * Formats a USD base amount into the target currency with correct symbols,
 * decimals, separators, and positioning.
 */
export function formatCurrencyAmount(
  amountInUSD: number,
  currencyCode: CurrencyCode,
  options?: {
    showCode?: boolean;
    includeSpace?: boolean;
  }
): string {
  const info = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amountInUSD * info.rate;

  // Format the number with correct decimal places and locale grouping
  const formattedNumber = new Intl.NumberFormat(info.locale, {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(converted);

  let formattedPrice = '';
  if (info.symbolPosition === 'suffix') {
    formattedPrice = `${formattedNumber}${info.symbol}`;
  } else {
    formattedPrice = `${info.symbol}${formattedNumber}`;
  }

  if (options?.showCode) {
    return `${formattedPrice} ${info.code}`;
  }

  return formattedPrice;
}

/**
 * Intelligent location detection using Browser Intl Timezone, Browser Locale, and Geo-coordinates
 */
export function detectUserLocationAndCurrency(): UserLocationData {
  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    timezone = 'UTC';
  }

  const navLang = typeof navigator !== 'undefined' ? (navigator.languages?.[0] || navigator.language || '') : '';
  const langLower = navLang.toLowerCase();

  // 1. Timezone mapping
  if (timezone.includes('Tokyo') || timezone.includes('Japan')) {
    return {
      country: 'Japan',
      city: 'Tokyo',
      regionName: 'Tokyo / Kanto (JST)',
      timezone,
      matchedCurrency: 'JPY',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (timezone.includes('Seoul') || timezone.includes('Korea')) {
    return {
      country: 'South Korea',
      city: 'Seoul',
      regionName: 'Seoul / Gyeonggi (KST)',
      timezone,
      matchedCurrency: 'KRW',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (timezone.includes('London') || timezone.includes('Belfast')) {
    return {
      country: 'United Kingdom',
      city: 'London',
      regionName: 'United Kingdom (GMT/BST)',
      timezone,
      matchedCurrency: 'GBP',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (
    timezone.includes('Paris') ||
    timezone.includes('Berlin') ||
    timezone.includes('Rome') ||
    timezone.includes('Madrid') ||
    timezone.includes('Amsterdam') ||
    timezone.includes('Brussels') ||
    timezone.includes('Vienna') ||
    timezone.includes('Athens') ||
    timezone.includes('Helsinki') ||
    timezone.includes('Dublin') ||
    timezone.includes('Lisbon') ||
    timezone.includes('Warsaw') ||
    timezone.includes('Europe')
  ) {
    if (timezone.includes('Zurich')) {
      return {
        country: 'Switzerland',
        city: 'Zurich',
        regionName: 'Switzerland (CET)',
        timezone,
        matchedCurrency: 'CHF',
        confidence: 'auto_timezone',
        detectedAt: new Date().toISOString(),
      };
    }
    if (timezone.includes('Stockholm')) {
      return {
        country: 'Sweden',
        city: 'Stockholm',
        regionName: 'Sweden (CET)',
        timezone,
        matchedCurrency: 'SEK',
        confidence: 'auto_timezone',
        detectedAt: new Date().toISOString(),
      };
    }
    return {
      country: 'European Union',
      city: 'Central Europe',
      regionName: 'Eurozone (CET)',
      timezone,
      matchedCurrency: 'EUR',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (
    timezone.includes('Toronto') ||
    timezone.includes('Vancouver') ||
    timezone.includes('Montreal') ||
    timezone.includes('Edmonton') ||
    timezone.includes('Winnipeg') ||
    timezone.includes('Halifax')
  ) {
    return {
      country: 'Canada',
      city: timezone.split('/')[1]?.replace('_', ' ') || 'Toronto',
      regionName: 'Canada',
      timezone,
      matchedCurrency: 'CAD',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (
    timezone.includes('Sydney') ||
    timezone.includes('Melbourne') ||
    timezone.includes('Brisbane') ||
    timezone.includes('Perth') ||
    timezone.includes('Adelaide') ||
    timezone.includes('Australia')
  ) {
    return {
      country: 'Australia',
      city: timezone.split('/')[1]?.replace('_', ' ') || 'Sydney',
      regionName: 'Australia (AEST)',
      timezone,
      matchedCurrency: 'AUD',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (timezone.includes('Johannesburg') || timezone.includes('Africa/Cape_Town')) {
    return {
      country: 'South Africa',
      city: 'Johannesburg',
      regionName: 'South Africa (SAST)',
      timezone,
      matchedCurrency: 'ZAR',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (timezone.includes('Dubai') || timezone.includes('Muscat')) {
    return {
      country: 'United Arab Emirates',
      city: 'Dubai',
      regionName: 'UAE / GCC (GST)',
      timezone,
      matchedCurrency: 'AED',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (timezone.includes('Singapore')) {
    return {
      country: 'Singapore',
      city: 'Singapore',
      regionName: 'Singapore (SGT)',
      timezone,
      matchedCurrency: 'SGD',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (timezone.includes('Hong_Kong')) {
    return {
      country: 'Hong Kong',
      city: 'Hong Kong',
      regionName: 'Hong Kong (HKT)',
      timezone,
      matchedCurrency: 'HKD',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  if (timezone.includes('Sao_Paulo') || timezone.includes('Brazil')) {
    return {
      country: 'Brazil',
      city: 'São Paulo',
      regionName: 'Brazil (BRT)',
      timezone,
      matchedCurrency: 'BRL',
      confidence: 'auto_timezone',
      detectedAt: new Date().toISOString(),
    };
  }

  // 2. Language / Locale fallback check
  if (langLower.startsWith('ja')) {
    return {
      country: 'Japan',
      regionName: 'Japan (Locale)',
      timezone,
      matchedCurrency: 'JPY',
      confidence: 'auto_locale',
      detectedAt: new Date().toISOString(),
    };
  }
  if (langLower.startsWith('ko')) {
    return {
      country: 'South Korea',
      regionName: 'South Korea (Locale)',
      timezone,
      matchedCurrency: 'KRW',
      confidence: 'auto_locale',
      detectedAt: new Date().toISOString(),
    };
  }
  if (langLower.includes('gb') || langLower === 'en-uk') {
    return {
      country: 'United Kingdom',
      regionName: 'United Kingdom (Locale)',
      timezone,
      matchedCurrency: 'GBP',
      confidence: 'auto_locale',
      detectedAt: new Date().toISOString(),
    };
  }
  if (langLower.includes('ca')) {
    return {
      country: 'Canada',
      regionName: 'Canada (Locale)',
      timezone,
      matchedCurrency: 'CAD',
      confidence: 'auto_locale',
      detectedAt: new Date().toISOString(),
    };
  }
  if (langLower.includes('au')) {
    return {
      country: 'Australia',
      regionName: 'Australia (Locale)',
      timezone,
      matchedCurrency: 'AUD',
      confidence: 'auto_locale',
      detectedAt: new Date().toISOString(),
    };
  }
  if (langLower.includes('za')) {
    return {
      country: 'South Africa',
      regionName: 'South Africa (Locale)',
      timezone,
      matchedCurrency: 'ZAR',
      confidence: 'auto_locale',
      detectedAt: new Date().toISOString(),
    };
  }

  // Default to US Dollar
  const cityName = timezone.includes('/')
    ? timezone.split('/')[1].replace('_', ' ')
    : 'New York';

  return {
    country: 'United States',
    city: cityName,
    regionName: `United States (${cityName})`,
    timezone,
    matchedCurrency: 'USD',
    confidence: 'auto_timezone',
    detectedAt: new Date().toISOString(),
  };
}

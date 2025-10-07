export interface Theme {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    cardBg: string;
    cardBorder: string;
    gradient1: string;
    gradient2: string;
  };
  pattern: string;
  borderStyle: string;
}

export const themes: Theme[] = [
  {
    id: 'alhambra',
    name: 'Alhambra Palace',
    nameArabic: 'قصر الحمراء',
    description: 'Inspired by the majestic Alhambra Palace of Granada',
    colors: {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#CD853F',
      text: '#FFFFFF',
      textSecondary: '#F5DEB3',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#DAA520',
      gradient1: '#8B4513',
      gradient2: '#CD853F',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L35 15L50 10L40 25L55 30L40 35L50 50L35 45L30 60L25 45L10 50L20 35L5 30L20 25L10 10L25 15Z' fill='%23DAA520' fill-opacity='0.1'/%3E%3C/svg%3E\")",
    borderStyle: '8px',
  },
  {
    id: 'bluemosque',
    name: 'Blue Mosque',
    nameArabic: 'المسجد الأزرق',
    description: 'Inspired by the iconic Blue Mosque of Istanbul',
    colors: {
      primary: '#1E3A8A',
      secondary: '#60A5FA',
      accent: '#DBEAFE',
      text: '#FFFFFF',
      textSecondary: '#BFDBFE',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#60A5FA',
      gradient1: '#1E3A8A',
      gradient2: '#3B82F6',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2360A5FA' fill-opacity='0.08'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M40 40h40v40H40z'/%3E%3C/g%3E%3Cpath d='M40 0L20 20L40 40L60 20Z M0 40L20 60L40 40L20 20Z M40 40L60 60L80 40L60 20Z M40 40L20 60L40 80L60 60Z' fill='%2360A5FA' fill-opacity='0.12'/%3E%3C/svg%3E\")",
    borderStyle: '10px',
  },
  {
    id: 'mecca',
    name: 'Masjid al-Haram',
    nameArabic: 'المسجد الحرام',
    description: 'Inspired by the sacred Grand Mosque of Mecca',
    colors: {
      primary: '#000000',
      secondary: '#FFD700',
      accent: '#C0C0C0',
      text: '#FFFFFF',
      textSecondary: '#FFD700',
      cardBg: 'rgba(255, 255, 255, 0.97)',
      cardBorder: '#FFD700',
      gradient1: '#1A1A1A',
      gradient2: '#4A4A4A',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45Z' fill='%23FFD700' fill-opacity='0.1'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23FFD700' stroke-opacity='0.08' stroke-width='2'/%3E%3C/svg%3E\")",
    borderStyle: '12px',
  },
  {
    id: 'moroccan',
    name: 'Moroccan Garden',
    nameArabic: 'الحديقة المغربية',
    description: 'Inspired by the lush gardens of Morocco',
    colors: {
      primary: '#064E3B',
      secondary: '#10B981',
      accent: '#6EE7B7',
      text: '#FFFFFF',
      textSecondary: '#D1FAE5',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#10B981',
      gradient1: '#064E3B',
      gradient2: '#047857',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15L25 25L15 30L25 35L30 45L35 35L45 30L35 25Z' fill='%2310B981' fill-opacity='0.12'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%2310B981' fill-opacity='0.1'/%3E%3C/svg%3E\")",
    borderStyle: '8px',
  },
  {
    id: 'desert',
    name: 'Desert Oasis',
    nameArabic: 'واحة الصحراء',
    description: 'Inspired by the warm colors of desert landscapes',
    colors: {
      primary: '#92400E',
      secondary: '#F59E0B',
      accent: '#FCD34D',
      text: '#FFFFFF',
      textSecondary: '#FEF3C7',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#F59E0B',
      gradient1: '#92400E',
      gradient2: '#D97706',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20Q10 10 20 20T40 20M0 0Q10 -10 20 0T40 0M0 40Q10 30 20 40T40 40' fill='none' stroke='%23F59E0B' stroke-opacity='0.1' stroke-width='2'/%3E%3C/svg%3E\")",
    borderStyle: '6px',
  },
  {
    id: 'andalusia',
    name: 'Andalusian Night',
    nameArabic: 'ليلة أندلسية',
    description: 'Inspired by the enchanting nights of Andalusia',
    colors: {
      primary: '#1E1B4B',
      secondary: '#A78BFA',
      accent: '#DDD6FE',
      text: '#FFFFFF',
      textSecondary: '#E9D5FF',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#A78BFA',
      gradient1: '#1E1B4B',
      gradient2: '#4C1D95',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10L32 18L40 20L32 22L30 30L28 22L20 20L28 18Z' fill='%23A78BFA' fill-opacity='0.15'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23A78BFA' fill-opacity='0.1'/%3E%3Ccircle cx='45' cy='45' r='2' fill='%23A78BFA' fill-opacity='0.1'/%3E%3C/svg%3E\")",
    borderStyle: '8px',
  },
  {
    id: 'ottoman',
    name: 'Ottoman Elegance',
    nameArabic: 'الأناقة العثمانية',
    description: 'Inspired by the grandeur of Ottoman architecture',
    colors: {
      primary: '#7C2D12',
      secondary: '#DC2626',
      accent: '#FCA5A5',
      text: '#FFFFFF',
      textSecondary: '#FEE2E2',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#DC2626',
      gradient1: '#7C2D12',
      gradient2: '#991B1B',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z' fill='%23DC2626' fill-opacity='0.1'/%3E%3Cpath d='M20 20L25 35L40 40L25 45L20 60L15 45L0 40L15 35Z M60 20L65 35L80 40L65 45L60 60L55 45L40 40L55 35Z' fill='%23DC2626' fill-opacity='0.08'/%3E%3C/svg%3E\")",
    borderStyle: '10px',
  },
  {
    id: 'persian',
    name: 'Persian Garden',
    nameArabic: 'الحديقة الفارسية',
    description: 'Inspired by the beautiful Persian gardens',
    colors: {
      primary: '#0C4A6E',
      secondary: '#06B6D4',
      accent: '#A5F3FC',
      text: '#FFFFFF',
      textSecondary: '#CFFAFE',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#06B6D4',
      gradient1: '#0C4A6E',
      gradient2: '#0E7490',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C30 0 20 10 20 20S25 35 30 35S40 30 40 20S30 0 30 0Z M0 30C0 30 10 20 20 20S35 25 35 30S30 40 20 40S0 30 0 30Z M30 25C30 25 40 35 40 45S35 60 30 60S20 55 20 45S30 25 30 25Z M25 30C25 30 35 40 45 40S60 35 60 30S55 20 45 20S25 30 25 30Z' fill='%2306B6D4' fill-opacity='0.1'/%3E%3C/svg%3E\")",
    borderStyle: '8px',
  },
  {
    id: 'cairo',
    name: 'Cairo Sunset',
    nameArabic: 'غروب القاهرة',
    description: 'Inspired by the magnificent sunsets over Cairo',
    colors: {
      primary: '#831843',
      secondary: '#EC4899',
      accent: '#FBCFE8',
      text: '#FFFFFF',
      textSecondary: '#FCE7F3',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: '#EC4899',
      gradient1: '#831843',
      gradient2: '#BE185D',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23EC4899' stroke-opacity='0.08' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23EC4899' stroke-opacity='0.08' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='%23EC4899' stroke-opacity='0.08' stroke-width='2'/%3E%3C/svg%3E\")",
    borderStyle: '8px',
  },
  {
    id: 'madinah',
    name: 'Green Dome',
    nameArabic: 'القبة الخضراء',
    description: 'Inspired by the blessed city of Madinah',
    colors: {
      primary: '#14532D',
      secondary: '#22C55E',
      accent: '#BBF7D0',
      text: '#FFFFFF',
      textSecondary: '#DCFCE7',
      cardBg: 'rgba(255, 255, 255, 0.97)',
      cardBorder: '#22C55E',
      gradient1: '#14532D',
      gradient2: '#166534',
    },
    pattern: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L45 35L80 40L45 45L40 80L35 45L0 40L35 35Z' fill='%2322C55E' fill-opacity='0.12'/%3E%3Cpath d='M40 15C40 15 35 20 35 25S37.5 32.5 40 32.5S45 30 45 25S40 15 40 15Z M25 40C25 40 20 35 15 35S7.5 37.5 7.5 40S10 45 15 45S25 40 25 40Z M40 47.5C40 47.5 45 52.5 45 57.5S42.5 67.5 40 67.5S35 65 35 57.5S40 47.5 40 47.5Z M47.5 40C47.5 40 52.5 45 57.5 45S67.5 42.5 67.5 40S65 35 57.5 35S47.5 40 47.5 40Z' fill='%2322C55E' fill-opacity='0.08'/%3E%3C/svg%3E\")",
    borderStyle: '10px',
  },
];

export const getThemeById = (id: string): Theme => {
  return themes.find((t) => t.id === id) || themes[0];
};

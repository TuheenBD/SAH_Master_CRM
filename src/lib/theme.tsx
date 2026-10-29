'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 
  | 'arielmc-erp'
  | 'executive-dark'
  | 'ink-wash'
  | 'fresh-peach'
  | 'stormy-morning'
  | 'california-beaches'
  | 'mossy-hollow';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  palette: string[];
  description: string;
  isPreferred?: boolean;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'arielmc-erp',
    name: 'ArielMC ERP (Signature)',
    palette: ['#1F3A2E', '#C8A96A', '#2C5240', '#0A1A2F'],
    description: 'Official ArielMC ERP: Forest Pine Green (#1F3A2E) & Imperial Gold (#C8A96A)',
    isPreferred: true,
  },
  {
    id: 'ink-wash',
    name: 'Ink Wash',
    palette: ['#4A4A4A', '#CBCBCB', '#FFFFE3', '#6D8196'],
    description: 'Minimalist Japanese sumi-e slate, ivory & fog blue',
  },
  {
    id: 'fresh-peach',
    name: 'Fresh Peach',
    palette: ['#FFD3AC', '#FFB5AB', '#E39A7B', '#DBB06B'],
    description: 'Warm terracotta, soft peach blush & antique gold',
  },
  {
    id: 'stormy-morning',
    name: 'Stormy Morning',
    palette: ['#384959', '#6A89A7', '#88BDF2', '#BDDDFC'],
    description: 'Atmospheric steel blue, azure mist & deep oceanic storm',
  },
  {
    id: 'california-beaches',
    name: 'California Beaches',
    palette: ['#FFC067', '#66F4FF', '#66C4FF', '#7D99AA'],
    description: 'Sun-drenched golden sand, turquoise surf & pacific blue',
  },
  {
    id: 'mossy-hollow',
    name: 'Mossy Hollow',
    palette: ['#3D4127', '#636B2F', '#BAC095', '#D4DE95'],
    description: 'Deep forest foliage, organic olive & pale chartreuse sage',
  },
  {
    id: 'executive-dark',
    name: 'Executive Obsidian',
    palette: ['#0f172a', '#1e293b', '#6366f1', '#10b981'],
    description: 'Ultra-dark slate with indigo and emerald accents',
  },
];

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'arielmc-erp',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('arielmc-erp');

  useEffect(() => {
    const saved = localStorage.getItem('master_crm_theme') as ThemeId;
    if (saved && THEMES.some(t => t.id === saved)) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      // Default to ArielMC ERP signature theme
      setCurrentTheme('arielmc-erp');
      document.documentElement.setAttribute('data-theme', 'arielmc-erp');
    }
  }, []);

  const setTheme = (id: ThemeId) => {
    setCurrentTheme(id);
    localStorage.setItem('master_crm_theme', id);
    document.documentElement.setAttribute('data-theme', id);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

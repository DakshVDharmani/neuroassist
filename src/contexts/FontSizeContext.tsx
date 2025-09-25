import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'sm' | 'md' | 'lg' | 'xl';

interface FontSizeContextType {
  fontSize: FontSize;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};

const FONT_SIZES: Record<FontSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const FONT_SIZE_ORDER: FontSize[] = ['sm', 'md', 'lg', 'xl'];

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const savedSize = localStorage.getItem('fontSize');
    return (savedSize as FontSize) || 'md';
  });

  useEffect(() => {
    const body = document.body;
    // Remove all font size classes
    Object.values(FONT_SIZES).forEach(cls => body.classList.remove(cls));
    // Add current font size class
    body.classList.add(FONT_SIZES[fontSize]);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const increaseFontSize = () => {
    const currentIndex = FONT_SIZE_ORDER.indexOf(fontSize);
    if (currentIndex < FONT_SIZE_ORDER.length - 1) {
      setFontSize(FONT_SIZE_ORDER[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = FONT_SIZE_ORDER.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(FONT_SIZE_ORDER[currentIndex - 1]);
    }
  };

  const resetFontSize = () => {
    setFontSize('md');
  };

  const value = {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    canIncrease: fontSize !== 'xl',
    canDecrease: fontSize !== 'sm',
  };

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
};

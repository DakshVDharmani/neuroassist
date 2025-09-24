import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};

const FONT_SIZES = {
  sm: 'font-size-sm',
  md: 'font-size-md',
  lg: 'font-size-lg',
  xl: 'font-size-xl',
};

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem('fontSize');
    return savedSize || 'md';
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
    const sizes = Object.keys(FONT_SIZES);
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = Object.keys(FONT_SIZES);
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const resetFontSize = () => {
    setFontSize('md');
  };

  const value = {
    fontSize,
    setFontSize,
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

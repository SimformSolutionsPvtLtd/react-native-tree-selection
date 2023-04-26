import { Dimensions } from 'react-native';

export const { width: windowWidth, height: windowHeight } =
  Dimensions.get('window');
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
const isLessWidth = windowWidth < windowHeight;
const shortDimension = isLessWidth ? windowWidth : windowHeight;
const longDimension = isLessWidth ? windowHeight : windowWidth;

// Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth: number = 375;
const guidelineBaseHeight: number = 812;

// Use for horizontal scaling
export const scale = (size: number): number => {
  return (shortDimension / guidelineBaseWidth) * size;
};

// Use for vertical scaling
export const verticalScale = (size: number): number => {
  return (longDimension / guidelineBaseHeight) * size;
};

// Use for horizontal & vertical scaling (example: Fonts)
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export function moderateVerticalScale(
  size: number,
  factor: number = 0.5
): number {
  return size + (verticalScale(size) - size) * factor;
}

// Used via Metrics.zero
export const Metrics = {
  screenWidth: screenWidth < screenHeight ? screenWidth : screenHeight,
  screenHeight: screenWidth < screenHeight ? screenHeight : screenWidth,
};

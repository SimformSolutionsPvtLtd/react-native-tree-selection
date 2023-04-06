import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const defaultConfig = {
  factor: 1,
  min: 0.8,
  max: 1.2,
};

/**
 * clamped scaling
 */
export const scale = (size: number, config = {}): number => {
  const mergedConfig = { ...defaultConfig, ...config };
  const scaledSize =
    Math.max(
      Math.min(width / guidelineBaseWidth, mergedConfig.max),
      mergedConfig.min
    ) * size;
  return size + (scaledSize - size) * mergedConfig.factor;
};

/**
 * Verticale scale
 */
export const verticalScale = (size: number, config = {}): number => {
  const mergedConfig = { ...defaultConfig, ...config };
  const scaledSize =
    Math.max(
      Math.min(height / guidelineBaseHeight, mergedConfig.max),
      mergedConfig.min
    ) * size;
  return size + (scaledSize - size) * mergedConfig.factor;
};

/**
 * fontscale.
 */
export const fontScale = (size: number): number =>
  Math.max(Math.min(width / guidelineBaseWidth, 1.2), 0.8) * size;

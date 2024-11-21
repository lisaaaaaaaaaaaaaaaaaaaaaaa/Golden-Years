import { Platform } from "react-native";

export const PERFORMANCE_CONFIG = {
  // Image optimization
  imageCache: {
    maxSize: 100,  // Maximum number of images to cache
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
  },

  // List optimization
  listConfig: {
    initialNumToRender: 10,
    maxToRenderPerBatch: 10,
    windowSize: 5,
    updateCellsBatchingPeriod: 50,
  },

  // Memory management
  memoryManagement: {
    shouldComponentUpdate: true,
    useMemo: true,
    useCallback: true,
  },

  // Network optimization
  network: {
    timeout: 30000,
    retryCount: 3,
    cacheControl: "public, max-age=300",
  },

  // Animation optimization
  animation: {
    useNativeDriver: Platform.select({
      ios: true,
      android: true,
      default: false,
    }),
    tension: 40,
    friction: 7,
  }
};

export const optimizeImage = (url: string, width: number, height: number): string => {
  if (!url) return "";
  // Add image optimization parameters based on your CDN
  return `${url}?w=${width}&h=${height}&auto=compress`;
};

export const memoizationConfig = {
  maxSize: 100,
  maxAge: 5 * 60 * 1000, // 5 minutes
};

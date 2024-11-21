export const ACCESSIBILITY_CONFIG = {
  // Minimum touch target size
  minTouchTarget: {
    width: 44,
    height: 44,
  },

  // Font scaling
  fontScale: {
    minimum: 0.85,
    maximum: 1.5,
  },

  // Color contrast
  colors: {
    minimumContrastRatio: 4.5,
    enhancedContrastRatio: 7,
  },

  // Animation settings
  animation: {
    reduceMotion: true,
    duration: {
      short: 200,
      medium: 300,
      long: 400,
    },
  },

  // Timing
  timing: {
    tooltipDelay: 1000,
    notificationDuration: 5000,
  },

  // Screen reader
  screenReader: {
    announceTimeout: 1000,
    priorityLevels: {
      high: "assertive",
      normal: "polite",
    },
  },
};

export const getAccessibleLabel = (element: string, action?: string): string => {
  return action ? `${element}, ${action}` : element;
};

export const getAccessibleHint = (hint: string): string => {
  return hint;
};

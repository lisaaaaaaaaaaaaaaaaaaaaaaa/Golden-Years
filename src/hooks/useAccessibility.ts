import { useState, useEffect } from "react";
import * as Speech from "expo-speech";
import { AccessibilityInfo, Platform } from "react-native";

export const useAccessibility = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isReduceTransparencyEnabled, setIsReduceTransparencyEnabled] = useState(false);

  useEffect(() => {
    setupAccessibilityListeners();
  }, []);

  const setupAccessibilityListeners = async () => {
    // Screen reader status
    AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      handleScreenReaderChanged
    );
    
    // Initial values
    const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    setIsScreenReaderEnabled(screenReaderEnabled);

    if (Platform.OS === "ios") {
      AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        handleReduceMotionChanged
      );
      AccessibilityInfo.addEventListener(
        "reduceTransparencyChanged",
        handleReduceTransparencyChanged
      );

      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      const reduceTransparencyEnabled = await AccessibilityInfo.isReduceTransparencyEnabled();
      
      setIsReduceMotionEnabled(reduceMotionEnabled);
      setIsReduceTransparencyEnabled(reduceTransparencyEnabled);
    }
  };

  const handleScreenReaderChanged = (enabled: boolean) => {
    setIsScreenReaderEnabled(enabled);
  };

  const handleReduceMotionChanged = (enabled: boolean) => {
    setIsReduceMotionEnabled(enabled);
  };

  const handleReduceTransparencyChanged = (enabled: boolean) => {
    setIsReduceTransparencyEnabled(enabled);
  };

  const speak = async (text: string, options = {}) => {
    try {
      await Speech.speak(text, {
        language: "en",
        pitch: 1.0,
        rate: 0.9,
        ...options,
      });
    } catch (error) {
      console.error("Error speaking text:", error);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
  };

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isReduceTransparencyEnabled,
    speak,
    stopSpeaking,
  };
};

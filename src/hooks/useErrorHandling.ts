import { useState, useEffect, useCallback } from "react";
import * as Sentry from "sentry-expo";
import { Platform } from "react-native";
import { analytics } from "../config/firebase";
import { logEvent } from "firebase/analytics";

interface ErrorLog {
  id: string;
  error: Error;
  context?: any;
  timestamp: Date;
  handled: boolean;
}

export const useErrorHandling = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isCrashReportingEnabled, setCrashReportingEnabled] = useState(true);

  useEffect(() => {
    // Initialize Sentry
    Sentry.init({
      dsn: "YOUR_SENTRY_DSN",
      enableInExpoDevelopment: true,
      debug: __DEV__,
    });

    // Set up global error handler
    const errorHandler = (error: Error, isFatal?: boolean) => {
      handleError(error, { isFatal, source: "global" });
    };

    if (Platform.OS !== "web") {
      ErrorUtils.setGlobalHandler(errorHandler);
    }

    return () => {
      // Reset global handler
      if (Platform.OS !== "web") {
        ErrorUtils.setGlobalHandler(() => {});
      }
    };
  }, []);

  const handleError = useCallback((error: Error, context: any = {}) => {
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      error,
      context,
      timestamp: new Date(),
      handled: true,
    };

    // Log to local state
    setErrors(prev => [...prev, errorLog]);

    // Log to Sentry if enabled
    if (isCrashReportingEnabled) {
      Sentry.Native.captureException(error, {
        extra: context,
      });
    }

    // Log to Firebase Analytics
    logEvent(analytics, "app_error", {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });

    return errorLog;
  }, [isCrashReportingEnabled]);

  const clearErrors = () => {
    setErrors([]);
  };

  const toggleCrashReporting = (enabled: boolean) => {
    setCrashReportingEnabled(enabled);
  };

  return {
    errors,
    handleError,
    clearErrors,
    toggleCrashReporting,
    isCrashReportingEnabled,
  };
};

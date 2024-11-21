import { useEffect, useState } from "react";
import { Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";

interface DeepLinkConfig {
  screens: {
    [key: string]: {
      path: string;
      parse?: (params: any) => any;
    };
  };
}

export const useDeepLinking = (config: DeepLinkConfig) => {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Handle deep linking when app is not running
    Linking.getInitialURL().then((url) => {
      if (url) {
        setInitialUrl(url);
        handleDeepLink(url);
      }
    });

    // Handle deep linking when app is running
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = (url: string) => {
    if (!url) return;

    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const params = Object.fromEntries(parsedUrl.searchParams);

    // Find matching screen
    for (const [screenName, screenConfig] of Object.entries(config.screens)) {
      if (path.match(screenConfig.path)) {
        const parsedParams = screenConfig.parse ? screenConfig.parse(params) : params;
        navigation.navigate(screenName, parsedParams);
        break;
      }
    }
  };

  const createDeepLink = (screenName: string, params = {}) => {
    const screen = config.screens[screenName];
    if (!screen) return null;

    const queryString = new URLSearchParams(params).toString();
    return `yourapp://${screen.path}${queryString ? `?${queryString}` : ""}`;
  };

  const openURL = async (url: string, useInAppBrowser = false) => {
    try {
      if (useInAppBrowser) {
        await WebBrowser.openBrowserAsync(url);
      } else {
        await Linking.openURL(url);
      }
      return true;
    } catch (error) {
      console.error("Error opening URL:", error);
      return false;
    }
  };

  return {
    initialUrl,
    handleDeepLink,
    createDeepLink,
    openURL,
  };
};

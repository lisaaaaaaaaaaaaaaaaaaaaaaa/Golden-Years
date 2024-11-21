import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Platform } from "react-native";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationResult {
  coords: Coordinates;
  address?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const getCurrentLocation = async (): Promise<LocationResult | null> => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      const formattedAddress = address
        ? `${address.street}, ${address.city}, ${address.region}`
        : undefined;

      const result = {
        coords: { latitude, longitude },
        address: formattedAddress
      };

      setLocation(result);
      return result;
    } catch (error) {
      setErrorMsg(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchLocations = async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await Location.geocodeAsync(searchTerm);
      return results;
    } catch (error) {
      setErrorMsg(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (coords1: Coordinates, coords2: Coordinates) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (coords2.latitude - coords1.latitude) * Math.PI / 180;
    const dLon = (coords2.longitude - coords1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords1.latitude * Math.PI / 180) * Math.cos(coords2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    location,
    errorMsg,
    loading,
    getCurrentLocation,
    searchLocations,
    calculateDistance
  };
};

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { handleError } from "../utils/errorHandling";

interface UseMediaReturn {
  uploadImage: (uri: string, path: string) => Promise<string>;
  pickImage: () => Promise<string | null>;
  takePhoto: () => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

export const useMedia = (): UseMediaReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (uri: string, path: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, path);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (err) {
      setError(handleError(err));
      throw new Error(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (): Promise<string | null> => {
    try {
      setError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
      return null;
    } catch (err) {
      setError(handleError(err));
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      setError(null);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Camera permission not granted');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
      return null;
    } catch (err) {
      setError(handleError(err));
      return null;
    }
  };

  return {
    uploadImage,
    pickImage,
    takePhoto,
    loading,
    error,
  };
};

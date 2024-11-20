import { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface PhotoCaptureProps {
  onPhotoCapture: (url: string) => void;
  folder: string;
}

export function PhotoCapture({ onPhotoCapture, folder }: PhotoCaptureProps) {
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });

      if (image.webPath) {
        setLoading(true);
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        
        const storageRef = ref(storage, `${folder}/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        
        onPhotoCapture(url);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={takePhoto}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
      {loading ? 'Uploading...' : 'Take Photo'}
    </button>
  );
}
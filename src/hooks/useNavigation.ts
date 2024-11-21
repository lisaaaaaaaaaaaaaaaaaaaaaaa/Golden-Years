import { useNavigation as useRNNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export const useNavigation = () => {
  return useRNNavigation<NativeStackNavigationProp<RootStackParamList>>();
};

export const useTypedRoute = <T extends keyof RootStackParamList>() => {
  return useRoute<RootStackParamList[T]>();
};

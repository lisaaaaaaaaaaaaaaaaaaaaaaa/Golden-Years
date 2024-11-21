import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { Pet } from '../../types';
import { PetCard } from './PetCard';

interface PetListProps {
  pets: Pet[];
  onPetSelect?: (pet: Pet) => void;
}

export const PetList: React.FC<PetListProps> = ({ pets, onPetSelect }) => {
  const renderPet = ({ item }: { item: Pet }) => (
    <PetCard
      pet={item}
      onPress={() => onPetSelect?.(item)}
    />
  );

  return (
    <View className="flex-1">
      <FlatList
        data={pets}
        renderItem={renderPet}
        keyExtractor={item => item.id}
        contentContainerClassName="px-4 py-2"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">No pets found</Text>
          </View>
        }
      />
    </View>
  );
};

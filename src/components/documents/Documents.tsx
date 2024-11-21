import { FC } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Document } from '../../types/document';
import { Ionicons } from '@expo/vector-icons';

interface DocumentsProps {
  documents: Document[];
  onDocumentPress: (document: Document) => void;
}

const getIconName = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'document-text';
    case 'image':
      return 'image';
    case 'spreadsheet':
      return 'grid';
    default:
      return 'document';
  }
};

export const Documents: FC<DocumentsProps> = ({ documents, onDocumentPress }) => {
  const renderDocument = ({ item }: { item: Document }) => (
    <TouchableOpacity
      onPress={() => onDocumentPress(item)}
      className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm"
    >
      <Ionicons 
        name={getIconName(item.type)} 
        size={24} 
        color="#4B5563" 
      />
      <View className="ml-3 flex-1">
        <Text className="text-gray-900 font-medium">{item.metadata.name || 'Untitled'}</Text>
        <Text className="text-gray-500 text-sm">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={item => item.id}
        contentContainerClassName="px-4 py-2"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">No documents found</Text>
          </View>
        }
      />
    </View>
  );
};

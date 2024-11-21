import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CareTeam = () => {
  const careTeamMembers = [
    {
      id: "1",
      name: "Dr. Smith",
      role: "Veterinarian",
      facility: "Happy Pets Clinic",
      phone: "(555) 123-4567",
      imageUrl: "https://example.com/dr-smith.jpg"
    },
    {
      id: "2",
      name: "Jane Doe",
      role: "Pet Sitter",
      phone: "(555) 987-6543",
      imageUrl: "https://example.com/jane.jpg"
    }
  ];

  const renderMember = ({ item }) => (
    <TouchableOpacity style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberRole}>{item.role}</Text>
          {item.facility && (
            <Text style={styles.memberFacility}>{item.facility}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="call-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.memberActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={careTeamMembers}
        renderItem={renderMember}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
  },
  memberCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  memberFacility: {
    fontSize: 14,
    color: "#666",
  },
  contactButton: {
    padding: 8,
  },
  memberActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: "#007AFF",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CareTeam;

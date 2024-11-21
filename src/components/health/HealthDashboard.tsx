import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HealthDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.medicationName}>Heartgard Plus</Text>
          <Text style={styles.medicationTime}>Next dose: Tomorrow</Text>
          <View style={styles.reminderBadge}>
            <Text style={styles.reminderText}>Set Reminder</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vaccinations</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.vaccineName}>Rabies</Text>
          <Text style={styles.vaccineDate}>Last updated: 01/01/2024</Text>
          <Text style={styles.vaccineStatus}>Due in 6 months</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vitals</Text>
        </View>
        
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>Weight</Text>
            <Text style={styles.vitalValue}>25 lbs</Text>
          </View>
          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>Temperature</Text>
            <Text style={styles.vitalValue}>101.5°F</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  medicationTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  reminderBadge: {
    backgroundColor: "#007AFF20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  reminderText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "500",
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  vaccineDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  vaccineStatus: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  vitalsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vitalCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vitalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 20,
    fontWeight: "600",
  },
});

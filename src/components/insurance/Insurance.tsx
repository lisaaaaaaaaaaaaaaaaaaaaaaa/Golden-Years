import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const Insurance = () => {
  const insuranceInfo = {
    provider: "PetInsure Plus",
    policyNumber: "PI123456789",
    coverage: "Comprehensive",
    // Your existing insurance data here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Policy</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Provider:</Text>
          <Text style={styles.value}>{insuranceInfo.provider}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Policy Number:</Text>
          <Text style={styles.value}>{insuranceInfo.policyNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Coverage Type:</Text>
          <Text style={styles.value}>{insuranceInfo.coverage}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Policy Details</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>File a Claim</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Insurance;

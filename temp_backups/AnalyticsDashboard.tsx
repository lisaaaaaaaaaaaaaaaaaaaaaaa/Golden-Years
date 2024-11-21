import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AnalyticsDashboard = () => {
  // Mock data for analytics
  const healthMetrics = {
    weight: [20, 21, 22, 21.5, 22, 22.5],
    activity: [45, 50, 30, 60, 40, 55],
    medications: 95,
    vaccinations: 100,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pet Health Analytics</Text>
        <Text style={styles.headerSubtitle}>Last 6 months</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { backgroundColor: "#E8F5E9" }]}>
          <Ionicons name="fitness" size={24} color="#2E7D32" />
          <Text style={styles.metricValue}>{healthMetrics.medications}%</Text>
          <Text style={styles.metricLabel}>Medication Adherence</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: "#E3F2FD" }]}>
          <Ionicons name="medical" size={24} color="#1565C0" />
          <Text style={styles.metricValue}>{healthMetrics.vaccinations}%</Text>
          <Text style={styles.metricLabel}>Vaccination Status</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight Tracking</Text>
        <View style={styles.chart}>
          {/* Placeholder for weight chart */}
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Weight Chart</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Level</Text>
        <View style={styles.chart}>
          {/* Placeholder for activity chart */}
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Activity Chart</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Insights</Text>
        <View style={styles.insightCard}>
          <Ionicons name="trending-up" size={24} color="#4CAF50" />
          <Text style={styles.insightText}>
            Activity level has improved by 15% this month
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
          <Text style={styles.insightText}>
            All vaccinations are up to date
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  metricsGrid: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
  },
  metricCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  chart: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
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
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
});

export default AnalyticsDashboard;

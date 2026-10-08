import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { Customer, fetchCustomer } from "@/data/customer";
import { problemFor } from "@/data/problem";

export default function CustomerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "content">(
    "loading",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomer(id)
      .then((data) => {
        setCustomer(data);
        setStatus("content");
      })
      .catch((err) => {
        setError(problemFor(err));
        setStatus("error");
      });
  }, [id]);

  if (status === "loading") {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <Text style={styles.stateText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <Text style={styles.stateTitle}>Something went wrong</Text>
        <Text style={styles.stateText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: customer!.name }} />

      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer!.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={styles.name}>{customer!.name}</Text>
            <Text style={styles.subtitle}>Customer details</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>

            <Text style={styles.balance}>₱ {customer!.balance.toFixed(2)}</Text>

            <Text style={styles.balanceStatus}>
              {customer!.balance > 0 ? "Amount still owed" : "Account settled"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Payment Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last paid</Text>
              <Text style={styles.infoValue}>{customer!.lastPaid}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Customer ID</Text>
              <Text style={styles.infoValue}>{customer!.id}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    marginTop: 14,
  },

  balanceLabel: {
    color: "#111",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  balance: {
    color: "#111",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },

  balanceStatus: {
    color: "#111",
    fontSize: 13,
    marginTop: 6,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 18,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 13,
    color: "#111",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },

  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },

  stateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },

  stateText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddCustomerModal } from "@/components/add-customer-modal";
import { CustomerRow } from "@/components/customer-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useCustomers } from "@/hooks/use-customers";
import { useProfile } from "@/hooks/use-profile";

export default function CustomersScreen() {
  const router = useRouter();
  const { status, customers, problem, retry } = useCustomers();
  const profile = useProfile();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  if (status === "loading")
    return (
      <ThemedView style={[styles.middle, styles.lightState]}>
        <ActivityIndicator />
        <ThemedText style={styles.stateText}>Loading customers</ThemedText>
      </ThemedView>
    );

  if (status === "error")
    return (
      <ThemedView style={[styles.middle, styles.lightState]}>
        <ThemedText style={styles.stateText}>{problem}</ThemedText>
        <Pressable style={styles.actionButton} onPress={retry}>
          <ThemedText style={styles.actionLabel}>Try again</ThemedText>
        </Pressable>
      </ThemedView>
    );

  const shown = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const total = customers.reduce((sum, c) => sum + c.balance, 0);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle" style={styles.title}>
            Customers
          </ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            Keep track of your shop ledger
          </ThemedText>
        </View>
        {profile?.role === "admin" && (
          <Pressable style={styles.addButton} onPress={() => setAdding(true)}>
            <ThemedText style={styles.addLabel}>+ Add</ThemedText>
          </Pressable>
        )}
      </View>
      <View style={styles.summary}>
        <ThemedText themeColor="textSecondary" type="small">
          Total owed
        </ThemedText>
        <ThemedText type="subtitle" style={styles.total}>
          ₱ {total.toFixed(2)}
        </ThemedText>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search customers"
        placeholderTextColor="#8A877F"
        style={[styles.search, { color: "#242424" }]}
      />
      <FlatList
        contentContainerStyle={styles.list}
        data={shown}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CustomerRow
            id={item.id}
            name={item.name}
            balance={item.balance}
            lastPaid={item.lastPaid}
            onPress={() => router.push(`/customers/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText style={styles.stateText}>
              {status === "empty"
                ? "No customers yet."
                : `No customers match "${query}".`}
            </ThemedText>
            {status === "empty" && profile?.role === "admin" && (
              <ThemedText themeColor="textSecondary" style={styles.emptyHint}>
                Add your first customer to start tracking the ledger.
              </ThemedText>
            )}
          </View>
        }
      />
      <AddCustomerModal
        visible={adding}
        onClose={() => setAdding(false)}
        onAdded={retry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  lightState: { backgroundColor: "#F8F7F3" },
  stateText: { color: "#242424" },
  emptyState: { paddingTop: Spacing.three },
  emptyHint: { color: "#6B685F", marginTop: Spacing.one },
  screen: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    backgroundColor: "#F8F7F3",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  title: { color: "#242424", fontSize: 30, lineHeight: 36 },
  addButton: {
    backgroundColor: "#2F6FED",
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  addLabel: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  summary: {
    backgroundColor: "#FFFFFF",
    borderLeftColor: "#2F6FED",
    borderLeftWidth: 3,
    borderRadius: 12,
    marginBottom: Spacing.three,
    padding: Spacing.three,
  },
  total: { color: "#242424", fontSize: 26, lineHeight: 32, marginTop: 2 },
  search: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DEDCD5",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  list: { paddingBottom: Spacing.five },
  actionButton: {
    backgroundColor: "#2F6FED",
    borderRadius: 10,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  actionLabel: { color: "#FFFFFF", fontWeight: "700" },
});

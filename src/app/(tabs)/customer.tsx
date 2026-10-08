import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomerRow } from "@/components/customer-row";
import { addCustomer } from "@/data/customer";
import { router } from "expo-router";
import { useCustomers } from "@/hooks/use-customers";

export default function CustomersScreen() {
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);

  const { customers, status, problem, retry } = useCustomers();

  const shown = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const total = customers.reduce((sum, c) => sum + c.balance, 0);

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  if (status === "error") {
    return (
      <SafeAreaView>
        <Text>{problem}</Text>

        <Text onPress={retry}>Try again</Text>
      </SafeAreaView>
    );
  }

  if (status === "empty") {
    return (
      <SafeAreaView>
        <Text>No customers available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Customers</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search customers"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.search}
      />

      <Pressable
        style={styles.walkInButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.walkInText}>ADD CUSTOMER</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Customer</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Customer name"
            style={styles.modalInput}
          />

          <TextInput
            value={balance}
            onChangeText={setBalance}
            placeholder="Balance"
            keyboardType="numeric"
            style={styles.modalInput}
          />

          <Pressable
            style={styles.saveButton}
            onPress={async () => {
              if (!name.trim() || !balance.trim()) {
                return;
              }

              const amount = Number(balance);

              if (Number.isNaN(amount)) {
                return;
              }

              try {
                setSaving(true);

                await addCustomer(name.trim(), amount);

                setName("");
                setBalance("");
                setModalVisible(false);

                retry();
              } catch (err) {
                console.log("ADD CUSTOMER ERROR:", err);
              } finally {
                setSaving(false);
              }
            }}
          >
            <Text style={styles.saveText}>{saving ? "SAVING..." : "SAVE"}</Text>
          </Pressable>

          <Pressable onPress={() => setModalVisible(false)}>
            <Text>Cancel</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <FlatList
        data={shown}
        style={styles.list}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CustomerRow
            id={item.id}
            name={item.name}
            lastPaid={item.lastPaid}
            balance={item.balance}
            onPress={() => {
              console.log("NAVIGATING:", item.id);
              router.push(`/customers/${item.id}`);
            }}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No customers match "{query}"</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 5,
    height: 42,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 13,
  },
  total: {
    color: "#666",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  walkInButton: {
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196f3",
    marginBottom: 8,
  },
  walkInText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  list: {
    marginTop: 2,
  },
  empty: {
    marginTop: 4,
    color: "#333",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#777",
    height: 42,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  saveButton: {
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196f3",
    marginBottom: 12,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});

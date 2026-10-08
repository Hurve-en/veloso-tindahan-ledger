import { useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { addCustomer } from "@/data/customer";
import { ThemedText } from "@/components/themed-text";

type AddCustomerModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export function AddCustomerModal({
  visible,
  onClose,
  onAdded,
}: AddCustomerModalProps) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    const amount = Number(balance);
    if (!name.trim() || !Number.isFinite(amount)) return;

    setSaving(true);
    try {
      // Refresh the customer list only after the API confirms the new record.
      await addCustomer(name.trim(), amount);
      setName("");
      setBalance("");
      onClose();
      onAdded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <ThemedText type="subtitle" style={styles.title}>
            Add customer
          </ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Customer name"
            placeholderTextColor="#8A877F"
            style={styles.input}
          />
          <TextInput
            value={balance}
            onChangeText={setBalance}
            placeholder="Starting balance"
            placeholderTextColor="#8A877F"
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <Pressable
            style={styles.saveButton}
            onPress={save}
            disabled={saving}
          >
            <ThemedText style={styles.saveLabel}>
              {saving ? "Saving..." : "Save customer"}
            </ThemedText>
          </Pressable>
          <Pressable onPress={onClose} disabled={saving} style={styles.cancel}>
            <ThemedText style={styles.cancelLabel}>Cancel</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(28, 28, 26, 0.32)",
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#F8F7F3",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    gap: 12,
    padding: 24,
  },
  title: { color: "#242424", fontSize: 24, lineHeight: 30, marginBottom: 4 },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DEDCD5",
    borderRadius: 10,
    borderWidth: 1,
    color: "#242424",
    padding: 14,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#2F6FED",
    borderRadius: 10,
    marginTop: 4,
    paddingVertical: 13,
  },
  saveLabel: { color: "#FFFFFF", fontWeight: "700" },
  cancel: { alignItems: "center", paddingVertical: 6 },
  cancelLabel: { color: "#6B685F" },
});

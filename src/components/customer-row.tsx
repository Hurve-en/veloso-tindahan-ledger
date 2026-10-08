import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export interface CustomerRowProps {
  id: string;
  name: string;
  balance: number;
  lastPaid: string;
  defaultExpanded?: boolean;
  onPress: () => void;
}

export function CustomerRow({
  name,
  balance,
  onPress,
}: CustomerRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={styles.secondary} type="small">
          View customer ledger
        </ThemedText>
      </View>
      <ThemedText style={styles.balance}>
        ₱ {balance.toFixed(2)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E5DD",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 16,
  },
  pressed: { opacity: 0.72 },
  name: { color: "#242424", fontSize: 17, fontWeight: "700" },
  secondary: { color: "#6B685F" },
  balance: { color: "#242424", fontSize: 16, fontWeight: "700", marginLeft: 12 },
});

import { StorePhoto } from "@/components/store-photo";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabase";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const profile = useProfile();
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ThemedText type="subtitle" style={styles.title}>
        Account
      </ThemedText>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {profile?.email?.charAt(0).toUpperCase() ?? "?"}
          </ThemedText>
        </View>
        <View style={styles.profileCopy}>
          <ThemedText style={styles.email}>{profile?.email}</ThemedText>
          <ThemedText style={styles.role} type="small">
            {profile?.role === "admin" ? "Store administrator" : "Store staff"}
          </ThemedText>
        </View>
      </View>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Store tools</ThemedText>
        {profile?.role === "admin" && <StorePhoto />}
      </View>
      <Pressable
        style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
        onPress={() => supabase.auth.signOut()}
      >
        <ThemedText style={styles.signOutLabel}>Sign out</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F8F7F3",
    flex: 1,
    padding: Spacing.four,
  },
  title: { color: "#242424", fontSize: 30, lineHeight: 36, marginBottom: Spacing.four },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E5DD",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    padding: Spacing.three,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#E9F0FF",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  avatarText: { color: "#2F6FED", fontSize: 20, fontWeight: "700" },
  profileCopy: { marginLeft: Spacing.three },
  email: { color: "#242424", fontSize: 17, fontWeight: "700" },
  role: { color: "#6B685F" },
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E5DD",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: Spacing.three,
    padding: Spacing.three,
  },
  sectionTitle: { color: "#242424", fontSize: 16, fontWeight: "700", marginBottom: Spacing.two },
  signOut: {
    alignItems: "center",
    borderColor: "#D6D3CB",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: "auto",
    paddingVertical: 13,
  },
  signOutLabel: { color: "#242424", fontWeight: "700" },
  pressed: { opacity: 0.65 },
});

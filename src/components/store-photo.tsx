import { ThemedText } from "@/components/themed-text";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Linking, Pressable, StyleSheet } from "react-native";

export function StorePhoto() {
  const [photo, setPhoto] = useState("");
  const [denied, setDenied] = useState(false);

  async function take() {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    setDenied(!granted);
    if (!granted) return;
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  return (
    <>
      <Pressable style={styles.action} onPress={take}>
        <ThemedText style={styles.actionLabel}>Take a store photo</ThemedText>
      </Pressable>
      {photo !== "" && (
        <Image source={{ uri: photo }} style={styles.photo} />
      )}
      {denied && <ThemedText style={styles.denied}>Camera is off for this app.</ThemedText>}
      {denied && (
        <Pressable onPress={() => Linking.openSettings()}>
          <ThemedText style={styles.settings}>
            Open settings
          </ThemedText>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    backgroundColor: "#E9F0FF",
    borderRadius: 10,
    paddingVertical: 12,
  },
  actionLabel: { color: "#2F6FED", fontWeight: "700" },
  denied: { color: "#242424", marginTop: 10 },
  photo: { borderRadius: 10, height: 220, marginTop: 12, width: "100%" },
  settings: { marginTop: 8, textDecorationLine: "underline" },
});

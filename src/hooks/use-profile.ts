import { fetchProfile, Profile } from "@/data/customer";
import { useEffect, useState } from "react";
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    let live = true;
    fetchProfile()
      .then((row: Profile) => live && setProfile(row))
      .catch((error: unknown) => {
        console.error("PROFILE ERROR:", error);
      });
    return () => {
      live = false;
    };
  }, []);
  return profile;
}

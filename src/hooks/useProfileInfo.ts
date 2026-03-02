import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

export function useProfileInfo() {
  const { user } = useUser();
  const [profileInfo, setProfileInfo] = useState<{ displayName: string | null; profileComplete: boolean }>({ displayName: null, profileComplete: true });

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const res = await fetch("/api/members/me");
        if (res.ok) {
          const data = await res.json();
          const primary = (data.profiles ?? []).find(
            (p: { _id: string; displayFirstName?: string; displayLastName?: string; profileComplete?: boolean }) =>
              String(p._id) === data.primaryProfileId
          ) ?? data.profiles?.[0] ?? null;
          let displayName = null;
          if (primary?.displayFirstName || primary?.displayLastName) {
            displayName = `${primary.displayFirstName ?? ''} ${primary.displayLastName ?? ''}`.trim();
          }
          setProfileInfo({
            displayName,
            profileComplete: primary?.profileComplete ?? true,
          });
        }
      } catch {
        setProfileInfo({ displayName: null, profileComplete: true });
      }
    };
    if (user) {
      fetchProfileInfo();
    } else {
      setProfileInfo({ displayName: null, profileComplete: true });
    }
  }, [user]);
  return profileInfo;
}

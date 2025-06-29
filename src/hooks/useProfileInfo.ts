import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

export function useProfileInfo() {
  const { user } = useUser();
  const [profileInfo, setProfileInfo] = useState<{ displayName: string | null; profileComplete: boolean }>({ displayName: null, profileComplete: true });

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const res = await fetch("/api/member/me");
        if (res.ok) {
          const data = await res.json();
          let displayName = null;
          if (data.displayFirstName || data.displayLastName) {
            displayName = `${data.displayFirstName ?? ''} ${data.displayLastName ?? ''}`.trim();
          }
          setProfileInfo({
            displayName: displayName,
            profileComplete: data.profileComplete ?? true,
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

import { useEffect, useState } from "react";
import type { IntroEnrollment } from "@/app/api/members/me/intro-enrollment/route";

type Result = {
  enrollment: IntroEnrollment | null;
  loading: boolean;
};

export function useIntroEnrollment(profileId: string | undefined): Result {
  const [enrollment, setEnrollment] = useState<IntroEnrollment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    fetch("/api/members/me/intro-enrollment")
      .then((r) => r.json())
      .then((data) => setEnrollment(data.enrollment ?? null))
      .catch(() => setEnrollment(null))
      .finally(() => setLoading(false));
  }, [profileId]);

  return { enrollment, loading };
}

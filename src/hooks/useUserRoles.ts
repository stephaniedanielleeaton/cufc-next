import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

export function useUserRoles() {
  const { user } = useUser();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await fetch("/api/auth/roles");
      const data = await res.json();
      if (Array.isArray(data.roles)) {
        setRoles(data.roles);
      }
    };

    if (user) {
      fetchRoles();
    }
  }, [user]);

  return roles;
}

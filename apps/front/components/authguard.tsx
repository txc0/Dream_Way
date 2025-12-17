"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userString);
    setUser(parsedUser);

    if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
      router.push("/login"); // or a "Not authorized" page
      return;
    }

    setLoading(false);
  }, [router, allowedRoles]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}

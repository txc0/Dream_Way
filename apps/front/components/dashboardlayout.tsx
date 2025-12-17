"use client";

import { ReactNode } from "react";
import AuthGuard from "./authguard";

type DashboardLayoutProps = {
  children: ReactNode;
  allowedRoles: string[];
};

export default function DashboardLayout({
  children,
  allowedRoles,
}: DashboardLayoutProps) {
  return <AuthGuard allowedRoles={allowedRoles}>{children}</AuthGuard>;
}

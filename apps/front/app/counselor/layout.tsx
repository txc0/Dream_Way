import DashboardLayout from "@/components/dashboardlayout";

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={["counselor"]}>{children}</DashboardLayout>
  );
}

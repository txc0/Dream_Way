import DashboardLayout from "@/components/dashboardlayout";

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={["seeker"]}>{children}</DashboardLayout>
  );
}

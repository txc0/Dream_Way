"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ✅ Reusable card component
function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{value}</CardContent>
    </Card>
  );
}

// ✅ Axios instance (no need to repeat headers everywhere)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000",
});

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalNotices, setTotalNotices] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/login");
      return;
    }

    setFirstName(JSON.parse(user).firstName);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const [usersRes, noticesRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/notices"),
        ]);

        setTotalUsers(usersRes.data.length);
        setTotalNotices(noticesRes.data.length);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <h1 className="text-2xl font-bold">Hello, {firstName}</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SummaryCard title="Total Users" value={totalUsers ?? "—"} />
        <SummaryCard title="Total Notices" value={totalNotices ?? "—"} />
      </div>

      {/* Management Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="w-full sm:w-auto" onClick={() => router.push("/admin/users")}>
          Manage Users
        </Button>
        <Button className="w-full sm:w-auto" onClick={() => router.push("/admin/notices")}>
          Manage Notices
        </Button>
      </div>
    </div>
  );
}

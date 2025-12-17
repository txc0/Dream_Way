"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Table, Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data); // backend should exclude admins
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.delete(`http://localhost:4000/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const columns: Column<User>[] = [
    { header: "Name", accessor: "firstName", render: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/users/edit/${row.id}`)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => deleteUser(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <Table columns={columns} data={users} />
    </div>
  );
}

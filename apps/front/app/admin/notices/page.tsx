"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Notice = {
  id: string;
  title: string;
  content: string;
};

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.get("http://localhost:4000/admin/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:4000/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete notice");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const columns: Column<Notice>[] = [
    { header: "Title", accessor: "title" },
    {
      header: "Content",
      accessor: "content",
      render: (row) =>
        row.content.length > 50 ? row.content.slice(0, 50) + "..." : row.content,
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/notices/edit/${row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteNotice(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <p className="p-8 text-gray-500">Loading notices...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notices</h1>
        <Button onClick={() => router.push("/admin/notices/create")}>
          + Create Notice
        </Button>
      </div>

      {notices.length ? (
        <Table columns={columns} data={notices} />
      ) : (
        <p className="text-gray-500">No notices found.</p>
      )}
    </div>
  );
}

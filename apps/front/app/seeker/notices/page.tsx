// apps/front/app/seeker/notices/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API ?? "http://localhost:4000";

type Notice = {
  id: string;
  title: string;
  message?: string;
  isActive: boolean;
  createdAt?: string;
};

export default function Page() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Notice[]>(`${API}/seeker/notices`, {
          headers: auth(),
        });
        setNotices(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        alert("Failed to load notices.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8">Loading notices...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notices</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/seeker/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {notices.length === 0 ? (
        <div className="text-sm text-gray-600">No active notices.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((n) => (
            <Card key={n.id} className="hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{n.title}</span>
                  {n.createdAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">
                  {n.message || "(No message provided)"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

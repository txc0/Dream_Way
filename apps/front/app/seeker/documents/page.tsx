"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Doc = { id: string; fileName: string; updatedAt: string };

const API = "http://localhost:4000"; 

export default function SeekerDocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = () => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Doc[]>(`${API}/documents/me`, { headers: auth() });
        setDocs(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        console.error(e);
        alert(e?.response?.data?.message || "Failed to load documents.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8">Loading documents…</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/seeker/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Uploaded Files</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {docs.length === 0 ? (
            <div className="text-sm text-gray-600">You haven’t uploaded any documents yet.</div>
          ) : (
            <ul className="divide-y">
              {docs.map((d) => (
                <li key={d.id} className="py-2 flex items-center justify-between">
                  <span className="truncate">{d.fileName}</span>
                  <span className="text-xs text-gray-500">{new Date(d.updatedAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

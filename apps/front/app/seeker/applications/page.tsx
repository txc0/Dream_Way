"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AppStatus =
  | "RESEARCHING" | "SUBMITTED" | "UNDER_REVIEW" | "OFFER"
  | "REJECTED" | "WITHDRAWN" | "VISA" | "ENROLLED";

interface Program { id: string; title: string; university: string; country: string; tuition: number; }
interface Application { id: string; status: AppStatus; note?: string | null; program: Program; createdAt: string; updatedAt: string; }

const API = "http://localhost:4000";
const STATUSES: AppStatus[] = ["RESEARCHING","SUBMITTED","UNDER_REVIEW","OFFER","REJECTED","WITHDRAWN","VISA","ENROLLED"];

export default function ApplicationsListPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<AppStatus | "">("");

  const auth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const load = async () => {
    try {
      const url = `${API}/seeker/applications${filter ? `?status=${filter}` : ""}`;
      const res = await axios.get<Application[]>(url, auth());
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); alert("Could not load applications."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
  const refetch = async () => { setLoading(true); await load(); };

  const updateStatus = async (id: string, status: AppStatus) => {
    try {
      setSavingId(id);
      await axios.patch(
        `${API}/seeker/applications/${id}/status`,
        { status },
        { ...auth(), headers: { "Content-Type": "application/json", ...(auth().headers as any) } }
      );
      const row = await axios.get<Application>(`${API}/seeker/applications/${id}`, auth());
      setApps((prev) => prev.map((a) => (a.id === id ? row.data : a)));
    } catch (e: any) { console.error(e); alert(e?.response?.data?.message || "Failed to update."); }
    finally { setSavingId(null); }
  };

  const remove = async (id: string) => {
    if (!confirm("Withdraw and delete this application?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${API}/seeker/applications/${id}`, auth());
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) { console.error(e); alert(e?.response?.data?.message || "Failed to delete."); }
    finally { setDeletingId(null); }
  };

  if (loading) return <div className="p-8">Loading applications...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <div className="flex items-center gap-2">
          <select className="border rounded px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="outline" onClick={refetch}>Filter</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/seeker/programs")}>Browse Programs</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {apps.map((a) => (
              <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
                <div className="text-sm">
                  <div className="font-medium">{a.program.title}</div>
                  <div className="text-gray-600">{a.program.university} — {a.program.country}</div>
                  <div className="text-xs text-gray-500">
                    Status: {a.status} • Updated: {new Date(a.updatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    className="border rounded-md px-3 py-2 text-sm"
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value as AppStatus)}
                    disabled={savingId === a.id}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <Button size="sm" variant="destructive" onClick={() => remove(a.id)} disabled={deletingId === a.id}>
                    {deletingId === a.id ? "Deleting..." : "Delete"}
                  </Button>

                  <Button size="sm" onClick={() => (window.location.href = `/seeker/applications/${a.id}`)}>
                    Manage
                  </Button>
                </div>
              </div>
            ))}
            {apps.length === 0 && <div className="text-sm text-gray-500">No applications yet.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

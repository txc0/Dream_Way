"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AppStatus =
  | "RESEARCHING" | "SUBMITTED" | "UNDER_REVIEW" | "OFFER"
  | "REJECTED" | "WITHDRAWN" | "VISA" | "ENROLLED";

interface Program {
  id: string;
  title: string;
  university: string;
  country: string;
  tuition: number;
}
interface Application {
  id: string;
  status: AppStatus;
  program: Program;
  createdAt: string;
  updatedAt: string;
}
// 🔽 put this right under the imports
const getSeekerId = (): string | null => {
  // A) try from localStorage "user"
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return String(u.id);
    }
  } catch {}

  // B) fallback: decode JWT payload (in case you didn’t store user.id)
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return payload?.id || payload?.sub || payload?.userId || null;
  } catch {
    return null;
  }
};


type Doc = { id: string; fileName: string; updatedAt: string };

const API ="http://localhost:4000";
const STATUSES: AppStatus[] = [
  "RESEARCHING","SUBMITTED","UNDER_REVIEW","OFFER",
  "REJECTED","WITHDRAWN","VISA","ENROLLED"
];

export default function ApplicationDetailPage() {
  const { id } = useParams() as { id: string };

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // documents
  const [showDocs, setShowDocs] = useState(false);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const auth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // const displayAppNo = (raw: string) =>
  //   raw?.includes("-") ? raw.split("-")[0].toUpperCase() : raw?.slice(0, 8)?.toUpperCase();

  const load = async () => {
    try {
      const res = await axios.get<Application>(`${API}/seeker/applications/${id}`, { headers: auth() });
      setApp(res.data);
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to load application.");
    } finally {
      setLoading(false);
    }
  };

  const loadDocs = async () => {
    setLoadingDocs(true);
    try {
      const { data } = await axios.get<Doc[]>(`${API}/documents/me`, { headers: auth() });
      setDocs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to load documents.");
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async (status: AppStatus) => {
    try {
      setSaving(true);
      await axios.patch(
        `${API}/seeker/applications/${id}/status`,
        { status },
        { headers: { "Content-Type": "application/json", ...auth() } }
      );
      await load();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Withdraw and delete this application?")) return;
    try {
      setDeleting(true);
      await axios.delete(`${API}/seeker/applications/${id}`, { headers: auth() });
      window.location.href = "/seeker/applications";
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

const uploadDoc = async () => {
  if (!file) return alert("Choose a file first.");

  const seekerId = getSeekerId();
  if (!seekerId) {
    alert("Missing seekerId. Make sure you store user.id in localStorage or the JWT contains id/sub.");
    return;
  }

  try {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);          // MUST be 'file' (matches FileInterceptor('file', ...))
    fd.append("seekerId", seekerId);  // <-- your backend expects this field

    await axios.post(`${API}/documents/upload`, fd, {
      headers: { ...auth() },         // do NOT set Content-Type manually
    });

    setFile(null);
    await loadDocs();
    alert("Uploaded!");
  } catch (e: any) {
    console.error(e);
    alert(e?.response?.data?.message || "Upload failed.");
  } finally {
    setUploading(false);
  }
};


  if (loading) return <div className="p-8">Loading application...</div>;
  if (!app) return <div className="p-8">Not found.</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Application </h1>
        <Button variant="outline" onClick={() => (window.location.href = "/seeker/applications")}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>{app.program.title}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>{app.program.university} — {app.program.country}</div>
          <div>Tuition: ${app.program.tuition}</div>

          <div className="flex items-center gap-3">
            <span className="text-sm">Status:</span>
            <select
              className="border rounded-md px-3 py-2"
              value={app.status}
              onChange={(e) => updateStatus(e.target.value as AppStatus)}
              disabled={saving}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={async () => {
                const next = !showDocs;
                setShowDocs(next);
                if (next) await loadDocs();
              }}
            >
              {showDocs ? "Hide Documents" : "Manage Documents"}
            </Button>

            <Button variant="destructive" onClick={remove} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Application"}
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            Updated: {new Date(app.updatedAt).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {showDocs && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Upload related documents</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Choose File
              </Button>
              <span className="text-sm text-gray-700">
                {file ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)` : "No file selected"}
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
            />

            <Button type="button" onClick={uploadDoc} disabled={!file || uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>

            <div className="mt-4 grid gap-2">
              {loadingDocs && <div className="text-sm text-gray-500">Loading documents…</div>}
              {!loadingDocs && docs.length === 0 && (
                <div className="text-sm text-gray-500">No documents yet.</div>
              )}
              {!loadingDocs && docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between border rounded p-2 text-sm">
                  <span className="truncate">{d.fileName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(d.updatedAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

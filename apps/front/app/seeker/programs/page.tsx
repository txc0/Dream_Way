"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DegreeLevel = "BACHELORS" | "MASTERS" | "DIPLOMA" | "PHD";

interface Program {
  id: string;
  title: string;
  university: string;
  country: string;
  degreeLevel: DegreeLevel;
  tuition: number;
  intakeMonths?: string[];
  deadline?: string | null;
}

interface Application { id: string; }

const API = "http://localhost:4000"; // add /api if you use a global prefix

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const auth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const load = async () => {
    try {
      const res = await axios.get<Program[]>(
        `${API}/seeker/programs${q ? `?q=${encodeURIComponent(q)}` : ""}`,
        auth()
      );
      setPrograms(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      alert("Could not load programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load();}, []);

  const applyNow = async (programId: string) => {
    try {
      setApplyingId(programId);
      const res = await axios.post<Application>(
        `${API}/seeker/applications`,
        { programId },
        { ...auth(), headers: { "Content-Type": "application/json", ...(auth().headers as any) } }
      );
      window.location.href = `/seeker/applications/${res.data.id}`;
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to apply.");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <div className="p-8">Loading programs...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Search title or university"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="outline" onClick={() => { setLoading(true); load(); }}>
            Search
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/seeker/applications")}>
            My Applications
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/seeker/dashboard")}>
            Back
          </Button>
          
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="text-sm text-gray-600">No programs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Card key={p.id} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.title}</span>
                  <span className="text-sm font-normal text-gray-500">{p.degreeLevel}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{p.university} — {p.country}</p>
                <p className="text-sm">Tuition: ${p.tuition}</p>
                {p.intakeMonths?.length ? (
                  <p className="text-xs text-gray-600">Intakes: {p.intakeMonths.join(", ")}</p>
                ) : null}
                {p.deadline && <p className="text-xs text-gray-500">Deadline: {new Date(p.deadline).toDateString()}</p>}

                <div className="flex gap-2 mt-3">
                  <Button className="w-full" onClick={() => applyNow(p.id)} disabled={applyingId === p.id}>
                    {applyingId === p.id ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

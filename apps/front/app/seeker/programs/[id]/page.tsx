"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DegreeLevel = "BACHELORS" | "MASTERS" | "DIPLOMA" | "PHD";
interface Program {
  id: string; title: string; university: string; country: string;
  degreeLevel: DegreeLevel; tuition: number; intakeMonths?: string[];
  requirements?: Record<string, any>; deadline?: string | null;
}
interface Application { id: string; }

const API = "http://localhost:4000";

export default function ProgramDetailPage() {
  const { id } = useParams() as { id: string };
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const auth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Program>(`${API}/seeker/programs/${id}`, { headers: auth() });
        setProgram(res.data);
      } catch (e) { console.error(e); alert("Failed to load program."); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const apply = async () => {
    try {
      setApplying(true);
      const res = await axios.post<Application>(
        `${API}/seeker/applications`,
        { programId: id },
        { headers: { "Content-Type": "application/json", ...auth() } }
      );
      window.location.href = `/seeker/applications/${res.data.id}`;
    } catch (e: any) { console.error(e); alert(e?.response?.data?.message || "Failed to apply."); }
    finally { setApplying(false); }
  };

  if (loading) return <div className="p-8">Loading program...</div>;
  if (!program) return <div className="p-8">Program not found.</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{program.title}</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/seeker/programs")}>Back</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{program.university} — {program.country}</span>
            <span className="text-sm text-gray-500">{program.degreeLevel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>Tuition: ${program.tuition}</div>
          {program.intakeMonths?.length ? <div>Intakes: {program.intakeMonths.join(", ")}</div> : null}
          {program.deadline ? <div>Deadline: {new Date(program.deadline).toDateString()}</div> : null}
          {program.requirements ? (
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(program.requirements, null, 2)}
            </pre>
          ) : null}
          <Button className="mt-3" onClick={apply} disabled={applying}>
            {applying ? "Applying..." : "Apply"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Status = "requested" | "accepted" | "completed";

interface Consultation {
  id: string;
  status: "REQUESTED" | "ACCEPTED" | "PAID" | "COMPLETED" | string;
  fee?: number | null;
  appointmentTime?: string | null;
  // you said your relation returns counselor; if your API returns seeker too, it's fine
  counselor?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

const API = "http://localhost:4000"; 

export default function SeekerConsultationListPage() {
  const { status } = useParams() as { status: Status };
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = () => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const niceTitle = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Consultation[]>(
          `${API}/seeker/consultations/${status}`,
          { headers: auth() }
        );
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        console.error(e);
        alert(e?.response?.data?.message || "Failed to load consultations.");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  if (loading) return <div className="p-8">Loading {status} consultations…</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {niceTitle(status)} Consultations
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/seeker/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/seeker/programs")}
          >
            Browse Programs
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-600">
          No {status} consultations found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((c) => (
            <Card key={c.id} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {c.counselor
                      ? `${c.counselor.firstName ?? ""} ${c.counselor.lastName ?? ""}`.trim() ||
                        c.counselor.email ||
                        "Counselor"
                      : "Counselor"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100">
                    {c.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {c.appointmentTime && (
                  <div>
                    <span className="text-sm text-gray-500 mr-1">Time:</span>
                    {new Date(c.appointmentTime).toLocaleString()}
                  </div>
                )}
                {typeof c.fee === "number" && (
                  <div>
                    <span className="text-sm text-gray-500 mr-1">Fee:</span>${c.fee}
                  </div>
                )}

                {/* For seeker we’re only listing; no actions here since your backend
                    doesn’t expose seeker-cancel etc. */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

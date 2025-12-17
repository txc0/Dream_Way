"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Consultation {
  id: string;
  counselorName: string;
  appointmentTime?: string;
  fee?: number;
  status: string;
}

export default function AppointmentsPage() {
  const { status } = useParams() as { status: string };
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, [status]);

  const fetchConsultations = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/consultation/seeker?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConsultations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading {status} consultations...</p>;
  if (!consultations.length) return <p>No {status} consultations found.</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">
        {status.charAt(0).toUpperCase() + status.slice(1)} Consultations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {consultations.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.counselorName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {c.status}</p>
              {c.appointmentTime && (
                <p>Time: {new Date(c.appointmentTime).toLocaleString()}</p>
              )}
              {c.fee && <p>Fee: ${c.fee}</p>}
              {status === "requested" && (
                <Button className="mt-2">Cancel Request</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

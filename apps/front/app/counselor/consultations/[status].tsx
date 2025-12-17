"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Consultation {
  id: string;
  seekerName: string;
  appointmentTime?: string;
  fee?: number;
  status: string;
}

export default function ConsultationListPage() {
  const { status } = useParams() as { status: string }; // Type assertion for TS
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `http://localhost:3000/counselor/consultations/${status}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConsultations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [status]);

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
              <CardTitle>{c.seekerName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {c.status}</p>
              {c.appointmentTime && (
                <p>Time: {new Date(c.appointmentTime).toLocaleString()}</p>
              )}
              {c.fee && <p>Fee: ${c.fee}</p>}
              {status === "requested" && (
                <Button className="mt-2">Accept Request</Button>
              )}
              {status === "accepted" && (
                <Button className="mt-2">Mark as Completed</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

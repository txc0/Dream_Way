"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Counselor {
  id: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  avatar?: string;
}

export default function BookCounselorPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/counselors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCounselors(data);
    } catch (err) {
      console.error("Failed to fetch counselors", err);
    } finally {
      setLoading(false);
    }
  };

  const requestConsultation = async (counselorId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ counselorId }),
      });

      if (res.ok) {
        alert("Consultation requested successfully!");
      } else {
        alert("Failed to request consultation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error requesting consultation.");
    }
  };

  if (loading) return <p>Loading counselors...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Available Counselors</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {counselors.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={c.avatar || "/path/to/default.jpg"}
                    alt={c.firstName}
                  />
                  <AvatarFallback>{c.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>
                  {c.firstName} {c.lastName}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Specialization: {c.specialization || "General"}</p>
              <Button
                className="mt-2"
                onClick={() => requestConsultation(c.id)}
              >
                Request Consultation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

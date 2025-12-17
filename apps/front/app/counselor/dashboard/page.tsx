"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

export default function CounselorDashboardPage() {
  const [firstName, setFirstName] = useState("");
  const [requests, setRequests] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setFirstName(JSON.parse(user).firstName);

    const fetchConsultations = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT if applicable

        const [reqRes, appRes, compRes] = await Promise.all([
          axios.get("http://localhost:3000/counselor/consultations/requested", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/counselor/consultations/accepted", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/counselor/consultations/completed", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRequests(reqRes.data.length);
        setAppointments(appRes.data.length);
        setCompleted(compRes.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConsultations();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Header / Navigation row */}
      <div className="flex items-center justify-between mb-8">
        <Avatar>
          <AvatarImage src="/path/to/profile.jpg" alt={firstName} />
          <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
        </Avatar>

        <h2 className="text-xl font-semibold">Counselor</h2>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "counselor/profile")}
        >
          My Profile
        </Button>
      </div>

      {/* Consultation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          onClick={() => (window.location.href = "/consultations/pending")}
          className="cursor-pointer hover:shadow-lg"
        >
          <CardHeader>
            <CardTitle>View Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {requests === null
              ? "Loading..."
              : `You have ${requests} pending consultation request${requests !== 1 ? "s" : ""}.`}
          </CardContent>
        </Card>

        <Card
          onClick={() => (window.location.href = "/consultations/appointments")}
          className="cursor-pointer hover:shadow-lg"
        >
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments === null
              ? "Loading..."
              : `You have ${appointments} scheduled appointment${appointments !== 1 ? "s" : ""}.`}
          </CardContent>
        </Card>

        <Card
          onClick={() => (window.location.href = "/consultations/completed")}
          className="cursor-pointer hover:shadow-lg"
        >
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {completed === null
              ? "Loading..."
              : `${completed} consultation${completed !== 1 ? "s" : ""} completed.`}
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <Button
        className="mt-6"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </Button>
    </div>
  );
}

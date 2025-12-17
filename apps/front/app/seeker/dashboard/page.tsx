"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

type Counts = {
  requests: number;
  appointments: number;
  completed: number;
  documents: number;
  programs: number;
  applications: number;
};

const API_BASE = "http://localhost:4000";

export default function SeekerDashboardPage() {
  const [firstName, setFirstName] = useState("");
  const [counts, setCounts] = useState<Counts>({
    requests: 0,
    appointments: 0,
    completed: 0,
    documents: 0,
    programs: 0,
    applications: 0,
  });

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setFirstName(parsed?.firstName ?? "");
      } catch {}
    }
    fetchCounts().catch((e) => console.error(e));
  }, []);

  async function fetchCounts() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    // NOTE: plural 'consultations'
    const urls = [
      `${API_BASE}/seeker/consultations/requested`,
      `${API_BASE}/seeker/consultations/accepted`,
      `${API_BASE}/seeker/consultations/completed`,
      `${API_BASE}/seeker/docs`,
      `${API_BASE}/seeker/programs`,
      `${API_BASE}/seeker/applications`,
    ];

    const [reqRes, apptRes, compRes, docRes, progRes, appRes] =
      await Promise.all(urls.map((u) => fetch(u, { headers })));

    // helpful error if any call failed
    const bad = [reqRes, apptRes, compRes, docRes, progRes, appRes].find(
      (r) => !r.ok
    );
    if (bad) {
      const text = await bad.text();
      console.error("Fetch error:", bad.url, bad.status, text);
      return;
    }

    const [
      requests,
      appointments,
      completed,
      documents,
      programs,
      applications,
    ] = await Promise.all([
      reqRes.json(),
      apptRes.json(),
      compRes.json(),
      docRes.json(),
      progRes.json(),
      appRes.json(),
    ]);

     const noticesRes = await axios.get(`${API_BASE}/admin/notices`, { headers });
    const notices = Array.isArray(noticesRes.data) ? noticesRes.data : [];

    setCounts({
      requests: Array.isArray(requests) ? requests.length : 0,
      appointments: Array.isArray(appointments) ? appointments.length : 0,
      completed: Array.isArray(completed) ? completed.length : 0,
      documents: Array.isArray(documents) ? documents.length : 0,
      programs: Array.isArray(programs) ? programs.length : 0,
      applications: Array.isArray(applications) ? applications.length : 0,
    });
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* My Requests */}
        <Card
          onClick={() =>
            (window.location.href = "/seeker/consultations/requested")
          }
          className="cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              window.location.href = "/seeker/consultations/requested";
            }
          }}
        >
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            You have {counts.requests} pending requests.
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card
          onClick={() =>
            (window.location.href = "/seeker/consultations/accepted")
          }
          className="cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              window.location.href = "/seeker/consultations/accepted";
            }
          }}
        >
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {counts.appointments} scheduled appointments.
          </CardContent>
        </Card>

        {/* Completed */}
        <Card
          onClick={() =>
            (window.location.href = "/seeker/consultations/completed")
          }
          className="cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              window.location.href = "/seeker/consultations/completed";
            }
          }}
        >
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>{counts.completed} consultations completed.</CardContent>
        </Card>

        {/* Documents */}
        <Card
          onClick={() => (window.location.href = "/seeker/documents")}
          className="cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              window.location.href = "/seeker/documents";
            }
          }}
        >
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>Your Documents</CardContent>
        </Card>

      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Programs</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm">
              Available programs: {counts.programs}
            </span>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/seeker/programs")}
            >
              Browse Programs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm">
              My applications: {counts.applications}
            </span>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/seeker/applications")}
            >
              Manage Applications
            </Button>
          </CardContent>
        </Card>

        <Card
          onClick={() => (window.location.href = "/seeker/notices")}
          className="cursor-pointer hover:shadow-lg"
        >
          <CardHeader><CardTitle>Notices</CardTitle></CardHeader>
          <CardContent>Active notice </CardContent>
        </Card>
      </div>

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

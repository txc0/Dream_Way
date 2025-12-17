"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function CounselorProfilePage() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/counselor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:3000/counselor/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="flex flex-col gap-4 max-w-md">
        <Input
          placeholder="First Name"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />
        <Input
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <Input
          placeholder="Bio"
          value={user.bio || ""}
          onChange={(e) => setUser({ ...user, bio: e.target.value })}
        />

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

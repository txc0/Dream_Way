"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { z } from "zod";

const ProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[A-Za-z\s']+$/, "Only letters, spaces, ' and - allowed"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[A-Za-z\s']+$/, "Only letters, spaces, ' and - allowed"),
  email: z.string().trim().email("Enter a valid email address"),
  academicInfo: z
    .string()
    .trim()
    .min(2, "Academic info must be at least 2 characters")
    .max(200, "Keep academic info under 200 chars"),
  country: z.string().trim().min(2, "Country must be at least 2 characters"),
});

type Profile = z.infer<typeof ProfileSchema>;

export default function SeekerProfilePage() {
  const [user, setUser] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
    academicInfo: "",
    country: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>(
    {}
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/seeker/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure shape & trimming
        const data = {
          firstName: res.data.firstName ?? "",
          lastName: res.data.lastName ?? "",
          email: (res.data.email ?? "").toLowerCase(),
          academicInfo: res.data.academicInfo ?? "",
          country: res.data.country ?? "",
        } as Profile;
        setUser(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validateAll = (payload: Profile) => {
    const result = ProfileSchema.safeParse(payload);
    if (result.success) {
      setErrors({});
      return true;
    }
    // Map first error per field
    const fieldErrors: Partial<Record<keyof Profile, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof Profile;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const handleSave = async () => {
    // Normalize/trim before validate & send
    const payload: Profile = {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      email: user.email.trim().toLowerCase(),
      academicInfo: user.academicInfo.trim(),
      country: user.country.trim(),
    };

    if (!validateAll(payload)) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:4000/seeker/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Optional: validate a single field on blur (lightweight UX)
  const validateField = (name: keyof Profile, value: string) => {
    const candidate = { ...user, [name]: value } as Profile;
    const result = ProfileSchema.pick({ [name]: true } as any).safeParse({
      [name]: name === "email" ? value.trim().toLowerCase() : value.trim(),
    });
    setErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="flex flex-col gap-4 max-w-md">
        <div>
          <Input
            placeholder="First Name"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            onBlur={(e) => validateField("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Last Name"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            onBlur={(e) => validateField("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            onBlur={(e) => validateField("email", e.target.value)}
            aria-invalid={!!errors.email}
            type="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Academic Info"
            value={user.academicInfo}
            onChange={(e) => setUser({ ...user, academicInfo: e.target.value })}
            onBlur={(e) => validateField("academicInfo", e.target.value)}
            aria-invalid={!!errors.academicInfo}
          />
          {errors.academicInfo && (
            <p className="mt-1 text-sm text-red-600">{errors.academicInfo}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Country"
            value={user.country}
            onChange={(e) => setUser({ ...user, country: e.target.value })}
            onBlur={(e) => validateField("country", e.target.value)}
            aria-invalid={!!errors.country}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

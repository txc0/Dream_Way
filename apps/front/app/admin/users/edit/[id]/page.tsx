"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  isVerified: z.boolean(),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
  });

  // Redirect if no token
  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  // Fetch user details
  useEffect(() => {
    if (!id || !token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: UpdateUserFormValues = {
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          isVerified: !!res.data.isVerified,
        };

        Object.entries(data).forEach(([key, value]) => setValue(key as keyof UpdateUserFormValues, value));
      } catch (err: any) {
        console.error(err);
        setSubmitMessage({ type: "error", text: err.response?.data?.message || "Failed to fetch user" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token, setValue]);

  const onSubmit = async (data: UpdateUserFormValues) => {
    if (!token) return;

    setSubmitMessage(null);
    try {
      await axios.patch(`http://localhost:4000/admin/users/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmitMessage({ type: "success", text: "User updated successfully!" });
      router.push("/admin/users");
    } catch (err: any) {
      console.error(err);
      setSubmitMessage({ type: "error", text: err.response?.data?.message || "Failed to update user" });
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      {submitMessage && (
      <Alert className={`mb-4 ${submitMessage.type === "error" ? "border-red-500" : "border-green-500"}`}>
        <AlertDescription className={submitMessage.type === "error" ? "text-red-700" : "text-green-700"}>
          {submitMessage.text}
        </AlertDescription>
      </Alert>

      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Edit User</CardTitle>
          <CardDescription className="text-center">Update user details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- Schema ---
const updateNoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type UpdateNoticeFormValues = z.infer<typeof updateNoticeSchema>;

export default function EditNoticePage() {
  const { id } = useParams();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UpdateNoticeFormValues>({
    resolver: zodResolver(updateNoticeSchema),
  });

  // Fetch notice details
  useEffect(() => {
    if (!id || !token) return;

    const fetchNotice = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/admin/notices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setValue("title", res.data.title || "");
        setValue("content", res.data.content || "");
      } catch (err: any) {
        console.error(err);
        setSubmitMessage({ type: "error", text: "Failed to fetch notice" });
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, token, setValue]);

  const onSubmit = async (data: UpdateNoticeFormValues) => {
    if (!token) return;
    setSubmitMessage(null);

    try {
      await axios.patch(`http://localhost:4000/admin/notices/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmitMessage({ type: "success", text: "Notice updated successfully!" });
      router.push("/admin/notices");
    } catch (err: any) {
      console.error(err);
      setSubmitMessage({ type: "error", text: err.response?.data?.message || "Failed to update notice" });
    }
  };

  if (loading) return <p>Loading notice...</p>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      {submitMessage && (
        <Alert className={`mb-4 ${submitMessage.type === "error" ? "border-red-500" : "border-green-500"}`}>
          <AlertDescription className={submitMessage.type === "error" ? "text-red-700" : "text-green-700"}>
            {submitMessage.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Notice</CardTitle>
          <CardDescription className="text-center">Update notice details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Input id="content" {...register("content")} />
              {errors.content && <p className="text-red-600 text-sm">{errors.content.message}</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/notices")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

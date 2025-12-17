"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Zod schema without isActive
const createNoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type CreateNoticeFormValues = z.infer<typeof createNoticeSchema>;

export default function CreateNoticePage() {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateNoticeFormValues>({
    resolver: zodResolver(createNoticeSchema),
  });

  const onSubmit = async (data: CreateNoticeFormValues) => {
    setSubmitMessage(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await axios.post("http://localhost:4000/admin/notices", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmitMessage({ type: "success", text: "Notice created successfully!" });
      router.push("/admin/notices");
    } catch (err: any) {
      console.error(err);
      setSubmitMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create notice",
      });
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Notice</CardTitle>
          <CardDescription className="text-center">Add a new notice below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content</Label>
              <Input id="content" {...register("content")} />
              {errors.content && <p className="text-red-600 text-sm">{errors.content.message}</p>}
            </div>

            {/* Submit message */}
            {submitMessage && (
              <Alert className={submitMessage.type === "error" ? "border-red-500" : "border-green-500"}>
                <AlertDescription className={submitMessage.type === "error" ? "text-red-700" : "text-green-700"}>
                  {submitMessage.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Buttons */}
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

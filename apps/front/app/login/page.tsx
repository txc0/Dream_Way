"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 1. Define Zod schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // 2. Add Zod resolver
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitMessage(null);

    try {
      const res = await axios.post("http://localhost:4000/auth/login", values, {
        withCredentials: true,
      });

      const { access_token, user } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setSubmitMessage({
        type: "success",
        text: "Login successful! Redirecting...",
      });

      if (user && user.role) {
        const role = user.role.toLowerCase().trim();
        if (role === "counselor") router.push("/counselor/dashboard");
        else if (role === "seeker") router.push("/seeker/dashboard");
        else if (role === "admin") router.push("/admin/dashboard");
        else router.push("/");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setSubmitMessage({
        type: "error",
        text: err.response?.data?.message || "Login failed. Try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password.message}</p>
              )}
            </div>

            {submitMessage && (
              <Alert
                className={
                  submitMessage.type === "error" ? "border-red-500" : "border-green-500"
                }
              >
                <AlertDescription
                  className={
                    submitMessage.type === "error" ? "text-red-700" : "text-green-700"
                  }
                >
                  {submitMessage.text}
                </AlertDescription>
              </Alert>
            )}

            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-center">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/forgot-password" className="text-gray-500 hover:underline">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

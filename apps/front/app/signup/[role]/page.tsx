"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schema stays the same
const signupSchema = z.object({
  firstName: z.string().min(2, { message: "Please add first name." }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const params = useParams();
  const role = (params.role as string).toLocaleLowerCase();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: SignupValues) {
    setIsSubmitting(true);
    setSubmitMessage(null);

    const payload = { ...values, role };

    axios
      .post("http://localhost:4000/auth/register", payload, {
        withCredentials: true,
      })
      .then((res) => {
        setSubmitMessage({
          type: "success",
          text: "Registration successful! Please check your email for verification.",
        });
        form.reset();
        setTimeout(() => router.push("/login"), 1500);
      })
      .catch((err) => {
        setSubmitMessage({
          type: "error",
          text:
            err.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {role === "COUNSELOR" ? "Counselor" : "Seeker"} Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitMessage && (
                <Alert
                  className={
                    submitMessage.type === "error"
                      ? "border-red-500"
                      : "border-green-500"
                  }
                >
                  <AlertDescription
                    className={
                      submitMessage.type === "error"
                        ? "text-red-700"
                        : "text-green-700"
                    }
                  >
                    {submitMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

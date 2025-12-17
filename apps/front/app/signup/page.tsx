"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupRolePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Choose Your Role
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/signup/counselor">
            <Button className="w-full">I’m a Counselor</Button>
          </Link>
          <Link href="/signup/seeker">
            <Button variant="outline" className="w-full">
              I’m a Seeker
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

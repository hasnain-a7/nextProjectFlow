"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserContextId } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, userContextId } = useUserContextId();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userContextId) {
      router.push("/Home");
    }
  }, [userContextId, router]);

  return (
    <Card className="w-full  max-w-sm mx-auto md:mt-10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center mb-2">
          Welcome back! Please enter your details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="example123@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-center mt-3">
          Don't have an account?{" "}
          <Link
            href="/SignUp"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          <Link href="/" className="text-chart-1 hover:underline">
            Back to Home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignIn;

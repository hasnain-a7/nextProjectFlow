"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContextId } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, userContextId } = useUserContextId();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userContextId) router.push("/Home");
  }, [userContextId, router]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Sign in to continue your journey.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-primary focus:border-primary placeholder:text-zinc-600 transition-all rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-primary focus:border-primary placeholder:text-zinc-600 transition-all rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-medium transition-all shadow-lg shadow-primary/20 rounded-lg mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-2  text-sm text-zinc-500">
        Don’t have an account?{" "}
        <Link
          href="/SignUp"
          className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
        >
          Create one
        </Link>
      </div>
    </motion.div>
  );
};

export default SignIn;

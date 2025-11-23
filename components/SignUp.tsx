"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContextId, type User } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Briefcase,
  Building2,
  MapPin,
} from "lucide-react";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const [userData, setuserData] = useState<User>({
    fullname: "",
    bio: "",
    email: "",
    avatar: "",
    isActive: false,
    occupation: "",
    location: "",
    origanization: "",
  });

  const { signUp, userContextId } = useUserContextId();

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (signUp) {
        await signUp(userData.email || "", password, userData);
        console.log("✅ User signed up successfully!");
      } else {
        throw new Error("Signup function not found in context");
      }
    } catch (error) {
      setError((error as Error).message);
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Create Account
        </h1>
        <p className="text-muted-foreground">
          Fill in your details to get started with ProjectFlow.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSignUpSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-zinc-300">
            Full Name
          </Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="fullname"
              type="text"
              placeholder="John Doe"
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-primary focus:border-primary placeholder:text-zinc-600 transition-all rounded-lg"
              value={userData.fullname || ""}
              onChange={(e) =>
                setuserData({ ...userData, fullname: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Occupation & Organization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-zinc-300">
              Occupation
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                id="occupation"
                type="text"
                placeholder="Developer"
                className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-primary focus:border-primary placeholder:text-zinc-600 transition-all rounded-lg"
                value={userData.occupation || ""}
                onChange={(e) =>
                  setuserData({ ...userData, occupation: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="text-zinc-300">
              Organization
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                id="organization"
                type="text"
                placeholder="Acme Inc"
                className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-primary focus:border-primary placeholder:text-zinc-600 transition-all rounded-lg"
                value={userData.origanization || ""}
                onChange={(e) =>
                  setuserData({ ...userData, origanization: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-zinc-300">
            Country/Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="location"
              type="text"
              placeholder="United States"
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-primary focus:border-primary placeholder:text-zinc-600 transition-all rounded-lg"
              value={userData.location || ""}
              onChange={(e) =>
                setuserData({ ...userData, location: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email */}
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
              value={userData.email || ""}
              onChange={(e) =>
                setuserData({ ...userData, email: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-primary focus:border-primary placeholder:text-zinc-600 transition-all rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !userData.email?.trim() || !password.trim()}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-medium transition-all shadow-lg shadow-primary/20 rounded-lg mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-2  text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/SignIn"
          className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
};

export default SignUp;

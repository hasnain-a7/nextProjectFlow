"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Sparkles, Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect scroll to toggle background style
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !isScrolled) {
      setIsScrolled(true);
    } else if (latest <= 50 && isScrolled) {
      setIsScrolled(false);
    }
  });

  const myVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,

        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.header
      variants={myVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Sparkles size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Project<span className="text-primary">Flow</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "About", "Pricing", "Testimonials"].map((item) => (
              <Link
                key={item}
                href={`${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="hidden md:flex text-muted-foreground hover:text-primary hover:bg-primary/5"
              onClick={() => router.push("/SignIn")}
            >
              Sign In
            </Button>

            <Button
              className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              size={isScrolled ? "sm" : "default"}
              onClick={() => router.push("/SignUp")}
            >
              Get Started
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Simple Implementation) */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl"
        >
          {["Features", "About", "Pricing"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-medium text-foreground/80 hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-1" />
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => router.push("/Login")}
          >
            Sign In
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative w-full overflow-hidden bg-background text-foreground">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* --- HERO AREA --- */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <Sparkles size={12} />
              <span>Now with AI Task Analysis</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-white/60"
          >
            Master your workflow <br className="hidden md:block" />
            <span className="text-primary">Project Flow</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Stop juggling scattered tools. Project Flow unifies your tasks,
            deadlines, and team communication into one intelligent, AI-powered
            workspace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16"
          >
            <Button
              size="lg"
              className="rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              onClick={() => router.push("/SignUp")}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/5"
              onClick={() =>
                window.open("https://youtu.be/0ajLMU9Elw8", "_blank")
              }
            >
              View Demo
            </Button>
          </motion.div>

          {/* Mock Dashboard Graphic (CSS Only - No Image File Needed) */}
          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-8xl mx-auto perspective-1000"
          >
            {/* The "Screen" Container with 3D tilt */}
            <div className="relative rounded-xl border border-white/10 bg-gray-950/50 backdrop-blur-xl shadow-2xl overflow-hidden transform rotate-x-12 transition-transform duration-700 hover:rotate-x-0">
              {/* Fake Browser Header */}
              <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 z-10 relative">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 h-4 w-64 rounded-full bg-white/5" />
              </div>

              <div className="relative w-full h-[400px] md:h-[600px] bg-background/50">
                <Image
                  src="https://dev.hasnain.site/project/uploads/sssfsd.png"
                  alt="App Dashboard Preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Glow Effect behind the screen */}
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 opacity-20 blur-2xl -z-10" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-black/20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Project Flow?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for modern teams who demand speed, clarity, and intelligence
              in their daily workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor project progress as it happens. Get instant
                notifications and live updates so you never miss a deadline.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unified Dashboard</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bring all your tools into one view. Manage tasks, documents, and
                team chats without switching tabs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Let our AI summarize meetings, suggest task priorities, and
                draft project updates for you automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">
            Trusted by forward-thinking teams
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Replaced text with generic icons/names for professionalism */}
            <div className="flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="text-primary" /> Octek
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="text-blue-500" /> Globex
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="text-purple-500" /> Sovia
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="text-green-500" /> Umbrell
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

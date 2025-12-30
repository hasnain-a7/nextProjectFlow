"use client";

import { useState, useEffect, useDeferredValue, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProjectModal from "@/components/modols/ProjectModol";
import { Project } from "@/types/types";

export default function HomeHeader() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [filter, setFilter] = useState<"all" | "recent" | "lastupdated">("all");
  const [filteredCategory, setFilteredCategory] = useState("");

  // Fetch projects client-side
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects"); // your API endpoint
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const q = (deferredSearch || "").trim().toLowerCase();
    let filtered = [...projects];

    if (filter === "recent") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.updatedAt || "").getTime() -
          new Date(a.updatedAt || "").getTime()
      );
    }

    if (filteredCategory) {
      filtered = filtered.filter(
        (p) => p.Category?.toLowerCase() === filteredCategory.toLowerCase()
      );
    }

    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [projects, deferredSearch, filteredCategory, filter]);

  const categories = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    projects.forEach((p) => {
      if (!p.Category) return;
      const clean = p.Category.trim().toLowerCase();
      if (!counts[clean]) {
        counts[clean] = {
          name:
            p.Category.trim().charAt(0).toUpperCase() +
            p.Category.trim().slice(1).toLowerCase(),
          count: 0,
        };
      }
      counts[clean].count += 1;
    });
    return Object.values(counts);
  }, [projects]);

  return (
    <div className="flex flex-col md:flex-row lg:flex-row lg:items-center lg:justify-between w-full gap-2 pt-2 shadow-sm">
      <div className="relative flex items-center w-full sm:max-w-sm md:max-w-md">
        <Search className="absolute left-3 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search projects..."
          value={deferredSearch}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-14 py-2 rounded-lg border text-sm"
        />
        <kbd className="absolute right-3 text-[12px] px-1.5 py-0.5 rounded">
          ⌘ K
        </kbd>
      </div>

      <div className="flex items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
        <Select
          defaultValue="all"
          onValueChange={(v) => setFilter(v as string)}
        >
          <SelectTrigger className="min-w-[125px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="lastupdated">Last Updated</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue="all"
          onValueChange={(v) => setFilteredCategory(v === "all" ? "" : v)}
        >
          <SelectTrigger className="min-w-[125px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem
                key={c.name}
                value={c.name}
                className="flex items-center justify-between gap-3 px-2 py-1"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground text-sm">
                  ({c.count})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="min-w-min md:min-w-[120px] flex items-center gap-2 font-medium whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add Project</span>
              <span className="md:hidden">Project</span>
            </Button>
          </DialogTrigger>
          <ProjectModal />
        </Dialog>
      </div>
    </div>
  );
}

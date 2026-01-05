"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function HomeHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Internal state for input (fast typing)
  const [searchInput, setSearchInput] = useState("");

  // Update query params helper
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row lg:flex-row lg:items-center lg:justify-between w-full gap-2 pt-2 shadow-sm">
      {/* Search */}
      <div className="relative flex items-center w-full sm:max-w-sm md:max-w-md">
        <Search className="absolute left-3 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateQuery("q", searchInput.trim());
              setSearchInput("");
            }
          }}
          className="pl-10 pr-14 py-2 rounded-lg border text-sm"
        />
        <kbd className="absolute right-3 text-[12px] px-1.5 py-0.5 rounded">
          ⌘ K
        </kbd>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
        <Select onValueChange={(v) => updateQuery("filter", v)}>
          <SelectTrigger className="min-w-[125px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="lastupdated">Last Updated</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Project */}
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

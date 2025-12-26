// components/HomeDynamic.tsx
"use client";
import { useState, useDeferredValue } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { StreamingProjectsGrid } from "@/components/ProjectsGrid";
import ProjectModol from "@/components/modols/ProjectModol";

export default function HomeDynamic({
  projects,
  LatestProject,
  LastUpdatedProject,
  Categories,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [filter, setFilter] = useState("all");
  const [filteredCategory, setFilteredCategory] = useState("");

  const filteredProjects = projects.filter((project) => {
    const q = deferredSearch.toLowerCase();
    const title = project.title?.toLowerCase() || "";
    const description = project.description?.toLowerCase() || "";
    const category = project.Category?.toLowerCase() || "";

    const titleMatch = !q || title.includes(q) || description.includes(q);
    const categoryMatch = filteredCategory
      ? category === filteredCategory.toLowerCase()
      : true;
    const dropdownMatch =
      filter === "recent"
        ? project.id === LatestProject?.id
        : filter === "lastupdated"
        ? project.id === LastUpdatedProject?.id
        : true;

    return titleMatch && categoryMatch && dropdownMatch;
  });

  return (
    <div>
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <Select defaultValue="all" onValueChange={(v) => setFilter(v)}>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="recent">Recent</SelectItem>
        <SelectItem value="lastupdated">Last Updated</SelectItem>
      </Select>

      <Select defaultValue="all" onValueChange={(v) => setFilteredCategory(v)}>
        <SelectItem value="all">Categories</SelectItem>
        {Categories.map((c) => (
          <SelectItem key={c.name} value={c.name}>
            {c.name}
          </SelectItem>
        ))}
      </Select>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Project</Button>
        </DialogTrigger>
        <ProjectModol />
      </Dialog>

      <StreamingProjectsGrid />
    </div>
  );
}

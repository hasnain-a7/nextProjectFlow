"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic"; // OPTIMIZATION: For lazy loading
import { usePathname } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { Separator } from "./ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Bot, FolderOpen, CalendarRange } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
// OPTIMIZATION: Lazy load the modal so it doesn't slow down initial render
const ProjectModol = dynamic(() => import("./modols/ProjectModol"), {
  ssr: false,
});

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/context/projectContext";
import SidebarFooter from "@/components/SidebarFooter";
import Loader from "./Loader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { projects, loading } = useProjectContext();
  const { setOpen, state } = useSidebar();
  const [hovered, setHovered] = React.useState(false);
  const pathname = usePathname();

  const [isPending, startTransition] = React.useTransition();

  const items = React.useMemo(
    () => [
      { title: "Home", url: "/Home", icon: IoHomeOutline },
      { title: "Projects", url: "/allprojects", icon: FolderOpen },
      // { title: "Ai Talk", url: "/ai-talk", icon: Bot },
      {
        title: "Schedule Projects",
        url: "/calender-projects",
        icon: CalendarRange,
      },
    ],
    []
  );

  // OPTIMIZATION: Memoize sorted projects so we don't re-sort on every hover/render
  const sortedProjects = React.useMemo(() => {
    if (!projects) return [];
    return [...projects].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [projects]);

  // OPTIMIZATION: Handle navigation smoothly without blocking the main thread
  const handleLinkClick = React.useCallback(() => {
    startTransition(() => {
      setOpen(false);
    });
  }, [setOpen]);

  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex flex-col h-full bg-sidebar"
    >
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 pt-2 -mb-2">
        <span className="font-semibold text-base tracking-tight">Menu</span>
        <SidebarTrigger className="scale-90" />
      </div>

      {/* Avatar */}
      <div
        className={`flex items-center ${
          state === "collapsed"
            ? "justify-center px-1 pt-3 pb-1"
            : "justify-between pl-3 pr-2 pt-3 pb-1"
        } w-full`}
      >
        <div
          className={`flex items-center gap-1 ${
            state === "collapsed" ? "justify-center" : ""
          }`}
        >
          {state === "collapsed" ? (
            <div
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {!hovered ? (
                <Avatar className="hidden md:flex cursor-pointer transition-transform hover:scale-105">
                  <AvatarImage
                    src="/public/todo-list-svgrepo-com.svg"
                    alt="User Avatar"
                    className="h-8 w-8 p-1"
                  />
                  <AvatarFallback className="text-[13px] font-medium">
                    U
                  </AvatarFallback>
                </Avatar>
              ) : (
                <SidebarTrigger
                  className="transition-all duration-200 scale-110 cursor-pointer"
                  onClick={() => setHovered(false)}
                />
              )}
            </div>
          ) : (
            <>
              <Avatar className=" cursor-pointer">
                <AvatarImage
                  src="/public/todo-list-svgrepo-com.svg"
                  alt="User Avatar"
                  className=" h-8 w-8 p-1"
                />
                <AvatarFallback className="text-[13px] font-medium">
                  U
                </AvatarFallback>
              </Avatar>
              <span className="text-[13px] font-semibold tracking-wide text-foreground">
                Project Flow
              </span>
            </>
          )}
        </div>

        {state === "expanded" && <SidebarTrigger className="scale-100" />}
      </div>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Main Menu */}
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`flex ${
                    state === "expanded"
                      ? "flex-row"
                      : "flex-col items-center justify-center "
                  } items-center`}
                >
                  <Link
                    href={item.url}
                    className="w-full"
                    onClick={handleLinkClick} // Used optimized handler
                  >
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive(item.url)}
                      className={`flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors ${
                        isActive(item.url)
                          ? "bg-accent text-white"
                          : "hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    >
                      <item.icon className="cursor-pointer" size={20} />
                      <span
                        className="md:hidden text-[14px] font-medium cursor-pointer"
                        onClick={handleLinkClick}
                      >
                        {item.title}
                      </span>
                      {state === "expanded" && (
                        <span
                          className="text-[14px] font-medium cursor-pointer"
                          onClick={handleLinkClick}
                        >
                          {item.title}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator className="my-3" />

            {/* Projects Section */}
            <div
              className={`flex items-center ${
                state === "expanded"
                  ? "justify-between px-0.5"
                  : "justify-center flex-col"
              }`}
            >
              {state === "expanded" ? (
                <>
                  <SidebarGroupLabel className="hidden md:flex text-[12px] gap-1 uppercase text-muted-foreground tracking-wide font-semibold">
                    Projects
                  </SidebarGroupLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="p-1.5 rounded hover:bg-sidebar-accent inline-flex items-center justify-center"
                        title="Add Project"
                      >
                        <AiOutlinePlus size={17} />
                      </button>
                    </DialogTrigger>
                    <ProjectModol />
                  </Dialog>
                </>
              ) : (
                <div className=" w-full   flex justify-between items-center gap-1">
                  <SidebarGroupLabel className="flex md:hidden text-[12px] uppercase text-muted-foreground tracking-wide font-semibold">
                    Projects
                  </SidebarGroupLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className=" p-1.5 rounded hover:bg-sidebar-accent inline-flex items-center justify-center"
                        title="Add Project"
                      >
                        <AiOutlinePlus size={17} />
                      </button>
                    </DialogTrigger>
                    <ProjectModol />
                  </Dialog>
                </div>
              )}
            </div>

            {state === "expanded" && (
              <ScrollArea className="h-[h-64] mt-2">
                <SidebarMenu className="space-y-0.5 mt-1">
                  {projects.length > 0 ? (
                    // Used Memoized Sorted Projects
                    sortedProjects.map((project) => (
                      <SidebarMenuItem key={project.id}>
                        <Link
                          href={`/projects/${project.id}`}
                          onClick={handleLinkClick}
                          className="w-full"
                        >
                          <SidebarMenuButton
                            tooltip={project?.title}
                            isActive={pathname === `/projects/${project.id}`}
                            className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-[13px] font-medium truncate transition-colors ${
                              pathname === `/projects/${project.id}`
                                ? "bg-primary text-white"
                                : "hover:bg-sidebar-accent/70 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FolderOpen
                                size={14}
                                className={
                                  pathname === `/projects/${project.id}`
                                    ? "text-white"
                                    : "text-muted-foreground"
                                }
                              />
                              <span className="truncate max-w-[110px]">
                                {project.title.charAt(0).toUpperCase() +
                                  project.title.slice(1)}
                              </span>
                            </div>
                            {project?.Tasks?.length &&
                              project?.Tasks?.length > 0 && (
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    pathname === `/projects/${project.id}`
                                      ? "bg-white/20 text-white"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {project?.Tasks.length}
                                </span>
                              )}
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      {loading ? (
                        <Loader />
                      ) : (
                        <>
                          <p>No projects</p>
                          <p>Add one to get started</p>
                        </>
                      )}
                    </div>
                  )}
                </SidebarMenu>
              </ScrollArea>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter state={state} setopen={setOpen} />
    </Sidebar>
  );
}

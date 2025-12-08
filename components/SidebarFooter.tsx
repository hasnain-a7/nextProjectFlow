"use client";
import React from "react";
import {
  SidebarFooter as SidebarFooterBase,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FaSignOutAlt } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { useUserContextId } from "@/app/context/AuthContext";

import { useProjectContext } from "@/app/context/projectContext";

interface SidebarFooterProps {
  setopen: (open: boolean) => void;
  state: "expanded" | "collapsed";
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ state }) => {
  const navigate = useRouter();
  const { logout } = useUserContextId();
  const { userData } = useProjectContext();

  const handleLogout = async () => {
    const confirmDelete = window.confirm("Do you want to logout?");
    if (!confirmDelete) return;
    logout();
  };

  return (
    <SidebarFooterBase>
      <div className="relative w-full">
        <SidebarMenuButton
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 mb-2 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/30"
        >
          <FaSignOutAlt className="h-4 w-4" /> Logout
        </SidebarMenuButton>
        <SidebarMenuButton
          className={`relative w-full transition-all duration-200 ${
            state === "expanded"
              ? "flex px-1 py-6"
              : "flex flex-col items-center justify-center py-3"
          }`}
          onClick={() => navigate.push("/profile")}
        >
          <Avatar
            className={`cursor-pointer hover:scale-105 ${
              state === "collapsed" ? "h-10 w-10" : ""
            }`}
          >
            <AvatarImage
              src={userData?.avatar || ""}
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <AvatarFallback>
              {userData?.fullname?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {state === "expanded" && (
            <div className="ml-3 flex flex-col">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {userData?.fullname || "Account"}
              </h3>
              <span className="text-xs text-muted-foreground">
                {userData?.email || ""}
              </span>
            </div>
          )}
        </SidebarMenuButton>
      </div>
    </SidebarFooterBase>
  );
};

export default SidebarFooter;

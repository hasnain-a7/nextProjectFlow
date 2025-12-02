import React from "react";
import SignIn from "@/components/SignIn";
const page = () => {
  return (
    <div className=" relative flex min-h-svh bg-linear-to-br from-gray-900 via-black to-gray-800 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md p-2">
        <SignIn />
      </div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-muted/50 backdrop-blur-sm px-4 py-2 rounded-md text-sm text-muted-foreground shadow-sm">
        Account: <span className="font-medium">whitecolour801@gmail.com</span> |
        Password: <span className="font-medium">123456</span>
      </div>
    </div>
  );
};

export default page;

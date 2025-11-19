import React from "react";
import SignIn from "@/components/SignIn";
const page = () => {
  return (
    <div className="flex min-h-svh bg-gradient-to-br from-gray-900 via-black to-gray-800 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md p-2">
        <SignIn />
      </div>
    </div>
  );
};

export default page;

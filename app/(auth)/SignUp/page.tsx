import SignUp from "@/components/SignUp";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800 p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
};

export default page;

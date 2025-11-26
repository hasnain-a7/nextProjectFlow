"use client";
import ProfileContent from "@/components/ProfileContent";
import ProfileHeader from "@/components/ProfileHeader";
import { useProjectContext } from "@/app/context/projectContext";
import Loader from "@/components/Loader";

const ProfilePage = () => {
  const { userData, loading } = useProjectContext();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="container mx-auto space-y-4  py-2">
        <ProfileHeader user={userData} />
        <ProfileContent />
      </div>
    </>
  );
};

export default ProfilePage;

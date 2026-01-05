import ProfileContent from "@/components/ProfileContent";
import ProfileHeader from "@/components/ProfileHeader";
import Loader from "@/components/Loader";
import { User } from "@/types/types";

const ProfilePage = async () => {
  let userdata: User = {};
  try {
    const res = await fetch(
      `/api/users`,

      {
        cache: "no-store",
      }
    );
    userdata = await res.json();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }

  if (!userdata) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className=" px-2 space-y-4  py-2">
        <ProfileHeader user={userdata} />
        <ProfileContent />
      </div>
    </>
  );
};

export default ProfilePage;

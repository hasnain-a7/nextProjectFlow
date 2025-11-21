"use client";
import { Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/app/context/projectContext";
import { useState, memo } from "react";
import type { User } from "@/app/context/projectContext";
import { useUserContextId } from "@/app/context/AuthContext";
import { ChangePasswordDialog } from "@/components/ChangePassword";

// HELPER: Moved outside component to prevent re-creation on every render
const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export default function ProfileContent() {
  const { userData, updateUserData, deleteUserData } = useProjectContext();
  const { userContextId, deleteFirebaseAccount, logout } = useUserContextId();

  const [currentUser, setCurrentUser] = useState<User>({
    id: userData?.id || userContextId || "",
    fullname: userData?.fullname || "",
    email: userData?.email || "",
    location: userData?.location || "",
    occupation: userData?.occupation || "",
    organization: userData?.organization || "",
    bio: userData?.bio || "",
    isActive: userData?.isActive ?? true,
    avatar: userData?.avatar || "",
    coverImage: userData?.coverImage,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserData(currentUser);
      console.log("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAccountDel = async () => {
    try {
      if (!currentUser.id) throw new Error("No user ID found.");
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      );
      if (!confirmDelete) return;
      await deleteFirebaseAccount(currentUser.id);
      await deleteUserData(currentUser?.id || userContextId!);
      await logout();
      console.log("✅ Account deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete account:", error);
    }
  };

  // Handlers for inputs to keep the JSX clean
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "coverImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("Image too large. Please upload under 500KB.");
      return;
    }
    try {
      const base64String = await toBase64(file);
      setCurrentUser((prev) => ({ ...prev, [field]: base64String }));
    } catch (err) {
      console.error("Error converting image", err);
    }
  };

  return (
    <Tabs defaultValue="personal" className="space-y-2">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      {/* PERSONAL INFO TAB */}
      <TabsContent value="personal" className="relative space-y-6">
        <PersonalTabContent
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          handleSave={handleSave}
          handleFileChange={handleFileChange}
          saving={saving}
          isActiveOriginal={userData.isActive}
        />
      </TabsContent>

      {/* ACCOUNT TAB */}
      <TabsContent value="account" className="space-y-6">
        <AccountTabContent
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          handleAccountDel={handleAccountDel}
        />
      </TabsContent>

      {/* SECURITY TAB - Memoized to prevent re-render on typing */}
      <TabsContent value="security" className="space-y-6">
        <SecurityTabContent />
      </TabsContent>

      {/* NOTIFICATIONS TAB - Memoized to prevent re-render on typing */}
      <TabsContent value="notifications" className="space-y-6">
        <NotificationsTabContent />
      </TabsContent>
    </Tabs>
  );
}

// --- SUB-COMPONENTS ---
// Separating these components allows React to optimize rendering.
// The main profile component is now much lighter.

const PersonalTabContent = ({
  currentUser,
  setCurrentUser,
  handleSave,
  handleFileChange,
  saving,
  isActiveOriginal,
}: {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  handleSave: () => void;
  handleFileChange: (e: any, field: "avatar" | "coverImage") => void;
  saving: boolean;
  isActiveOriginal?: boolean;
}) => {
  return (
    <>
      <div className="absolute top-4 right-6 flex items-center gap-3">
        {isActiveOriginal ? <h3>Active</h3> : <>Away</>}
        <Switch
          checked={currentUser.isActive}
          onCheckedChange={(value) =>
            setCurrentUser({ ...currentUser, isActive: value })
          }
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and profile information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={currentUser.fullname ?? ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, fullname: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={currentUser.occupation ?? ""}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    occupation: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origanization">Organization</Label>
              <Input
                id="origanization"
                value={currentUser.organization ?? ""}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    organization: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={currentUser.location ?? ""}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className=" flex gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="avatar">Profile Pic</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "avatar")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "coverImage")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={currentUser.bio ?? ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, bio: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const AccountTabContent = ({
  currentUser,
  setCurrentUser,
  handleAccountDel,
}: {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  handleAccountDel: () => void;
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Status</Label>
              <p className="text-muted-foreground text-sm">
                Your account is currently active
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              {currentUser.isActive ? <h3>Active</h3> : <h3>Inactive</h3>}
            </Badge>
          </div>

          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Visibility</Label>
              <p className="text-muted-foreground text-sm">
                Make your profile visible to other users
              </p>
            </div>
            <Switch
              checked={currentUser.isActive}
              onCheckedChange={(value) =>
                setCurrentUser({ ...currentUser, isActive: value })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Data Export</Label>
              <p className="text-muted-foreground text-sm">
                Download a copy of your data
              </p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Delete Account</Label>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" onClick={handleAccountDel}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

// MEMOIZED: This component will NOT re-render when you type in the Personal inputs
const SecurityTabContent = memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security and authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Password</Label>
              <p className="text-muted-foreground text-sm">
                Last changed 3 months ago
              </p>
            </div>
            <ChangePasswordDialog />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-muted-foreground text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-green-700"
              >
                Enabled
              </Badge>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
          <Separator />

          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Active Sessions</Label>
              <p className="text-muted-foreground text-sm">
                Manage devices that are logged into your account
              </p>
            </div>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              View Sessions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
SecurityTabContent.displayName = "SecurityTabContent";

// MEMOIZED: This component will NOT re-render when you type in the Personal inputs
const NotificationsTabContent = memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-muted-foreground text-sm">
                Receive notifications via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-muted-foreground text-sm">
                Receive push notifications in your browser
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Marketing Emails</Label>
              <p className="text-muted-foreground text-sm">
                Receive emails about new features and updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Weekly Summary</Label>
              <p className="text-muted-foreground text-sm">
                Get a weekly summary of your activity
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Security Alerts</Label>
              <p className="text-muted-foreground text-sm">
                Important security notifications (always enabled)
              </p>
            </div>
            <Switch checked disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
NotificationsTabContent.displayName = "NotificationsTabContent";

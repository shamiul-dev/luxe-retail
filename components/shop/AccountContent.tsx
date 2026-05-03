"use client";

import { useState } from "react";
import {
  useSession,
  signOut,
  updateUser,
  changePassword,
} from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  LogOut,
  ShieldCheck,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Tab = "profile" | "orders" | "security";

export default function AccountContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("profile");
  const [editing, setEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (isPending) {
    return (
      <div className="max-w-container mx-auto px-6 py-24 flex items-center justify-center">
        <p className="text-content-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/auth");
    return null;
  }

  function handleEditClick() {
    setName(session!.user.name);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword && !currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    setSaving(true);

    // Update name
    if (name !== session!.user.name) {
      const { error: err } = await updateUser({ name });
      if (err) {
        setError(err.message ?? "Failed to update name.");
        setSaving(false);
        return;
      }
    }

    // Update password if provided
    if (newPassword) {
      const { error: err } = await changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      });
      if (err) {
        setError(
          err.message ??
            "Failed to update password. Make sure your current password is correct.",
        );
        setSaving(false);
        return;
      }
      // Better Auth revokes the session after password change — redirect to sign in
      setSaving(false);
      await signOut();
      router.push("/auth?message=password-changed");
      return;
    }

    setCurrentPassword("");
    setSaving(false);
    setSuccess(true);
    setEditing(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  const initials = session.user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const TABS = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "orders" as Tab, label: "Orders", icon: Package },
    { id: "security" as Tab, label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <h1 className="font-heading text-3xl font-bold text-content tracking-tight mb-8">
        My Account
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-2">
          <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-raised mb-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="font-heading text-xl font-bold text-white">
                {initials}
              </span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-content text-sm">
                {session.user.name}
              </p>
              <p className="text-xs text-content-muted">{session.user.email}</p>
            </div>
          </div>

          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setEditing(false);
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left",
                tab === id
                  ? "bg-primary text-white"
                  : "text-content-secondary hover:bg-surface-container",
              )}
            >
              <Icon size={17} /> {label}
            </button>
          ))}

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer mt-2"
          >
            <LogOut size={17} /> Sign Out
          </button>
        </aside>

        {/* ── Content ── */}
        <div className="md:col-span-3">
          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="bg-white rounded-xl shadow-raised p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-content">
                  Profile Information
                </h2>
                {!editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="gap-2"
                  >
                    <Pencil size={14} /> Edit Profile
                  </Button>
                )}
              </div>

              {/* View mode */}
              {!editing && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-content-muted tracking-widest uppercase">
                        Full Name
                      </p>
                      <p className="text-sm font-medium text-content">
                        {session.user.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-content-muted tracking-widest uppercase">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-content">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-content-muted tracking-widest uppercase">
                        Password
                      </p>
                      <p className="text-sm font-medium text-content tracking-widest">
                        ••••••••
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold text-content-muted tracking-widest uppercase">
                        Member Since
                      </p>
                      <p className="text-sm font-medium text-content">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          year: "numeric",
                        }).format(new Date())}
                      </p>
                    </div>
                  </div>

                  {success && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Profile updated successfully
                    </p>
                  )}
                </div>
              )}

              {/* Edit mode */}
              {editing && (
                <form onSubmit={handleSave} className="flex flex-col gap-5">
                  <Input
                    id="name"
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />

                  {/* Email is read-only */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-content-secondary tracking-wide">
                      Email Address
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-surface-container text-content-muted text-sm cursor-not-allowed">
                      {session.user.email}
                    </div>
                    <p className="text-xs text-content-muted">
                      Email address cannot be changed.
                    </p>
                  </div>

                  <div className="h-px bg-border" />
                  <p className="text-xs font-semibold text-content-muted tracking-widest uppercase">
                    Change Password{" "}
                    <span className="font-normal normal-case">
                      (leave blank to keep current)
                    </span>
                  </p>

                  <Input
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <Input
                    id="newPassword"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <Input
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                  />

                  {error && (
                    <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={saving}
                      className="gap-2"
                    >
                      <Save size={15} />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X size={15} /> Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div className="bg-white rounded-xl shadow-raised p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-content">
                  Order History
                </h2>
                <a
                  href="/orders"
                  className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
                >
                  View All
                </a>
              </div>
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center">
                  <Package size={24} className="text-content-muted" />
                </div>
                <div>
                  <p className="font-semibold text-content text-sm mb-1">
                    No orders yet
                  </p>
                  <p className="text-content-muted text-sm">
                    When you place an order it will appear here.
                  </p>
                </div>
                <a href="/shop">
                  <Button variant="primary" size="sm">
                    Start Shopping
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === "security" && (
            <div className="bg-white rounded-xl shadow-raised p-8">
              <h2 className="font-heading text-xl font-bold text-content mb-6">
                Security
              </h2>

              <div className="flex flex-col gap-4">
                {/* Session info */}
                <div className="p-5 bg-surface-low rounded-xl">
                  <p className="text-xs font-semibold text-content-muted tracking-widest uppercase mb-3">
                    Active Session
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-content">
                        Current Device
                      </p>
                      <p className="text-xs text-content-muted mt-0.5">
                        Signed in as {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="p-5 border border-red-200 rounded-xl">
                  <p className="text-xs font-semibold text-red-500 tracking-widest uppercase mb-3">
                    Danger Zone
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-content">
                        Sign out everywhere
                      </p>
                      <p className="text-xs text-content-muted mt-0.5">
                        Sign out from all devices and sessions.
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Sign Out All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

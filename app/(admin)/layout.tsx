import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/auth");

  // Fetch real role from DB since session may not reflect latest role
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user || user.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar user={{ ...session.user, role: user.role } as any} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

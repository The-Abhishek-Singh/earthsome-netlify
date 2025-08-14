// /app/admin/page.js or page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import AdminLayout from "@/Components/Admin/AdminLayout";
import Dashboard from "@/Components/Adminpannel/Dashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // If no session OR not an admin, redirect to unauthorized
  if (!session || !session.user?.isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div >
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </div>
  );
}

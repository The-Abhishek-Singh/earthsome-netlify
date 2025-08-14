import AdminLayout from "@/Components/Admin/AdminLayout";
import DiscountsPage from "@/Components/Adminpannel/DiscountsPage";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  // If no session OR not an admin, redirect to unauthorized
  if (!session || !session.user?.isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div>
      <AdminLayout>
        <DiscountsPage />
      </AdminLayout>
    </div>
  );
};

export default page;

import AdminLayout from "@/Components/Admin/AdminLayout";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Bogo from "@/Components/Adminpannel/combos";


const page = async () => {
  const session = await getServerSession(authOptions);

  // If no session OR not an admin, redirect to unauthorized
  if (!session || !session.user?.isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <AdminLayout>
      <Bogo />
    </AdminLayout>
  );
};

export default page;

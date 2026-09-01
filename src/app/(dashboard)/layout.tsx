import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="app-shell min-h-screen bg-[#f6f8f5] text-[#1d2b29]">
      <Sidebar />
      <div className="page-shell flex-1">{children}</div>
    </div>
  );
}

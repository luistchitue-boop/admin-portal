import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const [teacherCount, turmaCount] = await Promise.all([
    prisma.teacher.count(),
    prisma.turma.count(),
  ]);

  return (
    <main className="main-content">
      <header className="topbar mb-6">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.06em] text-[#1d2b29]">Dashboard</h1>
        </div>
        <div className="profile">
          <span className="status-dot" />
          <span>{session?.user?.name ?? "Admin"}</span>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#69756d]">Teachers</p>
          <p className="mt-3 text-4xl font-extrabold tracking-[-0.06em] text-[#1d2b29]">{teacherCount}</p>
        </div>
        <div className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#69756d]">Turmas</p>
          <p className="mt-3 text-4xl font-extrabold tracking-[-0.06em] text-[#1d2b29]">{turmaCount}</p>
        </div>
        <div className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#69756d]">Role</p>
          <p className="mt-3 text-2xl font-extrabold tracking-[-0.05em] text-[#39755d]">ADMIN</p>
        </div>
      </section>
    </main>
  );
}

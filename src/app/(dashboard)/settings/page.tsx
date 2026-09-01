import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateSettings(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || session.user.name || "",
      ...(password ? { passwordHash: await hash(password, 10) } : {}),
    },
  });

  revalidatePath("/settings");
  redirect("/settings");
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="main-content">
      <header className="topbar mb-6">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.06em] text-[#1d2b29]">Settings</h1>
        </div>
      </header>

      <section className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
        <form action={updateSettings} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b] md:col-span-2">
            Name
            <input name="name" defaultValue={session?.user?.name ?? ""} className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b] md:col-span-2">
            New password
            <input name="password" type="password" className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="rounded-xl bg-[#39755d] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white">
              Save changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

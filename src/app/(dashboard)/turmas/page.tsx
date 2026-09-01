import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createTurma(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const capacity = Number(formData.get("capacity") ?? 0);

  if (!name) {
    redirect("/turmas?error=missing-name");
  }

  await prisma.turma.create({
    data: {
      name,
      capacity,
    },
  });

  revalidatePath("/turmas");
  redirect("/turmas");
}

async function assignTeacher(formData: FormData) {
  "use server";

  const turmaId = String(formData.get("turmaId") ?? "").trim();
  const teacherId = String(formData.get("teacherId") ?? "").trim();

  if (!turmaId || !teacherId) {
    redirect("/turmas?error=missing-assignment");
  }

  await prisma.turma.update({
    where: { id: turmaId },
    data: { teacherId },
  });

  revalidatePath("/turmas");
  revalidatePath("/teachers");
  redirect("/turmas");
}

async function removeTeacher(formData: FormData) {
  "use server";

  const turmaId = String(formData.get("turmaId") ?? "").trim();

  if (!turmaId) {
    redirect("/turmas?error=missing-assignment");
  }

  await prisma.turma.update({
    where: { id: turmaId },
    data: { teacherId: null },
  });

  revalidatePath("/turmas");
  revalidatePath("/teachers");
  redirect("/turmas");
}

export default async function TurmasPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const [turmas, teachers] = await Promise.all([
    prisma.turma.findMany({
      include: { teacher: true },
      orderBy: { name: "asc" },
    }),
    prisma.teacher.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="main-content">
      <header className="topbar mb-6">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.06em] text-[#1d2b29]">Turmas</h1>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-extrabold tracking-[-0.04em] text-[#1d2b29]">Create turma</h2>
        <form action={createTurma} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b] md:col-span-2">
            Name
            <input name="name" required className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">
            Capacity
            <input name="capacity" type="number" min={0} defaultValue={0} className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <div className="flex items-end justify-end">
            <button type="submit" className="rounded-xl bg-[#39755d] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white">
              Save turma
            </button>
          </div>
        </form>
        {params?.error === "missing-name" ? <p className="mt-3 text-sm font-medium text-[#8b3a3a]">Turma name is required.</p> : null}
      </section>

      <section className="grid gap-4">
        {turmas.map((turma) => (
          <article key={turma.id} className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-extrabold tracking-[-0.05em] text-[#1d2b29]">{turma.name}</h3>
                <p className="mt-1 text-sm text-[#63746c]">{turma.teacher ? `Assigned to ${turma.teacher.name}` : "No teacher assigned"}</p>
              </div>
              <span className="rounded-full bg-[#e7f1e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#39755d]">
                {turma.capacity} capacity
              </span>
            </div>

            <form action={turma.teacher ? removeTeacher : assignTeacher} className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
              <input type="hidden" name="turmaId" value={turma.id} />
              <label className="grid flex-1 gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">
                Teacher
                <select name="teacherId" defaultValue={turma.teacher?.id ?? ""} className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5 text-sm text-[#1d2b29]">
                  <option value="" disabled>
                    {turma.teacher ? "Choose a different teacher" : "Select a teacher"}
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id} selected={teacher.id === turma.teacher?.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" className="rounded-xl bg-[#39755d] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white">
                {turma.teacher ? "Update" : "Assign"}
              </button>

              {turma.teacher ? (
                <button type="submit" formAction={removeTeacher} className="rounded-xl border border-[#d2ded3] bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#1d2b29]">
                  Remove
                </button>
              ) : null}
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}

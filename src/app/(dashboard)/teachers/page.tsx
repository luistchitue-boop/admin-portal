import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createTeacher(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email || !password) {
    redirect("/teachers?error=missing-fields");
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    redirect("/teachers?error=existing-user");
  }

  const hashed = (await import("bcryptjs")).hashSync(password, 10);

  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash: hashed,
      role: "TEACHER",
      teacher: {
        create: {
          name,
          email: email.toLowerCase(),
          phone,
        },
      },
    },
  });

  revalidatePath("/teachers");
  redirect("/teachers");
}

async function assignTurma(formData: FormData) {
  "use server";

  const teacherId = String(formData.get("teacherId") ?? "").trim();
  const turmaId = String(formData.get("turmaId") ?? "").trim();

  if (!teacherId || !turmaId) {
    redirect("/teachers?error=missing-assignment");
  }

  await prisma.turma.update({
    where: { id: turmaId },
    data: { teacherId },
  });

  revalidatePath("/teachers");
  revalidatePath("/turmas");
  redirect("/teachers");
}

async function removeTurmaAssignment(formData: FormData) {
  "use server";

  const turmaId = String(formData.get("turmaId") ?? "").trim();

  if (!turmaId) {
    redirect("/teachers?error=missing-assignment");
  }

  await prisma.turma.update({
    where: { id: turmaId },
    data: { teacherId: null },
  });

  revalidatePath("/teachers");
  revalidatePath("/turmas");
  redirect("/teachers");
}

export default async function TeachersPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const [teachers, turmas] = await Promise.all([
    prisma.teacher.findMany({
      include: { turmas: true },
      orderBy: { name: "asc" },
    }),
    prisma.turma.findMany({
      include: { teacher: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="main-content">
      <header className="topbar mb-6">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.06em] text-[#1d2b29]">Teachers</h1>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-extrabold tracking-[-0.04em] text-[#1d2b29]">Create teacher</h2>
        <form action={createTeacher} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">
            Name
            <input name="name" required className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">
            Email
            <input name="email" type="email" required className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">
            Password
            <input name="password" type="password" required className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">
            Phone
            <input name="phone" className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5" />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="rounded-xl bg-[#39755d] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white">
              Save teacher
            </button>
          </div>
        </form>

        {params?.error === "existing-user" ? (
          <p className="mt-3 text-sm font-medium text-[#8b3a3a]">A teacher with this email already exists.</p>
        ) : null}
      </section>

      <section className="grid gap-4">
        {teachers.map((teacher) => {
          const availableTurmas = turmas.filter((turma) => !turma.teacher || turma.teacher.id === teacher.id);

          return (
            <article key={teacher.id} className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold tracking-[-0.05em] text-[#1d2b29]">{teacher.name}</h3>
                  <p className="mt-1 text-sm text-[#63746c]">{teacher.email}</p>
                </div>
                <span className="rounded-full bg-[#e7f1e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#39755d]">
                  {teacher.turmas.length} turmas
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {teacher.turmas.length ? (
                  teacher.turmas.map((turma) => (
                    <form key={turma.id} action={removeTurmaAssignment} className="inline-flex items-center gap-2 rounded-full border border-[#d7e3d9] bg-[#f7faf7] px-2.5 py-1 text-xs font-semibold text-[#2d4a3e]">
                      <input type="hidden" name="turmaId" value={turma.id} />
                      <span>{turma.name}</span>
                      <button type="submit" className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8b3a3a]">
                        remove
                      </button>
                    </form>
                  ))
                ) : (
                  <span className="rounded-full border border-dashed border-[#cfdccf] bg-[#f9fbf9] px-2.5 py-1 text-xs font-semibold text-[#65766d]">
                    No turma assigned
                  </span>
                )}
              </div>

              <form action={assignTurma} className="flex flex-col gap-3 md:flex-row md:items-end">
                <input type="hidden" name="teacherId" value={teacher.id} />
                <label className="grid flex-1 gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">
                  Assign turma
                  <select name="turmaId" defaultValue="" className="rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5 text-sm text-[#1d2b29]">
                    <option value="" disabled>
                      Select a turma
                    </option>
                    {turmas
                      .filter((turma) => !turma.teacher || turma.teacher.id === teacher.id)
                      .map((turma) => (
                        <option key={turma.id} value={turma.id}>
                          {turma.name}
                        </option>
                      ))}
                  </select>
                </label>
                <button type="submit" className="rounded-xl bg-[#39755d] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white">
                  Assign
                </button>
              </form>
            </article>
          );
        })}
      </section>
    </main>
  );
}

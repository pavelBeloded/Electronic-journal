import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="font-headline text-3xl font-bold">Админка</h1>
          <p className="mt-2 text-on-surface-variant">
            Управление расписанием, студентами и пропусками
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/schedule"
            className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5 transition hover:border-primary/40"
          >
            <h2 className="text-xl font-semibold">Расписание</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Добавлять, редактировать и удалять пары
            </p>
          </Link>

          <Link
            href="/admin/students"
            className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5 transition hover:border-primary/40"
          >
            <h2 className="text-xl font-semibold">Студенты</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Управление списком группы
            </p>
          </Link>

          <Link
            href="/admin/absences"
            className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5 transition hover:border-primary/40"
          >
            <h2 className="text-xl font-semibold">Пропуски</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Отмечать и смотреть пропуски
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}

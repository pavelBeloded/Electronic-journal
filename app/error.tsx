"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="mb-2 text-xl font-semibold text-on-surface">
          Что-то пошло не так.
        </h2>
        <p className="mb-1 text-sm text-on-surface-variant">
          Попробуйте обновить страницу или повторить действие
        </p>
        <p className="mb-6 text-sm text-on-surface-variant">
          P.S. Если ни перезагрузка ни перезаход не помогли, сайт лег. Можете
          написать мне в ТГ @ddedmorozzz
        </p>

        <button
          onClick={() => reset()}
          className="rounded-md bg-surface-container px-4 py-2 text-sm hover:bg-surface-container-high"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}

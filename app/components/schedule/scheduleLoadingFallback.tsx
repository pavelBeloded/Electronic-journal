export function ScheduleLoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        <p className="text-sm text-on-surface-variant">Будим БД</p>
      </div>
    </div>
  );
}

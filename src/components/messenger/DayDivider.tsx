export function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-3">
      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500 dark:bg-white/[0.06] dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}

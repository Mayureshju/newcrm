export function LoadMoreHistoryButton({
  onClick,
  loading,
  disabled,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-center py-3">
      <button
        type="button"
        onClick={onClick}
        disabled={loading || disabled}
        className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2 text-[12.5px] font-semibold text-white shadow-theme-sm transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-block size-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : null}
        {disabled ? "No more history" : loading ? "Loading…" : "Load More History"}
      </button>
    </div>
  );
}

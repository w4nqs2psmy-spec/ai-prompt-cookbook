'use client';

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
};

/**
 * Shared pagination bar used on the prompts and skills listing pages.
 * Renders nothing when there is only one page.
 */
export default function Pagination({ page, pageCount, onPageChange }: Props) {
  if (pageCount <= 1) return null;

  const btnBase =
    'inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border text-sm font-medium transition-colors duration-150 select-none';
  const btnActive =
    'border-teal bg-white text-teal hover:bg-teal hover:text-white cursor-pointer';
  const btnDisabled =
    'invisible pointer-events-none border-transparent bg-transparent text-transparent';

  return (
    <div className="mt-10 mb-[60px] flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Edellinen sivu"
        className={`${btnBase} ${page <= 1 ? btnDisabled : btnActive}`}
      >
        ← Edellinen
      </button>

      <span className="text-sm text-muted tabular-nums whitespace-nowrap">
        Sivu <span className="font-bold text-foreground">{page}</span> / {pageCount}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Seuraava sivu"
        className={`${btnBase} ${page >= pageCount ? btnDisabled : btnActive}`}
      >
        Seuraava →
      </button>
    </div>
  );
}

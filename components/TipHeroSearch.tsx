'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tip } from '@/lib/types';
import { Profile } from '@/lib/profiles';
import TipCard from '@/components/TipCard';
import SearchBar from '@/components/SearchBar';
import FilterSidebar, { Filters } from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 50;

const EMPTY_FILTERS: Filters = {
  subjects: [],
  levels: [],
  tools: [],
  useCases: [],
};

function applyFilters(tips: Tip[], query: string, filters: Filters): Tip[] {
  const q = query.toLowerCase().trim();
  return tips.filter((t) => {
    if (q) {
      const searchable = [t.title, t.description, t.tip_text, ...t.tags]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (filters.subjects.length > 0 && !filters.subjects.includes(t.subject)) return false;
    if (filters.levels.length > 0 && !filters.levels.includes(t.level)) return false;
    if (filters.tools.length > 0 && !filters.tools.includes(t.tool)) return false;
    if (filters.useCases.length > 0 && !filters.useCases.includes(t.use_case)) return false;
    return true;
  });
}

type Props = {
  initialTips: Tip[];
  profileMap?: Record<string, Profile>;
  /** Pre-fill search from ?search= URL param */
  initialQuery?: string;
  /** Pre-fill page from ?page= URL param */
  initialPage?: number;
};

export default function TipHeroSearch({
  initialTips,
  profileMap = {},
  initialQuery = '',
  initialPage = 1,
}: Props) {
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'liked'>('newest');
  const [page, setPage] = useState(() => Math.max(1, initialPage));

  /* ── Filter-change fade transition ────────────────────────────────── */
  const [gridVisible, setGridVisible] = useState(true);
  const [gridKey, setGridKey] = useState(0);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>();

  /* ── URL sync helper ───────────────────────────────────────────────── */
  const pushPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(window.location.search);
      if (newPage <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(newPage));
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router]
  );

  /* ── Page change ───────────────────────────────────────────────────── */
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      setGridKey((k) => k + 1);
      pushPage(newPage);
      // Smooth-scroll to the top of the results area
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [pushPage]
  );

  /* ── Filter change (resets to page 1) ─────────────────────────────── */
  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      clearTimeout(fadeTimer.current);
      setGridVisible(false);
      fadeTimer.current = setTimeout(() => {
        setFilters(newFilters);
        setPage(1);
        pushPage(1);
        setGridKey((k) => k + 1);
        setGridVisible(true);
      }, 160);
    },
    [pushPage]
  );

  /* ── Query change (resets to page 1) ──────────────────────────────── */
  const handleQueryChange = useCallback(
    (q: string) => {
      setQuery(q);
      setPage(1);
      pushPage(1);
      setGridKey((k) => k + 1);
    },
    [pushPage]
  );

  /* ── Sort change (resets to page 1) ───────────────────────────────── */
  const handleSortChange = useCallback(
    (next: 'newest' | 'popular' | 'liked') => {
      setSortBy(next);
      setPage(1);
      pushPage(1);
      setGridKey((k) => k + 1);
    },
    [pushPage]
  );

  /* ── Filtered + sorted full result set ────────────────────────────── */
  const results = useMemo(() => {
    const filtered = applyFilters(initialTips, query, filters);
    if (sortBy === 'popular') {
      return [...filtered].sort((a, b) => (b.copy_count ?? 0) - (a.copy_count ?? 0));
    }
    if (sortBy === 'liked') {
      return [...filtered].sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0));
    }
    return filtered;
  }, [initialTips, query, filters, sortBy]);

  /* ── Pagination ────────────────────────────────────────────────────── */
  const totalCount = results.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageResults = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── Labels ────────────────────────────────────────────────────────── */
  const activeFilterCount =
    filters.subjects.length + filters.levels.length + filters.tools.length + filters.useCases.length;

  const baseLabel =
    totalCount === 1
      ? '1 tulos'
      : `${totalCount} ${query || activeFilterCount > 0 ? 'tulosta' : 'vinkkiä'}`;

  const resultLabel =
    pageCount > 1 ? `${baseLabel} (sivu ${safePage}/${pageCount})` : baseLabel;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-14 pb-12 px-4 border-b border-warm-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              Vinkit
            </h1>
            <p className="text-base text-muted mb-7 leading-relaxed max-w-lg">
              Käytännön opetusvinkkejä ja neuvoja suomalaisista opettajista. Kokeillut ja testanneet kollegat jakavat parhaansa.
            </p>
            <SearchBar value={query} onChange={handleQueryChange} />
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex gap-10">

          {/* Sidebar – desktop */}
          <aside className="hidden lg:block w-56 shrink-0 pt-1">
            <FilterSidebar filters={filters} onChange={handleFilterChange} />
          </aside>

          {/* Results area */}
          <div className="flex-1 min-w-0" ref={resultsRef}>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-7 gap-3 flex-wrap">
              <p className="text-sm text-muted">
                <span className="font-serif text-foreground text-base font-semibold">{resultLabel}</span>
              </p>

              <div className="flex items-center gap-2">
                {/* Sort toggle */}
                <div className="flex items-center bg-background border border-warm-border rounded-lg p-0.5 text-xs font-medium">
                  <button
                    onClick={() => handleSortChange('newest')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${sortBy === 'newest' ? 'bg-teal text-white' : 'text-muted hover:text-foreground'}`}
                  >
                    Uusimmat
                  </button>
                  <button
                    onClick={() => handleSortChange('popular')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${sortBy === 'popular' ? 'bg-teal text-white' : 'text-muted hover:text-foreground'}`}
                  >
                    Suosituimmat
                  </button>
                  <button
                    onClick={() => handleSortChange('liked')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${sortBy === 'liked' ? 'bg-teal text-white' : 'text-muted hover:text-foreground'}`}
                  >
                    Tykätyimmät
                  </button>
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-warm-border text-sm font-medium text-foreground hover:border-teal transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  Suodata
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-teal text-white rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Card grid */}
            {results.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start transition-opacity duration-200"
                  style={{ opacity: gridVisible ? 1 : 0 }}
                >
                  {pageResults.map((tip, index) => (
                    <div
                      key={`${gridKey}-${tip.id}`}
                      className="animate-card-in"
                      style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
                    >
                      <TipCard
                        tip={tip}
                        profile={tip.submitted_by ? profileMap[tip.submitted_by] : null}
                      />
                    </div>
                  ))}
                </div>

                <Pagination
                  page={safePage}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-serif text-xl text-foreground mb-2">Ei tuloksia</h3>
                <p className="text-muted text-sm mb-7">
                  Kokeile eri hakusanaa tai poista suodattimia.
                </p>
                <button
                  onClick={() => {
                    handleQueryChange('');
                    handleFilterChange(EMPTY_FILTERS);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
                >
                  Tyhjennä haku
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Mobile filter drawer ────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background border-l border-warm-border overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">Suodata</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-muted hover:text-foreground transition-colors"
                aria-label="Sulje"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={handleFilterChange} />
            <div className="mt-8">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
              >
                Näytä {totalCount} tulosta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

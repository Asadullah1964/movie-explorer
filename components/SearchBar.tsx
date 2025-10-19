'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

type SearchBarProps = {
  size?: 'sm' | 'lg';        // 'sm' for navbar, 'lg' for hero
  placeholder?: string;
  className?: string;        // extra classes for layout wrappers
  defaultQuery?: string;     // optional controlled default
  showButton?: boolean;      // force button visibility (defaults by size)
};

export default function SearchBar({
  size = 'sm',
  placeholder = 'Search movies, TV shows, people...',
  className = '',
  defaultQuery = '',
  showButton,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/search?query=${encodeURIComponent(term)}`);
  };

  // Variant tokens
  const isSmall = size === 'sm';
  const withButton = showButton ?? !isSmall;

  const wrapper = [
    'flex items-center w-full',
    isSmall ? 'max-w-md rounded-lg px-3 py-2' : 'max-w-2xl rounded-xl px-4 py-3',
    'border border-token bg-surface/80 shadow-sm backdrop-blur',
    'focus-within:ring-2 focus-within:ring-token',
    className,
  ].join(' ');

  const iconCls = [
    isSmall ? 'h-4 w-4' : 'h-5 w-5',
    'text-muted',
    'mr-2',
  ].join(' ');

  const inputCls = [
    'w-full bg-transparent outline-none text-foreground placeholder:text-muted',
    isSmall ? 'text-sm' : 'text-sm',
    withButton ? (isSmall ? 'pr-2' : 'pr-3') : '',
  ].join(' ');

  const buttonCls = [
    'whitespace-nowrap rounded-lg border border-token bg-surface text-foreground shadow hover:bg-surface/90',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token',
    isSmall ? 'ml-2 px-3 py-1.5 text-xs' : 'ml-3 px-4 py-2 text-sm',
  ].join(' ');

  return (
    <form onSubmit={onSubmit} role="search" className={wrapper}>
      <SearchIcon className={iconCls} aria-hidden />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
        aria-label="Search"
      />
      {withButton ? (
        <button type="submit" className={buttonCls}>
          Search
        </button>
      ) : null}
    </form>
  );
}

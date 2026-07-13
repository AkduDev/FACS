import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps<T> {
  items: T[];
  onFilteredItems: (items: T[]) => void;
  searchFields: (keyof T)[];
  categories?: { value: string; label: string }[];
  categoryField?: keyof T;
  placeholder?: string;
}

export function SearchFilter<T extends Record<string, any>>({
  items,
  onFilteredItems,
  searchFields,
  categories,
  categoryField,
  placeholder = "Buscar...",
}: SearchFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Filter by category
    if (selectedCategory !== 'all' && categoryField) {
      result = result.filter(item => item[categoryField] === selectedCategory);
    }

    return result;
  }, [items, searchTerm, selectedCategory, searchFields, categoryField]);

  // Update parent when filters change
  React.useEffect(() => {
    onFilteredItems(filteredItems);
  }, [filteredItems, onFilteredItems]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const hasFilters = searchTerm || selectedCategory !== 'all';

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-marine-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-marine-900/50 border border-marine-700 rounded-xl text-sm text-white placeholder-marine-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-marine-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category filter */}
      {categories && categoryField && (
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-marine-500 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-marine-900/50 border border-marine-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">Todas</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="px-4 py-2.5 bg-marine-800/50 border border-marine-700 rounded-xl text-sm text-marine-400 hover:text-white hover:bg-marine-700/50 transition-colors"
        >
          Limpiar
        </button>
      )}

      {/* Results count */}
      <div className="flex items-center text-xs text-marine-500">
        {filteredItems.length} de {items.length}
      </div>
    </div>
  );
}

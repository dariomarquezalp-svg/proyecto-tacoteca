import React from "react";

const FilterPanel = ({
  categories,
  category,
  minPrice,
  maxPrice,
  updateFilter,
  clearFilters,
  hasFilters
}) => {

  const categoriesWithAll = [{ slug: "", name: "All Categories" }, ...categories];

  return (
    <div className="space-y-6 w-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-emerald-900 text-[16px]">Categories</h3>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-orange-500 hover:underline font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        
        <div className="space-y-1">
          {categoriesWithAll.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter("category", cat.slug)}
              className={`block w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-medium ${
                category === cat.slug
                  ? "bg-emerald-600 text-white shadow-md scale-[1.02]" // Verde sólido del botón superior
                  : "text-gray-600 hover:bg-amber-50/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-app-green mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
        <input type="number" placeholder="Min" value={minPrice}
        onChange={(e)=> updateFilter('minPrice', e.target.value)} className="w-full px-3 py-2 text-sm bg-white rounded-lg border
        not-focus:border-app-border"/>

        <span className="text-app-text-light">-</span>

        <input type="number" placeholder="Max" value={maxPrice}
        onChange={(e)=> updateFilter('maxPrice', e.target.value)} className="w-full px-3 py-2 text-sm bg-white rounded-lg border
        not-focus:border-app-border"/>
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters}
        className="w-full py-2 text-sm text-app-error hover:bg-red-50 rounded-lg transition-colors font-medium">
            Clear All Filters
        </button>
      )}

    </div>
  );
};

export default FilterPanel;
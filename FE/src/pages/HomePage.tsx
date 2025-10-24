import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Tag, Grid, List, Trash2 } from 'lucide-react';
import { useSkillStore } from '../store/useSkillStore';
import type { ViewMode } from '../types';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const items = useSkillStore((state) => state.items);
  const deleteItems = useSkillStore((state) => state.deleteItems);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categoryFilter = searchParams.get('category');
  const tagFilter = searchParams.get('tag');

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (tagFilter) {
      filtered = filtered.filter((item) => item.tags.includes(tagFilter));
    }

    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'title') {
        compareValue = a.title.localeCompare(b.title);
      } else {
        const aDate = new Date(a.metadata[sortBy]).getTime();
        const bDate = new Date(b.metadata[sortBy]).getTime();
        compareValue = aDate - bDate;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [items, categoryFilter, tagFilter, sortBy, sortOrder]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedItems.map((item) => item.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} item(s)?`)) {
      deleteItems(selectedIds);
      setSelectedIds([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {categoryFilter ? `Category: ${categoryFilter}` : tagFilter ? `Tag: ${tagFilter}` : 'All Skills'}
          </h2>
          <p className="text-gray-600 mt-1">{filteredAndSortedItems.length} skills found</p>
        </div>

        <div className="flex items-center space-x-4">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredAndSortedItems.length > 0 && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedIds.length === filteredAndSortedItems.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-gray-600">Select All</label>
        </div>
      )}

      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No skills found</p>
          <Link to="/new" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Create your first skill
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAndSortedItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-start space-x-4' : ''
              }`}
            >
              <div className={`p-6 flex-1 ${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}>
                {viewMode === 'list' && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, item.id]);
                      } else {
                        setSelectedIds(selectedIds.filter((id) => id !== item.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                )}

                <div className="flex-1">
                  {viewMode === 'grid' && (
                    <div className="mb-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, item.id]);
                          } else {
                            setSelectedIds(selectedIds.filter((id) => id !== item.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <Link to={`/skill/${item.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.content.overview.substring(0, 150)}...
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.metadata.updatedAt)}</span>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {item.category}
                    </span>
                  </div>

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

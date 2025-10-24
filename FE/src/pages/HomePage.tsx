import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tag, Grid, List, Trash2, Clock, FileText } from 'lucide-react';
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
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {categoryFilter ? `Category: ${categoryFilter}` : tagFilter ? `Tag: ${tagFilter}` : 'All Skills'}
          </h2>
          <p className="text-gray-600 mt-2 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>{filteredAndSortedItems.length} skills found</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Delete ({selectedIds.length})</span>
            </button>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all"
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all shadow-sm hover:shadow-md font-medium"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <div className="flex items-center space-x-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredAndSortedItems.length > 0 && (
        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
          <input
            type="checkbox"
            checked={selectedIds.length === filteredAndSortedItems.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">Select All</label>
        </div>
      )}

      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No skills found</p>
            <Link
              to="/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Create your first skill</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAndSortedItems.map((item) => (
            <div
              key={item.id}
              className={`group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-blue-200 hover:shadow-xl transition-all ${
                viewMode === 'list' ? 'flex items-start space-x-4 p-6' : 'p-6'
              }`}
            >
              <div className={`flex-1 ${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}>
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

                  <Link to={`/skill/${item.id}`} className="block group-hover:scale-[1.02] transition-transform">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.content.overview.substring(0, 150)}...
                  </p>

                  <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1.5 bg-blue-50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-blue-700 font-medium">{formatDate(item.metadata.updatedAt)}</span>
                    </div>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-xs font-medium hover:from-purple-200 hover:to-pink-200 transition-all"
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

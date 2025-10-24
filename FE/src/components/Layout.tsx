import { Link, Outlet, useLocation } from 'react-router-dom';
import { Plus, Home, Search, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSkillStore } from '../store/useSkillStore';

export default function Layout() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const items = useSkillStore((state) => state.items);

  const categories = useMemo(() => {
    const cats = items.map((item) => item.category);
    return Array.from(new Set(cats)).sort();
  }, [items]);

  const tags = useMemo(() => {
    const allTags = items.flatMap((item) => item.tags);
    return Array.from(new Set(allTags)).sort();
  }, [items]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Spica Skill Collector
                </h1>
                <p className="text-xs text-gray-500">Organize your knowledge</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <Link
                to="/new"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Skill</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/60 backdrop-blur-sm border-r border-white/20 min-h-[calc(100vh-4rem)] p-6 shadow-sm">
          <nav className="space-y-6">
            <div>
              <Link
                to="/"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/80 hover:shadow-md'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
            </div>

            {categories.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider px-4 flex items-center space-x-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <span>Categories</span>
                </h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/?category=${encodeURIComponent(category)}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-white/80 rounded-xl transition-all hover:shadow-md hover:pl-5"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider px-4 flex items-center space-x-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <Link
                      key={tag}
                      to={`/?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

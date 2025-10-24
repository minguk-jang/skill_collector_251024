import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Edit, Trash2, Calendar, Tag, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSkillStore } from '../store/useSkillStore';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getItemById = useSkillStore((state) => state.getItemById);
  const deleteItem = useSkillStore((state) => state.deleteItem);

  const [activeTab, setActiveTab] = useState<'overview' | 'prerequisites' | 'bestPractices' | 'commonIssues' | 'examples'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const item = id ? getItemById(id) : undefined;

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Skill not found</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteItem(item.id);
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'prerequisites', label: 'Prerequisites' },
    { key: 'bestPractices', label: 'Best Practices' },
    { key: 'commonIssues', label: 'Common Issues' },
    { key: 'examples', label: 'Examples' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to list</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            to={`/edit/${item.id}`}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Updated: {formatDate(item.metadata.updatedAt)}</span>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            {item.category}
          </span>
        </div>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="prose prose-lg max-w-none
                        prose-headings:text-gray-900
                        prose-p:text-gray-700
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-code:bg-gray-100 prose-code:text-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-gray-900 prose-pre:text-gray-100
                        prose-li:text-gray-700">
          <ReactMarkdown>
            {item.content[activeTab]}
          </ReactMarkdown>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{item.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

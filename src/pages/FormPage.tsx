import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useSkillStore } from '../store/useSkillStore';

export default function FormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getItemById = useSkillStore((state) => state.getItemById);
  const addItem = useSkillStore((state) => state.addItem);
  const updateItem = useSkillStore((state) => state.updateItem);

  const isEditMode = !!id;
  const existingItem = id ? getItemById(id) : undefined;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [overview, setOverview] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [bestPractices, setBestPractices] = useState('');
  const [commonIssues, setCommonIssues] = useState('');
  const [examples, setExamples] = useState('');

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setCategory(existingItem.category);
      setTagsInput(existingItem.tags.join(', '));
      setOverview(existingItem.content.overview);
      setPrerequisites(existingItem.content.prerequisites);
      setBestPractices(existingItem.content.bestPractices);
      setCommonIssues(existingItem.content.commonIssues);
      setExamples(existingItem.content.examples);
    }
  }, [existingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const itemData = {
      title,
      category,
      tags,
      content: {
        overview,
        prerequisites,
        bestPractices,
        commonIssues,
        examples,
      },
    };

    if (isEditMode && id) {
      updateItem(id, itemData);
      navigate(`/skill/${id}`);
    } else {
      addItem(itemData);
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to={isEditMode ? `/skill/${id}` : '/'} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Skill' : 'Create New Skill'}
        </h1>

        <div className="w-20"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Metadata */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter skill title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="e.g., Programming, Design, DevOps..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., React, TypeScript, Frontend..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Content</h2>

          <div>
            <label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-2">
              Overview *
            </label>
            <textarea
              id="overview"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              required
              rows={4}
              placeholder="Provide a summary and overview of this skill... (Markdown supported)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Markdown syntax is supported</p>
          </div>

          <div>
            <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites
            </label>
            <textarea
              id="prerequisites"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              rows={4}
              placeholder="List prerequisites and requirements... (Markdown supported)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="bestPractices" className="block text-sm font-medium text-gray-700 mb-2">
              Best Practices
            </label>
            <textarea
              id="bestPractices"
              value={bestPractices}
              onChange={(e) => setBestPractices(e.target.value)}
              rows={6}
              placeholder="Describe best practices and recommended approaches... (Markdown supported)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="commonIssues" className="block text-sm font-medium text-gray-700 mb-2">
              Common Issues
            </label>
            <textarea
              id="commonIssues"
              value={commonIssues}
              onChange={(e) => setCommonIssues(e.target.value)}
              rows={6}
              placeholder="Document common issues and their solutions... (Markdown supported)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="examples" className="block text-sm font-medium text-gray-700 mb-2">
              Examples
            </label>
            <textarea
              id="examples"
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              rows={8}
              placeholder="Provide practical examples and code snippets... (Markdown supported)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Link
            to={isEditMode ? `/skill/${id}` : '/'}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Link>

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'Update' : 'Create'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

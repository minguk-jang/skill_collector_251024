export interface SkillItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    author?: string;
  };
  content: {
    overview: string;
    prerequisites: string;
    bestPractices: string;
    commonIssues: string;
    examples: string;
  };
}

export interface FilterOptions {
  searchQuery: string;
  selectedCategory: string;
  selectedTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export type ViewMode = 'grid' | 'list';

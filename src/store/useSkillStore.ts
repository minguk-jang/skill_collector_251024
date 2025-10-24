import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SkillItem } from '../types';

interface SkillStore {
  items: SkillItem[];
  addItem: (item: Omit<SkillItem, 'id' | 'metadata'>) => void;
  updateItem: (id: string, item: Partial<SkillItem>) => void;
  deleteItem: (id: string) => void;
  deleteItems: (ids: string[]) => void;
  getItemById: (id: string) => SkillItem | undefined;
  getCategories: () => string[];
  getTags: () => string[];
}

export const useSkillStore = create<SkillStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: SkillItem = {
          ...item,
          id: uuidv4(),
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      updateItem: (id, updatedData) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updatedData,
                  metadata: {
                    ...item.metadata,
                    ...updatedData.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      deleteItems: (ids) => {
        set((state) => ({
          items: state.items.filter((item) => !ids.includes(item.id)),
        }));
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },

      getCategories: () => {
        const categories = get().items.map((item) => item.category);
        return Array.from(new Set(categories)).sort();
      },

      getTags: () => {
        const tags = get().items.flatMap((item) => item.tags);
        return Array.from(new Set(tags)).sort();
      },
    }),
    {
      name: 'skill-storage',
    }
  )
);

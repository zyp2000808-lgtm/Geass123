import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkItem {
  id: string;
  projectId: number;
  categoryId: string;
  title: string;
  thumbnail: string;
  type: 'video' | 'album' | 'text';
  content?: string;
  files?: File[];
  count?: number;
  orderIndex: number;
  views: number;
  createdAt: number;
  updatedAt: number;
}

export type SortType = 'custom' | 'createdAt' | 'updatedAt' | 'views' | 'title';
export type SortOrder = 'asc' | 'desc';

export type WorkStatus = 'normal' | 'hidden' | 'deleted';

export interface OperationLog {
  id: string;
  action: 'hide' | 'show' | 'delete' | 'restore' | 'reorder';
  workId: string;
  workTitle: string;
  timestamp: number;
  details?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export interface ProjectData {
  id: number;
  title: string;
  categories: ProjectCategory[];
}

interface AppState {
  activeProjectId: number | null;
  setActiveProjectId: (id: number | null) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  introState: 'loading' | 'dispersing' | 'hero';
  setIntroState: (state: 'loading' | 'dispersing' | 'hero') => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
}

interface WorksState {
  works: WorkItem[];
  hiddenWorks: string[];
  deletedWorks: string[];
  operationLogs: OperationLog[];
  addWork: (work: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'orderIndex' | 'views'>) => { success: boolean; error?: string; work?: WorkItem };
  updateWork: (id: string, updates: Partial<WorkItem>) => { success: boolean; error?: string };
  deleteWork: (id: string) => { success: boolean; error?: string };
  restoreWork: (id: string) => { success: boolean; error?: string };
  permanentlyDeleteWork: (id: string) => { success: boolean; error?: string };
  hideWork: (id: string) => { success: boolean; error?: string };
  showWork: (id: string) => { success: boolean; error?: string };
  batchHideWorks: (ids: string[]) => { success: boolean; error?: string; count: number };
  batchShowWorks: (ids: string[]) => { success: boolean; error?: string; count: number };
  batchDeleteWorks: (ids: string[]) => { success: boolean; error?: string; count: number };
  getWorksByProject: (projectId: number) => WorkItem[];
  getWorksByCategory: (projectId: number, categoryId: string) => WorkItem[];
  getVisibleWorksByCategory: (projectId: number, categoryId: string) => WorkItem[];
  getWorkById: (id: string) => WorkItem | undefined;
  getWorkStatus: (id: string) => WorkStatus;
  validateWorkRelation: (projectId: number, categoryId: string) => { valid: boolean; error?: string };
  changeWorkCategory: (id: string, newProjectId: number, newCategoryId: string) => { success: boolean; error?: string };
  reorderWorks: (projectId: number, categoryId: string, newOrder: string[]) => { success: boolean; error?: string };
  sortWorks: (works: WorkItem[], sortType: SortType, sortOrder: SortOrder) => WorkItem[];
  incrementViews: (id: string) => { success: boolean; error?: string };
  getOperationLogs: (limit?: number) => OperationLog[];
  clearOperationLogs: () => { success: boolean };
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const projectCategories: Record<number, ProjectCategory[]> = {
  1: [
    { id: 'knowledge', name: '知识科普' },
    { id: 'promotion', name: '宣传推广' },
    { id: 'entertainment', name: '娱乐搞笑' },
    { id: 'creative', name: '创意混剪' }
  ],
  2: [
    { id: 'brand', name: '品牌宣传' },
    { id: 'product', name: '产品介绍' },
    { id: 'event', name: '活动记录' },
    { id: 'corporate', name: '企业形象' }
  ],
  3: [
    { id: 'product', name: '产品摄影' },
    { id: 'environment', name: '环境摄影' },
    { id: 'event', name: '活动摄影' },
    { id: 'commercial', name: '商业广告' }
  ],
  4: [
    { id: 'portrait', name: '肖像摄影' },
    { id: 'personal', name: '个人写真' },
    { id: 'artistic', name: '艺术人像' },
    { id: 'family', name: '家庭摄影' }
  ],
  5: [
    { id: 'shortvideo', name: '短视频脚本' },
    { id: 'promotion', name: '宣传视频脚本' },
    { id: 'advertisement', name: '剧情创作' },
    { id: 'story', name: '文章写作' }
  ],
  6: [
    { id: 'copywriting', name: '品牌合作' },
    { id: 'content', name: '项目案例' },
    { id: 'script', name: '行业分类' },
    { id: 'article', name: '成果展示' }
  ]
};

const mockWorks: WorkItem[] = [
  { id: 'mock-1-1', projectId: 1, categoryId: 'knowledge', title: '科学小知识', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-1-2', projectId: 1, categoryId: 'knowledge', title: '历史冷知识', thumbnail: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-1-3', projectId: 1, categoryId: 'promotion', title: '产品宣传', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-1-4', projectId: 1, categoryId: 'promotion', title: '品牌推广', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-1-5', projectId: 1, categoryId: 'entertainment', title: '搞笑日常', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-1-6', projectId: 1, categoryId: 'entertainment', title: '幽默短剧', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-1-7', projectId: 1, categoryId: 'creative', title: '音乐混剪', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-1-8', projectId: 1, categoryId: 'creative', title: '电影剪辑', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-1', projectId: 2, categoryId: 'brand', title: '品牌宣传片', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-2', projectId: 2, categoryId: 'brand', title: '品牌故事', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-3', projectId: 2, categoryId: 'product', title: '产品功能介绍', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-4', projectId: 2, categoryId: 'product', title: '产品使用教程', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-5', projectId: 2, categoryId: 'event', title: '活动花絮', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-6', projectId: 2, categoryId: 'event', title: '活动回顾', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-7', projectId: 2, categoryId: 'corporate', title: '企业形象片', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-2-8', projectId: 2, categoryId: 'corporate', title: '企业文化展示', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-1', projectId: 3, categoryId: 'product', title: '产品静物', thumbnail: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-2', projectId: 3, categoryId: 'product', title: '产品细节', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-3', projectId: 3, categoryId: 'environment', title: '店铺环境', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-4', projectId: 3, categoryId: 'environment', title: '办公空间', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-5', projectId: 3, categoryId: 'event', title: '活动现场', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-6', projectId: 3, categoryId: 'event', title: '活动嘉宾', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-7', projectId: 3, categoryId: 'commercial', title: '广告摄影', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-3-8', projectId: 3, categoryId: 'commercial', title: '品牌形象', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-1', projectId: 4, categoryId: 'portrait', title: '职业肖像', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-2', projectId: 4, categoryId: 'portrait', title: '证件照', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-3', projectId: 4, categoryId: 'personal', title: '个人写真', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-4', projectId: 4, categoryId: 'personal', title: '时尚写真', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-5', projectId: 4, categoryId: 'artistic', title: '艺术人像', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-6', projectId: 4, categoryId: 'artistic', title: '创意人像', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-7', projectId: 4, categoryId: 'family', title: '家庭合影', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-4-8', projectId: 4, categoryId: 'family', title: '亲子摄影', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop', type: 'album', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-1', projectId: 5, categoryId: 'shortvideo', title: '抖音短视频脚本', thumbnail: 'https://images.unsplash.com/photo-1523480717963-028309347203?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-2', projectId: 5, categoryId: 'shortvideo', title: '快手短视频脚本', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-3', projectId: 5, categoryId: 'promotion', title: '企业宣传脚本', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-4', projectId: 5, categoryId: 'promotion', title: '产品宣传脚本', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-5', projectId: 5, categoryId: 'advertisement', title: '微电影脚本', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-6', projectId: 5, categoryId: 'advertisement', title: '剧情短片脚本', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-7', projectId: 5, categoryId: 'story', title: '新闻稿', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-5-8', projectId: 5, categoryId: 'story', title: '专题文章', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop', type: 'text', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-1', projectId: 6, categoryId: 'copywriting', title: '科技品牌合作', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-2', projectId: 6, categoryId: 'copywriting', title: '时尚品牌合作', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-3', projectId: 6, categoryId: 'content', title: '品牌推广项目', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-4', projectId: 6, categoryId: 'content', title: '产品宣传项目', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-5', projectId: 6, categoryId: 'script', title: '科技行业', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-6', projectId: 6, categoryId: 'script', title: '时尚行业', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-7', projectId: 6, categoryId: 'article', title: '合作成果展示', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 0, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
  { id: 'mock-6-8', projectId: 6, categoryId: 'article', title: '客户反馈', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop', type: 'video', orderIndex: 1, views: 0, createdAt: 1700000000000, updatedAt: 1700000000000 },
];

export const getProjectCategories = (projectId: number): ProjectCategory[] => {
  return projectCategories[projectId] || [];
};

export const isValidCategory = (projectId: number, categoryId: string): boolean => {
  const categories = projectCategories[projectId];
  return categories?.some(c => c.id === categoryId) || false;
};

export const getMockWorks = () => mockWorks;

export const useStore = create<AppState>((set) => ({
  activeProjectId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  introState: 'loading',
  setIntroState: (state) => set({ introState: state }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));

const addLog = (logs: OperationLog[], log: Omit<OperationLog, 'id' | 'timestamp'>): OperationLog => {
  const newLog: OperationLog = {
    ...log,
    id: generateId(),
    timestamp: Date.now()
  };
  return { ...logs, logs: [newLog, ...logs.logs].slice(0, 100) };
};

export const useWorksStore = create<WorksState>()(
  persist(
    (set, get) => ({
      works: [],
      hiddenWorks: [],
      deletedWorks: [],
      operationLogs: [],

      addWork: (workData) => {
        try {
          if (!workData.projectId || !workData.categoryId) {
            return { success: false, error: '项目和分类不能为空' };
          }

          if (!isValidCategory(workData.projectId, workData.categoryId)) {
            return { success: false, error: '无效的分类选择' };
          }

          if (!workData.title?.trim()) {
            return { success: false, error: '作品标题不能为空' };
          }

          const categoryWorks = get().works.filter(
            w => w.projectId === workData.projectId && w.categoryId === workData.categoryId
          );

          const newWork: WorkItem = {
            ...workData,
            id: generateId(),
            orderIndex: categoryWorks.length,
            views: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };

          set((state) => ({
            works: [...state.works, newWork]
          }));

          return { success: true, work: newWork };
        } catch (error) {
          console.error('添加作品失败:', error);
          return { success: false, error: '添加作品失败，请重试' };
        }
      },

      updateWork: (id, updates) => {
        try {
          const state = get();
          const workIndex = state.works.findIndex(w => w.id === id);

          if (workIndex === -1) {
            return { success: false, error: '作品不存在' };
          }

          if (updates.projectId || updates.categoryId) {
            const projectId = updates.projectId || state.works[workIndex].projectId;
            const categoryId = updates.categoryId || state.works[workIndex].categoryId;

            if (!isValidCategory(projectId, categoryId)) {
              return { success: false, error: '无效的分类选择' };
            }
          }

          set((state) => ({
            works: state.works.map((work, index) =>
              index === workIndex
                ? { ...work, ...updates, updatedAt: Date.now() }
                : work
            )
          }));

          return { success: true };
        } catch (error) {
          console.error('更新作品失败:', error);
          return { success: false, error: '更新作品失败，请重试' };
        }
      },

      deleteWork: (id) => {
        try {
          const state = get();
          const work = state.works.find(w => w.id === id);

          if (!work) {
            return { success: false, error: '作品不存在' };
          }

          set((state) => ({
            works: state.works.filter(w => w.id !== id),
            deletedWorks: [...state.deletedWorks, id],
            operationLogs: [
              {
                id: generateId(),
                action: 'delete',
                workId: work.id,
                workTitle: work.title,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true };
        } catch (error) {
          console.error('删除作品失败:', error);
          return { success: false, error: '删除作品失败，请重试' };
        }
      },

      restoreWork: (id) => {
        try {
          const state = get();

          set((state) => ({
            works: state.works.filter(w => w.id !== id),
            deletedWorks: state.deletedWorks.filter(wid => wid !== id),
            operationLogs: [
              {
                id: generateId(),
                action: 'restore',
                workId: id,
                workTitle: `作品 ${id}`,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true };
        } catch (error) {
          console.error('恢复作品失败:', error);
          return { success: false, error: '恢复作品失败，请重试' };
        }
      },

      permanentlyDeleteWork: (id) => {
        try {
          const state = get();

          set((state) => ({
            deletedWorks: state.deletedWorks.filter(wid => wid !== id)
          }));

          return { success: true };
        } catch (error) {
          console.error('永久删除作品失败:', error);
          return { success: false, error: '永久删除作品失败，请重试' };
        }
      },

      hideWork: (id) => {
        try {
          const state = get();
          const work = state.works.find(w => w.id === id) || mockWorks.find(w => w.id === id);

          if (!work) {
            return { success: false, error: '作品不存在' };
          }

          if (state.hiddenWorks.includes(id)) {
            return { success: false, error: '作品已在隐藏列表中' };
          }

          set((state) => ({
            hiddenWorks: [...state.hiddenWorks, id],
            operationLogs: [
              {
                id: generateId(),
                action: 'hide',
                workId: work.id,
                workTitle: work.title,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true };
        } catch (error) {
          console.error('隐藏作品失败:', error);
          return { success: false, error: '隐藏作品失败，请重试' };
        }
      },

      showWork: (id) => {
        try {
          const state = get();

          set((state) => ({
            hiddenWorks: state.hiddenWorks.filter(hid => hid !== id),
            operationLogs: [
              {
                id: generateId(),
                action: 'show',
                workId: id,
                workTitle: `作品 ${id}`,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true };
        } catch (error) {
          console.error('显示作品失败:', error);
          return { success: false, error: '显示作品失败，请重试' };
        }
      },

      batchHideWorks: (ids) => {
        try {
          const state = get();
          let count = 0;

          ids.forEach(id => {
            if (!state.hiddenWorks.includes(id)) {
              count++;
            }
          });

          set((state) => ({
            hiddenWorks: [...new Set([...state.hiddenWorks, ...ids])],
            operationLogs: [
              {
                id: generateId(),
                action: 'hide',
                workId: ids.join(','),
                workTitle: `批量隐藏 ${ids.length} 个作品`,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true, count };
        } catch (error) {
          console.error('批量隐藏作品失败:', error);
          return { success: false, error: '批量隐藏作品失败', count: 0 };
        }
      },

      batchShowWorks: (ids) => {
        try {
          set((state) => ({
            hiddenWorks: state.hiddenWorks.filter(hid => !ids.includes(hid)),
            operationLogs: [
              {
                id: generateId(),
                action: 'show',
                workId: ids.join(','),
                workTitle: `批量显示 ${ids.length} 个作品`,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true, count: ids.length };
        } catch (error) {
          console.error('批量显示作品失败:', error);
          return { success: false, error: '批量显示作品失败', count: 0 };
        }
      },

      batchDeleteWorks: (ids) => {
        try {
          set((state) => ({
            works: state.works.filter(w => !ids.includes(w.id)),
            deletedWorks: [...new Set([...state.deletedWorks, ...ids])],
            hiddenWorks: state.hiddenWorks.filter(hid => !ids.includes(hid)),
            operationLogs: [
              {
                id: generateId(),
                action: 'delete',
                workId: ids.join(','),
                workTitle: `批量删除 ${ids.length} 个作品`,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true, count: ids.length };
        } catch (error) {
          console.error('批量删除作品失败:', error);
          return { success: false, error: '批量删除作品失败', count: 0 };
        }
      },

      getWorksByProject: (projectId) => {
        return get().works.filter(w => w.projectId === projectId);
      },

      getWorksByCategory: (projectId, categoryId) => {
        return get().works.filter(
          w => w.projectId === projectId && w.categoryId === categoryId
        );
      },

      getVisibleWorksByCategory: (projectId, categoryId) => {
        const hiddenWorks = get().hiddenWorks;
        const deletedWorks = get().deletedWorks;
        const userWorks = get().works.filter(
          w => w.projectId === projectId && w.categoryId === categoryId &&
               !hiddenWorks.includes(w.id) && !deletedWorks.includes(w.id)
        );
        const mockCategoryWorks = mockWorks.filter(
          w => w.projectId === projectId && w.categoryId === categoryId &&
               !hiddenWorks.includes(w.id) && !deletedWorks.includes(w.id)
        );
        return [...mockCategoryWorks, ...userWorks];
      },

      getWorkById: (id) => {
        return get().works.find(w => w.id === id);
      },

      getWorkStatus: (id) => {
        const state = get();
        if (state.deletedWorks.includes(id)) return 'deleted';
        if (state.hiddenWorks.includes(id)) return 'hidden';
        return 'normal';
      },

      validateWorkRelation: (projectId, categoryId) => {
        if (!projectId) {
          return { valid: false, error: '项目ID不能为空' };
        }

        if (!projectCategories[projectId]) {
          return { valid: false, error: '项目不存在' };
        }

        if (!categoryId) {
          return { valid: false, error: '分类ID不能为空' };
        }

        if (!isValidCategory(projectId, categoryId)) {
          return { valid: false, error: '分类不存在于当前项目中' };
        }

        return { valid: true };
      },

      changeWorkCategory: (id, newProjectId, newCategoryId) => {
        try {
          const state = get();
          const work = state.works.find(w => w.id === id);

          if (!work) {
            return { success: false, error: '作品不存在' };
          }

          const validation = get().validateWorkRelation(newProjectId, newCategoryId);
          if (!validation.valid) {
            return { success: false, error: validation.error };
          }

          const newCategoryWorks = state.works.filter(
            w => w.projectId === newProjectId && w.categoryId === newCategoryId
          );

          set((state) => ({
            works: state.works.map(w =>
              w.id === id
                ? { ...w, projectId: newProjectId, categoryId: newCategoryId, orderIndex: newCategoryWorks.length, updatedAt: Date.now() }
                : w
            )
          }));

          return { success: true };
        } catch (error) {
          console.error('变更作品分类失败:', error);
          return { success: false, error: '变更作品分类失败，请重试' };
        }
      },

      reorderWorks: (projectId, categoryId, newOrder) => {
        try {
          const validation = get().validateWorkRelation(projectId, categoryId);
          if (!validation.valid) {
            return { success: false, error: validation.error };
          }

          set((state) => ({
            works: state.works.map(w => {
              if (w.projectId === projectId && w.categoryId === categoryId) {
                const newIndex = newOrder.indexOf(w.id);
                if (newIndex !== -1) {
                  return { ...w, orderIndex: newIndex, updatedAt: Date.now() };
                }
              }
              return w;
            }),
            operationLogs: [
              {
                id: generateId(),
                action: 'reorder',
                workId: newOrder.join(','),
                workTitle: `重排 ${newOrder.length} 个作品`,
                timestamp: Date.now()
              },
              ...state.operationLogs
            ].slice(0, 100)
          }));

          return { success: true };
        } catch (error) {
          console.error('重排作品失败:', error);
          return { success: false, error: '重排作品失败，请重试' };
        }
      },

      sortWorks: (works, sortType, sortOrder) => {
        const sorted = [...works];

        const compareFn = (a: WorkItem, b: WorkItem) => {
          let comparison = 0;

          switch (sortType) {
            case 'custom':
              comparison = a.orderIndex - b.orderIndex;
              break;
            case 'createdAt':
              comparison = a.createdAt - b.createdAt;
              break;
            case 'updatedAt':
              comparison = a.updatedAt - b.updatedAt;
              break;
            case 'views':
              comparison = a.views - b.views;
              break;
            case 'title':
              comparison = a.title.localeCompare(b.title, 'zh-CN');
              break;
          }

          return sortOrder === 'desc' ? -comparison : comparison;
        };

        return sorted.sort(compareFn);
      },

      incrementViews: (id) => {
        try {
          const state = get();
          const work = state.works.find(w => w.id === id);

          if (!work) {
            return { success: false, error: '作品不存在' };
          }

          set((state) => ({
            works: state.works.map(w =>
              w.id === id ? { ...w, views: w.views + 1 } : w
            )
          }));

          return { success: true };
        } catch (error) {
          console.error('增加浏览量失败:', error);
          return { success: false, error: '增加浏览量失败，请重试' };
        }
      },

      getOperationLogs: (limit) => {
        const logs = get().operationLogs;
        return limit ? logs.slice(0, limit) : logs;
      },

      clearOperationLogs: () => {
        set({ operationLogs: [] });
        return { success: true };
      }
    }),
    {
      name: 'works-storage'
    }
  )
);
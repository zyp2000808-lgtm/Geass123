import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useWorksStore, getProjectCategories, isValidCategory, getMockWorks } from '../store/useStore';

const projectData = [
  {
    id: 1,
    title: '短视频',
    description: '短视频创作服务，包括创意策划、脚本撰写、拍摄和剪辑等全流程服务。',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&h=600&fit=crop'
  },
  {
    id: 2,
    title: '宣传视频',
    description: '企业宣传视频制作，包括品牌宣传片、产品介绍视频、活动记录视频等。',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&h=600&fit=crop'
  },
  {
    id: 3,
    title: '商业摄影',
    description: '商业摄影服务，包括产品摄影、环境摄影、活动摄影等。',
    image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=800&h=600&fit=crop'
  },
  {
    id: 4,
    title: '人像摄影',
    description: '人像摄影服务，包括个人写真、肖像摄影、艺术人像等。',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&h=600&fit=crop'
  },
  {
    id: 5,
    title: '文字编辑',
    description: '文字编辑服务，包括短视频脚本、宣传视频脚本、剧情创作等。',
    image: 'https://images.unsplash.com/photo-1523480717963-028309347203?q=80&w=800&h=600&fit=crop'
  },
  {
    id: 6,
    title: '合作品牌',
    description: '合作品牌展示，包括与各行业品牌的合作案例和项目成果。',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&h=600&fit=crop'
  }
];

const mockVideos: Record<number, Record<string, { id: number; title: string; thumbnail: string }[]>> = {
  1: {
    knowledge: [
      { id: 1, title: '科学小知识', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '历史冷知识', thumbnail: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=400&h=225&fit=crop' }
    ],
    promotion: [
      { id: 1, title: '产品宣传', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '品牌推广', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop' }
    ],
    entertainment: [
      { id: 1, title: '搞笑日常', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '幽默短剧', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop' }
    ],
    creative: [
      { id: 1, title: '音乐混剪', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '电影剪辑', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop' }
    ]
  },
  2: {
    brand: [
      { id: 1, title: '品牌宣传片', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '品牌故事', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop' }
    ],
    product: [
      { id: 1, title: '产品功能介绍', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '产品使用教程', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop' }
    ],
    event: [
      { id: 1, title: '活动花絮', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '活动回顾', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop' }
    ],
    corporate: [
      { id: 1, title: '企业形象片', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '企业文化展示', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop' }
    ]
  },
  3: {
    product: [
      { id: 1, title: '产品静物', thumbnail: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '产品细节', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop' }
    ],
    environment: [
      { id: 1, title: '店铺环境', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '办公空间', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop' }
    ],
    event: [
      { id: 1, title: '活动现场', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '活动嘉宾', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop' }
    ],
    commercial: [
      { id: 1, title: '广告摄影', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '品牌形象', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop' }
    ]
  },
  4: {
    portrait: [
      { id: 1, title: '职业肖像', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '证件照', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop' }
    ],
    personal: [
      { id: 1, title: '个人写真', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '时尚写真', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop' }
    ],
    artistic: [
      { id: 1, title: '艺术人像', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '创意人像', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop' }
    ],
    family: [
      { id: 1, title: '家庭合影', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '亲子摄影', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop' }
    ]
  },
  5: {
    shortvideo: [
      { id: 1, title: '抖音短视频脚本', thumbnail: 'https://images.unsplash.com/photo-1523480717963-028309347203?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '快手短视频脚本', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop' }
    ],
    promotion: [
      { id: 1, title: '企业宣传脚本', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '产品宣传脚本', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop' }
    ],
    advertisement: [
      { id: 1, title: '微电影脚本', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '剧情短片脚本', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop' }
    ],
    story: [
      { id: 1, title: '新闻稿', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '专题文章', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop' }
    ]
  },
  6: {
    copywriting: [
      { id: 1, title: '科技品牌合作', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '时尚品牌合作', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop' }
    ],
    content: [
      { id: 1, title: '品牌推广项目', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '产品宣传项目', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&h=225&fit=crop' }
    ],
    script: [
      { id: 1, title: '科技行业', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '时尚行业', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&h=225&fit=crop' }
    ],
    article: [
      { id: 1, title: '合作成果展示', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=225&fit=crop' },
      { id: 2, title: '客户反馈', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&h=225&fit=crop' }
    ]
  }
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { works, hiddenWorks, getWorksByCategory, incrementViews } = useWorksStore();

  const projectId = parseInt(id || '0');
  const project = projectData.find(p => p.id === projectId);
  const categories = project ? getProjectCategories(projectId) : [];

  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (project) {
      const categoryParam = searchParams.get('category');

      if (categoryParam && isValidCategory(projectId, categoryParam)) {
        setActiveCategory(categoryParam);
      } else if (categories.length > 0) {
        setActiveCategory(categories[0].id);
      }
    }
  }, [project, searchParams, projectId]);

  const isUserWork = (id: string) => !id.startsWith('mock-');

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    if (isUserWork(item.id)) {
      incrementViews(item.id);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen pt-40 pb-fluid-section px-fluid-container relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            项目不存在
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/projects"
              className="inline-block text-zinc-100 text-fluid-body font-semibold hover:text-zinc-300 transition-colors"
            >
              返回作品集
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const getWorksByCurrentCategory = (categoryId: string) => {
    const mockWorks = getMockWorks();
    const mockCategoryWorks = mockWorks.filter(
      w => w.projectId === projectId && w.categoryId === categoryId && !hiddenWorks.includes(w.id)
    );
    const userWorks = getWorksByCategory(projectId, categoryId).filter(
      w => !hiddenWorks.includes(w.id)
    );
    return [...mockCategoryWorks, ...userWorks];
  };

  const totalWorks = categories.reduce((sum, cat) => {
    const mockCount = mockVideos[projectId]?.[cat.id]?.length || 0;
    const userCount = getWorksByCategory(projectId, cat.id).length;
    return sum + mockCount + userCount;
  }, 0);

  return (
    <div className="min-h-screen pt-40 pb-fluid-section px-fluid-container relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            to="/projects"
            className="inline-block text-zinc-400 text-fluid-body mb-4 hover:text-zinc-300 transition-colors"
          >
            ← 返回作品集
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-white/5 p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-fluid-h2 mb-4">{project.title}</h2>
                <p className="text-zinc-300 text-fluid-body leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                  <div className="text-white text-2xl font-bold">{categories.length}</div>
                  <div className="text-zinc-400 text-sm">分类</div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                  <div className="text-white text-2xl font-bold">{totalWorks}</div>
                  <div className="text-zinc-400 text-sm">作品</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-white/5 p-8">
              <h2 className="text-fluid-h3 mb-6">作品分类</h2>
              <div className="flex flex-wrap gap-4 mb-8">
                {categories.map((category) => {
                  const categoryWorksCount = (mockVideos[projectId]?.[category.id]?.length || 0) +
                    getWorksByCategory(projectId, category.id).length;
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-6 py-3 rounded-full text-fluid-body font-medium transition-all ${activeCategory === category.id ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.name} ({categoryWorksCount})
                    </motion.button>
                  );
                })}
              </div>

              <h3 className="text-fluid-h4 mb-4">
                {categories.find(c => c.id === activeCategory)?.name}作品
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {getWorksByCurrentCategory(activeCategory).length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-zinc-400 text-fluid-body">该分类下暂无作品</p>
                    </div>
                  ) : (
                    getWorksByCurrentCategory(activeCategory).map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-800/50 rounded-xl overflow-hidden group hover:bg-zinc-700/50 transition-colors cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        {item.content ? (
                          <div className="p-6">
                            <h4 className="text-white text-lg font-medium mb-3 leading-tight">{item.title}</h4>
                            <div className="text-zinc-300 text-sm leading-relaxed space-y-2 mb-4">
                              <p>{item.content.substring(0, 150)}{item.content.length > 150 ? '...' : ''}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 text-xs">
                                {isUserWork(item.id) ? '用户上传' : '文字作品'}
                              </span>
                              <button className="text-white text-xs hover:text-zinc-300 transition-colors">查看详情</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="aspect-video overflow-hidden relative">
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {item.count && (
                                <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {item.count} 张
                                </div>
                              )}
                              {isUserWork(item.id) && (
                                <div className="absolute top-4 left-4 bg-blue-600/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs">
                                  用户上传
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="text-white text-fluid-body font-medium">{item.title}</h4>
                              {item.count && (
                                <p className="text-zinc-400 text-sm mt-1">相册</p>
                              )}
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 rounded-3xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.content ? (
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                    <button
                      className="text-zinc-400 hover:text-white transition-colors"
                      onClick={() => setSelectedItem(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-zinc-300 text-lg leading-relaxed space-y-4">
                    <p>{selectedItem.content}</p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10">
                    <span className="text-zinc-400 text-sm">
                      {isUserWork(selectedItem.id) ? '用户上传的文字作品' : '文字作品'}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="aspect-video relative">
                    <img
                      src={selectedItem.thumbnail}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                      onClick={() => setSelectedItem(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">{selectedItem.title}</h2>
                    {selectedItem.count && (
                      <p className="text-zinc-400 mb-4">包含 {selectedItem.count} 张照片</p>
                    )}
                    <div className="mt-8 pt-4 border-t border-white/10">
                      <span className="text-zinc-400 text-sm">
                        {selectedItem.count ? '相册' : '作品'}
                        {isUserWork(selectedItem.id) && ' - 用户上传'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
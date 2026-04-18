import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const projects = [
  { id: 1, title: '短视频', category: '点击探索', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&h=600&fit=crop' },
  { id: 2, title: '宣传视频', category: '点击探索', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&h=600&fit=crop' },
  { id: 3, title: '商业摄影', category: '点击探索', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&h=600&fit=crop' },
  { id: 4, title: '人像摄影', category: '点击探索', image: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=800&h=600&fit=crop' },
  { id: 5, title: '文字编辑', category: '点击探索', image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=800&h=600&fit=crop' },
  { id: 6, title: '合作品牌', category: '点击探索', image: 'https://images.unsplash.com/photo-1531366936337-7785a649c73d?q=80&w=800&h=600&fit=crop' },
];

export default function Projects() {
  const navigate = useNavigate();

  // 处理项目卡片点击
  const handleProjectClick = (projectId: number) => {
    // 跳转到项目详情页
    navigate(`/project/${projectId}`);
  };

  // 处理上传功能点击
  const handleUploadClick = (projectId: number) => {
    // 跳转到管理员上传页面
    navigate(`/admin?projectId=${projectId}`);
  };

  return (
    <div className="min-h-screen pt-40 pb-fluid-section px-fluid-container relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          各类型作品集
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-gutter">
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-white/5 p-8 flex flex-col justify-end group overflow-hidden cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <img 
                src={project.image} 
                alt={project.title}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                sizes="(min-width: 768px) 42vw, 92vw"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-[32px] leading-[40px] font-medium drop-shadow-lg">{project.title}</h3>
                <div className="inline-block relative">
                  <p className="text-zinc-300 text-fluid-body drop-shadow-md">
                    {project.category}
                  </p>
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-300 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 统一上传作品界面 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <motion.a
            href="/admin"
            className="relative inline-block text-fluid-h1 font-bold italic tracking-tighter text-zinc-100 drop-shadow-2xl pb-16 mb-[124px] after:content-[''] after:absolute after:bottom-14 after:left-0 after:w-full after:h-1 md:after:h-2 after:bg-zinc-100 after:origin-left after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)] outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            上传作品
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}

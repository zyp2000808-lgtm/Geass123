import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="min-h-screen pt-40 pb-fluid-section px-fluid-container relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          关于。
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-gutter mt-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-fluid-stack"
          >
            <h2 className="text-fluid-h2">个人理念</h2>
            <p className="text-zinc-400 text-fluid-body leading-relaxed">
              我坚信！我喜欢的摄影，热爱的行业，是我温柔的灵魂与这个世界的情感连接
            </p>
            <p className="text-zinc-400 text-fluid-body leading-relaxed">
              通过将扎实的技术积累与工作经验相融合，为客户打造创新、专业且真诚的服务
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 flex flex-col gap-8"
          >
            <h2 className="text-fluid-h3">个人业务</h2>
            <div className="flex flex-wrap gap-4">
              {['IP策划', '视频拍摄', '后期制作', '低空航拍', '内容创作', '直播运营', '肖像写真', '照片直播', '文案编辑'].map((service) => (
                <span key={service} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-full text-fluid-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

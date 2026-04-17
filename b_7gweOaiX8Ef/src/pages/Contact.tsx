import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="min-h-screen pt-40 pb-fluid-section px-fluid-container relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          联系我。
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-gutter mt-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-12"
          >
            <div className="flex flex-col gap-fluid-stack">
              <h2 className="text-fluid-h2">开始合作</h2>
              <p className="text-zinc-400 text-fluid-body leading-relaxed">
                有兴趣一起合作吗？请在下方表单中填写一些关于您项目的信息，我会尽快回复您。
              </p>
            </div>
            
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-fluid-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">邮箱</h3>
                <a href="mailto:zyp2000808@gmail.com" className="text-fluid-h3 font-medium hover:text-zinc-400 relative inline-block pb-2 mb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 md:after:h-2 after:bg-zinc-100 after:origin-left after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)] outline-none hover:scale-105 transition-transform duration-300">zyp2000808@gmail.com</a>
              </div>
              <div>
                <h3 className="text-fluid-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">微信</h3>
                <button 
                  onClick={() => setShowQRCode(true)}
                  className="text-fluid-h3 font-medium hover:text-zinc-400 relative inline-block pb-2 mb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 md:after:h-2 after:bg-zinc-100 after:origin-left after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)] outline-none hover:scale-105 transition-transform duration-300 text-left"
                >
                  微信联系
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.form 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-8 bg-zinc-900/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5"
          >
            <div className="flex flex-col gap-2">
              <label className="block text-fluid-sm font-medium text-zinc-400">姓名</label>
              <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="张三" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-fluid-sm font-medium text-zinc-400">邮箱</label>
              <input type="email" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="zhangsan@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-fluid-sm font-medium text-zinc-400">留言</label>
              <textarea rows={4} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors resize-none" placeholder="告诉我关于您的项目..."></textarea>
            </div>
            <button type="button" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors mt-4">
              发送消息
            </button>
          </motion.form>
        </div>
      </div>

      {/* WeChat QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowQRCode(false)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <h3 className="text-2xl font-bold text-center mb-6">微信二维码</h3>
              
              <div className="bg-white p-6 rounded-2xl">
                <img 
                  src="/二维码.jpg" 
                  alt="微信二维码" 
                  className="w-64 h-64 object-contain mx-auto"
                />
              </div>
              
              <p className="mt-6 text-zinc-400 text-center text-sm">
                扫一扫上面的二维码图案，加我为朋友
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

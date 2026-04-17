import { motion } from 'motion/react';

export default function Wechat() {
  return (
    <div className="min-h-screen pt-40 pb-fluid-section px-fluid-container relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          微信二维码
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            <img 
              src="/二维码.jpg" 
              alt="微信二维码" 
              className="w-80 h-80 object-contain"
            />
          </div>
          <p className="mt-8 text-zinc-300 text-lg text-center">
            扫一扫上面的二维码图案，加我为朋友
          </p>
        </motion.div>
      </div>
    </div>
  );
}

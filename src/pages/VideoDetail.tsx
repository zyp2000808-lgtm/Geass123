import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<{
    id: string;
    title: string;
    description: string;
    videoUrl: string;
  } | null>(null);

  useEffect(() => {
    // 视频数据
    const videos = [
      {
        id: '1',
        title: '个人纪录片',
        description: '2026年个人纪录片，记录了个人职业发展历程和创作过程。',
        videoUrl: '/videos/个人纪录片.mp4'
      },
      {
        id: '2',
        title: '视频快剪',
        description: '2026年个人作品视频快剪，浓缩了创作的精华部分。',
        videoUrl: '/videos/视频快剪.mp4'
      },
      {
        id: '3',
        title: '活动拍摄',
        description: '2026年个人活动拍摄作品，展现了活动的整体氛围和细节。',
        videoUrl: '/videos/活动拍摄.mp4'
      }
    ];

    const foundVideo = videos.find(v => v.id === id);
    if (foundVideo) {
      setVideo(foundVideo);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!video) {
    return <div className="min-h-screen flex items-center justify-center text-zinc-400">加载中...</div>;
  }

  return (
    <section className="min-h-screen py-20 px-fluid-container bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <button 
          onClick={() => navigate('/')}
          className="mb-12 flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </button>

        {/* 视频详情 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">{video.title}</h1>
          <p className="text-zinc-300 text-lg mb-10">{video.description}</p>
          
          {/* 视频播放器 */}
          <div className="w-full mb-8">
            <h3 className="text-zinc-300 mb-4">视频播放</h3>
            <div className="w-full bg-zinc-800 rounded-xl p-4">
              <div className="relative w-full aspect-video">
                <video 
                  src={video.videoUrl} 
                  className="w-full h-full object-contain" 
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <p className="text-zinc-400 text-sm mt-2">视频路径: {video.videoUrl}</p>
            </div>
          </div>

          {/* 视频信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-zinc-700/30 p-6 rounded-xl">
              <h3 className="text-zinc-100 font-semibold mb-2">项目类型</h3>
              <p className="text-zinc-400">{video.title.includes('纪录片') ? '纪录片' : video.title.includes('快剪') ? '快剪' : '活动拍摄'}</p>
            </div>
            <div className="bg-zinc-700/30 p-6 rounded-xl">
              <h3 className="text-zinc-100 font-semibold mb-2">制作时间</h3>
              <p className="text-zinc-400">2026年1月</p>
            </div>
            <div className="bg-zinc-700/30 p-6 rounded-xl">
              <h3 className="text-zinc-100 font-semibold mb-2">制作团队</h3>
              <p className="text-zinc-400">星烁影视工作室</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
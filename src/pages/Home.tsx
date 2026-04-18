import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../store/useStore';

// 导入项目数据
const projectData = [
  { 
    id: 1, 
    title: '短视频', 
    description: '短视频创作服务，包括创意策划、脚本撰写、拍摄和剪辑等全流程服务。',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&h=600&fit=crop',
    categories: [
      { id: 'knowledge', name: '知识科普' },
      { id: 'promotion', name: '宣传推广' },
      { id: 'entertainment', name: '娱乐搞笑' },
      { id: 'creative', name: '创意混剪' }
    ],
    videos: {
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
    }
  },
  { 
    id: 2, 
    title: '宣传视频', 
    description: '企业宣传视频制作，包括品牌宣传片、产品介绍视频、活动记录视频等。',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&h=600&fit=crop',
    categories: [
      { id: 'brand', name: '品牌宣传' },
      { id: 'product', name: '产品介绍' },
      { id: 'event', name: '活动记录' },
      { id: 'corporate', name: '企业形象' }
    ],
    videos: {
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
    }
  },
  { 
    id: 3, 
    title: '商业摄影', 
    description: '商业摄影服务，包括产品摄影、环境摄影、活动摄影等。',
    image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=800&h=600&fit=crop',
    categories: [
      { id: 'product', name: '产品摄影' },
      { id: 'environment', name: '环境摄影' },
      { id: 'event', name: '活动摄影' },
      { id: 'commercial', name: '商业广告' }
    ],
    videos: {
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
    }
  },
  { 
    id: 4, 
    title: '人像摄影', 
    description: '人像摄影服务，包括个人写真、肖像摄影、艺术人像等。',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&h=600&fit=crop',
    categories: [
      { id: 'portrait', name: '肖像摄影' },
      { id: 'personal', name: '个人写真' },
      { id: 'artistic', name: '艺术人像' },
      { id: 'family', name: '家庭摄影' }
    ],
    videos: {
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
    }
  },
  { 
    id: 5, 
    title: '文字编辑', 
    description: '文字编辑服务，包括短视频脚本、宣传视频脚本、剧情创作等。',
    image: 'https://images.unsplash.com/photo-1523480717963-028309347203?q=80&w=800&h=600&fit=crop',
    categories: [
      { id: 'shortvideo', name: '短视频脚本' },
      { id: 'promotion', name: '宣传视频脚本' },
      { id: 'advertisement', name: '剧情创作' },
      { id: 'story', name: '文章写作' }
    ],
    videos: {
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
    }
  },
  { 
    id: 6, 
    title: '合作品牌', 
    description: '合作品牌展示，包括与各行业品牌的合作案例和项目成果。',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&h=600&fit=crop',
    categories: [
      { id: 'copywriting', name: '品牌合作' },
      { id: 'content', name: '项目案例' },
      { id: 'script', name: '行业分类' },
      { id: 'article', name: '成果展示' }
    ],
    videos: {
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
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const setActiveProjectId = useStore((state) => state.setActiveProjectId);
  const navigate = useNavigate();
  const [showQRCode, setShowQRCode] = useState(false);

  // 处理探索项目按钮点击
  const handleExploreProject = (projectId: number) => {
    // 跳转到对应的作品展示界面
    navigate(`/project/${projectId}`);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Track overall scroll progress
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          useStore.getState().setScrollProgress(self.progress);
        }
      });

      if (sectionRef.current && textRef.current) {
        gsap.to(textRef.current, {
          y: 100,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      // Project Triggers
      const projectElements = gsap.utils.toArray('.project-item');
      projectElements.forEach((el: any, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveProjectId(i + 1),
          onEnterBack: () => setActiveProjectId(i + 1),
          onLeave: () => {
            if (i === projectElements.length - 1) setActiveProjectId(null);
          },
          onLeaveBack: () => {
            if (i === 0) setActiveProjectId(null);
          }
        });
      });
    });
    
    return () => ctx.revert();
  }, [setActiveProjectId]);

  return (
    <>
      {/* Hero Section */}
      <section ref={sectionRef} className="relative h-screen flex flex-col justify-end pb-12 px-fluid-container overflow-hidden">
        <div ref={textRef} className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-fluid-gutter">
          
          {/* Left Side: Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col gap-2"
          >
            <h2 className="text-zinc-100 text-[24px] leading-[28px] tracking-tight">联系我</h2>
            <a href="mailto:zyp2000808@gmail.com" className="relative self-start inline-block text-zinc-400 text-fluid-body after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-zinc-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)] outline-none">zyp2000808@gmail.com</a>
          </motion.div>

          {/* Right Side: Intro */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="max-w-3xl md:text-right"
          >
            <p 
              className="text-zinc-100 text-[48px] leading-[52px] font-bold tracking-tight"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              你好,我是左云鹏，一名专注于写作和短视频创作的编导
            </p>
          </motion.div>

        </div>
      </section>

      {/* About Section */}
      <section className="py-fluid-section px-fluid-container">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-fluid-gutter items-center">
          <div className="flex flex-col gap-fluid-stack">
            <h2 
              className="text-3xl md:text-4xl leading-tight"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              如果命运的安排很烂，那就争做人生最好的编导
            </h2>
            <p className="text-zinc-400 text-fluid-body leading-relaxed">
              2021年由海运学院毕业,转行短视频领域。从视频运营做起,到剪辑师 摄影师 短视频编导。期间自考天津师范新闻学，摄影师三级，达芬奇调色师，无人机执照 <br /><br />
              乐观自信,想象力丰富。爱好摄影,写作,具备完整内容创作能力。2025年合伙创业,拥有团队管理与协助经验
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-fluid-section px-fluid-container">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-24 max-w-3xl flex flex-col gap-fluid-stack">
            <h2 className="text-fluid-h2 drop-shadow-lg">个人职业经历与作品集</h2>
            <p className="text-zinc-400 text-fluid-body leading-relaxed">
              按25年到21年时间线排列，列出本人职业经历与从事项目，并附带优秀作品
            </p>
          </div>
          <div className="flex flex-col">
            {
              [
                {
                  id: 5,
                  projectId: 6, // 合作品牌
                  title: '星烁影视工作室',
                  desc: '2025年合伙创业，成立星烁影视工作室。主要业务包括短视频制作、商业摄影、企业宣传片等。负责团队管理、项目策划、内容创作等工作。',
                  images: [
                    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=500&h=500&fit=crop'
                  ]
                },
                {
                  id: 4,
                  projectId: 1, // 短视频
                  title: '短视频编导',
                  desc: '2024年担任短视频编导，负责创意策划、脚本撰写、现场导演等工作。服务客户包括电商品牌、本地商家等，制作的视频在抖音、快手等平台获得大量播放量。以下为本人策划的三个优秀账号',
                  images: [
                    'https://images.unsplash.com/photo-1507371341162-763b5e419408?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1511497584788-76760111969?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?q=80&w=500&h=500&fit=crop'
                  ]
                },
                {
                  id: 3,
                  projectId: 3, // 商业摄影
                  title: '摄像师',
                  desc: '2023年担任摄像师，熟练操作主流摄影机，航拍无人机，稳定器等设备。室内外灯光布置，直播间搭建，设计分镜头脚本，现场高效执行拍摄计划，后期素材规范化整理，以下为本人优秀作品展示',
                  images: [
                    'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=500&h=500&fit=crop'
                  ]
                },
                {
                  id: 2,
                  projectId: 2, // 宣传视频
                  title: '剪辑师',
                  desc: '2022年担任剪辑师，熟练掌握FCPX，Pr Ps剪映等工作软件。操作项目有：知识付费课程,信息流短视频,宣传片,微电影,活动快剪等作品',
                  images: [
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=500&h=500&fit=crop'
                  ]
                },
                {
                  id: 1,
                  projectId: 5, // 文字编辑
                  title: '编辑',
                  desc: '2021年毕业入行，公众号编辑做起，具备6年文字稿撰写能力。熟悉主流媒体平台，图文与视频从选题策划到后期发布的全流程。擅长跟进社会热点，结合同龄人观点和看法创作，提高作品曝光度与传播效果',
                  images: [
                    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=500&h=500&fit=crop',
                    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=500&h=500&fit=crop'
                  ]
                }

              ].map((project) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="group project-item flex flex-col justify-center min-h-[100vh] relative z-10 w-full cursor-pointer"
                  onClick={() => handleExploreProject(project.projectId)}
                >
                  <div className={`w-full md:w-6/12 lg:w-5/12 p-8 bg-zinc-950/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-fluid-stack ${project.id % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="text-zinc-400 font-mono text-fluid-sm tracking-widest">202{project.id} // {project.id === 1 ? '自媒体编辑' : project.id === 2 ? '后期剪辑' : project.id === 3 ? '短视频摄像师' : project.id === 4 ? '短视频编导' : '合伙创业'}</div>
                    <h3 className="text-[32px] leading-[44px] drop-shadow-lg">{project.title}</h3>
                    <p className="text-zinc-300 text-fluid-body drop-shadow-md leading-relaxed">{project.desc}</p>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {project.id === 5 ? (
                        [
                          { id: '1', title: '个人纪录片', projectId: 1, category: 'knowledge' },
                          { id: '2', title: '视频快剪', projectId: 2, category: 'brand' },
                          { id: '3', title: '活动拍摄', projectId: 3, category: 'product' }
                        ].map((item, idx) => (
                          <a 
                            key={idx} 
                            href={`/project/${item.projectId}?category=${item.category}&itemId=1`}
                            className="w-full aspect-square rounded-xl overflow-hidden relative cursor-pointer group block"
                            title={item.title}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img 
                              src={`${idx === 0 ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20video%20production%2C%20documentary%20style%2C%20cinematic%20lighting%2C%20high%20quality&image_size=square' : idx === 1 ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20editing%20workflow%2C%20fast%20cut%20style%2C%20dynamic%20transitions%2C%20professional&image_size=square' : 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=event%20photography%2C%20corporate%20event%2C%20professional%20lighting%2C%20high%20quality&image_size=square'}`} 
                              alt={`${project.title} ${idx + 1}`} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </a>
                        ))
                      ) : (
                        [
                          { idx: 1, category: project.projectId === 1 ? 'knowledge' : project.projectId === 2 ? 'brand' : project.projectId === 3 ? 'product' : project.projectId === 4 ? 'portrait' : project.projectId === 5 ? 'shortvideo' : 'copywriting' },
                          { idx: 2, category: project.projectId === 1 ? 'promotion' : project.projectId === 2 ? 'product' : project.projectId === 3 ? 'environment' : project.projectId === 4 ? 'personal' : project.projectId === 5 ? 'promotion' : 'content' },
                          { idx: 3, category: project.projectId === 1 ? 'entertainment' : project.projectId === 2 ? 'event' : project.projectId === 3 ? 'event' : project.projectId === 4 ? 'artistic' : project.projectId === 5 ? 'advertisement' : 'script' }
                        ].map((item) => {
                          // 短视频编导栏目的特殊处理
                          if (project.title === '短视频编导') {
                            // 为短视频编导栏目的三个元素块添加抖音链接
                            const douyinLinks = [
                              'https://v.douyin.com/4o2i6dOjmwY/',
                              'https://v.douyin.com/OUJJsLre460/',
                              'https://v.douyin.com/9JuuoZuRrIY/'
                            ];
                            const link = douyinLinks[item.idx - 1] || `https://v.douyin.com/4o2i6dOjmwY/`;
                            
                            return (
                              <a 
                                key={item.idx} 
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full aspect-square rounded-xl overflow-hidden relative cursor-pointer group block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img 
                                  src={`${item.idx === 1 ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20background%2C%20white%20chinese%20characters%20%22助你创业%20不负梦想%22%2C%20bold%20text%2C%20professional%20design&image_size=square' : item.idx === 2 ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20circle%20logo%20with%20white%20abstract%20letter%20%22e%22%2C%20clean%20minimal%20design&image_size=square' : 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20traditional%20paper%20cut%20style%2C%20various%20brown%20paper%20pieces%20with%20chinese%20characters%2C%20artistic%20design&image_size=square'}`} 
                                  alt={`作品 ${item.idx}`} 
                                  loading="lazy"
                                  decoding="async"
                                  fetchPriority="low"
                                  sizes="(min-width: 1024px) 12vw, (min-width: 768px) 20vw, 30vw"
                                  referrerPolicy="no-referrer" 
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                              </a>
                            );
                          }
                          
                          // 其他栏目的处理
                          // 获取对应项目
                          const currentProject = projectData.find(p => p.id === project.projectId);
                          // 获取对应分类的作品
                          const categoryVideos = currentProject?.videos[item.category as keyof typeof currentProject.videos] || [];
                          // 获取第一个作品的缩略图
                          const thumbnail = categoryVideos[0]?.thumbnail || `${item.idx === 1 ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20background%2C%20white%20chinese%20characters%20%22助你创业%20不负梦想%22%2C%20bold%20text%2C%20professional%20design&image_size=square' : item.idx === 2 ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20circle%20logo%20with%20white%20abstract%20letter%20%22e%22%2C%20clean%20minimal%20design&image_size=square' : 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20traditional%20paper%20cut%20style%2C%20various%20brown%20paper%20pieces%20with%20chinese%20characters%2C%20artistic%20design&image_size=square'}`;
                          // 获取第一个作品的ID
                          const itemId = categoryVideos[0]?.id || 1;
                          
                          return (
                            <a 
                              key={item.idx} 
                              href={`/project/${project.projectId}?category=${item.category}&itemId=${itemId}`}
                              className="w-full aspect-square rounded-xl overflow-hidden relative cursor-pointer group block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img 
                                src={thumbnail} 
                                alt={`作品 ${item.idx}`} 
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                                sizes="(min-width: 1024px) 12vw, (min-width: 768px) 20vw, 30vw"
                                referrerPolicy="no-referrer" 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                              />
                            </a>
                          );
                        })
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleExploreProject(project.projectId); }} className="relative self-start inline-block text-fluid-body font-semibold text-zinc-100 tracking-wide uppercase after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-zinc-100 after:origin-left after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)] outline-none mt-2 cursor-pointer">
                      探索项目
                    </button>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center z-10 overflow-hidden">
        <motion.button
          onClick={() => setShowQRCode(true)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block text-fluid-h1 font-bold italic tracking-tighter text-zinc-100 drop-shadow-2xl pb-16 mb-[124px] after:content-[''] after:absolute after:bottom-14 after:left-0 after:w-full after:h-1 md:after:h-2 after:bg-zinc-100 after:origin-left after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)] outline-none cursor-pointer"
        >
          微信联系
        </motion.button>
      </section>

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
    </>
  );
}

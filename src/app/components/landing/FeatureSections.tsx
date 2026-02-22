"use client";

import { motion } from 'framer-motion';
import { 
  FiZap, FiShield, 
  FiCpu, FiDatabase, FiLayout, FiLock, FiFileText, FiTarget, FiPenTool, FiPrinter,
  FiTrendingUp, FiAlertCircle, FiCheckSquare, FiLayers, FiCommand, FiBarChart2, FiClock,
  FiX, FiCheck, FiAward, FiBriefcase, FiUsers, FiRefreshCw, FiCode, FiMousePointer
} from 'react-icons/fi';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';

// 简化的磁性卡片组件
const SimpleMagneticCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export function FeatureSections() {
  const { t } = useTranslation();
  
  const aiCarouselImages = [
    '/magic-resume-chat.png',
    '/magic-resume-select.png',
    '/magic-resume-optimize.png',
    '/magic-resume-analysis.png',
  ];
  const [currentAiImageIndex, setCurrentAiImageIndex] = useState(0);
  const [aiPaused] = useState(false);

  const exportImportImages = [
    '/magic-resume-export.png',
    '/magic-resume-import.png',
  ];
  const [currentExportImageIndex, setCurrentExportImageIndex] = useState(0);
  const [exportPaused] = useState(false);

  useEffect(() => {
    const aiInterval = setInterval(() => {
      if (!aiPaused) {
        setCurrentAiImageIndex((prevIndex) => (prevIndex + 1) % aiCarouselImages.length);
      }
    }, 8000);

    const exportInterval = setInterval(() => {
      if (!exportPaused) {
        setCurrentExportImageIndex((prevIndex) => (prevIndex + 1) % exportImportImages.length);
      }
    }, 8000);

    return () => {
      clearInterval(aiInterval);
      clearInterval(exportInterval);
    };
  }, [aiCarouselImages.length, exportImportImages.length, aiPaused, exportPaused]);

  return (
    <>
      {/* AI 功能部分 */}
      <section className="relative py-24 bg-neutral-900/30 overflow-hidden">
        {/* 简化背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/3 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full">
                <FiZap className="inline w-4 h-4 mr-2" />
                <span suppressHydrationWarning>{t("landing.tags.aiEnhancement")}</span>
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent" suppressHydrationWarning>
              {t("landing.features.main.title")}
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed" suppressHydrationWarning>
              {t("landing.features.main.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
            {/* 卡片1: AI 智能 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <SimpleMagneticCard className="h-full">
                 <div className="h-full bg-neutral-900/90 border border-neutral-700/50 rounded-2xl p-8 flex flex-col items-start text-left hover:border-blue-400/30 transition-colors">
                    <div className="p-3 bg-blue-500/10 rounded-xl mb-6">
                      <FiZap className="w-8 h-8 text-blue-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-white" suppressHydrationWarning>{t("landing.features.ai.title")}</h3>
                    
                    <p className="text-neutral-400 leading-relaxed mb-6 flex-grow" suppressHydrationWarning>
                      {t("landing.features.ai.description")}
                    </p>

                    <div className="w-full mt-auto">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-neutral-800 border border-neutral-700/50">
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
                         <Image
                            src={aiCarouselImages[currentAiImageIndex]}
                            alt="AI Feature"
                            width={400}
                            height={225}
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                            suppressHydrationWarning
                         />
                      </div>
                    </div>
                 </div>
              </SimpleMagneticCard>
            </motion.div>

             {/* 卡片2: 隐私安全 */}
             <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full"
            >
              <SimpleMagneticCard className="h-full">
                 <div className="h-full bg-neutral-900/90 border border-neutral-700/50 rounded-2xl p-8 flex flex-col items-start text-left hover:border-indigo-400/30 transition-colors">
                    <div className="p-3 bg-indigo-500/10 rounded-xl mb-6">
                      <FiShield className="w-8 h-8 text-indigo-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-white" suppressHydrationWarning>{t("landing.tags.dataSecurityGuarantee")}</h3>
                    
                    <p className="text-neutral-400 leading-relaxed mb-6 flex-grow" suppressHydrationWarning>
                      {t("landing.features.privacy.description")}
                    </p>

                     <div className="w-full mt-auto">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-neutral-800 border border-neutral-700/50">
                         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                         <Image
                            src={exportImportImages[currentExportImageIndex]}
                            alt="Privacy Feature"
                            width={400}
                            height={225}
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                         />
                      </div>
                    </div>
                 </div>
              </SimpleMagneticCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 研究背景部分 - 新增 */}
      <section className="relative py-24 bg-neutral-900/50 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" suppressHydrationWarning>
              {t("landing.features.background.title")}
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto" suppressHydrationWarning>
              {t("landing.features.background.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                key: "market", 
                icon: FiTrendingUp, 
                color: "red",
                delay: 0
              },
              { 
                key: "pain", 
                icon: FiAlertCircle, 
                color: "orange",
                delay: 0.2
              },
              { 
                key: "solution", 
                icon: FiCheckSquare, 
                color: "green",
                delay: 0.4
              }
            ].map((item) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                className="bg-neutral-800/30 border border-neutral-700/50 rounded-xl p-8 hover:bg-neutral-800/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full bg-${item.color}-500/10 flex items-center justify-center mb-6`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white" suppressHydrationWarning>
                  {t(`landing.features.background.cards.${item.key}.title`)}
                </h3>
                <p className="text-neutral-400 leading-relaxed" suppressHydrationWarning>
                  {t(`landing.features.background.cards.${item.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 优势对比部分 - 新增 */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" suppressHydrationWarning>
              {t("landing.features.comparison.title")}
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto" suppressHydrationWarning>
              {t("landing.features.comparison.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 传统方式 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-neutral-900/50 border border-red-900/30 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <FiX className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-300" suppressHydrationWarning>{t("landing.features.comparison.traditional.title")}</h3>
              </div>
              <ul className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-400">
                    <FiX className="w-5 h-5 text-red-500/50 mt-0.5 flex-shrink-0" />
                    <span suppressHydrationWarning>{t(`landing.features.comparison.traditional.points.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 本系统 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 bg-blue-500 text-white text-xs font-bold rounded-bl-xl">
                RECOMMENDED
              </div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-500/20">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FiCheck className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white" suppressHydrationWarning>{t("landing.features.comparison.ourSystem.title")}</h3>
              </div>
              <ul className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-blue-100">
                    <FiCheck className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span suppressHydrationWarning>{t(`landing.features.comparison.ourSystem.points.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 技术架构部分 */}
      <section className="relative py-24 bg-neutral-900/30 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" suppressHydrationWarning>
              {t("landing.features.architecture.title")}
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto" suppressHydrationWarning>
              {t("landing.features.architecture.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FiCpu,
                title: t("landing.features.architecture.llm.title"),
                desc: t("landing.features.architecture.llm.description"),
                color: "blue"
              },
              {
                icon: FiDatabase,
                title: t("landing.features.architecture.rag.title"),
                desc: t("landing.features.architecture.rag.description"),
                color: "indigo"
              },
              {
                icon: FiLayout,
                title: t("landing.features.architecture.frontend.title"),
                desc: t("landing.features.architecture.frontend.description"),
                color: "cyan"
              },
              {
                icon: FiLock,
                title: t("landing.features.architecture.security.title"),
                desc: t("landing.features.architecture.security.description"),
                color: "emerald"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg bg-${item.color}-500/10 flex items-center justify-center mb-4 text-${item.color}-400`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white" suppressHydrationWarning>{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed" suppressHydrationWarning>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 创新点部分 - 新增 */}
      <section className="relative py-24 bg-black overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" suppressHydrationWarning>
              {t("landing.features.innovations.title")}
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto" suppressHydrationWarning>
              {t("landing.features.innovations.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { key: "tech", icon: FiCode, color: "blue" },
              { key: "mode", icon: FiAward, color: "purple" },
              { key: "interact", icon: FiMousePointer, color: "cyan" }
            ].map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-600/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative bg-neutral-900 border border-neutral-800 p-8 rounded-2xl h-full hover:border-neutral-700 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center mb-6 text-${item.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4" suppressHydrationWarning>
                    {t(`landing.features.innovations.${item.key}.title`)}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed" suppressHydrationWarning>
                    {t(`landing.features.innovations.${item.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
         </div>
      </section>

      {/* 系统流程部分 */}
      <section className="relative py-24 bg-neutral-900/30 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white" suppressHydrationWarning>
              {t("landing.features.workflow.title")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* 连接线 */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 -z-10" />

            {[
              { icon: FiFileText, key: "1" },
              { icon: FiTarget, key: "2" },
              { icon: FiPenTool, key: "3" },
              { icon: FiPrinter, key: "4" }
            ].map((step, index) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center text-center bg-neutral-900 p-6 rounded-xl border border-neutral-800 relative z-10"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-blue-500/30 flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
                  <step.icon size={28} className="text-blue-400" />
                </div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-blue-200 text-xs px-2 py-0.5 rounded-full border border-blue-700">
                  Step {index + 1}
                </div>
                <h3 className="text-lg font-bold mb-3 text-white" suppressHydrationWarning>
                  {t(`landing.features.workflow.steps.${step.key}.title`)}
                </h3>
                <p className="text-neutral-400 text-sm" suppressHydrationWarning>
                  {t(`landing.features.workflow.steps.${step.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心算法与指标部分 - 新增 */}
      <section className="relative py-24 bg-neutral-900/50 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" suppressHydrationWarning>
              {t("landing.features.algorithm.title")}
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto" suppressHydrationWarning>
              {t("landing.features.algorithm.subtitle")}
            </p>
          </motion.div>

          {/* 算法卡片 */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="bg-gradient-to-br from-blue-900/20 to-neutral-900 border border-blue-500/20 rounded-2xl p-8"
             >
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                   <FiLayers size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-white" suppressHydrationWarning>{t("landing.features.algorithm.rag.title")}</h3>
               </div>
               <p className="text-neutral-400 leading-relaxed mb-6" suppressHydrationWarning>
                 {t("landing.features.algorithm.rag.desc")}
               </p>
               {/* 模拟RAG流程可视化 */}
               <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-blue-500"
                   initial={{ width: "0%" }}
                   whileInView={{ width: "100%" }}
                   transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                 />
               </div>
               <div className="flex justify-between text-xs text-neutral-500 mt-2">
                 <span>Query</span>
                 <span>Vector DB</span>
                 <span>Context</span>
                 <span>LLM</span>
               </div>
             </motion.div>

             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="bg-gradient-to-br from-indigo-900/20 to-neutral-900 border border-indigo-500/20 rounded-2xl p-8"
             >
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                   <FiCommand size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-white" suppressHydrationWarning>{t("landing.features.algorithm.prompt.title")}</h3>
               </div>
               <p className="text-neutral-400 leading-relaxed mb-6" suppressHydrationWarning>
                 {t("landing.features.algorithm.prompt.desc")}
               </p>
               <div className="flex gap-2">
                 {[1,2,3,4].map(i => (
                   <motion.div 
                     key={i}
                     className="h-2 flex-1 bg-indigo-500/30 rounded-full"
                     initial={{ opacity: 0.3 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ duration: 0.5, delay: i * 0.2, repeat: Infinity, repeatType: "reverse" }}
                   />
                 ))}
               </div>
               <div className="flex justify-between text-xs text-neutral-500 mt-2">
                 <span>Analysis</span>
                 <span>Reasoning</span>
                 <span>Drafting</span>
                 <span>Polishing</span>
               </div>
             </motion.div>
          </div>

          {/* 典型应用场景 - 新增 */}
          <div className="mb-20">
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
             >
               <h3 className="text-2xl font-bold text-white mb-2" suppressHydrationWarning>{t("landing.features.scenarios.title")}</h3>
               <p className="text-neutral-400" suppressHydrationWarning>{t("landing.features.scenarios.subtitle")}</p>
             </motion.div>
             
             <div className="grid md:grid-cols-3 gap-6">
                {[
                  { key: "fresh", icon: FiUsers, color: "green" },
                  { key: "change", icon: FiRefreshCw, color: "orange" },
                  { key: "expert", icon: FiBriefcase, color: "purple" }
                ].map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-neutral-800/30 border border-neutral-700 p-6 rounded-xl hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full bg-${item.color}-500/10 flex items-center justify-center mb-4 text-${item.color}-400`}>
                      <item.icon size={20} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2" suppressHydrationWarning>
                      {t(`landing.features.scenarios.${item.key}.title`)}
                    </h4>
                    <p className="text-sm text-neutral-400" suppressHydrationWarning>
                      {t(`landing.features.scenarios.${item.key}.desc`)}
                    </p>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* 性能指标 */}
          <div className="border-t border-neutral-800 pt-16">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-2" suppressHydrationWarning>{t("landing.features.metrics.title")}</h3>
              <p className="text-neutral-400" suppressHydrationWarning>{t("landing.features.metrics.subtitle")}</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
              {[
                { label: t("landing.features.metrics.speed"), value: "10x", icon: FiClock, color: "text-blue-400" },
                { label: t("landing.features.metrics.accuracy"), value: "95%", icon: FiTarget, color: "text-indigo-400" },
                { label: t("landing.features.metrics.satisfaction"), value: "A+", icon: FiBarChart2, color: "text-green-400" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="p-4"
                >
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-neutral-400 flex items-center justify-center gap-2" suppressHydrationWarning>
                    <stat.icon size={16} />
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 联系我们部分 */}
      <section className="relative py-32 text-center bg-neutral-900/30 overflow-hidden">
        {/* 简化背景效果 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 via-transparent to-indigo-900/5" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 
              className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent"
              suppressHydrationWarning
            >
              {t("landing.contact.title")}
            </h2>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed" suppressHydrationWarning>
              {t("landing.contact.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

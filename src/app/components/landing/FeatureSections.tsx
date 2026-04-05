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
      <section className="relative overflow-hidden bg-white/70 py-24">
        {/* 简化背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-sky-500/5 blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-500/5 blur-2xl" />
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
              <div className="rounded-full border border-sky-200 bg-gradient-to-r from-sky-100 to-indigo-100 px-4 py-2 text-sky-700 backdrop-blur-sm">
                <FiZap className="inline w-4 h-4 mr-2" />
                <span suppressHydrationWarning>{t("landing.tags.aiEnhancement")}</span>
              </div>
            </motion.div>
            
            <h2 className="mb-6 bg-gradient-to-r from-slate-900 to-sky-700 bg-clip-text text-4xl font-bold text-transparent md:text-6xl" suppressHydrationWarning>
              {t("landing.features.main.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-600" suppressHydrationWarning>
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
                 <div className="flex h-full flex-col items-start rounded-2xl border border-slate-200 bg-white/95 p-8 text-left shadow-sm transition-colors hover:border-sky-300/50">
                    <div className="mb-6 rounded-xl bg-sky-100 p-3">
                      <FiZap className="h-8 w-8 text-sky-600" />
                    </div>
                    
                    <h3 className="mb-4 text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.features.ai.title")}</h3>
                    
                    <p className="mb-6 flex-grow leading-relaxed text-slate-600" suppressHydrationWarning>
                      {t("landing.features.ai.description")}
                    </p>

                    <div className="w-full mt-auto">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                         <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-indigo-500/5" />
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
                 <div className="flex h-full flex-col items-start rounded-2xl border border-slate-200 bg-white/95 p-8 text-left shadow-sm transition-colors hover:border-indigo-300/50">
                    <div className="mb-6 rounded-xl bg-indigo-100 p-3">
                      <FiShield className="h-8 w-8 text-indigo-600" />
                    </div>
                    
                    <h3 className="mb-4 text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.tags.dataSecurityGuarantee")}</h3>
                    
                    <p className="mb-6 flex-grow leading-relaxed text-slate-600" suppressHydrationWarning>
                      {t("landing.features.privacy.description")}
                    </p>

                     <div className="w-full mt-auto">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
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
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl" suppressHydrationWarning>
              {t("landing.features.background.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600" suppressHydrationWarning>
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
                className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-colors hover:bg-slate-50"
              >
                <div className={`w-12 h-12 rounded-full bg-${item.color}-500/10 flex items-center justify-center mb-6`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                </div>
                <h3 className="mb-4 text-xl font-bold text-slate-900" suppressHydrationWarning>
                  {t(`landing.features.background.cards.${item.key}.title`)}
                </h3>
                <p className="leading-relaxed text-slate-600" suppressHydrationWarning>
                  {t(`landing.features.background.cards.${item.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 优势对比部分 - 新增 */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl" suppressHydrationWarning>
              {t("landing.features.comparison.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600" suppressHydrationWarning>
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
              className="rounded-2xl border border-red-200 bg-red-50/60 p-8"
            >
              <div className="mb-6 flex items-center gap-3 border-b border-red-200 pb-4">
                <div className="rounded-lg bg-red-100 p-2">
                  <FiX className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.features.comparison.traditional.title")}</h3>
              </div>
              <ul className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
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
              className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50 p-8"
            >
              <div className="absolute top-0 right-0 p-3 bg-blue-500 text-white text-xs font-bold rounded-bl-xl">
                RECOMMENDED
              </div>
              <div className="mb-6 flex items-center gap-3 border-b border-sky-200 pb-4">
                <div className="rounded-lg bg-sky-100 p-2">
                  <FiCheck className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.features.comparison.ourSystem.title")}</h3>
              </div>
              <ul className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <FiCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-600" />
                    <span suppressHydrationWarning>{t(`landing.features.comparison.ourSystem.points.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 技术架构部分 */}
      <section className="relative overflow-hidden bg-white/70 py-24">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl" suppressHydrationWarning>
              {t("landing.features.architecture.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600" suppressHydrationWarning>
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
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-sky-300/50"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-${item.color}-500/10 text-${item.color}-500`}>
                  <item.icon size={24} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900" suppressHydrationWarning>{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600" suppressHydrationWarning>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 创新点部分 - 新增 */}
      <section className="relative overflow-hidden bg-slate-50 py-24">
         <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl" suppressHydrationWarning>
              {t("landing.features.innovations.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600" suppressHydrationWarning>
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
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-${item.color}-300/30 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors hover:border-slate-300">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-${item.color}-500/10 text-${item.color}-500 transition-transform duration-300 group-hover:scale-110`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-slate-900" suppressHydrationWarning>
                    {t(`landing.features.innovations.${item.key}.title`)}
                  </h3>
                  <p className="leading-relaxed text-slate-600" suppressHydrationWarning>
                    {t(`landing.features.innovations.${item.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
         </div>
      </section>

      {/* 系统流程部分 */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-12 text-3xl font-bold text-slate-900 md:text-5xl" suppressHydrationWarning>
              {t("landing.features.workflow.title")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* 连接线 */}
            <div className="absolute top-12 left-0 -z-10 hidden h-0.5 w-full bg-gradient-to-r from-sky-200 via-indigo-200 to-sky-200 md:block" />

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
                className="relative z-10 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-200 bg-white shadow-lg shadow-sky-100/60">
                  <step.icon size={28} className="text-sky-600" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-sky-200 bg-white px-2 py-0.5 text-xs text-sky-700">
                  Step {index + 1}
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900" suppressHydrationWarning>
                  {t(`landing.features.workflow.steps.${step.key}.title`)}
                </h3>
                <p className="text-sm text-slate-600" suppressHydrationWarning>
                  {t(`landing.features.workflow.steps.${step.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心算法与指标部分 - 新增 */}
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl" suppressHydrationWarning>
              {t("landing.features.algorithm.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600" suppressHydrationWarning>
              {t("landing.features.algorithm.subtitle")}
            </p>
          </motion.div>

          {/* 算法卡片 */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-8"
             >
               <div className="flex items-center gap-4 mb-6">
                 <div className="rounded-lg bg-sky-100 p-3 text-sky-600">
                   <FiLayers size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.features.algorithm.rag.title")}</h3>
               </div>
               <p className="mb-6 leading-relaxed text-slate-600" suppressHydrationWarning>
                 {t("landing.features.algorithm.rag.desc")}
               </p>
               {/* 模拟RAG流程可视化 */}
               <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                 <motion.div 
                   className="h-full bg-blue-500"
                   initial={{ width: "0%" }}
                   whileInView={{ width: "100%" }}
                   transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                 />
               </div>
               <div className="mt-2 flex justify-between text-xs text-slate-500">
                 <span>Query</span>
                 <span>Vector DB</span>
                 <span>Context</span>
                 <span>LLM</span>
               </div>
             </motion.div>

             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-8"
             >
               <div className="flex items-center gap-4 mb-6">
                 <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                   <FiCommand size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.features.algorithm.prompt.title")}</h3>
               </div>
               <p className="mb-6 leading-relaxed text-slate-600" suppressHydrationWarning>
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
               <div className="mt-2 flex justify-between text-xs text-slate-500">
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
               <h3 className="mb-2 text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.features.scenarios.title")}</h3>
               <p className="text-slate-600" suppressHydrationWarning>{t("landing.features.scenarios.subtitle")}</p>
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
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-${item.color}-500/10 text-${item.color}-500`}>
                      <item.icon size={20} />
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-slate-900" suppressHydrationWarning>
                      {t(`landing.features.scenarios.${item.key}.title`)}
                    </h4>
                    <p className="text-sm text-slate-600" suppressHydrationWarning>
                      {t(`landing.features.scenarios.${item.key}.desc`)}
                    </p>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* 性能指标 */}
          <div className="border-t border-slate-200 pt-16">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="mb-2 text-2xl font-bold text-slate-900" suppressHydrationWarning>{t("landing.features.metrics.title")}</h3>
              <p className="text-slate-600" suppressHydrationWarning>{t("landing.features.metrics.subtitle")}</p>
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
                  <div className="flex items-center justify-center gap-2 text-slate-600" suppressHydrationWarning>
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
      <section className="relative overflow-hidden bg-white py-32 text-center">
        {/* 简化背景效果 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-sky-100/50 via-transparent to-indigo-100/40" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-sky-300/20 blur-2xl" />
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
              className="mb-8 bg-gradient-to-r from-slate-900 via-sky-700 to-indigo-700 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
              suppressHydrationWarning
            >
              {t("landing.contact.title")}
            </h2>
            
            <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-600" suppressHydrationWarning>
              {t("landing.contact.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

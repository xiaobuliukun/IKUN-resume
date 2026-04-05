"use client";

import Link from 'next/link';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiStar, FiZap, FiShield } from 'react-icons/fi';
import Image from 'next/image';
import { useTranslation, Trans } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';

// 简化的浮动图标组件
const SimpleFloatingIcon = ({ icon: Icon, delay = 0 }: { 
  icon: React.ComponentType<{ size?: number }>; 
  delay?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.2, 0.4, 0.2],
      y: [0, -15, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute hidden text-sky-500/20 md:block"
  >
    <Icon size={20} />
  </motion.div>
);

// 确定性随机数生成器
const seededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2**32;
    return state / 2**32;
  };
};

// 修复水合错误的粒子效果组件
const SimpleParticleField = () => {
  const [isClient, setIsClient] = useState(false);
  
  // 使用固定种子生成确定性随机数
  const particleElements = useMemo(() => {
    if (!isClient) return [];
    
    const random = seededRandom(12345); // 固定种子
    
    return Array.from({ length: 50 }, (_, i) => {
      const initialX = random() * 1200;
      const initialY = random() * 800;
      const endY = random() * 800 - 200;
      const endX = random() * 1200 + 50;
      const duration = random() * 5 + 5;
      const delay = random() * 4;
      
      return (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-sky-500/40"
          initial={{ 
            opacity: 0,
            x: initialX,
            y: initialY,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [initialY, endY],
            x: [initialX, endX],
            scale: [0, 1, 0]
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      );
    });
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 服务端渲染时显示空容器 */}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleElements}
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-unused-vars */
const fadeIn = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  },
};

const slideIn = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      duration: 1, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    } 
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */

export function HeroSection() {
  const { t } = useTranslation();
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  
  return (
    <motion.section 
      className="relative container mx-auto flex min-h-screen items-center justify-center overflow-hidden px-6 py-10 md:py-20"
      style={{ y, opacity }}
    >
      {/* 粒子背景 */}
      <SimpleParticleField />
      
      {/* 浮动图标 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          <SimpleFloatingIcon icon={FiStar} delay={0} />
          <SimpleFloatingIcon icon={FiZap} delay={1} />
          <SimpleFloatingIcon icon={FiShield} delay={2} />
        </div>
      </div>

      {/* 主要内容网格 */}
      <div className="flex flex-col items-center text-center max-w-5xl mx-auto relative z-10 gap-16">
        {/* 文字内容 */}
        <motion.div 
          initial="hidden" 
          animate={controls} 
          className="space-y-8 flex flex-col items-center"
        >
          {/* 标签 */}
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <div className="mb-4 rounded-full border border-sky-200 bg-gradient-to-r from-sky-100 to-indigo-100 px-4 py-2 text-sm text-sky-700 shadow-sm backdrop-blur-sm">
              <span className="flex items-center gap-2" suppressHydrationWarning>
                <FiZap className="w-4 h-4" />
                {t("landing.hero.tag")}
              </span>
            </div>
          </motion.div>

          {/* 主标题 */}
          <motion.div 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight mb-6 max-w-5xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-700 bg-clip-text pb-2 leading-tight text-transparent" suppressHydrationWarning>
               <Trans i18nKey="landing.hero.title" components={{ 1: <br /> }} />
            </h1>
          </motion.div>

          {/* 副标题 */}
          <motion.p 
            className="mb-8 max-w-2xl text-xl leading-relaxed text-slate-600 md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            suppressHydrationWarning
          >
            {t("landing.hero.subtitle")}
          </motion.p>

          {/* 按钮组 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/dashboard">
              <motion.div
                className="group relative overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex items-center gap-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-sky-200/70">
                  <span suppressHydrationWarning>{t("landing.hero.getStarted")}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* 特性标签 */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[t("landing.tags.aiSmart"), t("landing.tags.freeForever"), t("landing.tags.dataSecurity")].map((feature, index) => (
              <motion.span
                key={index}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm text-slate-600 shadow-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, borderColor: "#0ea5e9" }}
                suppressHydrationWarning
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* 下方图片区域 */}
        <motion.div 
          initial="hidden" 
          animate={controls} 
          className="relative w-full max-w-4xl"
        >
          {/* 简化的背景光晕 */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-100/70 to-indigo-100/60" />
          
          {/* 主图片容器 */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-lg transition-all duration-300 hover:border-sky-300/70 hover:shadow-xl">
            {/* 图片 */}
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={'/magic-resume-preview.png'}
                alt={t("landing.features.ai.alt")}
                width={1200}
                height={800}
                className="w-full h-auto group-hover:brightness-110 transition-all duration-300"
                priority
                quality={85}
                suppressHydrationWarning
              />
              
              {/* 轻量级悬浮叠加 */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-sky-100/0 to-sky-100/0 transition-all duration-300 group-hover:from-sky-100/50 group-hover:to-transparent" />
            </div>
          </div>

          {/* 简化的装饰元素 */}
          <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-sky-300 opacity-60 blur-xl" />
          <div className="absolute -bottom-4 -left-4 h-6 w-6 rounded-full bg-indigo-300 opacity-60 blur-xl" />
        </motion.div>
      </div>

      {/* 底部渐变 */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-100/80 to-transparent" />
    </motion.section>
  );
}

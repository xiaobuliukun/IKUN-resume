"use client";

import Link from 'next/link';
// import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'border-b border-slate-200/80 bg-white/85 shadow-xl shadow-sky-100/60 backdrop-blur-xl' 
          : 'border-b border-slate-200/40 bg-white/65 backdrop-blur-md'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo 区域 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="relative flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* 
                <Image 
                  src="/magic-resume-logo.png" 
                  alt="magic-resume-logo" 
                  width={160} 
                  height={40} 
                  className="transition-all duration-300 group-hover:brightness-110" 
                />
                */}
                <div className="text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Resume
                </div>
                {/* Logo 光晕效果 */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-300/30 to-indigo-300/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            </Link>
          </motion.div>

          {/* 导航区域 */}
          <nav className="flex items-center gap-2 md:gap-4">
            {/* 移除 GitHub 星标按钮 */}
          </nav>
        </div>
      </div>

      {/* 底部装饰线 */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      />
    </motion.header>
  );
}

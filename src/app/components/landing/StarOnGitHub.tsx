'use client'

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarOnGitHub() {
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/github-stars')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.stars === 'number') {
                    setStars(data.stars);
                }
            })
            .catch(err => {
                console.error('Failed to fetch stars:', err);
            });
    }, []);
    return (
        <a href="https://github.com/LinMoQC/Magic-Resume" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 md:flex">
            <FaStar className="text-yellow-400" />
            <span>Star on GitHub</span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-900">
                {stars !== null ? new Intl.NumberFormat().format(stars) : '...'}
            </span>
        </a>
    );
}

import React from 'react';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../userStore/userData';

const testimonials = [
    { id: 1, name: "Sarah L.", role: "CTO @ TechFlow", text: "The variety of AI agents here is mind-blowing. We automated our entire support flow in days." },
    { id: 2, name: "James K.", role: "Indie Maker", text: "Finally, a marketplace that curates top-tier tools. The integration process was seamless." },
    { id: 3, name: "Elena R.", role: "Product Lead", text: "The quality of vendors on AI-MALL is unmatched. Highly recommended for scaling startups." },
    { id: 4, name: "Michael T.", role: "DevOps Engineer", text: "Found the perfect monitoring agent. Saved us weeks of custom development time." },
    { id: 5, name: "Priya M.", role: "Founder", text: "A game-changer for non-technical founders. Plug and play AI at its finest." }
];

const Testimonials = () => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';

    return (
        <section className="py-20 overflow-hidden relative">
            <div className="container relative z-10 mb-10 text-center mx-auto">
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Loved by Innovators</h2>
            </div>

            {/* Gradient Fade Masks */}
            <div className={`absolute top-0 left-0 w-32 h-full bg-gradient-to-r ${isDark ? 'from-[#020617]' : 'from-[#f8fafc]'} to-transparent z-20 pointer-events-none`}></div>
            <div className={`absolute top-0 right-0 w-32 h-full bg-gradient-to-l ${isDark ? 'from-[#020617]' : 'from-[#f8fafc]'} to-transparent z-20 pointer-events-none`}></div>

            {/* Marquee Container */}
            <div className="flex w-full overflow-hidden mask-image-gradient">
                <div className="flex animate-marquee gap-8 py-4 pl-4">
                    {/* Render twice for seamless loop */}
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className={`min-w-[280px] sm:min-w-[350px] p-6 sm:p-8 backdrop-blur-xl border rounded-[24px] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] transition-colors ${isDark
                                ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                                : 'bg-white/40 border-white/60 hover:bg-white/60'
                            }`}>
                            <p className={`italic mb-6 leading-relaxed ${isDark ? 'text-white/80' : 'text-gray-600'}`}>"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600'
                                    }`}>
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>{t.name}</h4>
                                    <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

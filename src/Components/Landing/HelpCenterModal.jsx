import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Loader2, CheckCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../../services/apiService';
import { useLanguage } from '../../context/LanguageContext';

const HelpCenterModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('KNOWLEDGE');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [supportCategory, setSupportCategory] = useState('General Inquiry');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Dropdown State from Sidebar
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const issueOptionsMap = {
        "General Inquiry": "inquiryGeneral",
        "Payment Issue": "inquiryPayment",
        "Refund Request": "inquiryRefund",
        "Technical Support": "inquiryTechnical",
        "Account Access": "inquiryAccount",
        "Other": "inquiryOther"
    };
    const issueOptions = Object.keys(issueOptionsMap);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setSubmitted(false);
            setMessage('');
            // Set default category localized
            setSupportCategory('General Inquiry');
            setIsDropdownOpen(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleTicketSubmit = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            await apiService.submitReport({
                type: supportCategory,
                description: message,
                priority: 'medium'
            });
            setSubmitted(true);
            setMessage('');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Support submission error:", err);
            alert("Failed to submit support ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const faqs = [
        {
            question: t('faq1_q') || "What exactly is AI-Mall?",
            answer: t('faq1_a') || "AI-Mall is India's first dedicated marketplace for AI agents, offering a wide range of specialized AI solutions for various needs."
        },
        {
            question: t('faq2_q') || "How does the subscription plan work?",
            answer: t('faq2_a') || "We offer flexible subscription tiers. You can choose a monthly or annual plan that best fits your usage requirements."
        },
        {
            question: t('faq3_q') || "Which AI models power these agents?",
            answer: t('faq3_a') || "Our agents are powered by state-of-the-art LLMs including GPT-4, Claude 3, and specialized open-source models optimized for specific tasks."
        },
        {
            question: t('faq4_q') || "Is my data secure on the server?",
            answer: t('faq4_a') || "Yes, we prioritize data security. All data is encrypted at rest and in transit, following industry-standard security protocols."
        },
        {
            question: t('faq5_q') || "How many agents can I use right now?",
            answer: t('faq5_a') || "Depending on your plan, you can access multiple agents simultaneously. Check your plan details for specific limits."
        },
        {
            question: t('faq6_q') || "Can I create my own agent?",
            answer: t('faq6_a') || "Yes! Our Vendor Dashboard allows developers to create, test, and monetize their own custom AI agents on the marketplace."
        },
        {
            question: t('faq7_q') || "Why should I use this over other AI solutions?",
            answer: t('faq7_a') || "AI-Mall offers a curated, secure, and integrated environment where you can find specialized agents for specific workflows, saving you time on prompt engineering."
        },
        {
            question: t('faq8_q') || "Is it mobile-friendly?",
            answer: t('faq8_a') || "Absolutely. The AI-Mall interface is fully responsive and optimized for a seamless experience on smartphones and tablets."
        },
        {
            question: t('faq9_q') || "How do I get started?",
            answer: t('faq9_a') || "Simply sign up for an account, browse the marketplace, pick an agent, and start chatting immediately!"
        }
    ];

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[20px] md:rounded-[32px] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[85vh] animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 pb-2 gap-4 md:gap-0">
                    <div className="flex w-full md:w-auto bg-white/50 rounded-full p-1 border border-white/40">
                        <button
                            onClick={() => setActiveTab('KNOWLEDGE')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'KNOWLEDGE'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('knowledge') || 'KNOWLEDGE'}
                        </button>
                        <button
                            onClick={() => setActiveTab('SUPPORT')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'SUPPORT'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('supportHeading') || 'SUPPORT'}
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:static p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors border border-white/40 text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2 custom-scrollbar relative z-10">

                    {activeTab === 'KNOWLEDGE' && (
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t('generalGuidelines')}</h3>
                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="overflow-hidden rounded-2xl md:rounded-3xl bg-white/40 border border-white/40 hover:bg-white/50 transition-colors">
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                                        >
                                            <span className="font-semibold text-gray-800 text-xs md:text-sm pr-4">{faq.question}</span>
                                            {expandedFaq === index ? (
                                                <ChevronUp size={16} className="text-gray-500" />
                                            ) : (
                                                <ChevronDown size={16} className="text-gray-500" />
                                            )}
                                        </button>
                                        <div
                                            className={`px-4 md:px-5 text-xs md:text-sm text-gray-600 leading-relaxed transition-all duration-300 ease-in-out ${expandedFaq === index ? 'max-h-60 pb-4 md:pb-5 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            {faq.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'SUPPORT' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 relative">
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-64 flex flex-col items-center justify-center text-center space-y-6"
                                >
                                    <div className="relative">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                                        >
                                            <CheckCircle2 size={40} />
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute -inset-4 bg-green-500/20 rounded-full -z-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                            {t('messageSent') || 'Message Sent Successfully!'}
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-500 font-medium">
                                            {t('supportTeamContact') || 'Our team will review your request and get back to you shortly.'}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-2 block">
                                            {t('issueCategory') || 'ISSUE CATEGORY'}
                                        </label>

                                        {/* Custom Dropdown UI to match Sidebar */}
                                        <div className="relative group/input">
                                            <button
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className="w-full px-6 py-4 rounded-[24px] bg-white/60 border-2 border-purple-100 text-sm md:text-base text-gray-800 font-medium border focus:border-purple-300 transition-all shadow-glass-sm flex justify-between items-center"
                                            >
                                                <span className="font-medium text-left">{t(issueOptionsMap[supportCategory]) || supportCategory}</span>
                                                <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} text-purple-400`} />
                                            </button>

                                            <AnimatePresence>
                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-[24px] border bg-white border-purple-100 shadow-xl max-h-60 overflow-y-auto custom-scrollbar"
                                                    >
                                                        {issueOptions.map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => {
                                                                    setSupportCategory(option);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                className={`w-full px-6 py-3 text-left font-medium text-sm transition-colors ${supportCategory === option
                                                                    ? 'bg-purple-50 text-purple-600'
                                                                    : 'text-gray-600 hover:bg-purple-50/50'
                                                                    }`}
                                                            >
                                                                {t(issueOptionsMap[option]) || option}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-2">
                                            {t('details') || 'DETAILS'}
                                        </label>
                                        <div className="relative group/input">
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder={t('specifyRequest') || "helo admin"}
                                                className="w-full p-6 h-40 md:h-48 rounded-[32px] bg-white/60 border-2 border-purple-100 text-sm md:text-base text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all resize-none shadow-glass-sm"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <button
                                            onClick={handleTicketSubmit}
                                            disabled={loading || !message.trim()}
                                            className="w-full py-5 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(139,92,246,0.5)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    {t('sendMessage') || 'SEND MESSAGE'}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center pt-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] opacity-60">
                                            {t('directSupport') || 'DIRECT SUPPORT'}:
                                            <a href="mailto:admin@uwo24.com" className="text-[#8B5CF6] hover:underline ml-2 normal-case font-bold">admin@uwo24.com</a>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Footer Dismiss */}
                {!isOpen ? null : (
                    <div className="p-6 text-center">
                        <button
                            onClick={onClose}
                            className="px-12 py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 border border-gray-200 shadow-sm"
                        >
                            {t('dismiss') || 'DISMISS'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpCenterModal;

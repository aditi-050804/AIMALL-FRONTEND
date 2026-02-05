import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, Clock, ShieldAlert, BadgeInfo, BadgeCheck, Sparkles, X, Activity, Zap, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { apis } from '../types';
import { getUserData, notificationState } from '../userStore/userData';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';
import { useLanguage } from '../context/LanguageContext';

const Notifications = () => {
    const navigate = useNavigate();
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const { t, language } = useLanguage();
    const [notifications, setNotifications] = useRecoilState(notificationState);
    const [loading, setLoading] = useState(true);
    const [appIcons, setAppIcons] = useState({});
    const token = getUserData()?.token;

    const titleMap = {
        'CRITICAL ALERT': 'criticalAlert',
        'SYSTEM MAINTENANCE': 'systemMaintenance',
        'SERVICES RESTORED': 'servicesRestored',
        'SYSTEM RESTORED': 'systemRestored',
        'SUBSCRIPTION EXPIRING SOON': 'subExpiringSoon',
        'NEW SUPPORT REPLY': 'newSupportReply',
        'NEW APP ARRIVAL': 'newAppArrival'
    };

    const getTranslatedTitle = (title) => {
        if (!title) return '';
        const upper = title.trim().toUpperCase();
        const key = titleMap[upper] || title;
        return t(key);
    };

    const messageMap = {
        'Global Kill-Switch Activated. All AI services are momentarily suspended.': 'killSwitchMsg',
        'The system is currently in maintenance mode.': 'maintenanceMsg',
        'Global Kill-Switch Deactivated. All AI services are now active.': 'killSwitchDeactivatedMsg',
        'Maintenance is complete. System is fully operational.': 'maintenanceCompleteMsg'
    };

    const translateMessage = (msg) => {
        if (!msg) return '';
        if (messageMap[msg]) return t(messageMap[msg]);

        // Dynamic: Admin Response to Report
        if (msg.includes("Admin has responded to your report")) {
            const parts = msg.split(":");
            const prefix = parts[0];
            const content = parts.slice(1).join(":").trim();
            const idMatch = prefix.match(/\(ID: ([^)]+)\)/);
            const reportId = idMatch ? idMatch[1] : '';
            const baseTitle = t('adminRespondedReport') || "Admin has responded to your report";
            return reportId ? `${baseTitle} (ID: ${reportId}): ${content}` : `${baseTitle}: ${content}`;
        }

        // Dynamic: Subscription Expiring
        if (msg.startsWith("Reminder: Your subscription for '")) {
            const match = msg.match(/'([^']+)'/);
            const agentName = match ? match[1] : '...';
            return t('subExpiringMsg').replace('{agentName}', agentName);
        }

        // Dynamic: Support Reply
        if (msg.startsWith("A new reply has been added to your ticket: ")) {
            const subject = msg.replace("A new reply has been added to your ticket: ", "");
            return t('supportReplyMsg').replace('{subject}', subject);
        }

        // Dynamic: New App Arrival
        if (msg.startsWith("Exciting News: '")) {
            const match = msg.match(/'([^']+)'/);
            const agentName = match ? match[1] : '...';
            return t('newAppArrivalMsg').replace('{agentName}', agentName);
        }

        return msg;
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(apis.notifications, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    timeout: 5000
                });
                setNotifications(res.data);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchNotifications();
        }
    }, [token]);

    useEffect(() => {
        const fetchAppIcons = async () => {
            const uniqueTargetIds = [...new Set(notifications.filter(n => n.targetId).map(n => n.targetId))];
            const icons = {};

            for (const targetId of uniqueTargetIds) {
                try {
                    const res = await axios.get(`${apis.agents}/${targetId}`);
                    if (res.data && res.data.avatar) {
                        icons[targetId] = res.data.avatar;
                    }
                } catch (err) {
                    console.error(`Failed to fetch icon for ${targetId}:`, err);
                }
            }
            setAppIcons(icons);
        };

        if (notifications.length > 0) {
            fetchAppIcons();
        }
    }, [notifications]);

    const markAsRead = async (id) => {
        try {
            // Optimistically update the UI immediately
            setNotifications(prevNotifications =>
                prevNotifications.map(n => n._id === id ? { ...n, isRead: true } : n)
            );

            // Then sync with backend
            await axios.put(`${apis.notifications}/${id}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error marking as read:', err);
            // If backend fails, revert the change
            setNotifications(prevNotifications =>
                prevNotifications.map(n => n._id === id ? { ...n, isRead: false } : n)
            );
        }
    };

    const deleteNotification = async (id) => {
        try {
            // Optimistically remove from UI immediately
            const previousNotifications = notifications;
            setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== id));

            // Then sync with backend
            await axios.delete(`${apis.notifications}/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error deleting notification:', err);
            // If backend fails, restore the notifications
            setNotifications(notifications);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'ALERT': return <ShieldAlert className="w-7 h-7 text-red-500" />;
            case 'SUCCESS': return <BadgeCheck className="w-7 h-7 text-emerald-500" />;
            case 'WELCOME': return <Sparkles className="w-7 h-7 text-[#8b5cf6]" />;
            default: return <BadgeInfo className="w-7 h-7 text-[#8b5cf6]" />;
        }
    };

    const welcomeNotification = {
        _id: 'default-welcome',
        title: 'Welcome to AI MALL',
        message: 'Your intelligent command center. Real-time updates, agent alerts, and system notifications will appear here instantly.',
        type: 'WELCOME',
        createdAt: new Date().toISOString(),
        isRead: true,
        targetId: 'welcome'
    };

    const filteredNotifications = notifications
        .filter(notif => {
            // Support replies should always be shown
            if (notif.title === 'New Support Reply') return true;

            const isVendorNotification =
                notif.message.includes('Congratulations!') ||
                notif.message.includes('approved') ||
                notif.message.includes('rejected') ||
                notif.message.includes('good work');
            return !isVendorNotification;
        });

    const allNotifications = [welcomeNotification, ...filteredNotifications];

    return (
        <div className={`p-4 md:p-8 lg:p-12 h-screen overflow-y-auto no-scrollbar bg-transparent relative transition-colors duration-700 ${isDark ? 'text-[#E6E9F2]' : 'text-slate-900'}`}>
            {/* Decorative Background Glows */}
            <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700`}>
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a2235] via-[#242f49] to-[#1a2235]' : 'bg-transparent'} transition-all duration-700`}></div>
            </div>
            <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] ${isDark ? 'bg-purple-900/20' : 'bg-[#8b5cf6]/5'} rounded-full blur-[120px] pointer-events-none animate-pulse`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto relative z-10"
            >
                <div className="mb-10 md:mb-16">
                    <h1 className={`text-3xl md:text-5xl lg:text-7xl font-black ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'} tracking-tighter mb-4 md:mb-6 leading-none transition-colors`}>{t('notificationsHeading')}</h1>
                    <p className={`${isDark ? 'text-[#cbd5e1]' : 'text-gray-500'} font-bold text-lg md:text-xl tracking-tight max-w-2xl opacity-70 transition-colors`}>{t('notificationsDesc')}</p>
                </div>

                <div className="grid gap-6 md:gap-8">
                    <AnimatePresence mode='popLayout'>
                        {/* Empty state removed as we now have a default welcome message */}

                        {allNotifications.map((notif, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                key={notif._id}
                                className={`${isDark ? 'bg-[#242f49] shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'bg-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)]'} backdrop-blur-3xl p-3 md:p-10 rounded-xl md:rounded-[56px] border transition-all flex flex-row items-start md:items-start gap-3 md:gap-10 hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.15)] group relative overflow-hidden ${!notif.isRead ? (isDark ? 'border-[#8B5CF6]/40 shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'border-[#8b5cf6]/40 ring-1 ring-[#8b5cf6]/10') : (isDark ? 'border-white/5' : 'border-white/60')
                                    }`}
                            >
                                {!notif.isRead && (
                                    <div className="absolute top-0 left-0 w-2 h-full bg-[#8B5CF6]" />
                                )}

                                {notif.title === 'New Support Reply' && (
                                    <div
                                        className="absolute inset-0 cursor-pointer z-[1] hover:bg-black/5 transition-colors"
                                        onClick={() => navigate('/dashboard/admin-support')}
                                    />
                                )}

                                <div className={`w-10 h-10 md:w-20 md:h-20 shrink-0 rounded-xl md:rounded-[32px] flex items-center justify-center shadow-2xl border ${isDark ? 'border-white/5' : 'border-white'} transition-all duration-700 group-hover:rotate-6 ${notif.type === 'ALERT' ? (isDark ? 'bg-red-900/20' : 'bg-red-50') :
                                    notif.type === 'SUCCESS' ? (isDark ? 'bg-emerald-900/20' : 'bg-emerald-50') : (isDark ? 'bg-[#1a2235]' : 'bg-white')
                                    }`}>
                                    {appIcons[notif.targetId] ? (
                                        <img src={appIcons[notif.targetId]} alt="App" className="w-8 h-8 md:w-12 md:h-12 rounded-[12px] md:rounded-[20px] object-cover shadow-sm" />
                                    ) : (
                                        <div className="scale-75 md:scale-100">{getIcon(notif.type)}</div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-3 md:space-y-4 w-full">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-1.5 md:gap-4">
                                        <div className="space-y-0.5 text-left">
                                            <div className="flex items-center gap-3 justify-start">
                                                <h3 className={`text-sm md:text-2xl font-black tracking-tight uppercase transition-colors ${!notif.isRead ? (isDark ? 'text-[#E6E9F2]' : 'text-gray-900') : (isDark ? 'text-[#C7CBEA]' : 'text-gray-500')}`}>
                                                    {getTranslatedTitle(notif.title)}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 md:gap-3 ${isDark ? 'bg-[#131c31]' : 'bg-white/60'} px-2 md:px-5 py-1 md:py-2 rounded-lg md:rounded-2xl border ${isDark ? 'border-white/5' : 'border-white/80'} shadow-sm transition-colors`}>
                                            <Clock className="w-3 h-3 md:w-4 md:h-4 text-[#8B5CF6]" />
                                            <span className={`text-[10px] md:text-[10px] font-black ${isDark ? 'text-[#E6E9F2]' : 'text-gray-900'} uppercase tracking-widest transition-colors`}>
                                                {new Date(notif.createdAt).toLocaleDateString(language, { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={`text-xs md:text-lg font-bold leading-relaxed max-w-3xl text-left transition-colors ${!notif.isRead ? (isDark ? 'text-[#E6E9F2]' : 'text-gray-600') : (isDark ? 'text-[#C7CBEA]' : 'text-gray-400')}`}>
                                        {translateMessage(notif.message)}
                                    </p>

                                    <div className="flex flex-row items-center gap-3 md:gap-8 pt-1 md:pt-4 relative z-10 w-full justify-start">
                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markAsRead(notif._id)}
                                                className={`w-fit md:w-auto text-[9px] md:text-[11px] font-black text-[#8B5CF6] flex items-center justify-center gap-2 md:gap-3 uppercase tracking-[0.2em] hover:bg-[#8B5CF6] hover:text-white px-2 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-2xl transition-all shadow-sm border ${isDark ? 'border-[#8B5CF6]/20 bg-[#131c31]' : 'border-[#8b5cf6]/20 bg-white'}`}
                                            >
                                                <BadgeCheck className="w-3.5 h-3.5" /> {t('markAsRead')}
                                            </button>
                                        )}

                                        {notif._id !== 'default-welcome' && (
                                            <button
                                                onClick={() => deleteNotification(notif._id)}
                                                className={`w-fit md:w-auto text-[9px] md:text-[11px] font-black !text-red-500 hover:!text-red-600 flex items-center justify-center gap-2 md:gap-3 uppercase tracking-[0.2em] px-2 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-2xl transition-all relative group/btn overflow-hidden border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5 !text-red-500" /> {t('delete')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="flex flex-col items-center justify-center p-20 gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-4 ${isDark ? 'border-white/5' : 'border-[#8B5CF6]/10'} border-t-[#8B5CF6] animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap size={24} className="text-[#8B5CF6] animate-pulse" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.4em] animate-pulse">{t('syncingData')}</p>
                        </div>
                    )}
                </div>
            </motion.div >
        </div >
    );
};

export default Notifications;

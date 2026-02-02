import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Loader, CheckCircle, AlertCircle, RefreshCcw, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ForgotPassword = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            setMessage(response.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otp });
            setMessage(response.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-reset-otp', {
                email,
                otp,
                newPassword
            });
            setMessage(response.data.message);
            // Redirect to login after success
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getHeaderInfo = () => {
        switch (step) {
            case 1:
                return {
                    icon: <RefreshCcw className="w-7 h-7" />,
                    title: <>{t('access')} <span className="text-[#8b5cf6]">{t('recovery') || 'Recovery'}.</span></>,
                    sub: t('initResetSequence')
                };
            case 2:
                return {
                    icon: <ShieldCheck className="w-7 h-7" />,
                    title: <>{t('verifyIdentity') || 'Verify Identity'}</>,
                    sub: t('secureOTPRequired') || 'Secure OTP verification required'
                };
            case 3:
                return {
                    icon: <Lock className="w-7 h-7" />,
                    title: <>New <span className="text-[#8b5cf6]">Security Key.</span></>,
                    sub: 'Enter your new credentials'
                };
            default:
                return {};
        }
    };

    const header = getHeaderInfo();

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3]">
            {/* Background Dreamy Orbs */}
            <div className="fixed inset-0 -z-10 bg-transparent">
                <div className="absolute top-[20%] left-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/40 blur-[120px] animate-orb-float-1"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[120px] animate-orb-float-2"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        key={`icon-${step}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-28 h-28 bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-glass border border-white/80 mb-8 mx-auto group relative"
                    >
                        {/* Highlights & Glow */}
                        <div className="absolute inset-0 bg-[#8b5cf6]/10 rounded-[40px] animate-pulse blur-xl -z-10 group-hover:bg-[#8b5cf6]/20 transition-colors duration-500" />
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#d946ef]/20 to-[#8b5cf6]/20 rounded-[42px] blur opacity-50 -z-10" />

                        <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-[#8b5cf6] shadow-[0_10px_25px_-5px_rgba(139,92,246,0.3)] border border-purple-50 group-hover:scale-110 transition-transform duration-500">
                            {header.icon}
                        </div>
                    </motion.div>

                    <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                        {header.title}
                    </h2>
                    <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] opacity-70">
                        {header.sub}
                    </p>
                </div>

                {/* Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/40 backdrop-blur-3xl p-10 rounded-[48px] border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="mb-8 p-5 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 flex items-center gap-4 text-emerald-600 text-[11px] font-black uppercase tracking-wider"
                            >
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                {message}
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="mb-8 p-5 rounded-3xl bg-red-50/50 border border-red-100/50 flex items-center gap-4 text-red-600 text-[11px] font-black uppercase tracking-wider"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleRequestOTP}
                                className="space-y-8 relative z-10"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">
                                        {t('neuralAddress')}
                                    </label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-[#8b5cf6] transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/60 border border-white/80 rounded-[24px] py-5 pl-16 pr-8 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 shadow-sm transition-all font-medium"
                                            placeholder={t('emailPlaceholder') || "name@example.com"}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <> <RefreshCcw size={18} /> {t('initiateRecovery') || 'Send Reset Link'} </>
                                    )}
                                </button>
                            </motion.form>
                        ) : step === 2 ? (
                            <motion.form
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleVerifyOTP}
                                className="space-y-6 relative z-10"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">
                                        {t('identityOTP') || 'Identity OTP'}
                                    </label>
                                    <div className="relative group/input">
                                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-[#8b5cf6] transition-colors" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-white/60 border border-white/80 rounded-[20px] py-4 pl-16 pr-8 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 shadow-sm transition-all font-black tracking-[0.5em] text-center"
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <> <ShieldCheck size={18} /> {t('verifyAndUpdate') || 'Verify OTP'} </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                                >
                                    {t('changeEmail') || 'Change Email Address'}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleResetPassword}
                                className="space-y-6 relative z-10"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">
                                        {t('newSecurityKey') || 'New Security Key'}
                                    </label>
                                    <div className="relative group/input flex items-center">
                                        <div className="absolute left-6 inset-y-0 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400 group-focus-within/input:text-[#8b5cf6] transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white/60 border border-white/80 rounded-[20px] py-4 pl-16 pr-14 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 shadow-sm transition-all font-medium"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                        />
                                        <div className="absolute right-4 inset-y-0 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#8b5cf6]/10 text-gray-400 hover:text-[#8b5cf6]"
                                            >
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">
                                        {t('confirmKey') || 'Confirm Key'}
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/60 border border-white/80 rounded-[20px] py-4 pl-8 pr-8 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 shadow-sm transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <> <Lock size={18} /> {t('verifyAndUpdate') || 'Update Password'} </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                                >
                                    Back to OTP
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Back link */}
                <Link
                    to="/login"
                    className="mt-12 flex items-center justify-center gap-3 text-gray-400 hover:text-gray-900 transition-all font-black text-[10px] uppercase tracking-[0.3em]"
                >
                    <ArrowLeft className="w-4 h-4" strokeWidth={3} /> {t('abortReturnLogin')}
                </Link>
            </div>
        </div>
    );
};
export default ForgotPassword;

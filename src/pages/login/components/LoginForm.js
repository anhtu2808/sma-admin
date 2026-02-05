import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Input from '@/components/Input';
import Button from '@/components/Button/index.tsx';
import authService from '@/services/authService';
import { message } from 'antd';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await authService.login({ email, password });

            if (response?.data?.code === 200) {
                message.success(response?.data?.message || "Login successfully");
                navigate("/");
            } else {
                message.error(response?.data?.message || "Login failed");
            }
        } catch (error) {
            message.error(
                error.response?.data?.message || error.message || "An error occurred during login",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="10" r="4" fill="#FF6B35" />
                            <circle cx="16" cy="16" r="5" fill="#FF6B35" opacity="0.7" />
                            <circle cx="16" cy="23" r="6" fill="#FF6B35" opacity="0.4" />
                        </svg>
                        <span className="text-xl font-bold text-neutral-900">SmartRecruit</span>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-neutral-900 mb-8">
                        Smart hiring starts here.
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            prefix={<Mail size={30} />}
                        />

                        {/* Password Field */}
                        <Input.Password
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            prefix={<Lock size={20} />}
                        />

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-neutral-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark">
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            mode="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-neutral-400 uppercase tracking-wide text-xs font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <Button
                        type="button"
                        mode="secondary"
                        fullWidth
                        onClick={handleGoogleLogin}
                        iconLeft={
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" />
                                <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" />
                                <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" />
                                <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" />
                            </svg>
                        }
                    >
                        Google
                    </Button>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-sm text-neutral-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer Links */}
            <div className="p-8 flex items-center justify-center gap-8 text-xs text-neutral-500">
                <a href="#" className="hover:text-neutral-700">Privacy Policy</a>
                <a href="#" className="hover:text-neutral-700">Terms of Service</a>
                <a href="#" className="hover:text-neutral-700">Help Center</a>
            </div>
        </div>
    );
};

export default LoginForm;

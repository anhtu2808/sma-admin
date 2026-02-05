import React from 'react';

const LoginHero = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
            {/* Animated Abstract Shapes */}
            <div className="absolute inset-0">
                {/* Large gradient orb - top right */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-amber-600/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Medium gradient orb - center */}
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-full blur-2xl"></div>

                {/* Small gradient orb - bottom left */}
                <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-yellow-600/20 to-orange-400/15 rounded-full blur-3xl"></div>

                {/* Geometric shapes */}
                <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white/10 rounded-2xl rotate-12 backdrop-blur-sm"></div>
                <div className="absolute bottom-32 left-16 w-24 h-24 border-2 border-white/10 rounded-full backdrop-blur-sm"></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-lg rotate-45 backdrop-blur-sm"></div>

                {/* Floating dots */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Illustration/Icon in center */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    {/* Main icon circle */}
                    <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                        <div className="w-40 h-40 bg-gradient-to-br from-orange-500/40 to-amber-600/30 rounded-full flex items-center justify-center">
                            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    {/* Orbiting elements */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500/60 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-amber-500/60 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-16 bg-gradient-to-t from-[rgba(194,65,12,0.95)] via-[rgba(194,65,12,0.7)] to-transparent z-10">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Welcome back to<br />your career hub.
                </h1>
                <p className="text-base lg:text-lg text-white/90 max-w-md">
                    Connect with top talent and opportunities in a seamless, collaborative environment.
                </p>
            </div>
        </div>
    );
};

export default LoginHero;

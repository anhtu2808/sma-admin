import React from 'react';
import { Search, MapPin } from 'lucide-react';
import Button from '@/components/Button/index.tsx';

const Hero = () => {
    return (
        <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <div className="text-primary font-bold tracking-wider text-sm uppercase">Future of Work</div>
                <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-neutral-900 dark:text-white leading-tight">
                    Smart Hiring.<br />
                    Better Matches.<br />
                    Faster Decisions.
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
                    Our AI-powered platform connects the right talent with the right opportunities instantly. Experience 95% matching accuracy today.
                </p>

                <div className="flex gap-4">
                    <Button mode="primary">Find Jobs</Button>
                    <Button mode="secondary">Post a Job</Button>
                </div>

                <div className="bg-white p-2 rounded-xl shadow-soft border border-neutral-100 flex flex-col md:flex-row gap-2 max-w-xl">
                    <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-lg flex-1">
                        <Search className="text-neutral-400" size={20} />
                        <input
                            type="text"
                            placeholder="Job Title, Keywords, or Company"
                            className="bg-transparent border-none outline-none w-full text-sm text-neutral-900 placeholder-neutral-400"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-lg flex-1">
                        <MapPin className="text-neutral-400" size={20} />
                        <input
                            type="text"
                            placeholder="City, State, or Zip"
                            className="bg-transparent border-none outline-none w-full text-sm text-neutral-900 placeholder-neutral-400"
                        />
                    </div>
                    <button className="bg-neutral-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors">
                        Search
                    </button>
                </div>
            </div>

            <div className="relative">
                <div className="bg-[#E88D67] rounded-[2rem] p-8 md:p-12 aspect-[4/3] relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                    {/* Mock UI Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm mx-auto mt-8 relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden">
                                <img src="https://i.pravatar.cc/150?u=1" alt="Candidate" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="h-4 w-32 bg-neutral-200 rounded mb-2"></div>
                                <div className="h-3 w-20 bg-neutral-100 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-3 w-full bg-neutral-100 rounded"></div>
                            <div className="h-3 w-5/6 bg-neutral-100 rounded"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-12 right-12 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 z-20 animate-bounce cursor-pointer">
                        <div className="text-xs font-semibold uppercase text-neutral-500">Match Found</div>
                        <div className="text-sm font-bold text-neutral-900">Senior Product Designer</div>
                        <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">98% Match</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

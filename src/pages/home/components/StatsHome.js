import React from 'react';

const Stats = () => {
    return (
        <div className="py-12 border-y border-neutral-100 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8">Trusted by Leading Companies</div>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mb-16">
                    {['ACME Corp', 'GlobalTech', 'Nebula', 'Orbit', 'BlockSystems'].map((company) => (
                        <div key={company} className="flex items-center gap-2 font-bold text-xl text-neutral-400">
                            <div className="w-6 h-6 bg-neutral-300 rounded-full"></div> {company}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-neutral-100">
                    {[
                        { label: 'Active Candidates', value: '10k+' },
                        { label: 'Match Accuracy', value: '95%' },
                        { label: 'Faster Hiring', value: '50%' },
                        { label: 'AI Screening', value: '24/7' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm text-neutral-500 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stats;

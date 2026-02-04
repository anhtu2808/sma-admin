import React from 'react';
import { Briefcase, Zap, Shield, BarChart3 } from 'lucide-react';

const Features = () => {
    const features = [
        { icon: <Briefcase className="text-primary" />, title: 'AI Matching', desc: 'Proprietary algorithms match candidates to jobs with high precision based on skills.' },
        { icon: <Zap className="text-primary" />, title: 'Lightning Speed', desc: 'Reduce time-to-hire by up to 50% with automated screening and instant shortlisting.' },
        { icon: <Shield className="text-primary" />, title: 'Trusted Security', desc: 'Enterprise-grade security ensuring your candidate data privacy and compliance standards.' },
        { icon: <BarChart3 className="text-primary" />, title: 'Growth Analytics', desc: 'Insightful dashboards to track hiring metrics, team performance, and recruitment ROI.' },
    ];

    return (
        <section className="py-20 bg-surface-light dark:bg-neutral-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-neutral-900 dark:text-white">Why Recruiters Choose SmartRecruit</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">Experience the difference with our cutting-edge technology designed to streamline your hiring process.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-neutral-100 dark:border-neutral-700">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-neutral-900 dark:text-white">{feature.title}</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

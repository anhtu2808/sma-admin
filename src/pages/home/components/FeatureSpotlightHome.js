import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/Button/index.tsx';

const FeatureSpotlight = () => {
    return (
        <section className="py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
                        AI Powered Precision
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-neutral-900 dark:text-white">See Beyond the Resume</h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                        Our AI analyzes skills, experience, and cultural fit to provide a comprehensive match score.
                        We highlight transferable skills that traditional keyword searches miss.
                    </p>

                    <div className="space-y-4">
                        {[
                            { title: 'Skill Gap Analysis', desc: 'Instantly see what skills a candidate has versus what the role requires.' },
                            { title: 'Cultural Fit Prediction', desc: 'Assess soft skills and work style compatibility.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <CheckCircle2 className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white">{item.title}</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <Button mode="primary" className="!px-6">Learn more about AI</Button>
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-slate-300 rounded-3xl p-8 md:p-12 shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-700">
                        {/* Mock Dashboard UI */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <img src="https://i.pravatar.cc/150?u=2" alt="Candidate" className="w-12 h-12 rounded-full ring-2 ring-primary bg-neutral-100" />
                                    <div>
                                        <div className="font-bold text-neutral-900">Sarah Jenkins</div>
                                        <div className="text-xs text-neutral-500">UX Researcher</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-extrabold text-primary">94%</div>
                                    <div className="text-[10px] uppercase font-bold text-neutral-400">Match Score</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { l: 'User Research', w: '90%', t: 'Expert' },
                                    { l: 'Data Analysis', w: '75%', t: 'Advanced' },
                                    { l: 'Prototyping', w: '40%', t: 'Intermediate' }
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span>{s.l}</span>
                                            <span>{s.t}</span>
                                        </div>
                                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary to-orange-400" style={{ width: s.w }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSpotlight;

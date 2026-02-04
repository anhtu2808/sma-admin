import React from 'react';
import { Zap, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-white py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">
                            <Zap size={14} fill="currentColor" />
                        </div>
                        <span className="font-heading font-bold text-lg">RecruitAI</span>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                        The world's first fully autonomous AI recruitment platform. We help you build the team of your dreams.
                    </p>
                    <div className="flex gap-4">
                        {[Twitter, Facebook, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>

                {[
                    { h: 'Product', l: ['Features', 'Pricing', 'AI Engine', 'Case Studies'] },
                    { h: 'Company', l: ['About Us', 'Careers', 'Press', 'Contact'] },
                    { h: 'Resources', l: ['Blog', 'Help Center', 'API Documentation', 'Status'] }
                ].map((col) => (
                    <div key={col.h}>
                        <h4 className="font-bold mb-6">{col.h}</h4>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            {col.l.map(x => <li key={x}><a href="#" className="hover:text-primary transition-colors">{x}</a></li>)}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
                <div>© 2024 RecruitAI Inc. All rights reserved.</div>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white">Privacy Policy</a>
                    <a href="#" className="hover:text-white">Terms of Curvey</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

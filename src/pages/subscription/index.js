import React, { useState } from 'react';
import FeatureManagement from './feature';
import PlanManagement from './plan';
import { ShieldCheck, Zap } from 'lucide-react';

const SubscriptionManagement = () => {
    const [activeTab, setActiveTab] = useState('PLANS');

    const tabs = [
        { id: 'PLANS', label: 'Subscription plans' },
        { id: 'FEATURES', label: 'System features' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'PLANS': return <PlanManagement />;
            case 'FEATURES': return <FeatureManagement />;
            default: return <PlanManagement />;
        }
    };

    return (
        <div className="h-full flex flex-col font-body">
            {/* --- NEGATIVE TABS HEADER --- */}
            <div className="flex-shrink-0 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-neutral-800">
                <div className="pl-8 flex items-center justify-between">
                    <div className="flex gap-10">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    pb-4 text-sm transition-all duration-300 relative flex items-center gap-2
                    ${isActive
                                            ? 'text-[#111c2d] dark:text-white'
                                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200'
                                        }
                `}
                                >
                                    {tab.icon}
                                    {tab.label}

                                    <div
                                        className={`
                        absolute bottom-0 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300
                        ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}
                    `}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 overflow-hidden flex flex-col bg-neutral-50/30">
                {renderContent()}
            </div>
        </div>
    );
};

export default SubscriptionManagement;
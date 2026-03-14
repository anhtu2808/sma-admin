import React, { useState } from 'react';
import DomainManagement from './domain';
import ExpertiseGroupManagement from './expertise-group';
import ExpertiseManagement from './expertise';
import SkillCategoryManagement from './skill-category';
import SkillManagement from './skill';

const MasterManagement = () => {
    const [activeTab, setActiveTab] = useState('DOMAINS');

    const tabs = [
        { id: 'DOMAINS', label: 'Industry Domains' },
        { id: 'GROUPS', label: 'Expertise Groups' },
        { id: 'EXPERTISE', label: 'Job Expertises' },
        { id: 'SKILL_CATES', label: 'Skill Categories' },
        { id: 'SKILLS', label: 'Skills' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'DOMAINS': return <DomainManagement />;
            case 'GROUPS': return <ExpertiseGroupManagement />;
            case 'EXPERTISE': return <ExpertiseManagement />;
            case 'SKILL_CATES': return <SkillCategoryManagement />;
            case 'SKILLS': return <SkillManagement />;
            default: return <DomainManagement />;
        }
    };

    return (
        <div className="h-full flex flex-col  font-body">
            {/* --- NEGATIVE TABS HEADER --- */}
            <div className="flex-shrink-0 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-neutral-800">
                <div className="pl-6 flex items-center justify-between">
                    <div className="flex gap-10">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    pb-4 text-sm  transition-all duration-300 relative
                    ${isActive
                                            ? 'text-[#111c2d] dark:text-white'
                                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200'
                                        }
                `}
                                >
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

            {/* --- CONTENT AREA (Scrollable Area) --- */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white shadow-sm">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default MasterManagement;
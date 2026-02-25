import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, message } from 'antd';
import { useUpdateSampleJobMutation } from '@/apis/jobSampleApi';
import Button from '@/components/Button';

const JobListItem = ({
    id,
    title,
    status = 'Active',
    location,
    salary,
    tags = [],
    onViewDetails,
    onDelete,
    className = '',
}) => {
    const isActive = status === 'PUBLISHED';

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow ${className}`}>
            <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary cursor-pointer" onClick={onViewDetails}>
                        {title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                        {status}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <span className="material-icons-round text-base">place</span>
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-icons-round text-base">payments</span>
                        <span>{salary}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600 font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Button mode="secondary" size="sm" onClick={onViewDetails}>
                    Edit Sample
                </Button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Delete Sample"
                >
                    <span className="material-icons-round">delete_outline</span>
                </button>
            </div>
        </div>
    );
};

JobListItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string,
    postedTime: PropTypes.string,
    location: PropTypes.string,
    salary: PropTypes.string,
    expiry: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    stats: PropTypes.shape({
        applicants: PropTypes.number,
        views: PropTypes.number,
        ctr: PropTypes.number
    }),
    onViewDetails: PropTypes.func,
    className: PropTypes.string
};

export default JobListItem;

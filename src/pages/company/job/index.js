import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAdminJobsQuery } from '@/apis/apis';
import { Briefcase, Eye } from 'lucide-react';
import dayjs from 'dayjs';

const CompanyJobsTab = ({ companyId }) => {
    const navigate = useNavigate();

    const { data: jobsData, isLoading } = useGetAdminJobsQuery({
        companyId: companyId,
        size: 50
    });

    const jobs = jobsData?.data?.content || [];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PUBLISHED': return 'text-green-600 bg-green-50 border-green-100';
            case 'PENDING_REVIEW': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'SUSPENDED': return 'text-red-600 bg-red-50 border-red-100';
            case 'CLOSED': return 'text-gray-400 bg-gray-50 border-gray-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    if (isLoading) {
        return (
            <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">
                Synchronizing Job Listings...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm mb-10 font-body">
            <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-gray-50/80">
                    <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[45%]">Job Details</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%] text-center">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%]">Posted Date</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[15%] text-right pr-12">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-orange-50/20 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center font-black text-[10px] border border-orange-100 flex-shrink-0">
                                            #{job.id}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-neutral-800 truncate" title={job.name}>
                                                {job.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                                                {job.jobLevel} • {job.workingModel}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusStyle(job.status)}`}>
                                        {job.status?.replace('_', ' ')}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-neutral-700">
                                            {dayjs(job.uploadTime).format('DD MMM, YYYY')}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase">
                                            at {dayjs(job.uploadTime).format('HH:mm')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right pr-12">
                                    <button
                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-white border border-transparent hover:border-orange-100 rounded-xl transition-all shadow-sm"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-24 text-center">
                                <Briefcase className="mx-auto mb-4 opacity-10 text-neutral-400" size={64} />
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active job posts found</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CompanyJobsTab;
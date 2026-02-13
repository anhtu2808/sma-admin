import React, { useState, useEffect } from 'react';
import { useGetAdminJobsQuery, useUpdateAdminJobStatusMutation } from '@/apis/apis';
import { useNavigate } from 'react-router-dom';
import {
    MoreVertical, Search, Eye, ChevronLeft, ChevronRight,
    Briefcase, Building2, Calendar, ShieldAlert, Check, XCircle
} from 'lucide-react';
import moment from 'moment';
import { message, Dropdown, Menu, Spin } from 'antd';

const JobManagement = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const [updateStatus] = useUpdateAdminJobStatusMutation();

    const statusFilter = {
        'Draft': 'DRAFT',
        'Pending Review': 'PENDING_REVIEW',
        'Published': 'PUBLISHED',
        'Suspended': 'SUSPENDED',
        'Closed': 'CLOSED'
    }[activeTab] || null;

    const { data: jobData, isLoading } = useGetAdminJobsQuery({
        name: searchTerm || null,
        statuses: statusFilter ? [statusFilter] : null,
        page: page,
        size: 8
    });

    const { data: allData } = useGetAdminJobsQuery({ size: 1 });
    const { data: pendingData } = useGetAdminJobsQuery({ statuses: ['PENDING_REVIEW'], size: 1 });
    const { data: publishedStatData } = useGetAdminJobsQuery({ statuses: ['PUBLISHED'], size: 1 });
    const { data: closedStatData } = useGetAdminJobsQuery({ statuses: ['CLOSED'], size: 1 });

    const jobs = jobData?.data?.content || [];
    const totalJobs = allData?.data?.totalElements || 0;
    const pendingReviewCount = pendingData?.data?.totalElements || 0;
    const totalPublished = publishedStatData?.data?.totalElements || 0;
    const totalClosed = closedStatData?.data?.totalElements || 0;

    const handleStatusUpdate = async (jobId, newStatus) => {
        try {
            await updateStatus({ jobId, jobStatus: newStatus }).unwrap();
            message.success(`Job status updated to ${newStatus}`);
        } catch (error) {
            message.error(error?.data?.message || "Failed to update status");
        }
    };

    const getActionMenu = (job) => (
        <Menu className="!rounded-2xl !p-2 shadow-2xl border border-neutral-100">
            <div className="px-3 py-2 mb-1 border-b border-neutral-50">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Administrative Actions</p>
            </div>
            <Menu.Item
                key="view"
                onClick={() => navigate(`/admin/jobs/${job.id}`)}
                className="!rounded-xl hover:!bg-neutral-50"
            >
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-neutral-600">
                    <Eye size={14} /> Review Dossier
                </div>
            </Menu.Item>
            {job.status === 'PENDING_REVIEW' && (
                <Menu.Item key="approve" onClick={() => handleStatusUpdate(job.id, 'PUBLISHED')} className="!rounded-xl hover:!bg-green-50">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-green-600">
                        <Check size={14} /> Approve Job
                    </div>
                </Menu.Item>
            )}
            {job.status !== 'SUSPENDED' && (
                <Menu.Item key="suspend" onClick={() => handleStatusUpdate(job.id, 'SUSPENDED')} className="!rounded-xl hover:!bg-red-50">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-red-600">
                        <ShieldAlert size={14} /> Suspend
                    </div>
                </Menu.Item>
            )}
        </Menu>
    );

    if (isLoading) return <div className="p-20 text-center"><Spin size="large" /></div>;

    return (
        <div className="h-full flex flex-col space-y-6 overflow-hidden animate-fadeIn font-body">
            {/* Stats Cards */}
            <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="TOTAL JOB POSTS" value={totalJobs} icon={<Briefcase size={20} />} color="text-neutral-900" bgColor="bg-neutral-100" />
                <StatCard label="PENDING REVIEW" value={pendingReviewCount} icon={<ShieldAlert size={20} />} color="text-orange-500" bgColor="bg-orange-50" />
                <StatCard label="PUBLISHED POSTS" value={totalPublished} icon={<Building2 size={20} />} color="text-green-500" bgColor="bg-green-50" />
                <StatCard label="CLOSED POSTS" value={totalClosed} icon={<XCircle size={20} />} color="text-blue-600" bgColor="bg-blue-50" />
            </div>

            {/* Main Table Area */}
            <div className="flex-1 min-h-0 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                {/* Tabs & Search Header */}
                <div className="flex-shrink-0 p-5 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex bg-gray-100/80 p-1 rounded-2xl w-fit overflow-x-auto">
                        {['All', 'Draft', 'Pending Review', 'Published', 'Suspended', 'Closed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setPage(0); }}
                                className={`px-5 py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === tab
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                                {tab === 'Pending Review' && pendingReviewCount > 0 && (
                                    <span className="ml-2 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{pendingReviewCount}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by job name..."
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-xs font-bold transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 focus:bg-white"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4 w-[35%] text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Information</th>
                                <th className="px-6 py-4 w-[20%] text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 w-[20%] text-[10px] font-black text-gray-400 uppercase tracking-widest">Uploaded</th>
                                <th className="px-6 py-4 w-[10%] text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm overflow-hidden">
                                                {job.company?.logo ? <img src={job.company.logo} className="w-full h-full object-cover" /> : <Briefcase size={20} />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-gray-900 truncate" title={job.name}>{job.name}</p>
                                                <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5 truncate mt-0.5">
                                                    <Building2 size={12} /> {job.company?.name || "System Post"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <JobStatusTag status={job.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <Calendar size={14} className="text-gray-300" />
                                            {moment(job.uploadTime).format('DD MMM, YYYY')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => navigate(`/jobs/${job.id}`)}
                                            className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-xl transition-all"
                                            title="View Detail"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-white">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing <span className="text-gray-900">{jobs.length}</span> of <span className="text-gray-900">{jobData?.data?.totalElements || 0}</span> Job Posts
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className={`p-2 rounded-xl transition-all ${page === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(jobData?.data?.totalPages || 0)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`w-8 h-8 text-[10px] font-black rounded-lg transition-all ${page === i ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= (jobData?.data?.totalPages || 1) - 1}
                            className={`p-2 rounded-xl transition-all ${page >= (jobData?.data?.totalPages || 1) - 1 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bgColor }) => (
    <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex justify-between items-start">
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${bgColor}`}>
            <span className={color}>{icon}</span>
        </div>
    </div>
);

const JobStatusTag = ({ status }) => {
    const config = {
        PUBLISHED: { label: 'PUBLISHED', color: 'bg-green-50 text-green-600', dot: 'bg-green-600' },
        PENDING_REVIEW: { label: 'PENDING_REVIEW', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-600' },
        DRAFT: { label: 'DRAFT', color: 'bg-neutral-100 text-neutral-500', dot: 'bg-neutral-400' },
        CLOSED: { label: 'CLOSED', color: 'bg-blue-50 text-blue-400', dot: 'bg-blue-400' },
        SUSPENDED: { label: 'SUSPENDED', color: 'bg-red-50 text-red-600', dot: 'bg-red-600' },
    }[status] || { label: status, color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };

    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1.5 w-fit mx-auto ${config.color}`}>
            <span className={`w-1 h-1 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

export default JobManagement;
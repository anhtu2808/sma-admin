import React, { useState } from 'react';
import { useGetAdminCompaniesQuery } from '@/apis/apis';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Search, Download, Eye, ChevronLeft, ChevronRight, MapPin, Building2 } from 'lucide-react';

const CompanyManagement = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchName, setSearchName] = useState('');
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    const statusFilter = {
        'Pending Requests': 'PENDING_VERIFICATION',
        'Under Review': 'UNDER_REVIEW',
        'Verified': 'APPROVED',
        'Rejected': 'REJECTED'
    }[activeTab] || null;

    const { data, isLoading } = useGetAdminCompaniesQuery({
        name: searchName || null,
        status: statusFilter,
        page: page,
        size: 5
    });

    const { data: allData } = useGetAdminCompaniesQuery({ size: 1 });

    const { data: pendingData } = useGetAdminCompaniesQuery({
        status: 'PENDING_VERIFICATION',
        size: 1
    });

    const { data: underReviewData } = useGetAdminCompaniesQuery({
        status: 'UNDER_REVIEW',
        size: 1
    });

    const companies = data?.data?.content || [];
    const totalOrganizations = allData?.data?.totalElements || 0;
    const pendingApprovals = pendingData?.data?.totalElements || 0;
    const underReviewCount = underReviewData?.data?.totalElements || 0;
    const totalRecruiters = "--";

    if (isLoading) return <div className="p-10 text-center">Loading organizations...</div>;

    return (
        <div className="h-full flex flex-col space-y-6 overflow-hidden">
            <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="TOTAL ORGANIZATIONS"
                    value={totalOrganizations}
                    icon="business"
                    color="black"
                />
                <StatCard
                    label="PENDING APPROVAL"
                    value={pendingApprovals}
                    icon="schedule"
                    color="text-orange-500"
                    bgColor="bg-orange-50"
                />
                <StatCard
                    label="UNDER REVIEW"
                    value={underReviewCount}
                    icon={<Eye size={20} />}
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    label="TOTAL RECRUITERS"
                    value={totalRecruiters}
                    icon="groups"
                    color="text-green-600"
                />
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                <div className="flex-shrink-0 p-4 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex bg-gray-100/80 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit">
                        {['All', 'Pending Requests', 'Under Review', 'Verified', 'Rejected'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setPage(0); }}
                                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all duration-200 uppercase tracking-tight ${activeTab === tab
                                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab}
                                {tab === 'Pending Requests' && pendingApprovals > 0 && (
                                    <span className="ml-2 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                        {pendingApprovals}
                                    </span>
                                )}
                                {tab === 'Under Review' && underReviewCount > 0 && (
                                    <span className="ml-2 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                        {underReviewCount}
                                    </span>
                                )}

                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400/80" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                onChange={(e) => setSearchName(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-100/60 dark:bg-gray-800/40 border-none rounded-2xl text-sm transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 focus:bg-white dark:focus:bg-gray-700"
                            />
                        </div>
                        {/* <Button mode="outline" shape="rounded" iconLeft={<Download size={18} />}>Export</Button> */}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-4 w-[40%]">Organization</th>
                                <th className="px-6 py-4 w-[15%]">Status</th>
                                <th className="px-6 py-4 w-[15%]">Recruiters</th>
                                <th className="px-6 py-4 w-[20%]">Location</th>
                                <th className="px-6 py-4 w-[10%] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {companies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 min-w-0"> {/* min-w-0 rất quan trọng để truncate hoạt động trong flex */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                                {company.logo ? (
                                                    <img src={company.logo} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Building2 size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 truncate" title={company.name}>
                                                {company.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusTag status={company.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-primary truncate">
                                            {company.recruiterCount || 0} Members
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 flex items-center gap-1.5 truncate">
                                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{company.country || 'Vietnam'}</span>
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => navigate(`/companies/${company.id}`)} // Chuyển trang chi tiết
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
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-50 bg-white flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Showing <span className="text-gray-900">{companies.length}</span> of <span className="text-gray-900">{data?.data?.totalElements || 0}</span> Organizations
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(prev => Math.max(0, prev - 1))}
                            disabled={page === 0}
                            className={`p-2 rounded-xl transition-all ${page === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(data?.data?.totalPages || 0)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPage(index)}
                                    className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${page === index
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200' // Màu cam chuẩn theo ảnh của bạn
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={page >= (data?.data?.totalPages || 1) - 1}
                            className={`p-2 rounded-xl transition-all ${page >= (data?.data?.totalPages || 1) - 1 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub Components
const StatCard = ({ label, value, icon, color, bgColor }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {label}
            </p>
            <h3 className={`text-3xl font-bold ${color}`}>
                {value}
            </h3>
        </div>
        <div className={`p-3 rounded-xl ${bgColor || 'bg-gray-50'}`}>
            <span className={`material-icons-outlined ${color}`}>
                {icon}
            </span>
        </div>
    </div>
);

const StatusTag = ({ status }) => {
    const config = {
        APPROVED: { label: 'VERIFIED', color: 'bg-green-50 text-green-600', dot: 'bg-green-600' },
        PENDING_VERIFICATION: { label: 'PENDING', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-600' },
        UNDER_REVIEW: { label: 'UNDER REVIEW', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-600' },
        REJECTED: { label: 'REJECTED', color: 'bg-red-50 text-red-600', dot: 'bg-red-600' },
    }[status] || { label: status, color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

export default CompanyManagement;
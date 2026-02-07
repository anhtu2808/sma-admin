import React, { useState, useEffect } from 'react';
import { useGetAllUsersAdminQuery } from '@/apis/apis';
import { useNavigate } from 'react-router-dom';
import {
    MoreVertical, Search, ChevronLeft,
    ChevronRight, User as UserIcon, ShieldCheck,
    UserPlus, Users, Mail, Calendar, ChevronDown, Check
} from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('All Users');
    const [searchEmail, setSearchEmail] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const statuses = [
        { id: 'ALL', name: 'All Statuses' },
        { id: 'ACTIVE', name: 'Active' },
        { id: 'INACTIVE', name: 'Inactive' },
        { id: 'PENDING', name: 'Pending' }
    ];
    const [selectedStatus, setSelectedStatus] = useState(statuses[0]);

    const roleFilter = {
        'Candidates': 'CANDIDATE',
        'Recruiters': 'RECRUITER',
        'Admins': 'ADMIN'
    }[activeTab] || null;

    const { data, isLoading } = useGetAllUsersAdminQuery({
        email: searchEmail || null,
        role: roleFilter,
        status: selectedStatus.id === 'ALL' ? null : selectedStatus.id,
        page: page,
        size: 10
    });

    const { data: allData } = useGetAllUsersAdminQuery({ size: 1 });
    const { data: candidatesData } = useGetAllUsersAdminQuery({ role: 'CANDIDATE', size: 1 });
    const { data: recruitersData } = useGetAllUsersAdminQuery({ role: 'RECRUITER', size: 1 });
    const { data: adminsData } = useGetAllUsersAdminQuery({ role: 'ADMIN', size: 1 });

    const users = data?.data?.content || [];
    const pagination = data?.data || {};
    const totalPages = pagination.totalPages || 0;

    const stats = {
        total: allData?.data?.totalElements || 0,
        candidates: candidatesData?.data?.totalElements || 0,
        recruiters: recruitersData?.data?.totalElements || 0,
        admins: adminsData?.data?.totalElements || 0
    };

    const getPageNumbers = (current, total) => {
        const pages = [];
        if (total <= 7) {
            for (let i = 0; i < total; i++) pages.push(i);
        } else {
            pages.push(0);
            if (current > 2) pages.push('...');
            let start = Math.max(1, current - 1);
            let end = Math.min(total - 2, current + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (current < total - 3) pages.push('...');
            pages.push(total - 1);
        }
        return pages;
    };




    const getRoleStyle = (role) => {
        switch (role) {
            case 'CANDIDATE':
                return 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/10';
            case 'RECRUITER':
                return 'bg-orange-50 text-orange-600 ring-1 ring-orange-500/10';
            case 'ADMIN':
                return 'bg-green-50 text-green-700 ring-1 ring-green-500/10';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchEmail(inputValue);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    if (isLoading) return <div className="p-10 text-center font-black text-gray-400 animate-pulse uppercase tracking-widest">Loading Platform Users...</div>;

    return (
        <div className="h-full flex flex-col space-y-6 overflow-hidden font-body">
            <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Users" value={stats.total} icon={<Users size={20} />} color="text-neutral-900" bgColor="bg-gray-50" />
                <StatCard label="Candidates" value={stats.candidates} icon={<UserIcon size={20} />} color="text-blue-600" bgColor="bg-blue-50" />
                <StatCard label="Recruiters" value={stats.recruiters} icon={<UserPlus size={20} />} color="text-orange-600" bgColor="bg-orange-50" />
                <StatCard label="Admins" value={stats.admins} icon={<ShieldCheck size={20} />} color="text-green-600" bgColor="bg-green-50" />
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                <div className="flex-shrink-0 p-5 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-fit">
                        {['All Users', 'Candidates', 'Recruiters', 'Admins'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setPage(0); }}
                                className={`px-5 py-2 text-[11px] font-black rounded-xl transition-all duration-200 uppercase tracking-wider ${activeTab === tab
                                    ? 'bg-white text-orange-500 shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-52">
                            <Listbox value={selectedStatus} onChange={(val) => { setSelectedStatus(val); setPage(0); }}>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full cursor-default rounded-2xl bg-white border border-neutral-100 py-2.5 pl-10 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-500" />
                                        <span className="block truncate text-[11px] font-black uppercase tracking-widest text-neutral-700">
                                            {selectedStatus.name}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        as={React.Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                            {statuses.map((status) => (
                                                <Listbox.Option
                                                    key={status.id}
                                                    value={status}
                                                    className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-orange-50 text-orange-500' : 'text-neutral-700'}`}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate text-[10px] uppercase ${selected ? 'font-black' : 'font-bold'}`}>
                                                                {status.name}
                                                            </span>
                                                            {selected && (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                                                                    <Check size={14} strokeWidth={3} />
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>

                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                            <input
                                type="text"
                                placeholder="Search users by email..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-100 rounded-2xl text-xs font-bold transition-all shadow-sm focus:ring-2 focus:ring-orange-500/10 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[35%]">User Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%]">Account Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[25%]">Platform Activity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[15%]">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[10%] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-xs uppercase bg-orange-100">
                                                        {user.email?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-gray-900 truncate">{user.fullName || user.email}</p>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${getRoleStyle(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-400 font-medium truncate flex items-center gap-1">
                                                    <Mail size={10} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusTag status={user.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-gray-800 truncate">{user.mainActivity || '—'}</p>
                                            <p className="text-[10px] text-gray-400 font-bold tracking-tighter mt-0.5 truncate">{user.subActivity}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-1.5 font-bold text-xs">
                                            <Calendar size={13} className="text-gray-300" />
                                            {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => navigate(`/users/${user.id}`)}
                                            className="p-2.5 hover:bg-gray-100 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer: Optimized Pagination */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-50 bg-white flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing <span className="text-gray-900">{users.length}</span> of <span className="text-gray-900">{pagination.totalElements || 0}</span> Users
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
                            {getPageNumbers(page, totalPages).map((p, index) => (
                                p === '...' ? (
                                    <span key={`dots-${index}`} className="px-2 text-gray-300 font-black text-xs">...</span>
                                ) : (
                                    <button
                                        key={`page-${p}`}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 text-[10px] font-black rounded-lg transition-all ${page === p
                                            ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                            : 'text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {p + 1}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={page >= totalPages - 1}
                            className={`p-2 rounded-xl transition-all ${page >= totalPages - 1 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
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
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color}`}>
            {icon}
        </div>
    </div>
);

const StatusTag = ({ status }) => {
    const config = {
        ACTIVE: { label: 'ACTIVE', color: 'bg-green-50 text-green-600', dot: 'bg-green-600' },
        PENDING: { label: 'PENDING', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-600' },
    }[status] || { label: status, color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 w-fit ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

export default UserManagement;
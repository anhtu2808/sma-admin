import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserDetailAdminQuery, useUpdateUserStatusAdminMutation } from '@/apis/apis';
import {
    ChevronLeft, User, Mail, ShieldCheck, Calendar, MapPin,
    Briefcase, FileText, Globe, ExternalLink, MoreVertical,
    CheckCircle2, XCircle, Clock, Building2, Eye, ShieldAlert
} from 'lucide-react';
import Button from '@/components/Button';
import dayjs from 'dayjs';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    const { data, isLoading, isError, refetch } = useGetUserDetailAdminQuery(id, {
        refetchOnMountOrArgChange: true
    });

    const user = data?.data;
    const baseInfo = user?.baseInfo;
    const isCandidate = baseInfo?.role === 'CANDIDATE';
    const isRecruiter = baseInfo?.role === 'RECRUITER';
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
    const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusAdminMutation();

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-100';
            case 'INACTIVE': return 'text-red-600 bg-red-50 border-red-100';
            case 'PENDING': return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getJobStatusStyle = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return 'text-green-600 bg-green-50 border-green-100';
            case 'PENDING_REVIEW':
                return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'DRAFT':
                return 'text-gray-500 bg-gray-50 border-gray-100';
            case 'SUSPENDED':
                return 'text-red-600 bg-red-50 border-red-100';
            case 'CLOSED':
                return 'text-neutral-400 bg-neutral-50 border-neutral-100';
            default:
                return 'text-gray-400 bg-gray-50 border-gray-100';
        }
    };

    const getResumeStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-green-600 bg-green-50 border-green-100';
            case 'ARCHIVED':
                return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'DRAFT':
                return 'text-gray-500 bg-gray-50 border-gray-100';
            default:
                return 'text-gray-400 bg-gray-50 border-gray-100';
        }
    };

    const openConfirmModal = (status) => {
        setPendingStatusUpdate(status);
        setIsStatusModalOpen(true);
    };

    const handleConfirmStatusUpdate = async () => {
        try {
            await updateStatus({
                userId: id,
                status: pendingStatusUpdate
            }).unwrap();

            setIsStatusModalOpen(false);
            refetch();
        } catch (err) {
            console.error("Failed to update user status:", err);
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-gray-400 tracking-widest">LOADING USER DOSSIER...</div>;
    if (isError || !user) return <div className="p-10 text-center text-red-500">USER NOT FOUND</div>;

    return (
        <div className="h-full flex flex-col space-y-4 overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-primary transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center overflow-hidden">
                            {baseInfo?.avatar ? (
                                <img src={baseInfo.avatar} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                                <User className="text-orange-500" size={32} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#111c2d] leading-tight truncate">
                                {baseInfo?.fullName || baseInfo?.email || "Unknown User"}
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">
                                Account ID: {baseInfo?.id} • {baseInfo?.role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 px-2 mt-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex gap-10">
                    {[{ id: 'Overview', label: 'OVERVIEW' },
                    isCandidate && { id: 'Resumes', label: `RESUME LIST (${user.candidateDetail?.resumes?.length || 0})` },
                    isRecruiter && { id: 'Jobs', label: `JOB POSTS (${user.recruiterDetail?.jobs?.length || 0})` }
                    ].filter(Boolean).map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-[10px] font-extrabold tracking-[0.15em] relative transition-all ${activeTab === tab.id ? 'text-[#111c2d]' : 'text-gray-400'}`}>
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500 rounded-full" />}
                        </button>
                    ))}
                </div>
                <div className="pb-4">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(baseInfo?.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${baseInfo?.status === 'ACTIVE' ? 'bg-green-600' : 'bg-current'}`} />
                        {baseInfo?.status}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                {activeTab === 'Overview' && (
                    <div className="flex flex-col lg:flex-row gap-8 pb-10">
                        <div className="w-full lg:w-[350px] flex-shrink-0 space-y-6">
                            <div className="bg-orange-400 text-white rounded-[32px] p-8 relative overflow-hidden">
                                <div className="relative z-10 space-y-6">
                                    <p className="text-[10px] font-bold text-orange-800 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <ShieldCheck size={14} /> General Information
                                    </p>
                                    <div className="space-y-6">
                                        <SidebarItem label="Email Address" value={baseInfo?.email} icon={<Mail size={16} />} />
                                        <SidebarItem label="Gender" value={user.gender} icon={<User size={16} />} />
                                        <SidebarItem label="Birthday" value={user.dateOfBirth} icon={<Calendar size={16} />} />
                                        <SidebarItem label="Join Date" value={dayjs(baseInfo?.joinedAt).format('MMM DD, YYYY')} icon={<Clock size={16} />} />
                                    </div>
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            </div>

                            {isCandidate && (
                                <div className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm space-y-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Social Connections</p>
                                    <SocialLink label="LinkedIn" url={user.candidateDetail?.linkedinUrl} />
                                    <SocialLink label="GitHub" url={user.candidateDetail?.githubUrl} />
                                    <SocialLink label="Portfolio" url={user.candidateDetail?.websiteUrl} />
                                </div>
                            )}

                            {isRecruiter && (
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Company</p>
                                    <div className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-orange-100">
                                            {user.recruiterDetail?.companyLogo ? <img src={user.recruiterDetail.companyLogo} className="object-contain" /> : <Building2 className="text-orange-400" size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{user.recruiterDetail?.companyName}</p>
                                            <p className="text-[10px] text-orange-600 font-bold uppercase">{user.recruiterDetail?.isRootRecruiter ? 'Register Recruiter' : 'Recruiter'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 bg-white rounded-[32px] border border-gray-50 shadow-sm p-10 flex flex-col">
                            <h4 className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-12">User Platform Dossier</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {!baseInfo?.role?.includes('ADMIN') && (
                                    <>
                                        <DossierItem
                                            icon={<Briefcase size={22} />}
                                            label={isCandidate ? "CVs Uploaded" : "Job Posts"}
                                            value={baseInfo?.mainActivity}
                                        />
                                        <DossierItem
                                            icon={isCandidate ? <FileText size={22} /> : <Building2 size={22} />}
                                            label={isCandidate ? "Applications" : "Company"}
                                            value={baseInfo?.subActivity}
                                        />
                                    </>
                                )}

                                {isCandidate && (
                                    <>
                                        <DossierItem
                                            icon={<Clock size={22} />}
                                            label="Availability"
                                            value={user.candidateDetail?.availabilityDate || 'Immediate'}
                                        />
                                        <DossierItem
                                            icon={<User size={22} />}
                                            label="Profile public"
                                            value={user.candidateDetail?.isPublic ? 'Yes' : 'No'}
                                        />
                                    </>
                                )}

                                <DossierItem
                                    icon={<ShieldCheck size={22} />}
                                    label="Role Permission"
                                    value={baseInfo?.role}
                                />
                            </div>

                            <div className="mt-auto pt-12 flex justify-end gap-3 border-t border-gray-50">
                                {baseInfo?.status === 'PENDING' && (
                                    <>
                                        <Button
                                            mode="secondary"
                                            onClick={() => openConfirmModal('INACTIVE')}
                                            disabled={isUpdating}
                                        >
                                            Reject / Inactive
                                        </Button>
                                        <Button
                                            mode="primary"
                                            onClick={() => openConfirmModal('ACTIVE')}
                                            disabled={isUpdating}
                                        >
                                            Verify & Activate
                                        </Button>
                                    </>
                                )}

                                {baseInfo?.status === 'ACTIVE' && (
                                    <Button
                                        mode="secondary"
                                        onClick={() => openConfirmModal('INACTIVE')}
                                        disabled={isUpdating}
                                    >
                                        Disable Account
                                    </Button>
                                )}

                                {(baseInfo?.status === 'INACTIVE' || baseInfo?.status === 'SUSPENDED') && (
                                    <Button
                                        mode="primary"
                                        onClick={() => openConfirmModal('ACTIVE')}
                                        disabled={isUpdating}
                                    >
                                        Activate Account
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Resumes' && (
                    <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm mb-10">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[40%]">Document Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%]">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[15%] text-center">View CV</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {user.candidateDetail?.resumes?.map((resume) => (
                                    <tr key={resume.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500 transition-all">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-neutral-800 ">{resume.resumeName || resume.fileName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getResumeStatusStyle(resume.status)}`}>
                                                {resume.status?.replace('_', ' ') || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <a href={resume.resumeUrl} target="_blank" rel="noreferrer"
                                                className="inline-flex p-2.5 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-white border border-transparent hover:border-orange-100 rounded-xl transition-all shadow-sm">
                                                <ExternalLink size={16} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!user.candidateDetail?.resumes || user.candidateDetail.resumes.length === 0) && (
                            <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">No documents uploaded</div>
                        )}
                    </div>
                )}

                {activeTab === 'Jobs' && (
                    <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm mb-10">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[45%]">Jobs</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%]">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%]">Upload Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[15%] text-center">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {user.recruiterDetail?.jobs?.map((job) => (
                                    <tr key={job.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 text-neutral-400 rounded-xl flex items-center justify-center font-black text-xs transition-all ">
                                                    {job.id}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-neutral-800 truncate">{job.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getJobStatusStyle(job.status)}`}>
                                                {job.status?.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-neutral-700">{dayjs(job.uploadTime).format('DD MMM, YYYY')}</span>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase">at {dayjs(job.uploadTime).format('HH:mm')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-white border border-transparent hover:border-blue-100 rounded-xl transition-all shadow-sm">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!user.recruiterDetail?.jobs || user.recruiterDetail.jobs.length === 0) && (
                            <div className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">No jobs posted yet</div>
                        )}
                    </div>
                )}
            </div>
            {isStatusModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                            <ShieldAlert size={32} />
                        </div>

                        <h3 className="text-xl font-black text-neutral-800 mb-2">
                            Confirm Status Change
                        </h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            Are you sure you want to change this user's status to
                            <span className="font-black text-neutral-800 mx-1 uppercase tracking-tighter">
                                {pendingStatusUpdate}
                            </span>?
                            This action will take effect immediately on the platform.
                        </p>

                        <div className="flex gap-3 w-full">
                            <Button
                                mode="secondary"
                                className="flex-1"
                                onClick={() => setIsStatusModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                mode="primary"
                                className={`${pendingStatusUpdate === 'INACTIVE' ? '' : ''}`}
                                onClick={handleConfirmStatusUpdate}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Processing...' : 'Confirm Change'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// HELPER COMPONENTS
const SidebarItem = ({ label, value, icon }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-bold text-orange-200 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-3">
            <span className="text-orange-200">{icon}</span>
            <span className="text-xs font-bold text-white">{value || '-'}</span>
        </div>
    </div>
);

const DossierItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-5 group">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 border border-orange-100 group-hover:bg-orange-100 transition-colors flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-gray-800">{value || '-'}</p>
        </div>
    </div>
);

const SocialLink = ({ label, url }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
        <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
        {url ? (
            <a href={url} target="_blank" className="text-blue-500 hover:text-blue-700 transition-colors"><ExternalLink size={14} /></a>
        ) : (
            <span className="text-[10px] text-gray-300 italic font-medium">Not linked</span>
        )}
    </div>
);

export default UserDetail;
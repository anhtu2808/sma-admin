import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAdminJobDetailQuery, useUpdateAdminJobStatusMutation } from '@/apis/apis';
import {
    ChevronLeft, Building2, Globe, FileText, Briefcase,
    Calendar, Mail, ExternalLink, ShieldCheck, Users,
    Pen, DollarSign, Layers, Target, BrainCircuit,
    UserCheck, HelpCircle, Check, AlertTriangle,
    Upload, Hash, ArrowUpRight, Link, MapPin
} from 'lucide-react';
import Button from '@/components/Button';
import moment from 'moment';
import { Spin, message, Tag } from 'antd';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [reason, setReason] = useState('');

    const { data, isLoading, isError, refetch } = useGetAdminJobDetailQuery(id, {
        refetchOnMountOrArgChange: true
    });
    const job = data?.data;
    const [updateStatus, { isLoading: isUpdating }] = useUpdateAdminJobStatusMutation();

    useEffect(() => {
        if (job?.id && job?.status === 'PENDING_REVIEW') {
            console.log("🚀 Admin is reviewing a flagged job...");
        }
    }, [job?.id, job?.status]);

    if (isLoading) return <div className="p-10 text-center font-bold text-gray-400 tracking-widest uppercase animate-pulse">LOADING JOB DOSSIER...</div>;

    if (isError || !job) return (
        <div className="p-10 text-center flex flex-col items-center gap-4 font-body">
            <AlertTriangle className="text-red-500" size={48} />
            <p className="text-red-500 font-bold uppercase tracking-widest">COULD NOT RETRIEVE JOB DATA</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PUBLISHED': return 'text-green-600 bg-green-50 border-green-100';
            case 'PENDING_REVIEW': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'SUSPENDED': return 'text-red-600 bg-red-50 border-red-100';
            case 'CLOSED': return 'text-gray-600 bg-gray-50 border-gray-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    const confirmUpdateStatus = async () => {
        try {
            await updateStatus({
                jobId: id,
                jobStatus: pendingStatus
            }).unwrap();

            message.success(`Job status updated to ${pendingStatus}`);
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            message.error(error?.data?.message || "Update failed");
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 overflow-hidden font-body">
            {/* HEADER AREA */}
            <div className="flex-shrink-0 flex items-center justify-between px-4">
                <div className="flex-shrink-0 flex items-center gap-6 px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-primary transition-all flex-shrink-0"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                            {job.company?.logo ? (
                                <img src={job.company.logo} className="w-full h-full object-cover" alt="logo" />
                            ) : (
                                <Briefcase className="text-orange-500" size={32} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#111c2d] leading-tight tracking-tight">{job.name}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">
                                ID: {job.id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB SELECTION */}
            <div className="flex-shrink-0 px-6 mt-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex gap-10">
                    {[
                        { id: 'Overview', label: 'OVERVIEW' },
                        { id: 'AI Rules', label: 'AI SCORING' },
                        { id: 'Company', label: 'ORGANIZATION' }
                    ].map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 text-[10px] font-extrabold tracking-[0.15em] transition-all duration-300 relative ${isActive ? 'text-[#111c2d]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab.label}
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                            </button>
                        );
                    })}
                </div>

                <div className="pb-4">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(job.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {job.status?.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">

                {activeTab === 'Overview' && (
                    <div className="flex flex-col lg:flex-row gap-8 pb-10 mt-4">
                        {/* LEFT SIDEBAR: DARK SPECS CARD */}
                        <div className="w-full lg:w-[350px] flex-shrink-0">
                            <div className="bg-orange-300 text-white rounded-[32px] p-8 shadow-lg relative overflow-hidden shadow-orange-200/50">
                                <div className="relative z-10 space-y-8">
                                    <p className="text-[10px] font-bold text-orange-700 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <ShieldCheck size={14} /> Employment Specs
                                    </p>
                                    <div className="space-y-6">
                                        <SidebarItem icon={<DollarSign size={16} className="text-white" />} label="Salary Range" value={`${job.salaryStart?.toLocaleString()} - ${job.salaryEnd?.toLocaleString()} ${job.currency}`} />
                                        <SidebarItem icon={<Layers size={16} className="text-white" />} label="Working Model" value={job.workingModel} />
                                        <SidebarItem icon={<UserCheck size={16} className="text-white" />} label="Experience Required" value={`${job.experienceTime || 0} Years`} />
                                        <SidebarItem icon={<Calendar size={16} className="text-white" />} label="Expiration Date" value={moment(job.expDate).format('DD MMM, YYYY')} />
                                    </div>
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl" />
                            </div>

                            <div className="mt-6 bg-white rounded-3xl p-6 border border-gray-50 shadow-sm space-y-6">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Required Stack</p>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Layers size={14} className="text-orange-500" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Skills</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills?.length > 0 ? (
                                            job.skills.map(skill => (
                                                <span key={skill.id} className="px-3 py-1.5 bg-orange-50/50 text-orange-600 rounded-xl text-[10px] font-black border border-orange-100/50 hover:bg-orange-100 transition-all cursor-default">
                                                    {skill.name}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-gray-300 italic ml-1">No specific skills listed</p>
                                        )}
                                    </div>
                                </div>

                                {/* Divider nhẹ */}
                                <div className="border-t border-gray-50 w-full" />

                                {/* Section: Domains */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Globe size={14} className="text-blue-500" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Domains</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.domains?.length > 0 ? (
                                            job.domains.map(domain => (
                                                <span key={domain.id} className="px-3 py-1.5 bg-blue-50/50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100/50 hover:bg-blue-50 transition-all cursor-default">
                                                    {domain.name}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-gray-300 italic ml-1">No domains specified</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT: DOSSIER ITEMS */}
                        <div className="flex-1 bg-white rounded-[32px] border border-gray-50 shadow-sm p-10 flex flex-col">
                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Job Description Dossier</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {job.isViolated && (
                                    <div className="md:col-span-2 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                                        <AlertTriangle className="text-red-500" size={20} />
                                        <div>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Automatic Flag</p>
                                            <p className="text-sm font-bold text-red-700">This post contains suspicious or banned keywords.</p>
                                        </div>
                                    </div>
                                )}
                                <DossierItem icon={<Briefcase size={22} />} label="Professional Expertise" value={job.expertise?.name} />
                                <DossierItem icon={<Target size={22} />} label="Job Level" value={job.jobLevel} />
                                <DossierItem icon={<Users size={22} />} label="Hiring Quantity" value={`${job.quantity || '-'} Candidates`} />
                                <DossierItem icon={<Calendar size={22} />} label="Date Uploaded" value={moment(job.uploadTime).format('LLL')} />
                                <DossierItem
                                    icon={<Hash size={22} />}
                                    label="Root Job"
                                    value={job.rootJob ? (
                                        <div
                                            onClick={() => navigate(`/jobs/${job.rootJob.id}`)}
                                            className="cursor-pointer hover:underline flex items-center gap-1 group"
                                        >
                                            ID: {job.rootJob.id} - {job.rootJob.name}
                                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    ) : "-"}
                                />
                                <DossierItem
                                    icon={<Check size={22} />}
                                    label="Benefits"
                                    value={
                                        job.benefits?.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {job.benefits.map(benefit => (
                                                    <span
                                                        key={benefit.id}
                                                        className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black border border-green-100 uppercase tracking-tighter"
                                                    >
                                                        {benefit.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : "No specific benefits listed"
                                    }
                                />



                                <div className="md:col-span-2 space-y-8 mt-4 pt-10 border-t border-gray-50">
                                    <section>
                                        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <FileText size={14} /> About
                                        </h5>
                                        <p className="text-gray-500 leading-relaxed text-sm text-justify whitespace-pre-wrap">{job.about}</p>
                                    </section>
                                    <section>
                                        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Pen size={14} /> Responsibilities
                                        </h5>
                                        <p className="text-gray-500 leading-relaxed text-sm text-justify whitespace-pre-wrap">{job.responsibilities}</p>
                                    </section>
                                    <section>
                                        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <ShieldCheck size={14} /> Requirements
                                        </h5>
                                        <p className="text-gray-500 leading-relaxed text-sm text-justify whitespace-pre-wrap">{job.requirement}</p>
                                    </section>
                                    <section className="pt-4">
                                        <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <HelpCircle size={14} className="text-orange-500" /> Screening Questions ({job.questions?.length || 0})
                                        </h5>

                                        <div className="grid grid-cols-1 gap-4">
                                            {job.questions && job.questions.length > 0 ? (
                                                job.questions.map((q, index) => (
                                                    <div key={q.id || index} className="group p-5 bg-gray-50/50 rounded-[24px] border border-gray-100 hover:bg-white hover:shadow-md hover:border-orange-100 transition-all duration-300">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex gap-4">
                                                                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:text-orange-500 transition-colors">
                                                                    {index + 1}
                                                                </span>

                                                                <div className="space-y-1">
                                                                    <p className="text-sm font-bold text-gray-800 leading-snug">
                                                                        {q.question}
                                                                        {q.isRequired && <span className="text-red-500 ml-1.5">*</span>}
                                                                    </p>

                                                                    {q.description && (
                                                                        <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed">
                                                                            {q.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {q.isRequired && (
                                                                <span className="flex-shrink-0 px-2 py-0.5 bg-red-50 text-red-600 text-[8px] font-black rounded-md uppercase tracking-tighter border border-red-100">
                                                                    Mandatory
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 bg-gray-50/30 rounded-[32px] border border-dashed border-gray-200 text-center">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No screening questions configured</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <div className="mt-auto pt-12 flex justify-end items-center gap-3">
                                <Button
                                    mode="secondary"
                                    className="!text-red-500"
                                    onClick={() => { setPendingStatus('SUSPENDED'); setIsModalOpen(true); }}
                                    disabled={job.status === 'SUSPENDED' || isUpdating || job.status === 'CLOSED' || job.status === 'DRAFT'}
                                >
                                    Suspend Post
                                </Button>
                                <Button
                                    mode="primary"
                                    onClick={() => { setPendingStatus('PUBLISHED'); setIsModalOpen(true); }}
                                    disabled={job.status === 'PUBLISHED' || isUpdating || job.status === 'CLOSED' || job.status === 'DRAFT'}
                                >
                                    {job.status === 'PENDING_REVIEW' ? 'Verify & Publish' : 'Re-publish Post'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: AI SCORING */}
                {activeTab === 'AI Rules' && (
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 pb-10 mt-4 font-body">
                        <div className="bg-white rounded-[32px] border border-gray-50 p-10 shadow-sm">
                            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <BrainCircuit size={18} className="text-orange-500" /> Custom Scoring Rules
                            </h5>
                            <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed mb-4">
                                {job.enableAiScoring ? 'AI Scoring is enabled for this job post.' : 'AI Scoring is disabled for this job post.'}
                            </p>
                            <div className="space-y-4">
                                {job.scoringCriterias?.map((crit, idx) => (
                                    <div key={idx} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-orange-200 transition-all">
                                        <span className="text-sm font-bold text-gray-700">{crit.context}</span>
                                        <span className="px-3 py-1 bg-white rounded-lg text-xs font-black shadow-sm text-primary">WEIGHT: {crit.weight}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: COMPANY INFO */}
                {activeTab === 'Company' && (
                    <div className="pb-10 mt-4 bg-white rounded-[40px] border border-gray-50 p-12 shadow-sm flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[32px] bg-orange-50 flex items-center justify-center mb-6 shadow-inner">
                            {job.company?.logo ? <img src={job.company.logo} className="w-full h-full object-cover rounded-[32px]" /> : <Building2 className="text-orange-500" size={48} />}
                        </div>
                        <h3 className="text-xl font-black text-[#111c2d] mb-2 uppercase tracking-tighter">{job.company?.name}</h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-10">{job.company?.companyIndustry}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl text-left border-t border-gray-50 pt-10">
                            <DossierItem label="Industry" value={job.company?.companyIndustry} icon={<Briefcase size={20} />} />
                            <DossierItem label="Followers" value={`${job.company?.followerNumber || 0} Followers`} icon={<Check size={20} />} />
                            <DossierItem label="Website" value={job.company?.link} icon={<Globe size={20} />} isLink />
                            <DossierItem label="Location" value={job.company?.location} icon={<MapPin size={20} />} />
                        </div>

                        <Button className="mt-12" mode="secondary" onClick={() => navigate(`/companies/${job.company.id}`)}>
                            Go to Company Profile
                        </Button>
                    </div>
                )}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300 text-center">
                            <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${pendingStatus === 'PUBLISHED' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                {pendingStatus === 'PUBLISHED' ? <Check size={40} /> : <AlertTriangle size={40} />}
                            </div>
                            <h3 className="text-2xl font-black text-[#111c2d] mb-2 uppercase tracking-tight">Confirm Action</h3>
                            <p className="text-sm text-gray-500 font-medium mb-8">
                                Are you sure you want to change this job post status to <span className="font-black text-primary">{pendingStatus}</span>?
                            </p>
                            <div className="flex gap-4">
                                <Button mode="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button mode="primary" className="flex-1" onClick={confirmUpdateStatus} disabled={isUpdating}>
                                    {isUpdating ? 'Executing...' : 'Proceed'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CONFIRMATION MODAL */}

        </div>
    );
};

// SUB-COMPONENTS
const SidebarItem = ({ icon, label, value, color }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.1em]">{label}</p>
        <div className="flex items-center gap-3">
            <span className="text-gray-400">{icon}</span>
            <span className={`text-xs font-bold ${color || 'text-white'}`}>{value || 'N/A'}</span>
        </div>
    </div>
);

const DossierItem = ({ icon, label, value, isLink }) => (
    <div className="flex items-start gap-5 group">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 border border-orange-100 flex-shrink-0 group-hover:bg-orange-100 transition-colors">
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            {isLink && value ? (
                <a href={value} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:text-orange-500 transition-colors truncate block">
                    {value}
                </a>
            ) : (
                <div className="text-sm font-bold text-gray-800 break-words">
                    {(value !== null && value !== undefined) ? value : '-'}
                </div>
            )}
        </div>
    </div>

);

export default JobDetail;
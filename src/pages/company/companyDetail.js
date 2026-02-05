import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAdminCompanyDetailQuery, useSetUnderReviewMutation, useUpdateCompanyStatusMutation } from '@/apis/apis';
import {
    ChevronLeft, Building2, MapPin, Globe, FileText, Briefcase, Map,
    Users, Calendar, Mail, Phone, ExternalLink, ShieldCheck,
    Pen
} from 'lucide-react';
import Button from '@/components/Button';
import HRTeamTab from './hrTeam';

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    const { data, isLoading, isError } = useGetAdminCompanyDetailQuery(id);
    const company = data?.data;
    const [setUnderReview] = useSetUnderReviewMutation();
    const [pendingStatus, setPendingStatus] = useState(null);
    const [updateStatus, { isLoading: isUpdating }] = useUpdateCompanyStatusMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (company?.id && company?.status === 'PENDING_VERIFICATION') {
            setUnderReview(company.id)
                .unwrap()
                .catch((err) => console.error("Failed to update status:", err));
        }
    }, [company?.id, company?.status, setUnderReview]);

    if (isLoading) return <div className="p-10 text-center font-bold text-gray-400 tracking-widest">LOADING DOSSIER...</div>;

    if (isError || !company) return (
        <div className="p-10 text-center flex flex-col items-center gap-4">
            <p className="text-red-500 font-bold">COULD NOT RETRIEVE COMPANY DATA</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
    );

    const primaryLocation = company.locations?.[0]?.address || company.country || 'N/A';
    const hrTeamSize = Array.isArray(company.recruiters) ? company.recruiters.length : 0;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-50 border-green-100';
            case 'UNDER_REVIEW': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'PENDING_VERIFICATION': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'REJECTED': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const confirmUpdateStatus = async () => {
        if (!reason.trim() && pendingStatus === 'REJECTED') {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            await updateStatus({
                companyId: id,
                status: pendingStatus,
                reason: reason
            }).unwrap();

            setIsModalOpen(false);
            setReason('');
            navigate('/companies');
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-between px-4">
                <div className="flex-shrink-0 flex items-center gap-6 px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-primary transition-all flex-shrink-0"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {company.logo ? (
                                <img src={company.logo} className="w-full h-full object-cover" alt="logo" />
                            ) : (
                                <Building2 className="text-orange-500" size={32} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#111c2d] leading-tight">{company.name}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">
                                Verified Organization Profile
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 px-2 mt-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex gap-10">
                    {[
                        { id: 'Overview', label: 'OVERVIEW' },
                        { id: 'HR Team', label: `HR TEAM (${hrTeamSize})` },
                        { id: 'Jobs', label: `JOB LISTINGS (${company.totalJobs ?? 0})` }
                    ].map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    pb-4 text-[10px] font-extrabold tracking-[0.15em] transition-all duration-300 relative
                                    ${isActive ? 'text-[#111c2d]' : 'text-gray-400 hover:text-gray-600'}
                                `}
                            >
                                {tab.label}

                                <div className={`
                                    absolute bottom-0 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300
                                    ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}
                                `} />
                            </button>
                        );
                    })}
                </div>

                <div className="pb-4">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(company.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${company.status === 'APPROVED' ? 'bg-green-600' : 'bg-current'
                            }`} />
                        {company.status?.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* CONTENT AREA: Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">

                {/* HIỂN THỊ TAB OVERVIEW */}
                {activeTab === 'Overview' && (
                    <div className="flex flex-col lg:flex-row gap-8 pb-10">
                        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                            <div className="flex flex-col lg:flex-row gap-8 pb-10">

                                <div className="w-full lg:w-[350px] flex-shrink-0">
                                    <div className="bg-orange-300 text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden shadow-orange-200/50">
                                        <div className="relative z-10 space-y-8">
                                            <p className="text-[10px] font-bold text-orange-700 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <ShieldCheck size={14} /> Requested Account Info
                                            </p>

                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold mb-4 border border-white/30 shadow-lg">
                                                    {company.recruiters?.[0]?.fullName?.charAt(0) || 'S'}
                                                </div>
                                            </div>

                                            <div className="space-y-6 pt-4">
                                                <SidebarItem icon={<Mail size={16} className="text-orange-200" />} label="Recruiter Email" value={company.recruiters?.[0]?.email || 'No email available'} />
                                                <SidebarItem icon={<Phone size={16} className="text-orange-200" />} label="Contact Phone" value={company.phone} />
                                                {/* <SidebarItem icon={<Users size={16} className="text-orange-200" />} label="Members" value={`${hrTeamSize} Members`} color="text-white" /> */}
                                                {/* <SidebarItem icon={<Calendar size={16} className="text-orange-200" />} label="Billing Status" value="PAID & ACTIVE" color="text-white" /> */}
                                            </div>
                                        </div>
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
                                    </div>

                                    <div className="mt-6 bg-white rounded-3xl p-6 border border-gray-50 shadow-sm">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Verification Assets</p>

                                        {company.erc ? (
                                            <a
                                                href={company.erc}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 group cursor-pointer hover:bg-orange-50 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="text-orange-500" size={18} />
                                                    <span className="text-sm font-bold text-gray-700">Business License (ERC)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-orange-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                                        View Image
                                                    </span>
                                                    <ExternalLink size={14} className="text-orange-300" />
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                                <p className="text-xs text-gray-400 font-medium">No ERC image uploaded</p>
                                            </div>
                                        )}

                                        <p className="mt-4 text-[10px] text-orange-600 font-bold flex items-center gap-2">
                                            <ShieldCheck size={14} /> Business License / ERC File
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 bg-white rounded-[32px] border border-gray-50 shadow-sm p-10 flex flex-col">
                                    <h4 className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-12">
                                        Company Profile Dossier
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        {company.status === 'REJECTED' && company.rejectReason && (
                                            <div className="md:col-span-2 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Rejection Reason</p>
                                                <p className="text-sm font-bold text-red-700">{company.rejectReason}</p>
                                            </div>
                                        )}
                                        <DossierItem icon={<Briefcase size={22} />} label="Industry" value={company.companyIndustry} />
                                        <DossierItem icon={<FileText size={22} />} label="Tax Identification" value={company.taxIdentificationNumber} />
                                        <DossierItem icon={<Globe size={22} />} label="Company Email" value={company.email} />
                                        <DossierItem icon={<Globe size={22} />} label="Website URL" value={company.link} isLink />
                                        <DossierItem icon={<Users size={22} />} label="Workforce Scale" value={`${company.size || 'N/A'} Employees`} />
                                        <DossierItem icon={<FileText size={22} />} label="Company Type" value={company.companyType || 'N/A'} />
                                        <DossierItem icon={<Map size={22} />} label="Country" value={company.country} />
                                        <DossierItem icon={<Pen size={22} />} label="Sign Commitment" value={company.signCommitment || 'N/A'} />
                                        <DossierItem icon={<Calendar size={22} />} label="Total Jobs" value={company.totalJobs ?? 0} />
                                        <DossierItem icon={<Users size={22} />} label="Followers" value={company.totalFollowers ?? 0} />
                                        <DossierItem
                                            icon={<MapPin size={22} />}
                                            label="Company Locations"
                                            value={
                                                company.locations && company.locations.length > 0 ? (
                                                    <div className="space-y-2 mt-1">
                                                        {company.locations.map((loc, index) => (
                                                            <div key={index} className="flex flex-col border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                                                <p className="text-sm font-bold text-gray-800 break-words leading-snug">
                                                                    {loc.address}
                                                                </p>
                                                                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">
                                                                    {loc.country || company.country}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    company.country || 'N/A'
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="mt-12 pt-12 border-t border-gray-50">
                                        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">About Organization</h5>
                                        <p className="text-gray-500 leading-relaxed text-sm text-justify">
                                            {company.description}
                                        </p>
                                    </div>
                                    <div className="mt-12 pt-12 border-t border-gray-50">
                                        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Image</h5>
                                        <p className="text-gray-500 leading-relaxed text-sm text-justify">
                                            {company.images && company.images.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {company.images.map((imgUrl, index) => (
                                                        <img key={index} src={imgUrl} alt={`Company Image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 italic">No images available</p>
                                            )}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-12 flex justify-end items-center gap-3">
                                        <Button
                                            mode="secondary"
                                            onClick={() => {
                                                setPendingStatus('REJECTED');
                                                setIsModalOpen(true);
                                            }}
                                            disabled={company.status === 'APPROVED' || company.status === 'REJECTED' || isUpdating}
                                        >
                                            Reject
                                        </Button>

                                        <Button
                                            mode="primary"
                                            onClick={() => {
                                                setPendingStatus('APPROVED');
                                                setIsModalOpen(true);
                                            }}
                                            disabled={company.status === 'APPROVED' || company.status === 'REJECTED' || isUpdating}
                                        >
                                            {company.status === 'APPROVED' ? 'Already Verified' : 'Approve & Verify'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* HIỂN THỊ TAB HR TEAM */}
                {activeTab === 'HR Team' && (
                    <div className="pb-10">
                        <HRTeamTab recruiters={company?.recruiters} />
                    </div>
                )}

                {/* HIỂN THỊ TAB JOB LISTINGS */}
                {activeTab === 'Jobs' && (
                    <div className="pb-10 bg-white rounded-[32px] border border-gray-50 p-20 text-center text-gray-400">
                        <Briefcase className="mx-auto mb-4 opacity-20" size={48} />
                        <p>Job Listings for this organization are currently being synchronized...</p>
                    </div>
                )}
            </div>
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <h3 className="text-xl font-bold text-[#111c2d] mb-2">
                                Confirm {pendingStatus === 'APPROVED' ? 'Approval' : 'Rejection'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Please provide a brief reason or note for this action.
                            </p>

                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason here..."
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none mb-6"
                            />

                            <div className="flex gap-3">
                                <Button
                                    mode="secondary"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="primary"
                                    onClick={confirmUpdateStatus}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Processing...' : 'Confirm'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

// Sub-components
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
                <p className="text-sm font-bold text-gray-800 break-words">
                    {(value !== null && value !== undefined) ? value : 'N/A'}
                </p>
            )}
        </div>
    </div>

);


export default CompanyDetail;

import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Eye } from 'lucide-react';

const HRTeamTab = ({ recruiters, onAddClick }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden mb-10">
            {/* Table Header */}
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h4 className="text-[11px] font-bold text-[#111c2d] uppercase tracking-[0.2em]">
                </h4>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold text-[10px] uppercase tracking-wider transition-colors"
                >
                    <Users size={14} />
                    Add Member
                </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[45%]">Member Details</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[15%]">Role</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%]">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] w-[20%] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {recruiters?.map((hr) => (
                            <tr key={hr.id} className="hover:bg-orange-50/10 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar Thumbnail */}
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-sm">
                                            {hr.fullName?.charAt(0) || hr.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#111c2d]">{hr.fullName || 'Authorized Recruiter'}</p>
                                            <p className="text-xs text-gray-400 font-medium">{hr.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                        {hr.isRootRecruiter ? 'Register Recruiter' : 'Recruiter'}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${hr.isVerified
                                        ? 'bg-green-50 text-green-600 border-green-100'
                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                        <span className={`w-1 h-1 rounded-full ${hr.isVerified ? 'bg-green-600' : 'bg-orange-600'}`} />
                                        {hr.isVerified ? 'Active' : 'Inactive'}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => navigate(`/users/${hr.userId}`)}
                                        className="flex items-center gap-2 ml-auto text-[10px] font-black text-gray-300 group-hover:text-orange-500 uppercase tracking-widest transition-all"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {(!recruiters || recruiters.length === 0) && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-medium tracking-tight">No recruitment officers registered.</p>
                </div>
            )}
        </div>
    );
};

export default HRTeamTab;
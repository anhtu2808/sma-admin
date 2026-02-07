import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, Search, Building2, UserPlus } from 'lucide-react';
import Button from '@/components/Button';
import { useGetAdminCompaniesQuery } from '@/apis/apis';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

const CreateUserModal = ({ isOpen, onClose, onCreate, isLoading }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'CANDIDATE',
        companyId: null
    });
    const [companySearch, setCompanySearch] = useState('');
    const [serverError, setServerError] = useState('');

    const { data: companies } = useGetAdminCompaniesQuery(
        { name: companySearch, size: 5 },
        { skip: formData.role !== 'RECRUITER' || !isOpen }
    );

    const roles = [
        { id: 'CANDIDATE', name: 'Candidate' },
        { id: 'RECRUITER', name: 'Recruiter' },
        { id: 'ADMIN', name: 'Admin' }
    ];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        try {
            await onCreate(formData);
            onClose();
        } catch (err) {
            const mainMessage = err?.data?.message || 'Error occurred';
            const details = err?.data?.data;

            if (details && typeof details === 'object') {
                const detailedMessages = Object.entries(details)
                    .map(([field, msg]) => `${field.toUpperCase()}: ${msg}`)
                    .join(' | ');

                setServerError(`${mainMessage} - ${detailedMessages}`);
            } else {
                setServerError(mainMessage);
            }

            console.error("Backend Payload:", err.data);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0f15]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-black text-neutral-800 uppercase tracking-tighter">Create User</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manual Account Creation</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                {serverError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                            <p className="text-[11px] font-black text-red-600 uppercase tracking-tight">
                                Execution Failed
                            </p>
                        </div>

                        <div className="ml-7 space-y-1">
                            {serverError.split(' | ').map((msg, index) => (
                                <p key={index} className="text-[10px] font-bold text-red-500/80 lowercase italic">
                                    • {msg}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Account Email<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input required type="email" placeholder="example@domain.com"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                                onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Security Password<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input required type="password" placeholder="Min 6 characters"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                                onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-1 relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Access Role<span className="text-red-500">*</span></label>

                        <Listbox
                            value={roles.find(r => r.id === formData.role)}
                            onChange={(val) => setFormData({ ...formData, role: val.id, companyId: null })}
                        >
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-default rounded-2xl bg-gray-50 border border-gray-100 py-3 pl-12 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <span className="block truncate text-xs font-bold uppercase tracking-wider text-neutral-700">
                                        {roles.find(r => r.id === formData.role)?.name}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                        <ChevronDown className="h-4 w-4 text-gray-300" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                        {roles.map((role) => (
                                            <Listbox.Option
                                                key={role.id}
                                                value={role}
                                                className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-orange-50 text-orange-500' : 'text-neutral-700'}`}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className={`block truncate text-[10px] font-black uppercase tracking-widest ${selected ? 'text-orange-500' : 'text-neutral-600'}`}>
                                                            {role.name}
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

                    {formData.role === 'RECRUITER' && (
                        <div className="space-y-2 pt-2 animate-in fade-in duration-300">
                            <label className="text-[10px] font-black text-orange-500 uppercase ml-1">Assign Company<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input placeholder="Search company name..."
                                    className="w-full pl-10 pr-4 py-3 bg-orange-50/50 border border-orange-100 rounded-2xl text-xs font-bold outline-none"
                                    value={companySearch} onChange={e => setCompanySearch(e.target.value)} />
                            </div>
                            <div className="max-h-32 overflow-y-auto rounded-2xl border border-gray-100 bg-white">
                                {companies?.data?.content?.map(comp => (
                                    <div key={comp.id}
                                        onClick={() => { setFormData({ ...formData, companyId: comp.id }); setCompanySearch(comp.name); }}
                                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${formData.companyId === comp.id ? 'bg-orange-500 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                                        <Building2 size={14} />
                                        <span className="text-[10px] font-black uppercase">{comp.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-6">
                        <Button mode="secondary" className="flex-1" onClick={onClose} type="button">Cancel</Button>
                        <Button mode="primary" isLoading={isLoading} type="submit"
                            disabled={formData.role === 'RECRUITER' && !formData.companyId}>
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
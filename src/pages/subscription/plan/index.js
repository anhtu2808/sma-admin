import React, { useState, useEffect } from 'react';
import {
    useGetPlansQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation
} from '../../../apis/subscriptionApi';
import {
    Plus, Edit3, Search, ChevronLeft, ChevronRight, X,
    ShieldCheck, Zap, Users, Building2, Tag, DollarSign, Check,
} from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { toast } from 'react-toastify';
import PlanModal from './planModal';

const PlanManagement = () => {
    const [page, setPage] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchName, setSearchName] = useState('');

    // Filtes
    const [selectedTarget, setSelectedTarget] = useState({ id: 'ALL', name: 'All Targets' });

    const { data, isLoading, refetch } = useGetPlansQuery({
        page,
        size: 10,
        name: searchName || undefined,
        planTarget: selectedTarget.id === 'ALL' ? undefined : selectedTarget.id
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = data?.data?.content || [];
    const pagination = data?.data || {};
    const totalPages = pagination.totalPages || 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchName(inputValue);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const openModal = (plan = null) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full font-body relative overflow-hidden">
            {/* Header Section */}
            <div className="flex items-center justify-between px-6 py-8">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark font-heading tracking-tight">
                        Subscription Plan Tiers
                    </h2>
                    <p className="text-subtext-light dark:text-subtext-dark text-sm mt-1 max-w-md">
                        Manage membership plans and pricing strategies
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Target Filter */}
                    <div className="relative w-48">
                        <Listbox
                            value={selectedTarget}
                            onChange={(val) => {
                                setSelectedTarget(val);
                                setPage(0);
                            }}
                        >
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-default rounded-2xl bg-white border border-neutral-100 py-2.5 pl-4 pr-10 text-left shadow-sm focus:ring-2 focus:ring-primary/20 transition-all">
                                    <span className="block truncate text-xs font-bold text-neutral-700">
                                        {selectedTarget.name}
                                    </span>

                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Users className="h-3.5 w-3.5 text-neutral-400" />
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    as={React.Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute z-50 mt-2 w-full overflow-auto rounded-2xl bg-white py-2 shadow-2xl border border-neutral-100">

                                        {[
                                            { id: 'ALL', name: 'All Targets' },
                                            { id: 'COMPANY', name: 'Recruiters' },
                                            { id: 'CANDIDATE', name: 'Candidates' }
                                        ].map((t) => (
                                            <Listbox.Option
                                                key={t.id}
                                                value={t}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active
                                                        ? 'bg-primary/5 text-primary'
                                                        : 'text-neutral-700'
                                                    }`
                                                }
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate text-xs ${selected
                                                                ? 'font-black text-primary'
                                                                : 'font-bold'
                                                                }`}
                                                        >
                                                            {t.name}
                                                        </span>

                                                        {selected && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
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

                    <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text" placeholder="Search plan name..."
                            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-100 rounded-2xl text-xs font-bold transition-all shadow-sm focus:ring-2 focus:ring-primary/10"
                        />
                    </div>

                    <Button mode="primary" iconLeft={<Plus size={14} strokeWidth={3} />} onClick={() => openModal()}>
                        CREATE PLAN
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 px-6 min-h-0">
                <Card className="!p-0 border-neutral-200 overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider w-20">ID</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider w-1/4">Plan Name</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider text-center">Target</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider text-center">Type</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider text-center">Prices</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider w-32 text-center">Status</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={7} className="px-6 py-6 bg-neutral-50/30 h-20"></td></tr>)
                                ) : plans.map((plan) => (
                                    <tr key={plan.id} className="group hover:bg-neutral-50 transition-all duration-200">
                                        <td className="px-6 py-5 text-[11px] font-bold text-neutral-400 font-mono">{plan.id}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-neutral-900 dark:text-white text-sm">{plan.name}</p>
                                                {plan.isPopular && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black rounded uppercase">Popular</span>}
                                                {plan.isDefault && (
                                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded uppercase border border-blue-200">Default</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-neutral-400 truncate max-w-[180px] font-medium">{plan.description || "No description provided"}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${plan.planTarget === 'COMPANY' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {plan.planTarget === 'COMPANY' ? <Building2 size={10} className="inline mr-1" /> : <Users size={10} className="inline mr-1" />}
                                                {plan.planTarget}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center text-[10px] font-black text-neutral-500 uppercase tracking-tighter">
                                            {plan.planType}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm text-orange-600 flex items-center gap-1.5 truncate">{plan.planPrices?.length || 0} Price Tiers</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black border ${plan.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-neutral-50 text-neutral-400'}`}>
                                                {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button onClick={() => openModal(plan)} className="p-2 text-neutral-400 hover:text-primary transition-all hover:scale-110">
                                                <Edit3 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Pagination */}
            <div className="pt-2 flex items-center justify-between dark:border-neutral-800 bg-white dark:bg-surface-dark mt-auto">
                <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                    Showing <span className="text-gray-900">{plans.length}</span> of <span className="text-gray-900">{pagination.totalElements || 0}</span> Plans
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className={`p-2 rounded-xl transition-all ${page === 0 ? 'text-neutral-100' : 'text-neutral-400 hover:bg-neutral-100'}`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setPage(index)}
                                className={`w-8 h-8 text-[10px] font-bold rounded-lg transition-all ${page === index
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-neutral-500 hover:bg-neutral-100'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={page >= totalPages - 1}
                        className={`p-2 rounded-xl transition-all ${page >= totalPages - 1 ? 'text-neutral-100' : 'text-neutral-400 hover:bg-neutral-100'}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <PlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plan={selectedPlan}
                onSuccess={refetch}
            />
        </div>
    );
};

export default PlanManagement;
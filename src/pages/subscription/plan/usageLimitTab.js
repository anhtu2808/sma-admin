import React, { useState } from 'react';
import {
    useGetUsageLimitsQuery,
    useAddUsageLimitMutation,
    useUpdateUsageLimitMutation,
    useDeleteUsageLimitMutation,
    useGetAllFeaturesQuery
} from '../../../apis/subscriptionApi';
import { Plus, Trash2, Shield, Info, X, Zap, Layers, AlertTriangle } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { toast } from 'react-toastify';
import { Combobox, Transition, Listbox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

const UsageLimitTab = ({ planId }) => {
    const { data: limitsData, refetch } = useGetUsageLimitsQuery(planId);
    const { data: featuresData } = useGetAllFeaturesQuery(false);
    const [query, setQuery] = useState('');

    const [addLimit, { isLoading: isAdding }] = useAddUsageLimitMutation();
    const [deleteLimit] = useDeleteUsageLimitMutation();

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [limitForm, setLimitForm] = useState({
        featureId: '',
        maxQuota: 10,
        limitUnit: 'PER_MONTH'
    });
    const unitOptions = [
        { id: 'PER_MONTH', name: 'PER MONTH' },
        { id: 'PER_YEAR', name: 'PER YEAR' },
        { id: 'TOTAL', name: 'TOTAL (ONE TIME)' }
    ];

    const limits = limitsData?.data || [];
    const features = featuresData?.data || [];
    const availableFeatures = features.filter(f => !limits.find(l => l.featureId === f.id));

    const filteredFeatures = query === ''
        ? availableFeatures
        : availableFeatures.filter((f) =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.featureKey.toLowerCase().includes(query.toLowerCase())
        );
    const handleSave = async () => {
        if (!limitForm.featureId) {
            setErrorMsg("Please select a feature to limit");
            return;
        }
        setErrorMsg(null);
        try {
            await addLimit({ planId, ...limitForm }).unwrap();
            toast.success("FEATURE LIMIT ASSIGNED");
            setIsAddingNew(false);
            setLimitForm({ featureId: '', maxQuota: 10, limitUnit: 'PER_MONTH' });
            refetch();
        } catch (err) {
            setErrorMsg(err?.data?.message || "Failed to assign limit");
        }
    };

    const handleDelete = async (featureId) => {
        try {
            await deleteLimit({ planId, featureId }).unwrap();
            toast.success("LIMIT REMOVED");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Action blocked");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Usage Specifications</h4>
                    <p className="text-[9px] text-neutral-300 font-bold uppercase mt-1">Define quotas for each system feature</p>
                </div>
                {!isAddingNew && availableFeatures.length > 0 && (
                    <button onClick={() => setIsAddingNew(true)} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                        <Plus size={16} strokeWidth={3} />
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {/* FORM ADD NEW */}
                {isAddingNew && (
                    <div className="p-6 bg-neutral-50 rounded-[32px] border-2 border-dashed border-primary/20 space-y-5 animate-in zoom-in duration-200">
                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                                <AlertTriangle size={14} className="text-red-500" />
                                <p className="text-[10px] text-red-600 font-black uppercase">{errorMsg}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Select Feature</label>
                            <Combobox
                                value={limitForm.featureId}
                                onChange={(val) => {
                                    setLimitForm({ ...limitForm, featureId: val });
                                    setQuery(''); // Reset query sau khi chọn
                                }}
                            >
                                <div className="relative">
                                    <div className="relative w-full cursor-default overflow-hidden rounded-2xl bg-white border border-neutral-200 text-left shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                        <Combobox.Input
                                            className="w-full border-none py-4 pl-4 pr-10 text-xs font-bold text-neutral-700 bg-transparent focus:outline-none placeholder:text-neutral-300"
                                            placeholder="Search by name or key..."
                                            displayValue={(featureId) =>
                                                features.find(f => f.id === featureId)?.name || ''
                                            }
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <ChevronDown className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                                        </Combobox.Button>
                                    </div>

                                    <Transition
                                        as={React.Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        afterLeave={() => setQuery('')}
                                    >
                                        <Combobox.Options className="absolute z-[110] mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                            {filteredFeatures.length === 0 && query !== '' ? (
                                                <div className="relative cursor-default select-none py-4 px-4 text-neutral-500 text-[10px] font-black uppercase tracking-widest text-center">
                                                    No unassigned features found.
                                                </div>
                                            ) : (
                                                filteredFeatures.map((f) => (
                                                    <Combobox.Option
                                                        key={f.id}
                                                        value={f.id}
                                                        className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700'}`}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <div className="flex flex-col">
                                                                    <span className={`block truncate text-xs ${selected ? 'font-black' : 'font-bold'}`}>
                                                                        {f.name}
                                                                    </span>
                                                                    <span className="text-[9px] font-medium opacity-50 uppercase tracking-tighter">
                                                                        {f.featureKey} • {f.usageType}
                                                                    </span>
                                                                </div>
                                                                {selected && (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                                        <Check size={14} strokeWidth={3} />
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </Combobox.Option>
                                                ))
                                            )}
                                        </Combobox.Options>
                                    </Transition>
                                </div>
                            </Combobox>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Max Quota</label>
                                <Input type="number" value={limitForm.maxQuota} onChange={e => setLimitForm({ ...limitForm, maxQuota: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Limit Unit</label>
                                <Listbox
                                    value={limitForm.limitUnit}
                                    onChange={(val) => setLimitForm({ ...limitForm, limitUnit: val })}
                                >
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className={`relative w-full cursor-default rounded-2xl bg-white border border-neutral-200 py-4 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${open ? 'ring-2 ring-primary/20' : ''}`}>
                                                <span className="block truncate text-xs font-black text-neutral-700 uppercase">
                                                    {unitOptions.find(opt => opt.id === limitForm.limitUnit)?.name || 'Select Unit'}
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <ChevronDown
                                                        className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </Listbox.Button>

                                            <Transition
                                                as={React.Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-[110] mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                                    {unitOptions.map((unit) => (
                                                        <Listbox.Option
                                                            key={unit.id}
                                                            value={unit.id}
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700'
                                                                }`
                                                            }
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={`block truncate text-[11px] ${selected ? 'font-black text-primary' : 'font-bold'} uppercase`}>
                                                                        {unit.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                                            <Check size={14} strokeWidth={3} />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button mode="secondary" className="flex-1 font-black text-[10px]" onClick={() => setIsAddingNew(false)}>CANCEL</Button>
                            <Button mode="primary" className="font-black text-[10px]" onClick={handleSave} disabled={isAdding}>CONFIRM ASSIGN</Button>
                        </div>
                    </div>
                )}

                {/* LIST ASSIGNED LIMITS */}
                {limits.map((limit) => (
                    <div key={limit.featureId} className="p-5 bg-white rounded-[24px] border border-neutral-100 flex items-center justify-between group hover:border-primary/20 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                <Layers size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-neutral-800 uppercase tracking-tight">{limit.featureName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[9px] font-black">{limit.featureKey}</span>
                                    <span className="text-xs font-black text-orange-500">Allow: {limit.maxQuota} {limit.limitUnit.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDelete(limit.featureId)}
                            className="p-2.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {limits.length === 0 && !isAddingNew && (
                    <div className="py-20 text-center border-2 border-dashed border-neutral-100 rounded-[40px] bg-neutral-50/30">
                        <Zap size={32} className="mx-auto text-neutral-200 mb-4" />
                        <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em]">No features assigned to this plan</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsageLimitTab;
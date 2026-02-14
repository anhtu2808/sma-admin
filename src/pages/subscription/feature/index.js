import React, { useState, useEffect } from 'react';
import {
    useGetAllFeaturesQuery,
    useCreateFeatureMutation,
    useUpdateFeatureMutation,
} from '../../../apis/subscriptionApi'; // Đã cập nhật sang subscriptionApi
import { Plus, Edit3, Search, ChevronLeft, ChevronRight, X, ShieldCheck, Activity, ChevronDown, Check, Layers } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { toast } from 'react-toastify';
import { Listbox, Combobox, Transition } from '@headlessui/react';

const FeatureManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE');
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        usageType: 'EVENT',
        featureKey: 'AI_SCORING',
        isActive: true
    });

    const [createFeature, { isLoading: isCreating }] = useCreateFeatureMutation();
    const [updateFeature, { isLoading: isUpdating }] = useUpdateFeatureMutation();

    const [inputValue, setInputValue] = useState('');
    const [formError, setFormError] = useState(null);
    const [query, setQuery] = useState('');

    const { data, isLoading, refetch } = useGetAllFeaturesQuery(false);
    const features = data?.data || [];
    const filteredFeatures = features.filter(f =>
        f.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        f.featureKey.toLowerCase().includes(inputValue.toLowerCase())
    );

    const featureKeys = [
        'CV_UPLOAD_LIMIT',
        'EXPORT_SHORTLIST',
        'TALENT_SEARCH',
        'TALENT_UNLOCK',
        'AI_SUGGESTION',
        'MATCHING_SCORE',
        'DETAIL_MATCHING_SCORE',
        'RESUME_PARSING',
        'JOB_POST_LIMIT',
        'TEAM_MEMBER_LIMIT',
        'CUSTOM_CAREER_PAGE',
        'API_PARSING',
        'API_SCORING',
        'CHECKLIST',
    ];

    const usageTypeOptions = [
        { id: 'BOOLEAN', name: 'BOOLEAN' },
        { id: 'STATE', name: 'STATE' },
        { id: 'EVENT', name: 'EVENT' }
    ];

    const filteredKeys = query === ''
        ? featureKeys
        : featureKeys.filter((key) =>
            key.toLowerCase().includes(query.toLowerCase())
        );

    const openModal = (mode, feature = null) => {
        setModalMode(mode);
        setFormError(null);
        setQuery('');
        if (mode === 'UPDATE' && feature) {
            setSelectedFeature(feature);
            setFormData({
                name: feature.name,
                description: feature.description || '',
                usageType: feature.usageType,
                featureKey: feature.featureKey,
                isActive: feature.isActive
            });
        } else {
            setFormData({
                name: '',
                description: '',
                usageType: 'EVENT',
                featureKey: 'AI_SCORING',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', usageType: 'LIMITED', featureKey: '', isActive: true });
        setSelectedFeature(null);
        setFormError(null);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.featureKey.trim()) {
            setFormError("Name and Feature Key are required");
            toast.warn("Please fill in required fields");
            return;
        }

        try {
            if (modalMode === 'CREATE') {
                await createFeature(formData).unwrap();
                toast.success("NEW FEATURE DEFINED");
            } else {
                await updateFeature({ id: selectedFeature.id, ...formData }).unwrap();
                toast.success("FEATURE UPDATED SUCCESSFULLY");
            }
            handleCloseModal();
            refetch();
        } catch (error) {
            const msg = error?.data?.message || "ACTION FAILED";
            setFormError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex flex-col h-full font-body relative overflow-hidden">
            <div className="flex items-center justify-between px-6 py-8">
                <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading uppercase flex items-center gap-2">
                        <ShieldCheck className="text-primary" size={24} />
                        System Features
                    </h2>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1 tracking-widest uppercase">
                        Define and manage subscription-based functionalities
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text"
                            placeholder="Filter features..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold transition-all placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/10 focus:border-primary/20 shadow-sm"
                        />
                    </div>

                    <Button
                        mode="primary"
                        iconLeft={<Plus size={14} strokeWidth={3} />}
                        onClick={() => openModal('CREATE')}
                    >
                        DEFINE FEATURE
                    </Button>
                </div>
            </div>

            <div className="flex-1 px-6 min-h-0">
                <Card className="!p-0 border-neutral-200 overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead className="sticky top-0 z-10 bg-orange-100/80 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase w-20">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase w-1/4">Feature Info</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase">Key</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase w-32 text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-5 bg-neutral-50/30 h-16"></td>
                                        </tr>
                                    ))
                                ) : filteredFeatures.length > 0 ? (
                                    filteredFeatures.map((feature) => (
                                        <tr key={feature.id} className="group hover:bg-neutral-50 transition-all duration-200">
                                            <td className="px-6 py-5 text-[11px] font-bold text-neutral-400 font-mono">{feature.id}</td>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-neutral-900 dark:text-white text-sm">{feature.name}</p>
                                                <p className="text-[10px] text-neutral-400 truncate max-w-[200px]">{feature.description || "No description"}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-black uppercase tracking-tighter">
                                                        {feature.featureKey}
                                                    </span>

                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${feature.usageType === 'UNLIMITED' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {feature.usageType}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${feature.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'}`}>
                                                    {feature.isActive ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button onClick={() => openModal('UPDATE', feature)} className="p-2 text-neutral-400 hover:text-primary transition-all hover:scale-110">
                                                    <Edit3 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">
                                            No system features found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* MODAL CREATE/UPDATE */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[40px] w-full max-w-xl p-8 shadow-2xl animate-in zoom-in duration-300 relative border border-neutral-100">
                        <button onClick={handleCloseModal} className="absolute top-8 right-8 text-neutral-400 hover:text-neutral-600 transition-colors">
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">
                                    {modalMode === 'CREATE' ? 'Define New Feature' : 'Update Feature Settings'}
                                </h3>
                                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">System functionality configuration</p>
                            </div>
                        </div>

                        {formError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-[10px] text-red-600 font-black uppercase">Error: {formError}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6 text-left">
                            <div className="space-y-2 col-span-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Feature Name <span className="text-red-500">*</span></label>
                                <Input
                                    placeholder="e.g. AI Scoring Matching, Advanced Analytics"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                                    Feature Key (Unique) <span className="text-red-500">*</span>
                                </label>
                                <Combobox
                                    value={formData.featureKey}
                                    onChange={(val) => setFormData({ ...formData, featureKey: val })}
                                    disabled={modalMode === 'UPDATE'}
                                >
                                    <div className="relative">
                                        <div className={`relative w-full cursor-default overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100 text-left shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all ${modalMode === 'UPDATE' ? 'opacity-60' : ''}`}>
                                            <Combobox.Input
                                                className="w-full border-none py-4 pl-4 pr-10 text-xs font-bold text-neutral-700 bg-transparent focus:outline-none"
                                                placeholder="Select key..."
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
                                        >
                                            <Combobox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                                {filteredKeys.length === 0 && query !== '' ? (
                                                    <div className="relative cursor-default select-none py-4 px-4 text-neutral-500 text-[11px] font-bold uppercase tracking-widest text-center">
                                                        Nothing found.
                                                    </div>
                                                ) : (
                                                    filteredKeys.map((key) => (
                                                        <Combobox.Option
                                                            key={key}
                                                            value={key}
                                                            className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700'}`}
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={`block truncate text-xs ${selected ? 'font-black' : 'font-bold'}`}>{key}</span>
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

                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                                    Usage Type
                                </label>
                                <Listbox
                                    value={formData.usageType}
                                    onChange={(val) => setFormData({ ...formData, usageType: val })}
                                >
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className={`relative w-full cursor-default rounded-2xl bg-neutral-50 border border-neutral-100 py-4 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${open ? 'ring-2 ring-primary/20' : ''}`}>
                                                <span className="block truncate text-xs font-bold text-neutral-700 uppercase">
                                                    {usageTypeOptions.find(opt => opt.id === formData.usageType)?.name || 'Select Type'}
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
                                                <Listbox.Options className="absolute z-[100] mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                                    {usageTypeOptions.map((type) => (
                                                        <Listbox.Option
                                                            key={type.id}
                                                            value={type.id}
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700'
                                                                }`
                                                            }
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={`block truncate text-xs ${selected ? 'font-black text-primary' : 'font-bold'}`}>
                                                                        {type.name}
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

                            <div className="space-y-2 col-span-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Briefly describe what this feature does..."
                                    className="w-full h-24 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-xs font-bold text-neutral-700 focus:ring-2 focus:ring-primary/20 outline-none resize-none shadow-sm"
                                />
                            </div>

                            <div className="col-span-2 flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                                <div>
                                    <p className="text-[11px] font-black text-neutral-800 uppercase">Is Active</p>
                                    <p className="text-[9px] text-neutral-400 font-bold uppercase">Toggle feature availability in the system</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-6 h-6 rounded-lg accent-secondary cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <Button mode="secondary" className="flex-1 font-black" onClick={handleCloseModal}>CANCEL</Button>
                            <Button
                                mode="primary"
                                className="font-black"
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating}
                            >
                                {isCreating || isUpdating ? 'PROCESSING...' : 'SAVE FEATURE'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeatureManagement;
import React, { useState, useEffect } from 'react';
import { useCreatePlanMutation, useUpdatePlanMutation } from '../../../apis/subscriptionApi';
import { X, Layout, Info, Target, Settings2, DollarSign, Tag, ShieldCheck } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { toast } from 'react-toastify';
import PriceTab from './priceTab';
import UsageLimitTab from './usageLimitTab';

const PlanModal = ({ isOpen, onClose, plan, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('BASIC'); // BASIC | PRICING | LIMITS
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        planDetails: '',
        planTarget: 'COMPANY',
        planType: 'MAIN',
        currency: 'VND',
        isPopular: false
    });

    const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
    const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                description: plan.description || '',
                planDetails: plan.planDetails || '',
                planTarget: plan.planTarget,
                planType: plan.planType,
                currency: plan.currency,
                isPopular: plan.isPopular
            });
            setActiveTab('BASIC');
        } else {
            setFormData({
                name: '', description: '', planDetails: '',
                planTarget: 'COMPANY', planType: 'MAIN',
                currency: 'VND', isPopular: false
            });
        }
    }, [plan, isOpen]);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => setAlert({ ...alert, show: false }), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert.show]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setAlert({ show: true, message: "Please enter a package name", type: 'warn' });
            return;
        }

        try {
            if (plan) {
                await updatePlan({ id: plan.id, ...formData }).unwrap();
                setAlert({ show: true, message: "PLAN UPDATED!", type: 'success' });
                onSuccess();
            } else {
                await createPlan(formData).unwrap();
                setAlert({ show: true, message: "NEW PLAN CREATED! Please set pricing now.", type: 'success' });
                onSuccess();
                setTimeout(() => setActiveTab('PRICING'), 1000);
            }
        } catch (err) {
            setAlert({ show: true, message: err?.data?.message || "SAVE FAILED!", type: 'error' });
        }
    };
    return (
        <Transition show={isOpen} as={React.Fragment}>
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm">
                <Transition.Child
                    as="div"
                    enter="transition ease-out duration-300 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col border-l border-neutral-100"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/50">
                        <div>
                            <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter">
                                {plan ? 'Package Configuration' : 'Design New Package'}
                            </h3>
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => setActiveTab('BASIC')}
                                    className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'BASIC' ? 'border-primary text-primary' : 'border-transparent text-neutral-400'}`}
                                >
                                    Basic Information
                                </button>
                                {plan && (
                                    <>
                                        <button
                                            onClick={() => setActiveTab('PRICING')}
                                            className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'PRICING' ? 'border-primary text-primary' : 'border-transparent text-neutral-400'}`}
                                        >
                                            Pricing
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('LIMITS')}
                                            className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'LIMITS' ? 'border-primary text-primary' : 'border-transparent text-neutral-400'}`}
                                        >
                                            Usage Limits
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-neutral-400 transition-all"><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {activeTab === 'BASIC' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* INLINE ALERT SYSTEM */}
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Package Name</label>
                                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Enterprise Gold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Target Audience</label>
                                        <EnumSelect
                                            value={formData.planTarget}
                                            options={['COMPANY', 'CANDIDATE']}
                                            onChange={val => setFormData({ ...formData, planTarget: val })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Package Type</label>
                                        <EnumSelect
                                            value={formData.planType}
                                            options={['MAIN', 'ADD_ON']}
                                            onChange={val => setFormData({ ...formData, planType: val })}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full h-20 p-4 bg-neutral-50 rounded-2xl text-xs font-bold border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Details</label>
                                        <textarea
                                            value={formData.planDetails}
                                            onChange={e => setFormData({ ...formData, planDetails: e.target.value })}
                                            className="w-full h-20 p-4 bg-neutral-50 rounded-2xl text-xs font-bold border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center justify-between p-5 bg-neutral-50 rounded-[24px] border border-dashed border-neutral-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'}`}>
                                                <ShieldCheck size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-neutral-800 uppercase leading-none">Activate Plan</p>
                                                <p className="text-[9px] text-neutral-400 font-bold uppercase mt-1">Status: {formData.isActive ? 'Visible to customers' : 'Hidden from store'}</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive || false}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-6 h-6 accent-secondary cursor-pointer"
                                        />
                                    </div>
                                    <div className="col-span-2 p-4 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600"><Tag size={18} /></div>
                                            <div>
                                                <p className="text-[11px] font-black text-neutral-800 uppercase leading-none">Promoted Package</p>
                                                <p className="text-[9px] text-neutral-400 font-bold uppercase mt-1">Display "Popular" badge on pricing page</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({ ...formData, isPopular: e.target.checked })} className="w-5 h-5 accent-secondary cursor-pointer" />
                                    </div>
                                    {alert.show && (
                                        <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${alert.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' :
                                            alert.type === 'warn' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                'bg-red-50 border-red-100 text-red-600'
                                            }`}>
                                            <Info size={18} className="flex-shrink-0" />
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                {alert.type.toUpperCase()}: {alert.message}
                                            </p>
                                            <button onClick={() => setAlert({ ...alert, show: false })} className="ml-auto opacity-50 hover:opacity-100">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'PRICING' ? (
                            <PriceTab planId={plan?.id} currency={plan?.currency} />
                        ) : (
                            <UsageLimitTab planId={plan?.id} />
                        )}
                    </div>

                    <div className="p-8 border-t border-neutral-50 bg-neutral-50/30 flex gap-4">
                        <Button mode="secondary" className="flex-1 font-black" onClick={onClose}>CLOSE</Button>
                        {activeTab === 'BASIC' && (
                            <Button mode="primary" className="font-black" onClick={handleSave} disabled={isCreating || isUpdating}>
                                {isCreating || isUpdating ? 'SAVING...' : 'SAVE CONFIGURATION'}
                            </Button>
                        )}
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    );
};

// Helper component
const EnumSelect = ({ value, options, onChange }) => (
    <Listbox value={value} onChange={onChange}>
        <div className="relative">
            <Listbox.Button className="w-full py-4 px-4 bg-neutral-50 rounded-2xl text-xs font-black text-neutral-700 text-left uppercase tracking-tight outline-none focus:ring-2 focus:ring-primary/20">
                {value}
            </Listbox.Button>
            <Listbox.Options className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden">
                {options.map(opt => (
                    <Listbox.Option key={opt} value={opt} className={({ active }) => `py-3 px-4 text-[10px] font-black uppercase cursor-pointer ${active ? 'bg-primary/5 text-primary' : 'text-neutral-600'}`}>
                        {opt}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </div>
    </Listbox>
);

export default PlanModal;
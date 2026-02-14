import React, { useState } from 'react';
import {
    useGetPlanPricesQuery,
    useAddPlanPriceMutation,
    useUpdatePlanPriceMutation,
    useDeletePlanPriceMutation
} from '../../../apis/subscriptionApi';
import { Plus, Trash2, Edit2, Check, X, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { toast } from 'react-toastify';

const PriceTab = ({ planId, currency }) => {
    const { data: pricesData, isLoading, refetch } = useGetPlanPricesQuery(planId);
    const [addPrice, { isLoading: isAdding }] = useAddPlanPriceMutation();
    const [updatePrice, { isLoading: isUpdating }] = useUpdatePlanPriceMutation();
    const [deletePrice, { isLoading: isDeleting }] = useDeletePlanPriceMutation();

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [priceForm, setPriceForm] = useState({
        originalPrice: '',
        salePrice: '',
        duration: 1,
        unit: 'MONTH',
        isActive: true
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const prices = pricesData?.data || [];

    const resetForm = () => {
        setPriceForm({ originalPrice: '', salePrice: '', duration: 1, unit: 'MONTH', isActive: true });
        setIsAddingNew(false);
        setErrorMsg(null);
    };

    const handleSave = async () => {
        if (!priceForm.originalPrice || !priceForm.salePrice) {
            setErrorMsg("Original and Sale prices are mandatory.");
            return;
        }
        setErrorMsg(null);
        try {
            await addPrice({ planId, ...priceForm }).unwrap();
            toast.success("NEW PRICE TIER ADDED");
            resetForm();
            refetch();
        } catch (err) {
            setErrorMsg(err?.data?.message || "Failed to add price tier");
        }
    };

    const openDeleteConfirm = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            await deletePrice({ planId, priceId: itemToDelete }).unwrap();
            toast.success("PRICE REMOVED SUCCESSFULLY");
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "DELETE FAILED");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Available Price Tiers</h4>
                    <p className="text-[9px] text-neutral-300 font-bold uppercase mt-1">Configure subscription duration and costs</p>
                </div>
                {!isAddingNew && (
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all group"
                    >
                        <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    </button>
                )}
            </div>

            {/* List Prices */}
            <div className="space-y-3">
                {prices.map((p) => (
                    <div key={p.id} className="p-5 bg-white rounded-[24px] border border-neutral-100 flex items-center justify-between group hover:border-primary/20 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-neutral-800 uppercase tracking-tight">
                                    {p.duration} {p.unit}(S)
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-neutral-300 line-through">
                                        {Number(p.originalPrice).toLocaleString()} {currency}
                                    </span>
                                    <span className="text-xs font-black text-primary">
                                        {Number(p.salePrice).toLocaleString()} {currency}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => openDeleteConfirm(p.id)}
                            className="p-2.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {/* Form Add New Inline */}
                {isAddingNew && (
                    <div className="p-8 bg-neutral-50/50 rounded-[32px] border-2 border-dashed border-neutral-200 space-y-6 animate-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <DollarSign size={16} />
                            </div>
                            <h5 className="text-[11px] font-black text-neutral-800 uppercase">New Pricing Configuration</h5>
                        </div>

                        {errorMsg && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                                <div className="flex-shrink-0">
                                    <AlertCircle size={14} className="text-red-500" />
                                </div>
                                <p className="text-[10px] text-red-600 font-black uppercase tracking-tight leading-none">
                                    Error: {errorMsg}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Duration</label>
                                <Input type="number" min="1" value={priceForm.duration} onChange={e => setPriceForm({ ...priceForm, duration: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Unit</label>
                                <select
                                    className="w-full py-4 px-4 bg-white rounded-2xl text-xs font-black text-neutral-700 uppercase outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-primary/20 appearance-none"
                                    value={priceForm.unit} onChange={e => setPriceForm({ ...priceForm, unit: e.target.value })}
                                >
                                    <option value="DAY">DAY</option>
                                    <option value="MONTH">MONTH</option>
                                    <option value="YEAR">YEAR</option>
                                    <option value="FOREVER">FOREVER</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Original Price ({currency})</label>
                                <Input type="number" placeholder="0" value={priceForm.originalPrice} onChange={e => setPriceForm({ ...priceForm, originalPrice: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Sale Price ({currency})</label>
                                <Input type="number" placeholder="0" value={priceForm.salePrice} onChange={e => setPriceForm({ ...priceForm, salePrice: e.target.value })} />
                            </div>
                            <div className="col-span-2 flex items-center gap-2 px-2">
                                <input
                                    id="price-active"
                                    type="checkbox"
                                    checked={priceForm.isActive}
                                    onChange={e => setPriceForm({ ...priceForm, isActive: e.target.checked })}
                                    className="w-4 h-4 accent-secondary"
                                />
                                <label htmlFor="price-active" className="text-[10px] font-black text-neutral-500 uppercase cursor-pointer">
                                    Set this price tier as active immediately
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button mode="secondary" className="flex-1 font-black text-[10px]" onClick={resetForm}>CANCEL</Button>
                            <Button mode="primary" className="font-black text-[10px]" onClick={handleSave} disabled={isAdding}>
                                {isAdding ? 'PROCESSING...' : 'CONFIRM ADD'}
                            </Button>
                        </div>
                    </div>
                )}

                {!isLoading && prices.length === 0 && !isAddingNew && (
                    <div className="py-20 text-center border-2 border-dashed border-neutral-100 rounded-[40px] bg-neutral-50/30">
                        <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em]">Vault Empty: Define first price</p>
                    </div>
                )}
            </div>

            {/* CUSTOM DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-300 text-center relative border border-neutral-100">
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} className="text-red-500" />
                        </div>

                        <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter mb-2">Delete Price Tier?</h3>
                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                            This will remove the pricing option from the public store. <br />
                            Existing subscriptions <span className="text-red-500">won't be affected</span>.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button
                                mode="primary"
                                onClick={executeDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'DELETING...' : 'YES, REMOVE TIER'}
                            </Button>
                            <Button
                                mode="secondary"
                                className="border-none text-neutral-400 font-black"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                GO BACK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceTab;
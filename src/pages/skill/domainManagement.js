import React, { useState } from 'react';
import {
    useGetDomainsQuery,
    useCreateDomainMutation,
    useUpdateDomainMutation,
    useDeleteDomainMutation
} from '../../apis/apis';
import { Plus, Edit3, Trash2, RefreshCw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { toast } from 'react-toastify';

const DomainManagement = () => {
    const [page, setPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE');
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const { data, isLoading, isFetching, refetch } = useGetDomainsQuery({ page, size: 10 });
    const [createDomain, { isLoading: isCreating }] = useCreateDomainMutation();
    const [updateDomain, { isLoading: isUpdating }] = useUpdateDomainMutation();
    const [deleteDomain, { isLoading: isDeleting }] = useDeleteDomainMutation();
    const [inputValue, setInputValue] = useState('');
    const [searchName, setSearchName] = useState('');

    const domains = data?.data?.content || [];
    const pagination = data?.data || {};
    const totalPages = pagination.totalPages || 0;
    const openModal = (mode, domain = null) => {
        setModalMode(mode);
        if (mode === 'UPDATE' && domain) {
            setSelectedDomain(domain);
            setFormData({ name: domain.name, description: domain.description || '' });
        } else {
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '' });
        setSelectedDomain(null);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) return;
        try {
            if (modalMode === 'CREATE') {
                await createDomain(formData).unwrap();
                toast.success("NEW DOMAIN CREATED");
            } else {
                await updateDomain({ id: selectedDomain.id, ...formData }).unwrap();
                toast.success("DOMAIN UPDATED SUCCESSFULLY");
            }
            handleCloseModal();
        } catch (error) {
            toast.error(error?.data?.message || "ACTION FAILED");
        }
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            await deleteDomain(itemToDelete).unwrap();
            toast.success("DOMAIN REMOVED SUCCESSFULLY");
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error(error?.data?.message || "FAILED TO DELETE");
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface-light dark:bg-background-dark font-body relative">
            <div className="flex items-center justify-between px-6 py-8">
                <div>
                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading uppercase">Industry Domains</h2>
                    <p className="text-[11px] text-neutral-500 font-medium mt-1 uppercase tracking-widest">Manage business sectors and industry classifications</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="p-2.5 text-neutral-400 hover:text-primary transition-all rounded-xl">
                        <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                    </button>
                    <Button mode="primary" iconLeft={<Plus size={14} strokeWidth={3} />} onClick={() => openModal('CREATE')}>
                        ADD NEW DOMAIN
                    </Button>
                </div>
            </div>
            <div className="flex-grow px-6 overflow-auto pb-6">
                <Card className="!p-0 border-neutral-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase">ID</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase">Domain Name</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase">Description</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {domains.map((domain) => (
                                <tr key={domain.id} className="group hover:bg-neutral-50 transition-all duration-200">
                                    <td className="px-6 py-5 text-[11px] font-bold text-neutral-400 font-mono">#{domain.id}</td>
                                    <td className="px-6 py-5 font-bold text-neutral-900 uppercase text-xs">{domain.name}</td>
                                    <td className="px-6 py-5 text-[11px] text-neutral-500 line-clamp-1 max-w-sm">{domain.description || "N/A"}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => openModal('UPDATE', domain)} className="p-2 text-neutral-400 hover:text-primary"><Edit3 size={14} /></button>
                                            <button onClick={() => confirmDelete(domain.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
            <div className="p-6 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-surface-dark mt-auto">
                <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase font-heading">
                    Showing {domains.length} of {pagination.totalElements || 0} domains
                </p>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page === 0} className={`p-2 rounded-xl transition-all ${page === 0 ? 'text-neutral-100' : 'text-neutral-400 hover:bg-neutral-100'}`}><ChevronLeft size={16} /></button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index} onClick={() => setPage(index)} className={`w-8 h-8 text-[10px] font-bold rounded-lg transition-all ${page === index ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-neutral-500 hover:bg-neutral-100'}`}>{index + 1}</button>
                        ))}
                    </div>
                    <button onClick={() => setPage(prev => prev + 1)} disabled={page >= totalPages - 1} className={`p-2 rounded-xl transition-all ${page >= totalPages - 1 ? 'text-neutral-100' : 'text-neutral-400 hover:bg-neutral-100'}`}><ChevronRight size={16} /></button>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300 relative border border-neutral-100">
                        <button onClick={handleCloseModal} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors"><X size={20} /></button>
                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">
                            {modalMode === 'CREATE' ? 'Add New Domain' : 'Update Domain'}
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mb-8">
                            {modalMode === 'CREATE' ? 'Create a new business sector classification' : `Editing Domain ID: #${selectedDomain?.id}`}
                        </p>
                        <div className="space-y-6 text-left">
                            <Input label="Domain Name" placeholder="e.g. Fintech, Healthcare..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 font-body">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter domain details..."
                                    className="w-full h-32 p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body shadow-sm placeholder:text-neutral-400 placeholder:font-medium"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-10">
                            <Button mode="secondary" className="flex-1" onClick={handleCloseModal}>CANCEL</Button>
                            <Button mode="primary" className="font-bold" onClick={handleSubmit} disabled={isCreating || isUpdating || !formData.name.trim()}>
                                {isCreating || isUpdating ? 'PROCESSING...' : 'SAVE DOMAIN'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[32px] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-300 text-center border border-neutral-100">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">Confirm Deletion</h3>
                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                            Are you sure you want to remove this domain? <br />
                            This action is <span className="text-red-500">permanent</span>.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button mode="primary" onClick={executeDelete} disabled={isDeleting}>
                                {isDeleting ? 'DELETING...' : 'YES, DELETE DOMAIN'}
                            </Button>
                            <Button mode="secondary" className="border-none text-neutral-400" onClick={() => setIsDeleteModalOpen(false)}>CANCEL</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DomainManagement;
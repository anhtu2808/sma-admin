import React, { useState, useEffect } from 'react';
import {
    useGetExpertisesQuery,
    useGetExpertiseGroupsQuery,
    useCreateExpertiseMutation,
    useUpdateExpertiseMutation,
    useDeleteExpertiseMutation
} from '../../apis/apis';
import { Combobox } from '@headlessui/react';
import { Plus, Edit3, Trash2, RefreshCw, ChevronLeft, ChevronRight, X, Search, Briefcase, Check, ChevronDown, Layers } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { toast } from 'react-toastify';

const ExpertiseManagement = () => {
    const [page, setPage] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchName, setSearchName] = useState('');
    const [query, setQuery] = useState('');
    const { data, isLoading, isFetching, refetch } = useGetExpertisesQuery({
        page,
        size: 10,
        name: searchName || undefined
    });

    const { data: groupsData } = useGetExpertiseGroupsQuery({ size: 100 });

    const [createExpertise, { isLoading: isCreating }] = useCreateExpertiseMutation();
    const [updateExpertise, { isLoading: isUpdating }] = useUpdateExpertiseMutation();
    const [deleteExpertise, { isLoading: isDeleting }] = useDeleteExpertiseMutation();
    const expertises = data?.data?.content || [];
    const groups = groupsData?.data?.content || [];
    const pagination = data?.data || {};
    const totalPages = pagination.totalPages || 0;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE');
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', groupId: '' });
    const [deleteError, setDeleteError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredGroups = query === ''
        ? groups
        : groups.filter((group) =>
            group.name.toLowerCase().includes(query.toLowerCase())
        );
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchName(inputValue);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const openModal = (mode, item = null) => {
        setModalMode(mode);
        if (mode === 'UPDATE' && item) {
            setSelectedItem(item);
            setFormData({
                name: item.name,
                description: item.description || '',
                groupId: item.expertiseGroup?.id || ''
            });
        } else {
            setFormData({ name: '', description: '', groupId: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        const errors = [];
        if (!formData.name?.trim()) errors.push("Name is required");

        if (formData.hasOwnProperty('groupId') && !formData.groupId) {
            errors.push("Please select an assigned group");
        }

        if (errors.length > 0) {
            setFormError(errors.join(" & "));
            toast.warn("Please fill in all required fields");
            return;
        }

        setFormError(null);

        try {
            if (modalMode === 'CREATE') {
                await createExpertise(formData).unwrap();
                toast.success("NEW EXPERTISE CREATED");
            } else {
                await updateExpertise({ id: selectedItem.id, ...formData }).unwrap();
                toast.success("UPDATED SUCCESSFULLY");
            }
            setIsModalOpen(false);
            setFormError(null);
        } catch (error) {
            const msg = error?.data?.message || "ACTION FAILED";
            setFormError(msg);
            toast.error("PLEASE CHECK YOUR INPUT");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', groupId: '' });
        setSelectedItem(null);
        setFormError(null);
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteError(null);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            await deleteExpertise(itemToDelete).unwrap();
            toast.success("REMOVED SUCCESSFULLY");
            setIsDeleteModalOpen(false);
        } catch (error) {
            const errorMessage = error?.data?.message || "DELETE FAILED";
            setDeleteError(errorMessage);
            toast.error("ACTION FAILED");
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface-light dark:bg-background-dark font-body relative">
            <div className="flex items-center justify-between px-6 py-8">
                <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading uppercase">Job Expertises</h2>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1 uppercase tracking-widest">Manage detailed professional roles</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text"
                            placeholder="Search expertise by name or group..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold transition-all shadow-sm"
                        />
                    </div>
                    <Button mode="primary" iconLeft={<Plus size={14} strokeWidth={3} />} onClick={() => openModal('CREATE')}>
                        ADD EXPERTISE
                    </Button>
                </div>
            </div>

            <div className="flex-grow px-6 overflow-auto pb-6">
                <Card className="!p-0 border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase">ID</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase">Expertise Name</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase">Description</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase">Group</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {isLoading ? (
                                <tr className="animate-pulse"><td colSpan={4} className="h-40 bg-neutral-50/30"></td></tr>
                            ) : expertises.map((item) => (
                                <tr key={item.id} className="group hover:bg-neutral-50 transition-all duration-200">
                                    <td className="px-6 py-5 text-[11px] font-bold text-neutral-400 font-mono">#{item.id}</td>
                                    <td className="px-6 py-5 font-bold text-neutral-900 uppercase text-xs font-heading">{item.name}</td>
                                    <td className="px-6 py-5 text-sm text-neutral-600">{item.description || 'N/A'}</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-orange-50 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-100">
                                            {item.expertiseGroup?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => openModal('UPDATE', item)} className="p-2 text-neutral-400 hover:text-primary"><Edit3 size={14} /></button>
                                            <button onClick={() => { setItemToDelete(item.id); setIsDeleteModalOpen(true); }} className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={14} /></button>
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
                    Showing {groups.length} of {pagination.totalElements || 0} groups
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
                        <button onClick={handleCloseModal} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600">
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">
                            {modalMode === 'CREATE' ? 'Add Expertise' : 'Edit Expertise'}
                        </h3>

                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mb-6">
                            {modalMode === 'CREATE' ? 'Define a new job role' : `Editing ID: #${selectedItem?.id}`}
                        </p>

                        {formError ? (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-in fade-in slide-in-from-top-1">
                                <p className="text-[10px] text-amber-600 font-black uppercase tracking-tighter leading-tight">
                                    Validation Error: {formError}
                                </p>
                            </div>
                        ) : (
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mb-6 italic">
                                Fill in the details below to proceed.
                            </p>
                        )}

                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 font-body">
                                    Expertise Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. Java Developer..."
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (formError) setFormError(null);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 font-body">
                                    Assigned Group <span className="text-red-500">*</span>
                                </label>

                                <Combobox
                                    value={groups.find(g => g.id === Number(formData.groupId)) || null}
                                    onChange={(group) => setFormData({ ...formData, groupId: group?.id })}
                                >
                                    <div className="relative mt-1">
                                        <div className="relative w-full cursor-default overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100 text-left shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                            <Combobox.Input
                                                className="w-full border-none py-4 pl-4 pr-10 text-xs font-bold text-neutral-700 bg-transparent focus:outline-none"
                                                displayValue={(group) => group?.name || ''}
                                                onChange={(event) => setQuery(event.target.value)}
                                                placeholder="Search or select a group..."
                                            />
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                <ChevronDown className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                                            </Combobox.Button>
                                        </div>

                                        <Combobox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                            {filteredGroups.length === 0 && query !== '' ? (
                                                <div className="relative cursor-default select-none py-4 px-4 text-neutral-500 text-[11px] font-bold uppercase tracking-widest text-center">
                                                    Nothing found.
                                                </div>
                                            ) : (
                                                filteredGroups.map((group) => (
                                                    <Combobox.Option
                                                        key={group.id}
                                                        className={({ active }) =>
                                                            `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700'
                                                            }`
                                                        }
                                                        value={group}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={`block truncate text-xs ${selected ? 'font-black' : 'font-bold'}`}>
                                                                    {group.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                                        <Check size={14} strokeWidth={3} />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Combobox.Option>
                                                ))
                                            )}
                                        </Combobox.Options>
                                    </div>
                                </Combobox>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 font-body">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full h-24 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-10">
                            <Button mode="secondary" className="flex-1 uppercase font-bold" onClick={() => setIsModalOpen(false)}>CANCEL</Button>
                            <Button mode="primary" className="uppercase font-bold" onClick={handleSubmit} disabled={isCreating || isUpdating}>
                                SAVE EXPERTISE
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[32px] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-300 text-center border border-neutral-100">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Layers size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">Delete Expertise?</h3>
                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                            {deleteError ? (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl">
                                    <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter leading-tight">
                                        Reason: {deleteError}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                                    You are about to remove this expertise. <br />
                                    This action is <span className="text-red-500">permanent</span>.
                                </p>
                            )}
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button mode="primary" onClick={executeDelete} disabled={isDeleting}>
                                {isDeleting ? 'DELETING...' : 'YES, REMOVE EXPERTISE'}
                            </Button>
                            <Button mode="secondary" className="border-none text-neutral-400 uppercase font-bold" onClick={() => setIsDeleteModalOpen(false)}>GO BACK</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpertiseManagement;
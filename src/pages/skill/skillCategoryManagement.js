import React, { useState, useEffect } from 'react';
import {
    useGetSkillCategoriesQuery,
    useCreateSkillCategoryMutation,
    useUpdateSkillCategoryMutation,
    useDeleteSkillCategoryMutation
} from '../../apis/apis';
import { Plus, Edit3, Trash2, RefreshCw, ChevronLeft, Search, ChevronRight, X, ListTree } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { toast } from 'react-toastify';

const SkillCategoryManagement = () => {
    const [page, setPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [searchName, setSearchName] = useState('');
    const [deleteError, setDeleteError] = useState(null);
    const [formError, setFormError] = useState(null);

    const { data, isLoading, isFetching, refetch } = useGetSkillCategoriesQuery({
        page,
        size: 10,
        name: searchName || undefined
    });
    const [createCategory, { isLoading: isCreating }] = useCreateSkillCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateSkillCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteSkillCategoryMutation();

    const categories = data?.data?.content || [];
    const pagination = data?.data || {};
    const totalPages = pagination.totalPages || 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchName(inputValue);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const openModal = (mode, category = null) => {
        setModalMode(mode);
        if (mode === 'UPDATE' && category) {
            setSelectedCategory(category);
            setFormData({ name: category.name });
        } else {
            setFormData({ name: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.name.trim()) {
            setFormError("Category Name is required and cannot be empty");
            toast.warn("Please enter a category name");
            return;
        }

        try {
            if (modalMode === 'CREATE') {
                await createCategory(formData).unwrap();
                toast.success("NEW SKILL CATEGORY CREATED");
            } else {
                await updateCategory({ id: selectedCategory.id, ...formData }).unwrap();
                toast.success("SKILL CATEGORY UPDATED SUCCESSFULLY");
            }
            handleCloseModal();
        } catch (error) {
            const msg = error?.data?.message || "ACTION FAILED";
            setFormError(msg);
            toast.error("PLEASE CHECK YOUR INPUT");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '' });
        setSelectedCategory(null);
        setFormError(null);
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteError(null);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            await deleteCategory(itemToDelete).unwrap();
            toast.success("CATEGORY REMOVED SUCCESSFULLY");
            setIsDeleteModalOpen(false);
        } catch (error) {
            const errorMessage = error?.data?.message || "FAILED TO DELETE";
            setDeleteError(errorMessage);
            toast.error("ACTION FAILED");
        }
    };

    return (
        <div className="flex flex-col h-full font-body relative overflow-hidden">
            {/* Header Area */}
            <div className="flex items-center justify-between px-6 py-8">
                <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading uppercase">
                        Skill Categories
                    </h2>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1 tracking-widest">
                        Classify skills into functional groups
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text"
                            placeholder="Search category by name..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold transition-all shadow-sm focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <Button
                        mode="primary"
                        iconLeft={<Plus size={14} strokeWidth={3} />}
                        onClick={() => openModal('CREATE')}
                    >
                        ADD CATEGORY
                    </Button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 px-6 min-h-0">
                <Card className="!p-0 border-neutral-200 overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead className="sticky top-0 z-10 bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-md shadow-[0_1px_0_0_rgba(251,146,60,0.2)]">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase w-24">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase">Category Name</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase text-right w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={3} className="px-6 py-5 bg-neutral-50/30 h-16"></td>
                                        </tr>
                                    ))
                                ) : categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat.id} className="group hover:bg-neutral-50 transition-all duration-200">
                                            <td className="px-6 py-5 text-[11px] font-bold text-neutral-400 font-mono">{cat.id}</td>
                                            <td className="px-6 py-5 font-bold text-neutral-900 dark:text-white text-sm">{cat.name}</td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => openModal('UPDATE', cat)} className="p-2 text-neutral-400 hover:text-primary"><Edit3 size={14} /></button>
                                                    <button onClick={() => confirmDelete(cat.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-20 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Pagination Footer */}
            <div className="pt-2 flex items-center justify-between dark:border-neutral-800 bg-white dark:bg-surface-dark mt-auto">
                <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase font-heading">
                    Showing {categories.length} of {pagination.totalElements || 0} skill categories
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

            {/* --- CREATE/UPDATE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[32px] w-full max-w-lg p-5 shadow-2xl animate-in zoom-in duration-300 relative border border-neutral-100">
                        <button onClick={handleCloseModal} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors">
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">
                            {modalMode === 'CREATE' ? 'Add Skill Category' : 'Update Category'}
                        </h3>

                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mb-6">
                            {modalMode === 'CREATE' ? 'Define a new skill group for competency management' : `Editing Category ID: #${selectedCategory?.id}`}
                        </p>
                        {formError && (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-in fade-in slide-in-from-top-1">
                                <p className="text-[10px] text-amber-600 font-black uppercase tracking-tighter leading-tight">
                                    Validation Error: {formError}
                                </p>
                            </div>
                        )}

                        {!formError && (
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mb-6 italic">
                                Fill in the details below to proceed.
                            </p>
                        )}

                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 font-body">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. Programming Languages, Soft Skills..."
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (formError) setFormError(null);
                                    }}
                                />
                            </div>

                        </div>

                        <div className="flex gap-3 mt-10">
                            <Button mode="secondary" className="flex-1 font-bold" onClick={handleCloseModal}>
                                CANCEL
                            </Button>
                            <Button
                                mode="primary"
                                className="font-bold"
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating || !formData.name.trim()}
                            >
                                {isCreating || isUpdating ? 'PROCESSING...' : 'SAVE CATEGORY'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[32px] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-300 text-center border border-neutral-100">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <ListTree size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">Delete Category?</h3>

                        {deleteError ? (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter leading-tight">
                                    FAIL: {deleteError}
                                </p>
                            </div>
                        ) : (
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                                Are you sure to remove this category? <br />
                                This action will fail if any <span className="text-red-500 underline">Skills</span> are still assigned to it.
                            </p>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button mode="primary" onClick={executeDelete} disabled={isDeleting}>
                                {isDeleting ? 'DELETING...' : 'YES, REMOVE CATEGORY'}
                            </Button>
                            <Button mode="secondary" className="border-none text-neutral-400 font-bold" onClick={() => { setIsDeleteModalOpen(false); setDeleteError(null); }}>
                                {deleteError ? 'CLOSE' : 'GO BACK'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillCategoryManagement;
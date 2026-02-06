import React, { useState, useEffect } from 'react';
import {
    useGetSkillsQuery,
    useGetSkillCategoriesQuery,
    useCreateSkillMutation,
    useUpdateSkillMutation,
    useDeleteSkillMutation
} from '../../apis/apis';
import { Combobox } from '@headlessui/react';
import { Plus, Edit3, Trash2, RefreshCw, ChevronLeft, ChevronRight, X, Search, Check, ChevronDown, Cpu } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Listbox, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const SkillManagement = () => {
    const [page, setPage] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchName, setSearchName] = useState('');
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState({ id: 'ALL', name: 'All Categories' });
    const { data, isLoading, isFetching, refetch } = useGetSkillsQuery({
        page,
        size: 10,
        name: searchName || undefined,
        categoryId: selectedCategory.id === 'ALL' ? undefined : selectedCategory.id
    });

    const { data: categoriesData } = useGetSkillCategoriesQuery({ size: 100 });

    const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
    const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();
    const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

    const skills = data?.data?.content || [];
    const categories = categoriesData?.data?.content || [];
    const pagination = data?.data || {};
    const totalPages = pagination.totalPages || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE');
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', categoryId: '' });
    const [formError, setFormError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);



    const filteredCategories = query === ''
        ? categories
        : categories.filter((cat) =>
            cat.name.toLowerCase().includes(query.toLowerCase())
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
        setFormError(null);
        if (mode === 'UPDATE' && item) {
            setSelectedItem(item);
            setFormData({
                name: item.name,
                categoryId: item.category?.id || '',
                description: item.description || ''
            });
        } else {
            setFormData({ name: '', categoryId: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormError(null);
        setFormData({ name: '', categoryId: '', description: '' });
    };

    const handleSubmit = async () => {
        if (!formData.name?.trim() || !formData.categoryId) {
            setFormError("Skill Name and Category are required");
            toast.warn("Please fill in all required fields");
            return;
        }

        setFormError(null);
        try {
            if (modalMode === 'CREATE') {
                await createSkill(formData).unwrap();
                toast.success("NEW SKILL CREATED");
            } else {
                await updateSkill({ id: selectedItem.id, ...formData }).unwrap();
                toast.success("UPDATED SUCCESSFULLY");
            }
            handleCloseModal();
        } catch (error) {
            setFormError(error?.data?.message || "ACTION FAILED");
            toast.error("PLEASE CHECK YOUR INPUT");
        }
    };

    const executeDelete = async () => {
        try {
            await deleteSkill(itemToDelete).unwrap();
            toast.success("SKILL REMOVED");
            setIsDeleteModalOpen(false);
        } catch (error) {
            setDeleteError(error?.data?.message || "DELETE FAILED");
            toast.error("ACTION FAILED");
        }
    };

    return (
        <div className="flex flex-col h-full font-body relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-8">
                <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading uppercase">Skills</h2>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1 tracking-widest">Manage individual technical and soft skills</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-56">
                        <Listbox value={selectedCategory} onChange={(val) => { setSelectedCategory(val); setPage(0); }}>
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-default rounded-2xl bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 py-2.5 pl-10 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-500" />
                                    <span className="block truncate text-[11px] font-black uppercase tracking-widest text-neutral-700 dark:text-neutral-200">
                                        {selectedCategory.name}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                        <ChevronDown className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    as={React.Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white dark:bg-gray-800 py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-neutral-100 dark:border-neutral-700 animate-in fade-in zoom-in duration-200">
                                        <Listbox.Option
                                            value={{ id: 'ALL', name: 'All Categories' }}
                                            className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700 dark:text-neutral-300'}`}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate text-[10px] ${selected ? 'font-black text-primary' : 'font-bold uppercase'}`}>ALL CATEGORIES</span>
                                                    {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check size={14} strokeWidth={3} /></span> : null}
                                                </>
                                            )}
                                        </Listbox.Option>

                                        {categories.map((cat) => (
                                            <Listbox.Option
                                                key={cat.id}
                                                value={cat}
                                                className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700 dark:text-neutral-300'}`}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className={`block truncate text-[10px] uppercase ${selected ? 'font-black text-primary' : 'font-bold'}`}>
                                                            {cat.name}
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
                        </Listbox>
                    </div>
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text"
                            placeholder="Search skill or category..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold transition-all shadow-sm"
                        />
                    </div>
                    <Button mode="primary" iconLeft={<Plus size={14} strokeWidth={3} />} onClick={() => openModal('CREATE')}>
                        ADD NEW SKILL
                    </Button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 px-6 min-h-0">
                <Card className="!p-0 border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead className="sticky top-0 z-10 bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-md shadow-[0_1px_0_0_rgba(251,146,60,0.2)]">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase w-24">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase w-1/4">Skill Name</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase">Description</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase text-center w-40">Skill Category</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-neutral-800 tracking-[0.2em] uppercase text-right w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-5 bg-neutral-50/30 h-16"></td>
                                        </tr>
                                    ))
                                ) : skills.length > 0 ? (
                                    skills.map((item) => (
                                        <tr key={item.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-all duration-200">
                                            <td className="px-6 py-5 text-[11px] font-bold text-neutral-400 font-mono">{item.id}</td>
                                            <td className="px-6 py-5 font-bold text-neutral-900 dark:text-white text-sm tracking-tight">{item.name}</td>
                                            <td className="px-6 py-5 text-sm text-neutral-600 dark:text-neutral-400 truncate">{item.description || '—'}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-3 py-1 text-orange-600 dark:text-orange-400 rounded-full text-[12px] font-black tracking-wider">
                                                    {item.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => openModal('UPDATE', item)} className="p-2 text-neutral-400 hover:text-primary transition-colors"><Edit3 size={14} /></button>
                                                    <button onClick={() => { setItemToDelete(item.id); setIsDeleteModalOpen(true); }} className="p-2 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                            No skills found. Start by adding a new one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <div className="pt-2 flex items-center justify-between dark:border-neutral-800 bg-white dark:bg-surface-dark mt-auto">
                <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase font-heading">
                    Showing {skills.length} of {pagination.totalElements || 0} skills
                </p>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page === 0} className={`p-2 rounded-xl transition-all ${page === 0 ? 'text-neutral-100' : 'text-neutral-400 hover:bg-neutral-100'}`}><ChevronLeft size={16} /></button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index} onClick={() => setPage(index)} className={`w-8 h-8 text-[10px] font-bold rounded-lg transition-all ${page === index ? 'bg-primary text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}>{index + 1}</button>
                        ))}
                    </div>
                    <button onClick={() => setPage(prev => prev + 1)} disabled={page >= totalPages - 1} className={`p-2 rounded-xl transition-all ${page >= totalPages - 1 ? 'text-neutral-100' : 'text-neutral-400 hover:bg-neutral-100'}`}><ChevronRight size={16} /></button>
                </div>
            </div>

            {/* --- CREATE/UPDATE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[32px] w-full max-w-lg p-5 shadow-2xl animate-in zoom-in duration-300 relative border border-neutral-100">
                        <button onClick={handleCloseModal} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600"><X size={20} /></button>

                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">
                            {modalMode === 'CREATE' ? 'Add New Skill' : 'Edit Skill'}
                        </h3>

                        {formError ? (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-in fade-in slide-in-from-top-1">
                                <p className="text-[10px] text-amber-600 font-black uppercase tracking-tighter leading-tight">
                                    Validation Error: {formError}
                                </p>
                            </div>
                        ) : (
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mb-6 italic">
                                Please assign the skill to a category.
                            </p>
                        )}

                        <div className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                                    Skill Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. React, Project Management..."
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (formError) setFormError(null);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                                    Skill Category <span className="text-red-500">*</span>
                                </label>
                                <Combobox
                                    value={categories.find(c => c.id === Number(formData.categoryId)) || null}
                                    onChange={(cat) => {
                                        setFormData({ ...formData, categoryId: cat?.id });
                                        setFormError(null);
                                    }}
                                >
                                    <div className="relative mt-1">
                                        <div className="relative w-full cursor-default overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100 text-left shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                            <Combobox.Input
                                                className="w-full border-none py-4 pl-4 pr-10 text-xs font-bold text-neutral-700 bg-transparent focus:outline-none"
                                                displayValue={(cat) => cat?.name || ''}
                                                onChange={(event) => setQuery(event.target.value)}
                                                placeholder="Search or select category..."
                                            />
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                <ChevronDown className="h-4 w-4 text-neutral-400" />
                                            </Combobox.Button>
                                        </div>

                                        <Combobox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-neutral-100 animate-in fade-in zoom-in duration-200">
                                            {filteredCategories.length === 0 && query !== '' ? (
                                                <div className="relative cursor-default select-none py-4 px-4 text-neutral-500 text-[11px] font-bold uppercase tracking-widest text-center">Nothing found.</div>
                                            ) : (
                                                filteredCategories.map((cat) => (
                                                    <Combobox.Option
                                                        key={cat.id}
                                                        className={({ active }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700'}`}
                                                        value={cat}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span className={`block truncate text-xs ${selected ? 'font-black' : 'font-bold'}`}>{cat.name}</span>
                                                                {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check size={14} strokeWidth={3} /></span>}
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
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 font-body">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Briefly describe this skill..."
                                    className="w-full h-24 p-4 bg-neutral-50 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body shadow-sm placeholder:text-neutral-400"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-10">
                            <Button mode="secondary" className="flex-1 uppercase font-bold" onClick={handleCloseModal}>CANCEL</Button>
                            <Button mode="primary" className="uppercase font-bold" onClick={handleSubmit} disabled={isCreating || isUpdating || !formData.name?.trim() || !formData.categoryId}>
                                SAVE SKILL
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-[32px] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in duration-300 text-center border border-neutral-100">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Cpu size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-heading uppercase tracking-tight mb-2">Delete Skill?</h3>
                        {deleteError ? (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter leading-tight">Reason: {deleteError}</p>
                            </div>
                        ) : (
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                                This action will permanently remove the skill from the system.
                            </p>
                        )}
                        <div className="flex flex-col gap-3">
                            <Button mode="primary" className="bg-red-500 hover:bg-red-600 border-none shadow-lg" onClick={executeDelete} disabled={isDeleting}>
                                {isDeleting ? 'DELETING...' : 'YES, REMOVE SKILL'}
                            </Button>
                            <Button mode="secondary" className="border-none text-neutral-400 font-bold uppercase" onClick={() => setIsDeleteModalOpen(false)}>GO BACK</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillManagement;
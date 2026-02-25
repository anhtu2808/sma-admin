import React, { useEffect, useState } from 'react';
import { Input as AntInput, Select, ConfigProvider, Modal } from 'antd';
import {
    useGetSampleJobsQuery,
    useDeleteSampleJobMutation
} from '@/apis/jobSampleApi';
import JobListItem from '@/components/JobListItem';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SampleJobsManagement = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [workingModel, setWorkingModel] = useState(null);
    const [jobLevel, setJobLevel] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearchTerm, workingModel, jobLevel]);

    const { data: jobsData, isLoading: isJobsLoading } = useGetSampleJobsQuery({
        page,
        size: pageSize,
        name: debouncedSearchTerm || undefined,
        workingModel: workingModel || undefined,
        jobLevel: jobLevel || undefined
    });

    const [deleteSampleJob] = useDeleteSampleJobMutation();

    const jobs = jobsData?.data?.content || [];
    const totalPages = jobsData?.data?.totalPages || 0;

    const handleDelete = (id, name) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the JD sample: "${name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    await deleteSampleJob(id).unwrap();
                    toast.success('JD sample deleted successfully');
                } catch (err) {
                    toast.error(err?.data?.message || 'Failed to delete JD sample');
                }
            }
        });
    };

    const formatSalary = (min, max, currency = 'VND') => {
        if (!min && !max) return 'Negotiable';

        const locale = currency === 'VND' ? 'vi-VN' : 'en-US';

        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        });

        return `${formatter.format(min)} - ${formatter.format(max)}`;
    };

    if (isJobsLoading) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            JD Samples (Admin)
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage system JD templates for AI Scoring
                        </p>
                    </div>

                    <Button
                        mode="primary"
                        onClick={() => navigate('create')}
                        iconLeft={<span className="material-icons-round">add</span>}
                    >
                        Create New Sample
                    </Button>
                </header>

                {/* FILTER */}
                <ConfigProvider theme={{ token: { colorPrimary: '#f97316' } }}>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center mb-6">
                        <div className="flex-1 w-full">
                            <AntInput
                                placeholder="Search samples..."
                                prefix={
                                    <span className="material-icons-round text-gray-400">
                                        search
                                    </span>
                                }
                                className="w-full h-10 rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4">
                            <Select
                                placeholder="Working Model"
                                className="w-40 h-10"
                                allowClear
                                onChange={setWorkingModel}
                                options={[
                                    { value: 'ONSITE', label: 'Onsite' },
                                    { value: 'REMOTE', label: 'Remote' },
                                    { value: 'HYBRID', label: 'Hybrid' },
                                ]}
                            />

                            <Select
                                placeholder="Job Level"
                                className="w-40 h-10"
                                allowClear
                                onChange={setJobLevel}
                                options={[
                                    { value: 'INTERN', label: 'Intern' },
                                    { value: 'FRESHER', label: 'Fresher' },
                                    { value: 'JUNIOR', label: 'Junior' },
                                    { value: 'MIDDLE', label: 'Middle' },
                                    { value: 'SENIOR', label: 'Senior' },
                                ]}
                            />
                        </div>
                    </div>
                </ConfigProvider>

                <div className="flex flex-col gap-4">
                    {jobs.map((job) => (
                        <JobListItem
                            key={job.id}
                            title={job.name}
                            status={job.status}
                            location="System Sample"
                            salary={formatSalary(
                                job.salaryStart,
                                job.salaryEnd,
                                job.currency
                            )}
                            tags={[job.jobLevel, job.workingModel].filter(Boolean)}
                            onViewDetails={() => navigate(`edit/${job.id}`)}
                            onDelete={() => handleDelete(job.id, job.name)}
                        />
                    ))}
                </div>

                {/* PAGINATION */}
                <div className="pt-4">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SampleJobsManagement;
import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Radio, message, Spin, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateSampleJobMutation,
    useUpdateSampleJobMutation,
    useGetSampleJobByIdQuery,
    useGetCriteriaQuery // Đảm bảo hook này được import từ jobSampleApi hoặc jobApi phù hợp
} from '@/apis/jobSampleApi';
import Button from '@/components/Button';

// Import các sub-components bạn đã có
import Classification from './components/Classification';
import JobDescriptionSection from './components/JobDescriptionSection';
import ScoringWeights from './components/ScoringWeights';

const SampleJobForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { data: sampleRes, isLoading: isFetching } = useGetSampleJobByIdQuery(id, { skip: !isEdit });
    const { data: criteriaRes } = useGetCriteriaQuery();

    const [createSample, { isLoading: isCreating }] = useCreateSampleJobMutation();
    const [updateSample, { isLoading: isUpdating }] = useUpdateSampleJobMutation();

    const jobName = sampleRes?.data?.name || "";

    useEffect(() => {
        if (isEdit && sampleRes?.data) {
            const d = sampleRes.data;
            const initialValues = {
                ...d,
                expertiseId: d.expertise?.id,
                skillIds: d.skills?.map(s => s.id) || [],
                domainIds: d.domains?.map(d => d.id) || [],
                benefitIds: d.benefits?.map(b => b.id) || [],
                ...d.scoringCriterias?.reduce((acc, curr) => {
                    if (curr?.criteria?.id) {
                        acc[`weight_${curr.criteria.id}`] = curr.weight;
                    }
                    return acc;
                }, {})
            };
            form.setFieldsValue(initialValues);
        }
    }, [sampleRes, isEdit, form]);

    const onFinish = async (values) => {
        const criteriaList = criteriaRes?.data || [];
        const scoringCriterias = criteriaList.map(c => ({
            criteriaId: c.id,
            weight: values[`weight_${c.id}`] ?? c.defaultWeight,
            enable: true
        }));

        const totalWeight = scoringCriterias.reduce((sum, c) => sum + c.weight, 0);
        if (Math.abs(totalWeight - 100) > 0.01) {
            return message.error(`Total weight must be 100%. Current: ${totalWeight}%`);
        }

        const payload = {
            ...values,
            scoringCriterias,
            isSample: true
        };

        try {
            if (isEdit) {
                await updateSample({ id, ...payload }).unwrap();
                message.success('JD Sample updated successfully!');
            } else {
                await createSample(payload).unwrap();
                message.success('JD Sample created successfully!');
            }
            navigate('/job-samples');
        } catch (err) {
            message.error(err?.data?.message || 'Failed to save sample');
        }
    };

    if (isFetching) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spin size="large" tip="Loading sample data..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto w-full">
                    <header className="flex items-center mb-6 gap-2">
                        <Button
                            mode="text"
                            onClick={() => navigate("/job-samples")}
                            iconLeft={<span className="material-icons-round">arrow_back</span>}
                            className="text-gray-500 hover:text-primary"
                        >
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? `Update ${jobName} JD Sample` : 'Create JD Sample'}
                        </h1>
                    </header>

                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-10">
                            {/* Cột trái: Form nhập liệu chính */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <Form.Item
                                        name="name"
                                        label={<span className="font-bold text-gray-700">Job Title (Sample)</span>}
                                        rules={[{ required: true, message: 'Please enter job title' }]}
                                    >
                                        <Input placeholder="e.g. Senior Java Developer" className="rounded-lg py-2 font-semibold" />
                                    </Form.Item>
                                </div>

                                <JobDescriptionSection />

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Form.Item name="jobLevel" label="Target Level">
                                        <Select options={[
                                            { value: 'INTERN', label: 'Intern' },
                                            { value: 'FRESHER', label: 'Fresher' },
                                            { value: 'JUNIOR', label: 'Junior' },
                                            { value: 'MIDDLE', label: 'Middle' },
                                            { value: 'SENIOR', label: 'Senior' }
                                        ]} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="experienceTime" label="Experience Required (Years)">
                                        <InputNumber className="w-full rounded-lg" min={0} />
                                    </Form.Item>
                                    <Form.Item label="Expected Salary Range">
                                        <div className="flex gap-2">
                                            <Form.Item name="salaryStart" noStyle><InputNumber placeholder="Min" className="w-full rounded-lg" /></Form.Item>
                                            <span className="pt-1 text-gray-400">-</span>
                                            <Form.Item name="salaryEnd" noStyle><InputNumber placeholder="Max" className="w-full rounded-lg" /></Form.Item>
                                            <Form.Item name="currency" noStyle initialValue="USD">
                                                <Select options={[{ value: 'USD', label: 'USD' }, { value: 'VND', label: 'VND' }]} style={{ width: 85 }} />
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                    <Form.Item name="workingModel" label="Working Model">
                                        <Radio.Group className="flex gap-4">
                                            <Radio value="REMOTE">Remote</Radio>
                                            <Radio value="ONSITE">Onsite</Radio>
                                            <Radio value="HYBRID">Hybrid</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>

                                <Classification />
                            </div>

                            {/* Cột phải: AI Scoring Weights (Sticky) */}
                            <div className="lg:col-span-1 sticky top-6 self-start">
                                <ScoringWeights />
                            </div>
                        </div>
                    </Form>
                </div>
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto flex justify-end gap-3 px-6 sm:px-8">
                        <Button
                            mode="secondary"
                            onClick={() => navigate('/job-samples')}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="primary"
                            onClick={() => form.submit()}
                            loading={isCreating || isUpdating}
                        >
                            {isEdit ? 'Update Sample' : 'Save Sample'}
                        </Button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SampleJobForm;
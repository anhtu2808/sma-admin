import React, { useState, useMemo } from 'react';
import { Select, Input, Form } from 'antd';
import { useGetSkillsQuery } from '@/apis/skillApi';
import { debounce } from 'lodash';
import { useGetExpertiseQuery, useGetDomainQuery } from '@/apis/masterDataApi';

const Classification = () => {
    const [skillSearch, setSkillSearch] = useState('');

    // Gọi API - Lưu ý cấu trúc trả về là { data: { content: [...] } }
    const { data: skillsRes, isLoading: skillsLoading, isFetching: skillsFetching } = useGetSkillsQuery({ name: skillSearch || undefined });
    const { data: expertiseRes } = useGetExpertiseQuery();
    const { data: domainRes } = useGetDomainQuery();

    // Chuyển đổi dữ liệu từ data.content thành Options cho Select
    const skillOptions = useMemo(() =>
        (skillsRes?.data?.content || []).map((skill) => ({
            value: skill.id,
            label: skill.name,
        })), [skillsRes]);

    const expertiseOptions = useMemo(() => {
        const rawData = expertiseRes || [];
        return rawData.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    }, [expertiseRes]);

    const domainOptions = useMemo(() => {
        const rawData = domainRes || [];
        return rawData.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    }, [domainRes]);

    const handleSkillSearch = useMemo(
        () => debounce((value) => setSkillSearch(value), 300),
        []
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">category</span>
                Classification & Skills
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expertise Select */}
                <Form.Item name="expertiseId" label="Primary Expertise" className="mb-0">
                    <Select
                        showSearch
                        optionFilterProp="label"
                        placeholder="Select expertise (e.g. Backend Developer)"
                        className="w-full h-10"
                        options={expertiseOptions}
                    />
                </Form.Item>

                {/* Domain Select */}
                <Form.Item name="domainIds" label="Industry Domain" className="mb-0">
                    <Select
                        mode="multiple"
                        optionFilterProp="label"
                        placeholder="Select domains (e.g. FinTech)"
                        className="w-full h-10"
                        options={domainOptions}
                    />
                </Form.Item>
            </div>

            {/* Skills Select with Search */}
            <Form.Item name="skillIds" label="Skills (Tags)" className="mb-0">
                <Select
                    mode="multiple"
                    placeholder="Search and select skills (e.g. Java, React)..."
                    className="w-full"
                    showSearch
                    filterOption={false}
                    onSearch={handleSkillSearch}
                    loading={skillsLoading || skillsFetching}
                    options={skillOptions}
                />
            </Form.Item>
            <Form.Item name="benefits" label="Benefits" className="mb-0">
                <Input.TextArea
                    placeholder="Enter job benefits (e.g. 13th month salary, Health Insurance...)"
                    rows={4}
                    className="rounded-lg pt-2"
                />
            </Form.Item>
        </div>
    );
};

export default Classification;
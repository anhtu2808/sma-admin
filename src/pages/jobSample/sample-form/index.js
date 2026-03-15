import React, { useEffect } from "react";
import { Form, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
    useCreateSampleJobMutation,
    useUpdateSampleJobMutation,
    useGetSampleJobByIdQuery,
    useGetCriteriaQuery
} from "@/apis/jobSampleApi";

import Button from "@/components/Button";

// components
import JobIdentity from "./components/JobIdentity";
import JobDescriptionSection from "./components/JobDescriptionSection";
import WorkCompensation from "./components/WorkCompensation";
import Classification from "./components/Classification";
import ScreeningQuestions from "./components/ScreeningQuestions";
import ScoringWeights from "./components/ScoringWeights";
import ProTips from "./components/ProTips";

const SampleJobForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { data: sampleRes, isLoading: isFetching } =
        useGetSampleJobByIdQuery(id, { skip: !isEdit });

    const { data: criteriaRes } = useGetCriteriaQuery();

    const [createSample, { isLoading: isCreating }] =
        useCreateSampleJobMutation();

    const [updateSample, { isLoading: isUpdating }] =
        useUpdateSampleJobMutation();

    const jobName = sampleRes?.data?.name || "";

    useEffect(() => {
        if (isEdit && sampleRes?.data && criteriaRes?.data) {
            const d = sampleRes.data;

            const weights = d.scoringCriterias?.reduce((acc, curr) => {
                if (curr?.criteria?.id) {
                    acc[`weight_${curr.criteria.id}`] = curr.weight;
                }
                return acc;
            }, {});

            form.setFieldsValue({
                ...d,
                expertiseId: d.expertise?.id,
                skillIds: d.skills?.map((s) => s.id) || [],
                domainIds: d.domains?.map((d) => d.id) || [],
                benefitIds: d.benefits?.map((b) => Number(b.id)) || [],
                ...weights
            });
        } else if (!isEdit && criteriaRes?.data) {
            const defaultWeights = criteriaRes.data.reduce((acc, curr) => {
                acc[`weight_${curr.id}`] = curr.defaultWeight;
                return acc;
            }, {});

            form.setFieldsValue(defaultWeights);
        }
    }, [sampleRes, criteriaRes, isEdit, form]);

    const onFinish = async (values) => {
        const criteriaList = criteriaRes?.data || [];

        const scoringCriterias = criteriaList.map((c) => ({
            criteriaId: c.id,
            weight: values[`weight_${c.id}`] ?? c.defaultWeight,
            enable: true
        }));

        const totalWeight = scoringCriterias.reduce(
            (sum, c) => sum + c.weight,
            0
        );

        if (Math.abs(totalWeight - 100) > 0.01) {
            return message.error(
                `Total weight must be 100%. Current: ${totalWeight}%`
            );
        }

        const payload = {
            ...values,
            scoringCriterias,
            isSample: true
        };

        try {
            if (isEdit) {
                await updateSample({ id, ...payload }).unwrap();
                message.success("JD Sample updated successfully!");
            } else {
                await createSample(payload).unwrap();
                message.success("JD Sample created successfully!");
            }

            navigate("/job-samples");
        } catch (err) {
            message.error(err?.data?.message || "Failed to save sample");
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar">

                <Button
                    mode="text"
                    onClick={() => navigate("/job-samples")}
                    iconLeft={<span className="material-icons-round">arrow_back</span>}
                    className="text-gray-500 hover:text-primary"
                >
                    Back to Samples
                </Button>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="block"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">

                            <JobIdentity />

                            <JobDescriptionSection />

                            <WorkCompensation />

                            <Classification />

                            <ScreeningQuestions />

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-1">

                            <div className="top-6 space-y-6">

                                <ScoringWeights />

                                <ProTips />



                            </div>

                        </div>

                    </div>
                    <div className=" flex justify-end gap-3">
                        <Button
                            mode="secondary"
                            onClick={() => navigate("/job-samples")}
                        >
                            Cancel
                        </Button>

                        <Button
                            mode="primary"
                            htmlType="submit"
                            loading={isCreating || isUpdating}
                        >
                            {isEdit ? "Update Sample" : "Save Sample"}
                        </Button>
                    </div>

                </Form>
            </div>
        </div>
    );
};

export default SampleJobForm;
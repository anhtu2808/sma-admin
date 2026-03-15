import React, { useState } from "react";
import { Form, Select, Button } from "antd";
import { useGetJobQuestionsQuery, useCreateJobQuestionMutation } from "@/apis/jobQuestionApi";

const ScreeningQuestions = ({ jobId }) => {

    const { data } = useGetJobQuestionsQuery(jobId);
    const [createQuestion] = useCreateJobQuestionMutation();

    const [value, setValue] = useState([]);

    const options = data?.data?.content?.map(q => ({
        value: q.id,
        label: q.question
    })) || [];

    const handleCreate = async (question) => {
        await createQuestion({
            jobId,
            question,
            isRequired: true,
            description: ""
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-orange-500">quiz</span>
                    Screening Questions
                </h3>
            </div>

            <Form.Item name="questionIds" label="Select Questions" className="mb-0">
                <Select
                    mode="multiple"
                    placeholder="Select screening questions..."
                    className="w-full"
                    value={value}
                    onChange={setValue}
                    options={options}
                />
            </Form.Item>

        </div>
    );
};

export default ScreeningQuestions;
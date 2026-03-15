import { api, API_VERSION } from "./baseApi";

export const jobQuestionApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getJobQuestions: builder.query({
            query: (jobId) => ({
                url: `${API_VERSION}/jobs/${jobId}/job-questions`,
                method: "GET",
            }),
            providesTags: ["Jobs"],
        }),

        createJobQuestion: builder.mutation({
            query: ({ jobId, ...body }) => ({
                url: `${API_VERSION}/jobs/${jobId}/job-questions`,
                method: "POST",
                body
            }),
            invalidatesTags: ["Jobs"],
        }),

    }),
});

export const {
    useGetJobQuestionsQuery,
    useCreateJobQuestionMutation
} = jobQuestionApi;
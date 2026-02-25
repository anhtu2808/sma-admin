import { api, API_VERSION } from "./baseApi";

export const jobSampleApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSampleJobs: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/jobs/samples`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "Jobs", id })),
                        { type: "Jobs", id: "SAMPLE_LIST" },
                    ]
                    : [{ type: "Jobs", id: "SAMPLE_LIST" }],
        }),

        getSampleJobById: builder.query({
            query: (jobId) => ({
                url: `${API_VERSION}/jobs/${jobId}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Jobs", id }],
        }),

        createSampleJob: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/jobs/samples`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Jobs", id: "SAMPLE_LIST" }],
        }),

        updateSampleJob: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/jobs/samples/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Jobs", id },
                { type: "Jobs", id: "SAMPLE_LIST" },
            ],
        }),

        deleteSampleJob: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/jobs/samples/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Jobs", id: "SAMPLE_LIST" }],
        }),

        getCriteria: builder.query({
            query: () => `${API_VERSION}/criteria`,
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSampleJobsQuery,
    useGetSampleJobByIdQuery,
    useCreateSampleJobMutation,
    useUpdateSampleJobMutation,
    useDeleteSampleJobMutation,
    useGetCriteriaQuery,
} = jobSampleApi;
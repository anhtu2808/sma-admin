import { api, API_VERSION } from "./baseApi";

export const adminCompanyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminCompanies: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/admin/companies`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "Companies", id })),
                        { type: "Companies", id: "LIST" },
                    ]
                    : [{ type: "Companies", id: "LIST" }],
        }),

        getAdminCompanyDetail: builder.query({
            query: (companyId) => ({
                url: `${API_VERSION}/admin/companies/${companyId}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Companies", id }],
        }),

        setUnderReview: builder.mutation({
            query: (companyId) => ({
                url: `${API_VERSION}/admin/companies/${companyId}/status`,
                method: "PATCH",
                body: { status: "UNDER_REVIEW" },
            }),
            invalidatesTags: (result, error, id) => [{ type: "Companies", id: "LIST" }],
        }),

        updateCompanyStatus: builder.mutation({
            query: ({ companyId, ...body }) => ({
                url: `${API_VERSION}/admin/companies/${companyId}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { companyId }) => [
                { type: "Companies", id: companyId },
                { type: "Companies", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAdminCompaniesQuery,
    useGetAdminCompanyDetailQuery,
    useUpdateCompanyStatusMutation,
    useSetUnderReviewMutation
} = adminCompanyApi;
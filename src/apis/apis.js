import { api, API_VERSION } from "./baseApi";

export const adminCompanyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminCompanies: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/companies`,
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
                url: `${API_VERSION}/companies/${companyId}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Companies", id }],
        }),

        setUnderReview: builder.mutation({
            query: (companyId) => ({
                url: `${API_VERSION}/companies/${companyId}/status`,
                method: "PATCH",
                body: { status: "UNDER_REVIEW" },
            }),
            invalidatesTags: (result, error, id) => [{ type: "Companies", id: "LIST" }],
        }),

        updateCompanyStatus: builder.mutation({
            query: ({ companyId, ...body }) => ({
                url: `${API_VERSION}/companies/${companyId}/status`,
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


export const adminDomainApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDomains: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/domains`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "Domains", id })),
                        { type: "Domains", id: "LIST" },
                    ]
                    : [{ type: "Domains", id: "LIST" }],
        }),
        createDomain: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/domains`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Domains", id: "LIST" }],
        }),
        updateDomain: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/domains/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Domains", id },
                { type: "Domains", id: "LIST" },
            ],
        }),
        deleteDomain: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/domains/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Domains", id: "LIST" }],
        }),
    }),
});

export const {
    useGetDomainsQuery,
    useCreateDomainMutation,
    useUpdateDomainMutation,
    useDeleteDomainMutation
} = adminDomainApi;


export const adminExpertiseApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // --- EXPERTISE GROUPS ---
        getExpertiseGroups: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/expertise-groups`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [...result.data.content.map(({ id }) => ({ type: "ExpertiseGroups", id })), { type: "ExpertiseGroups", id: "LIST" }]
                    : [{ type: "ExpertiseGroups", id: "LIST" }],
        }),
        createExpertiseGroup: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/expertise-groups`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "ExpertiseGroups", id: "LIST" }],
        }),
        updateExpertiseGroup: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/expertise-groups/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "ExpertiseGroups", id }, { type: "ExpertiseGroups", id: "LIST" }],
        }),
        deleteExpertiseGroup: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/expertise-groups/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "ExpertiseGroups", id: "LIST" }],
        }),


        // --- EXPERTISES ---
        getExpertises: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/expertises`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [...result.data.content.map(({ id }) => ({ type: "Expertise", id })), { type: "Expertise", id: "LIST" }]
                    : [{ type: "Expertise", id: "LIST" }],
        }),
        createExpertise: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/expertises`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Expertise", id: "LIST" }],
        }),
        updateExpertise: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/expertises/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Expertise", id }, { type: "Expertise", id: "LIST" }],
        }),
        deleteExpertise: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/expertises/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Expertise", id: "LIST" }],
        }),
    }),
});

export const {
    useGetExpertiseGroupsQuery,
    useCreateExpertiseGroupMutation,
    useUpdateExpertiseGroupMutation,
    useDeleteExpertiseGroupMutation,
    useGetExpertisesQuery,
    useCreateExpertiseMutation,
    useUpdateExpertiseMutation,
    useDeleteExpertiseMutation
} = adminExpertiseApi;



export const adminSkillApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // --- SKILL CATEGORIES (Loại kỹ năng) ---
        getSkillCategories: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/skill-categories`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "SkillCategories", id })),
                        { type: "SkillCategories", id: "LIST" }
                    ]
                    : [{ type: "SkillCategories", id: "LIST" }],
        }),
        createSkillCategory: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/skill-categories`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "SkillCategories", id: "LIST" }],
        }),
        updateSkillCategory: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/skill-categories/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "SkillCategories", id },
                { type: "SkillCategories", id: "LIST" }
            ],
        }),
        deleteSkillCategory: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/skill-categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "SkillCategories", id: "LIST" }],
        }),

        // --- SKILLS (Kỹ năng chi tiết) ---
        getSkills: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/skills`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "Skills", id })),
                        { type: "Skills", id: "LIST" }
                    ]
                    : [{ type: "Skills", id: "LIST" }],
        }),
        createSkill: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/skills`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Skills", id: "LIST" }],
        }),
        updateSkill: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/skills/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Skills", id },
                { type: "Skills", id: "LIST" }
            ],
        }),
        deleteSkill: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/skills/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Skills", id: "LIST" }],
        }),
    }),
});

export const {
    useGetSkillCategoriesQuery,
    useCreateSkillCategoryMutation,
    useUpdateSkillCategoryMutation,
    useDeleteSkillCategoryMutation,
    useGetSkillsQuery,
    useCreateSkillMutation,
    useUpdateSkillMutation,
    useDeleteSkillMutation
} = adminSkillApi;


export const adminUserApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsersAdmin: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/users`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "Users", id })),
                        { type: "Users", id: "LIST" },
                    ]
                    : [{ type: "Users", id: "LIST" }],
        }),

        getUserDetailAdmin: builder.query({
            query: (id) => ({
                url: `${API_VERSION}/users/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Users", id }],
        }),



        updateUserStatusAdmin: builder.mutation({
            query: ({ userId, status }) => ({
                url: `${API_VERSION}/users/${userId}/status`,
                method: "PATCH",
                params: { status },
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: "Users", id: userId },
                { type: "Users", id: "LIST" }
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllUsersAdminQuery,
    useGetUserDetailAdminQuery,
    useUpdateUserStatusAdminMutation,
} = adminUserApi;
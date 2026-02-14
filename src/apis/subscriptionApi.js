import { api, API_VERSION } from "./baseApi";

export const subscriptionApi = api.enhanceEndpoints({
    addTagTypes: ['Plans', 'PlanPrices', 'Features', 'UsageLimits', 'UsageEvents']
}).injectEndpoints({
    endpoints: (builder) => ({
        // --- (PLANS) ---
        getPlans: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/plans`,
                method: 'GET',
                params
            }),
            providesTags: ['Plans'],
        }),
        getPlanById: builder.query({
            query: (id) => `${API_VERSION}/plans/${id}`,
            providesTags: (result, error, id) => [{ type: 'Plans', id }],
        }),
        createPlan: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/plans`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Plans'],
        }),
        updatePlan: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/plans/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error, { id }) => ['Plans', { type: 'Plans', id }],
        }),

        // --- (PLAN PRICES) ---
        getPlanPrices: builder.query({
            query: (planId) => `${API_VERSION}/plans/${planId}/prices`,
            providesTags: (result, error, planId) => [{ type: 'PlanPrices', id: planId }],
        }),
        addPlanPrice: builder.mutation({
            query: ({ planId, ...body }) => ({
                url: `${API_VERSION}/plans/${planId}/prices`,
                method: 'POST',
                body
            }),
            invalidatesTags: (result, error, { planId }) => [{ type: 'PlanPrices', id: planId }],
        }),
        updatePlanPrice: builder.mutation({
            query: ({ planId, priceId, ...body }) => ({
                url: `${API_VERSION}/plans/${planId}/prices/${priceId}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error, { planId }) => [{ type: 'PlanPrices', id: planId }],
        }),
        deletePlanPrice: builder.mutation({
            query: ({ planId, priceId }) => ({
                url: `${API_VERSION}/plans/${planId}/prices/${priceId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, { planId }) => [{ type: 'PlanPrices', id: planId }],
        }),

        // --- (FEATURES) ---
        getAllFeatures: builder.query({
            query: (onlyActive) => ({
                url: `${API_VERSION}/features`,
                params: { onlyActive }
            }),
            providesTags: ['Features'],
        }),
        createFeature: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/features`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Features'],
        }),
        updateFeature: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${API_VERSION}/features/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Features'],
        }),

        // --- (USAGE LIMITS) ---
        getUsageLimits: builder.query({
            query: (planId) => ({
                url: `${API_VERSION}/usage-limits`,
                params: { planId }
            }),
            providesTags: (result, error, planId) => [{ type: 'UsageLimits', id: planId }],
        }),
        addUsageLimit: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/usage-limits`,
                method: 'POST',
                body
            }),
            invalidatesTags: (result, error, { planId }) => [{ type: 'UsageLimits', id: planId }],
        }),
        updateUsageLimit: builder.mutation({
            query: ({ planId, featureId, ...body }) => ({
                url: `${API_VERSION}/usage-limits`,
                method: 'PUT',
                params: { planId, featureId },
                body
            }),
            invalidatesTags: (result, error, { planId }) => [{ type: 'UsageLimits', id: planId }],
        }),
        deleteUsageLimit: builder.mutation({
            query: ({ planId, featureId }) => ({
                url: `${API_VERSION}/usage-limits`,
                method: 'DELETE',
                params: { planId, featureId }
            }),
            invalidatesTags: (result, error, { planId }) => [{ type: 'UsageLimits', id: planId }],
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetPlansQuery,
    useGetPlanByIdQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation,
    useGetPlanPricesQuery,
    useAddPlanPriceMutation,
    useUpdatePlanPriceMutation,
    useDeletePlanPriceMutation,
    useGetAllFeaturesQuery,
    useCreateFeatureMutation,
    useUpdateFeatureMutation,
    useGetUsageLimitsQuery,
    useAddUsageLimitMutation,
    useUpdateUsageLimitMutation,
    useDeleteUsageLimitMutation,
} = subscriptionApi;
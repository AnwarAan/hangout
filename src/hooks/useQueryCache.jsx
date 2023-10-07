import services from "@/services"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useQueryCache = (key, q, params, isEnabled) => {
    const queryClient = useQueryClient()

    const { data, isLoading, isFetched } = useQuery({
        queryKey: [key],
        queryFn: async () => {
            const cache = queryClient.getQueryData([key])
            if (cache) {
                return cache
            }
            const res = await services.get(`/events${+q}`, { params: params })
            return res.data.data
        },
        enabled: isEnabled
    })

    return { data, isLoading, isFetched }
}
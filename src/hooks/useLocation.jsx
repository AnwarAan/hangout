import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useLocation = (label, id) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [`${label}/${id}`, id],
    queryFn: async () => {
      const cache = queryClient.getQueryData([`${label}/${id}`]);
      if (cache) return cache;
      const res = await axios.get(`https://anwaraan.github.io/api-wilayah-indonesia/api/${label}/${id}.json`);
      return res.data;
    },
    enabled: !!id,
  });

  return { data, isLoading };
};

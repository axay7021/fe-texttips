import {
  type QueryFunction,
  type QueryKey,
  useQuery,
} from '@tanstack/react-query';

export const useQueryData = <T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T, QueryKey>,
  enabled?: boolean,
) => {
  const { data, isPending, isFetched, refetch, isFetching } = useQuery({
    queryKey,
    queryFn,
    enabled,
  });
  return { data, isPending, isFetched, refetch, isFetching };
};

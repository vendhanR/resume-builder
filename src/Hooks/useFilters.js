import { useQuery } from "react-query"

const useFilters = () => {
    const {data , isError , isLoading, refetch} = useQuery(
        'globalFilter',
        () => ({searchTerm : ''}),
        {refetchOnWindowFocus : false}
    )
    return {data , isError , isLoading, refetch}
}

export default useFilters;
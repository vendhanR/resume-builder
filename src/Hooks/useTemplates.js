import { useQuery } from "react-query"
import { getTemplates } from "../api";

const useTemplates = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        'Templates',
        async () => {
            try {
                const templats = await getTemplates();
                return templats;
            } catch (error) {
                console.log(error)
            }
        },
        {
            refetchOnWindowFocus: false,

            onerror: (error) => {
                console.log('Failed to fetch templates: ' + error.message)
            }
        },

    )
    return { data, isLoading, isError, refetch }
}

export default useTemplates;
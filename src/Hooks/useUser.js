import { useQuery } from "react-query";
import { getUserDetail } from "../api";

const useUser = () => {

    const {data, isLoading, error , refetch} = useQuery(
        'user',
        async () => {
            try {
                const userDetail = await getUserDetail();
                return userDetail;
            } catch (error) {
                console.log("useUser error" , error.message)
            }
        },
        {refetchOnWindowFocus:false}
    )
    return {data, isLoading, error , refetch}
}

export default useUser;


import { useQuery } from "@tanstack/react-query";
import { userService } from "../services";

/**custom hook: fetch current user profile
@returns {UseQueryResult} Query result object 

*Usage:
const {data: user, isLoading, error} = useUser();
*/
export const useUser = () => {
  return useQuery({
    //query key la bat buoc
    queryKey: ["me"],

    /**
     * Query key Concept
     * Key: ID cua Cache
     * Cung key = chung cache
     * khac key = khac cache
     *
     * vd: ["me"] # ["user",1] # ["user",2]
     *
     * Key la Array vi
     * De nest: ['user',userId,'posts',postId]
     * De invalidate theo pattern
     * React Query so sanh array theo gia tri (deep equal)
     */

    //Query Function: bat buoc: call API

    queryFn: userService.getMe,
    /**
     * QUERY FUNCTION CONCEPT
     * ham async tra ve data
     * chi chay khi can fetch(inital,refetch,window focus,...)
     *
     * VD:
     * queryFn: () => axios.get('/me').then(res => res.data)
     *
     */
    staleTime: 1000 * 60 * 2,
    //Option tuy chon
    /**
     * Stale Time: 1000 * 60 * 5 // 5 phut
     *
     * StaleTime Usage:
     * 0(default): data ngay lap tuc cu
     * moi lan mount component = fetch lai
     * Tot cho: Real-time data (chat, stock price)
     *
     * 30s-5p: data tuoi trong khoang nay
     * Mount component = kh fetch (dung cache)
     * tot cho: User profile,settings
     *
     * Infinity: data kh bao h cu
     * chi fetch 1 lan duy nhat
     * Tot cho static data (country list,categories)
     *
     *
     * Enable: !!accessToken
     * Enable Option:
     * Conditional fetching:
     * enabled: false: query kh chay
     * enabled: true: query chay binh thuong
     *
     * Use case:
     * chi fetch khi co token
     * chi fetch khi user click button
     * Dependent queries (fetch B sau khi co data tu A)
     *
     * Select: (data) => ({id:data.id,displayName:data.name})
     *
     * Select Option:
     *
     * Transform data trc khi return ve component
     *
     * Loi ich:
     * component chi nen re-render khi tranformed data thay doi
     * tach logic transform ra khoi component
     *
     * Dung: Do not
     * useEffect(() => setTransformedData(transform(data)), [data])
     *
     * Dung cho
     * select: (data) => transform(data)
     *
     * refetchInterval: 300000
     *
     * Refetch Interval Option:
     * Auto refetch moi X milis
     * Use case:
     * Dashboard can update lien tuc
     * Real-time monitoring
     *
     * Luu y
     * chi chay khi component mount
     * tat khi component unmount
     * can nhac server load
     */
  });
};

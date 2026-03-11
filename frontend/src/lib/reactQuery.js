import { QueryClient } from "@tanstack/react-query";

export const queryClient= new QueryClient({
    defaultOptions:{
        queries:{
            staleTime:30*1000,
            cacheTime:5*60*1000,
            refetchOnWindowFocus:true,
            retry:1
        }
    }
})
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Authentication, HomeScreen } from './pages'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'


const App = () => {

    const queryClient =new QueryClient();
    
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path='/*' element={<HomeScreen />} />
                    <Route path='/auth' element={<Authentication />} />
                </Routes>
            </Suspense>
            <ReactQueryDevtools initialIsOpen={false} />    
        </QueryClientProvider>
    )
}

export default App;
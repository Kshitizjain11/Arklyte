"use client"
import { User_Api_Routes } from '@/utils/api-routes'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

// Move the component using useSearchParams to a separate component
const SuccessContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const paymentIntent = searchParams.get("payment_intent")
    
    useEffect(() => {
        const updateOrderInfo = async () => {
            await axios.patch(User_Api_Routes.CREATE_BOOKING, { paymentIntent })
            setTimeout(() => {
                router.push("/my-bookings")
            }, 3000)
        }
        
        if (paymentIntent) {
            updateOrderInfo()
        }
    }, [paymentIntent, router])
    
    return (
        <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
            <h1 className="text-4xl text-center">
                Payment successful. You are being redirected to the bookings page.
            </h1>
            <h1 className="text-4xl text-center">Please do not close the page.</h1>
        </div>
    )
}

const Success = () => {
    return (
        <Suspense fallback={
            <div className="h-[80vh] flex items-center justify-center">
                <div>Loading payment status...</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}

export default Success
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const Success = () => {
    const router = useRouter()
    const  searchParams = useSearchParams()
    const paymentIntent = searchParams.get("payment_intent")
    useEffect(() => {
      
    
    }, [])
    
  return (
    <div>
        <h1>Payment successful.You are being redirected to the bookings page.</h1>
        <h1>Please do not close the page</h1>

    </div>
  )
}

export default Success
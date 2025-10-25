"use client"
import { Elements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CheckoutForm from './components/checkout-form/checkout-form'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "")

const Checkout = () => {
    const [clientSecret, setClientSecret] = useState("")
    const searchParams = useSearchParams()
    const client_secret = searchParams.get("client_secret")
    useEffect(() => {
        if (client_secret){
            setClientSecret(client_secret)
        }
    
    }, [client_secret])
    
  return (
    <div className='min-h-[80vh]'>
        {clientSecret &&
             <Elements options={{clientSecret,appearance:{theme:'stripe'}}} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} />
            </Elements>}
    </div>
  )
}

export default Checkout
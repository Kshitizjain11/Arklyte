import React from 'react'
import Actions from './actions'
import { cookies } from 'next/headers'

const Logout = async() => {
    const deleteCookie = async ()=>{
        "use server"
        ;(await cookies()).delete("access_token")
    }
  return (
    <Actions deleteCookie={deleteCookie} />
  )
}

export default Logout
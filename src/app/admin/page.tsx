"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Admin = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("admin/dashboard")
  }, [router])
  
  return (
    <div>Admin</div>
  )
}

export default Admin
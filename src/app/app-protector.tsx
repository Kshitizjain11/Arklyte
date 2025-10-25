"use client"
import { useAppStore } from '@/store'
import { User_Api_Routes } from '@/utils/api-routes'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AppProtector = () => {
  const router = useRouter()
  const pathName = usePathname()
  const {userInfo,setUserInfo} = useAppStore()
  useEffect(() => {
    if (!userInfo) {
      const getUserInfo = async ()=>{
        try {
          const response = await axios.get(User_Api_Routes.ME);
          if (response?.data?.userInfo) {
            setUserInfo(response.data.userInfo)
          }
        } catch {
          // ignore errors (user not authenticated)
        }
      }
      getUserInfo()
    }
  },[userInfo,setUserInfo])
  
  return null;
}

export default AppProtector
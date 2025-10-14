"use client"
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@heroui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import {Architects_Daughter} from 'next/font/google'
import { apiClient } from '@/lib'
import { Admin_Api_Routes } from '@/utils'
import { useAppStore } from '@/store'
import { useRouter } from 'next/navigation'
const ArchitectsDaughter = Architects_Daughter({
  weight:"400",
  style: "normal",
  subsets: ["latin"],

})
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const {setUserInfo} = useAppStore()

  const handleLogin = async() => { 
    try {
      const response = await apiClient.post(Admin_Api_Routes.LOGIN,{email,password})
      if (response.data.userInfo){
        setUserInfo(response.data.userInfo)
        router.push('/admin')
      }
    } catch (error) {
      console.log(error)
    }
   }
  return (
    <div className='h-[100vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url(/home/home-bg.png)]' >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl "></div>
      <Card className='shadow-2xl bg-white/20 w-[480px]'>
        <CardHeader className='flex flex-col gap-1 capitalize text-3xl items-center'>
          <div className="flex flex-col gap-1 capitalize text-3xl items-center">
              <Image className='cursor-pointer' src="/logo.png" alt='Logo' width="80" height="80" />
              <span className='text-xl uppercase font-medium italic text-white'>
                <span className={ArchitectsDaughter.className}>Arklyte admin login</span>
              </span>
          </div>
        </CardHeader>
        <CardBody className='flex flex-col items-center w-full justify-center'>
          <div className="flex flex-col gap-2 w-full">
              <Input placeholder='Email' type='email' value={email} color='danger' onChange={(e)=> setEmail(e.target.value)} />
              <Input placeholder='password' type='password' value={password} onChange={(e)=> setPassword(e.target.value)} color='danger' />
          </div>
        </CardBody>
        <CardFooter className='flex flex-col justify-center gap-2 items-center'>
          <Button className='w-full capitalize' size='lg' onClick={handleLogin} color='danger' variant='shadow'>Login</Button>
        </CardFooter>
      </Card>
    </div>

  )
}

export default Login
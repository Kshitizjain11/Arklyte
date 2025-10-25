import { useAppStore } from '@/store';
import { User_Api_Routes } from '@/utils/api-routes';
import { Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import axios from 'axios';
import { Architects_Daughter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const ArchitectsDaughter = Architects_Daughter({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const AuthModal = ({isOpen,onOpen,onOpenChange} : {isOpen : boolean ; onOpen?:()=>void;onOpenChange: ()=> void}) => {
    const [modalType, setModalType] = useState("login")
    const router = useRouter()
    const {userInfo} = useAppStore()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {setUserInfo} = useAppStore()

    const handleSignUp = async(onClose : ()=>void)=>{
        const response = await axios.post(User_Api_Routes.SIGNUP,{
            firstName,
            lastName,
            email,
            password
        });
        if(response.data.userInfo) {
            setUserInfo(response.data.userInfo)
            onClose()
            setFirstName("")
            setLastName("")
            setEmail("")
            setPassword("")
        }
    }
    const handleLogin = async(onClose : ()=>void)=>{
        const response = await axios.post(User_Api_Routes.LOGIN,{
            email,
            password
        });
        if(response.data.userInfo) {
            setUserInfo(response.data.userInfo)
            onClose()
            setFirstName("")
            setLastName("")
            setEmail("")
            setPassword("")
        }
    } 
    const switchModalType = ()=>{
        if (modalType === "login") setModalType("signUp")
        else setModalType("login")
        
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")

    }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' className='bg-purple-200/50' >
        <ModalContent>
            {
                (onClose) => <>
                <ModalHeader className='flex flex-col gap-1 capitalize text-3xl items-center '>
                    {modalType}
                </ModalHeader>
                <ModalBody className='flex flex-col items-center w-full justify-center'>
                <div className="cursor-pointer">
                <Image
                  src="/logo.png"
                  alt="logo"
                  height={80}
                  width={80}
                  className="cursor-pointer"
                  onClick={() => router.push("/admin/dashboard")}
                />
                <span className="text-xl uppercase font-medium italic">
                  <span className={ArchitectsDaughter.className}>ARKLYTE</span>
                </span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Input placeholder='Email' type='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                {modalType === "signUp" && <>
                <Input placeholder='First Name' type='text' value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                <Input placeholder='Last Name' type='text' value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                </>}
                <Input placeholder='Password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                
              </div>
                </ModalBody>
                <ModalFooter className='flex flex-col items-center gap-2 justify-center'>
                    <Button color='primary' className='w-full capitalize' onPress={()=>{
                        modalType === "login" ? handleLogin(onClose) : handleSignUp(onClose)
                    }} >{modalType}</Button>
                    {
                        modalType === "signUp" && (<p>Already have an account?&nbsp; <Link className='cursor-pointer' onClick={()=>switchModalType()}>{" "}Login Now</Link></p>)
                    }
                    {
                        modalType === "login" && (<p>Don&apos;t have an account?&nbsp; <Link className='cursor-pointer' onClick={()=>switchModalType()}>{" "}Sign Up Now</Link></p>)
                    }
                </ModalFooter>
                </>
            }
        </ModalContent>
    </Modal>
  )
}

export default AuthModal
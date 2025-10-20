"use client"
import { useAppStore } from '@/store'
import { Architects_Daughter } from 'next/font/google'
import React from 'react'
import {Button, NavbarBrand, NavbarContent, NavbarItem, Navbar as NextNavbar} from "@heroui/react"
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
const ArchitectsDaughter = Architects_Daughter({
  weight:"400",
  style: "normal",
  subsets: ["latin"],

})

const Navbar = () => {
    const router = useRouter()
    const userInfo = useAppStore()
    const pathName = usePathname()
    const routesWithImages = ["/","/search-filghts","/search-hotels","",""]
  return (
    <NextNavbar isBordered className='min-h-[10vh] bg-violet-500/10  relative'>
        {
            !routesWithImages.includes(pathName) && (
                <>
                <div className="fixed left-0 top-0 h-[10vh] w-[100vw] overflow-hidden z-0">
                    <div className="h-[70vh] w-[100vw] absolute top-0 left-0 ">
                        <Image src="/home/home-bg.png" layout='fill' objectFit='cover' alt='Search' />
                    </div>
                </div>
                <div className="fixed left-0 top-0 h-[10vh] w-[100vw] overflow-hidden z-0" style={{backdropFilter:"blur(12px) saturate(280%)",WebkitBackdropFilter:"blur(12px) saturate(280%)"}}></div>
                </>
            )
        }
        <div className="z-10 w-full flex items-center">
            <NavbarBrand>
                <div className="cursor-pointer flex items-center">
                    <Image src="/logo.png" alt='logo' height={80} width={80} />
                    <span className='text-xl uppercase font-medium italic'>
                <span className={ArchitectsDaughter.className}>Arklyte</span>
              </span>
                </div>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className={`${
            pathName === "/" ? "text-danger-500" : "text-white"}`} href="/">
            Tours
          </Link>
        </NavbarItem>
        <NavbarItem className={`${
            pathName === "/search-flights" ? "text-danger-500" : "text-white"}`}>
          <Link aria-current="page" href="/search-flights">
            Flights
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className={`${
            pathName === "/search-hotels" ? "text-danger-500" : "text-white"}`} href="/search-hotels">
            Hotels
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button color='secondary' variant='flat' className='text-purple-500'>Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button color="danger" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
        </div>
    </NextNavbar>
  )
}

export default Navbar
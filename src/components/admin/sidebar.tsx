"use client"
import { Architects_Daughter } from 'next/font/google'
import { BiSolidCategory } from "react-icons/bi";
import { FaBookOpen, FaHome, FaHotel } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineDataUsage } from "react-icons/md";
import React, { useState } from 'react'


import {Sidebar as ReactProSidebar,Menu,MenuItem,sidebarClasses} from 'react-pro-sidebar'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ArchitectsDaughter = Architects_Daughter({
  weight:"400",
  style: "normal",
  subsets: ["latin"],

})
const Sidebar = () => {
    const menuItems = [
    { label: "Dashboard", icon: <FaHome />, link: "/admin/dashboard" },
    {
      label: "Trips",
      icon: <BiSolidCategory />,
      link: "/admin/trips",
    },
    {
      label: "Hotels",
      icon: <FaHotel />,
      link: "/admin/hotels",
    },
    { label: "Bookings", icon: <FaBookOpen />, link: "/admin/bookings" },
    {
      label: "Scrape Data",
      icon: <MdOutlineDataUsage />,
      link: "/admin/scrape-data",
    },
  ];
  const [selectedItem, setSelectedItem] = useState("/admin/dashboard")
  const router = useRouter()
  const handleItemClicked = (link:string)=>{
    setSelectedItem(link);
    router.push(link || selectedItem)
  }
  return (
    <div className='min-h-[100vh] overflow-hidden'>
        <ReactProSidebar
        className="h-full overflow-hidden"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#ffffff",
            "&:hover": {
              backgroundColor: "#ffffff",
            },
          },
        }}
      >
        <Menu menuItemStyles={{
          button:({level,active})=>{
            return {
              backgroundColor: active ? "#000" : "#fff",
              color: active ? "#fff" : "#000",
              '&:hover':{backgroundColor: active ? "#000" : "#000",
              color: active ? "#fff" : "#fff",}
            }
          }
        }} className='h-[100vh] max-h-[100vh] text-black overflow-hidden'>
          <div className="flex items-center justify-center my-10 flex-col">
            <Image onClick={()=>router.push("/admin/dashboard")} src="/logo.png" alt='Logo' height={"150"} width="150" className='cursor-pointer' />
              <span className='text-3xl uppercase font-medium italic'>
                <span className={ArchitectsDaughter.className}>Arklyte</span>
              </span>
          </div>
          {
            menuItems.map((item,index)=>(
              <React.Fragment key={index}>
                <MenuItem icon={item.icon} active={selectedItem === item.link} onClick={()=>handleItemClicked(item.link)} >
                {item.label}
                </MenuItem>
              </React.Fragment>
            ))
          }
          <MenuItem icon={<LuLogOut />} active={selectedItem === "/admin/logout"} onClick={()=>handleItemClicked("/admin/logout")}>Logout</MenuItem>
        </Menu>
        </ReactProSidebar>
    </div>
  )
}

export default Sidebar
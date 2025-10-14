import { apiClient } from '@/lib'
import { Admin_Api_Routes } from '@/utils'
import { Card, CardBody, CardHeader } from '@heroui/react'
import React, { useEffect, useState } from 'react'

const ScrapingQueue = () => {
    const [onGoingJobs, setOnGoingJobs] = useState(0)
    useEffect(() => {
        const getData = async()=>{
            const data = await apiClient.get(Admin_Api_Routes.JOB_DETAILS)
            setOnGoingJobs(data.data.onGoingJobs)
        }   
        const interval = setInterval(()=>getData(),3000)
        return ()=>{
            clearInterval(interval)
        }
    }, [])

    const onGoingJobColor = ()=>{
        if (onGoingJobs <=5) return "bg-green-500"
        else if (onGoingJobs <=10) return "bg-orange-500"
        else return "bg-red-500"
    }
    const onGoingJobTextColor = () => { 
        if (onGoingJobs <=5) return "text-green-500"
        else if (onGoingJobs <=10) return "text-orange-500"
        else return "text-red-500"
    }

     
  return (
    <Card className='h-full'>
        <CardHeader>Current Queue</CardHeader>
        <CardBody className='flex justify-center items-center'>
            <div className={`w-52 h-52 rounded-full flex items-center justify-center ${onGoingJobColor()}`}>
                <div className="h-44 w-44 bg-white rounded-full flex items-center justify-center">
                    <h4 className={`text-6xl font-bold ${onGoingJobTextColor()}`}>{onGoingJobs}</h4>
                </div>
            </div>
        </CardBody>
    </Card>
  )
}

export default ScrapingQueue
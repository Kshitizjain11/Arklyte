import { Footer } from '@/components/client/footer'
import { Navbar } from '@/components/client/navbar'
import React from 'react'

const PageLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex flex-col relative ' id='app-conatainer'>
        <main className='flex flex-col relative'>
            <Navbar/>
            <section className='h-full flex-1'>
                {children}
            </section>
            <Footer/>
        </main>
    </div>
  )
}

export default PageLayout
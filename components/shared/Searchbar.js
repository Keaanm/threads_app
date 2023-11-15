"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

const Searchbar = () => {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const pathname = usePathname()

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(search){
                router.push(`${pathname}?q=${search}`)
            }
            else{
                router.push(`${pathname}`)
            }
        }, 3000)

        return () => clearTimeout(delayDebounceFn)
    }, [search, pathname])
    return (
        <div className="searchbar">
            <Image 
            src='/assets/search-gray.svg'
            alt='search'
            width={24}
            height={24}
            className='object-contain'/>
            <Input
            className="no-focus searchbar_input"
            placeholder={pathname === '/search' ? 'Search Users' : `Search ${pathname.split('/').pop()}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            />
        </div>
    )
}

export default Searchbar
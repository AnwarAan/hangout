import EventCard from "@/components/event/EventCard"
import Container from "@/components/layout/Container"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { categories } from "../../../constant/index.jsx"
import { Skeleton } from "@/components/ui/skeleton"
import { getAPI } from "@/api/api"
import NoResources from "@/components/shared/NoResources"
import { useQuery } from "@tanstack/react-query"

const CategoryPage = () => {
    const { categoryHealth } = useParams()
    const [select, setSelect] = useState('today')
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const ref = useRef(null)
    const navigate = useNavigate()

    // const currentCategory = categories.filter(category => category.value === eventCategory)[0]

    // TODO: filtering data based on date    
    const { data, isLoading } = useQuery([`/category/${categoryHealth}`], async () => {
        try {
          const res = await getAPI(`event?category=health`)
        //   const currentCategory = res.filter(category => category.value === eventCategory)[0]
        //   return currentCategory;
          return res.data; 
        } catch (error) {
          throw new Error(error.response.data.message)
        }
      });      

    useEffect(() => {
        const clickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setSelect('today')
            }
        }
        clickOutside()

        document.addEventListener('mousedown', clickOutside)
        return () => {
            document.removeEventListener('mousedown', clickOutside)
        }
    }, [])
    
    // console.log(categories);

    return (
        <div>
           <span className="cursor-pointer" onClick={() => navigate(-1)}>
                <span className="flex items-center gap-2">
                    <ArrowLeft className="text-primary w-4 h-4" /> <p className="hover:underline text-muted-foreground hover:text-foreground">back</p>
                </span>
            </span>
            <div className="w-full bg-secondary mt-4 h-[250px] rounded-md">
                <div className="w-full mx-auto flex items-center h-full">
                    <div className=" flex flex-col justify-center px-8 gap-2">
                        <h1 className="text-6xl font-extrabold text-primary max-w-[800px]">{`Events`}</h1>
                        <p className="text-primary">{`Discover the best events in your area and online`}</p>
                    </div>
                </div>
            </div>
            <div className="w-full mx-auto py-4 relative">
                <Select open={isCalendarOpen} onOpenChange={() => { setIsCalendarOpen(!isCalendarOpen) }
                } value={select} onValueChange={(value) => setSelect(value)} >
                    <SelectTrigger className="w-[180px] rounded-full">
                        <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup  >
                            <SelectItem value="calendar">Calendar</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="tomorrow">Tomorrow</SelectItem>
                            <SelectItem value="weekend">This Weekend</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {
                    select === 'calendar' &&
                    (
                        <div ref={ref}>
                            <Calendar className="absolute left-0 top-12 border w-max rounded-md bg-white mt-5" />
                        </div>
                    )
                }
                <div className="p-2 grid grid-cols-4 gap-4">
                    {
                        isLoading ?
                            <Skeleton className="w-10 h-10 rounded-md bg-secondary" />
                            : data.length > 0 ?
                                data.map(event => (<div key={event.id}><EventCard event={event} /></div>))
                                : <NoResources text={`no Events`} />
                    }
                </div>
            </div>
        </div>
    )
}

export default CategoryPage
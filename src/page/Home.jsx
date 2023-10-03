// import Container from "../components/layout/Container"
import { ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import Category from "../components/event/Category"
import EventCard from "@/components/event/EventCard"
import UserCard from "@/components/event/UserCard"

import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
// import { useQueryCache } from "@/hooks/useQueryCache";
import { categories } from "../../constant/index.jsx"
import { Skeleton } from "@/components/ui/skeleton"
import NoResources from "@/components/shared/NoResources"

import { getAPI } from "@/api/api"
import useToken from "@/hooks/useToken"

const tabs = ["All", "Online", "Today", "This Week", "Free"]

const MyEvent = () => {
  const { userId } = useToken()

  const {
    data: user,
    isLoading,
    isFetched: userFetched,
  } = useQuery(["event-user"], async () => {
    const res = await getAPI(`user/${userId}`)
    return res.data
  })

  return (
    <div className="rounded-md shadow-sm h-10 bg-background p-2 w-full flex flex-col gap-2">
      {isLoading ? (
        <Skeleton className="bg-secondary w-[260px] h-[100px]" />
      ) : userFetched && user.events.length > 0 ? (
        user.events.map((event) => <UserCard key={event.id} event={event} />)
      ) : (
        <Skeleton />
      )}
    </div>
  )
}

const Home = () => {
  const { isLogin } = useToken()
  const [tab, setTab] = useState("All")

  const { data, isLoading } = useQuery(["events"], async () => {
    const res = await getAPI("event")
    return res.data
  })

  // const { data: today, isLoading: todayLoading } = useQuery(["events"], async () => {
  //   const res = await getAPI("event");
  //   return res.data;
  // });

  // const { data: today, isLoading: todayLoading } = useQueryCache("filter/today", "/f", { date: 0 }, tab === "Today");
  // const { data: thisWeek, isLoading: thisWeekLoading } = useQueryCache(
  //   "filter/thisWeek",
  //   "/f",
  //   { date: 7 },
  //   tab === "This Week"
  // );
  // const { data: online, isLoading: onlineLoading } = useQueryCache(
  //   "filter/online",
  //   "/location",
  //   { loc: "isOnline", value: "online" },
  //   tab === "Online"
  // );
  // const { data: free, isLoading: freeLoading } = useQueryCache("filter/free", "/f", { price: "free" }, tab === "Free");

  // const { data: userEvent } = useQueryCache(`event/${userId}`, "/user", { id: userId }, true);

  useEffect(() => {}, [])

  return (
    // <Container>
    <div
      className={`flex flex-col w-full items-center ${
        isLogin && "lg:flex-row"
      }`}
    >
      <div
        className={`${
          isLogin
            ? "w-[1280px]"
            : "w-[640px] lg:w-[calc((100%_-_350px)_-_45px)] mr-0 lg:mr-[45px] h-[1000px] px-6 sm:p-2"
        }`}
      >
        <div
          className={`flex overflow-x-auto gap-4 lg:w-full justify-between ${
            isLogin ? "w-[1280px]" : "w-[640px]"
          }`}
        >
          {categories.map((category) => (
            <Category
              key={category.value}
              imgUrl="/placeholder.jpeg"
              category={category}
            />
          ))}
        </div>
        <div className="mt-8">
          <Tabs
            defaultValue="All"
            value={tab}
            onValueChange={setTab}
            className="w-full"
          >
            <TabsList className="flex justify-start gap-2 bg-backround text-primary">
              {tabs.map((tab) => (
                <TabsTrigger
                  className="p-2 px-4 rounded-full hover:ring-1 hover:ring-primary data-[state=active]:border-primary data-[state=active]:border data-[state=active]:text-primary data-[state=active]:font-bold"
                  key={tab}
                  value={tab}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="All">
              <div className="p-2 grid grid-cols-4 gap-4 items-stretch">
                {isLoading ? (
                  <Skeleton className="bg-secondary w-[260px] h-[100px]" />
                ) : data.length > 0 ? (
                  data.map((event) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))
                ) : (
                  <NoResources text="no events" />
                )}
              </div>
            </TabsContent>
            <TabsContent value="Online">
              {/* <div className="p-2 grid grid-cols-4 gap-4">
                {onlineLoading ? (
                  <Skeleton className="bg-secondary w-[260px] h-[100px]" />
                ) : online.length > 0 ? (
                  online.map((event) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))
                ) : (
                  <NoResources text="no online events" />
                )}
              </div> */}
            </TabsContent>
            <TabsContent value="Today">
              {/* <div className="p-2 grid grid-cols-4 gap-4">
                {todayLoading ? (
                  <Skeleton className="bg-secondary w-[260px] h-[100px]" />
                ) : today.length > 0 ? (
                  today.map((event) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))
                ) : (
                  <NoResources text="no today's events" />
                )}
              </div> */}
            </TabsContent>
            <TabsContent value="This Week">
              {/* <div className="p-2 grid grid-cols-4 gap-4">
                {thisWeekLoading ? (
                  <Skeleton className="bg-secondary w-[100px] h-[100px]" />
                ) : thisWeek.length > 0 ? (
                  thisWeek.map((event) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))
                ) : (
                  <NoResources text="no events this week" />
                )}
              </div> */}
            </TabsContent>
            <TabsContent value="Free">
              {/* <div className="p-2 grid grid-cols-4 gap-4">
                {freeLoading ? (
                  <Skeleton className="bg-secondary w-[100px] h-[100px]" />
                ) : free.length > 0 ? (
                  free.map((event) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))
                ) : (
                  <NoResources text="sowy no free events" />
                )}
              </div> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {isLogin && (
        <div className="w-[350px] shrink-0 hidden lg:flex">
          <div className="fixed flex flex-col gap-4 top-[80px] w-[1950px] right-auto max-w-[350px] p-2">
            <div className="rounded-md shadow-sm bg-background p-2 w-full">
              <span className="flex gap-2 items-end justify-between">
                <h4 className="text-lg font-bold">My Events</h4>
                <Link
                  className="flex gap-1 items-center text-sm text-slate-500"
                  to="/profile/my-events/"
                >
                  See All <ChevronRight size={20} />
                </Link>
              </span>
            </div>

            {isLogin ? <MyEvent /> : ""}
            {/* <div className="rounded-md shadow-sm h-10 bg-background p-2 w-full flex flex-col gap-2">
              {userEvent && userEvent.slice(0, 3).map((event) => <UserCard key={event.id} event={event} />)}
            </div> */}
          </div>
        </div>
      )}
    </div>
    // </Container>
  )
}

export default Home

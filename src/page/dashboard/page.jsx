// import Navbar from "./components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import Overview from "./components/overview"
import Events from "./components/events/page"
import useToken from "@/hooks/useToken"
import { getAPI } from "@/api/api"

const Dashboard = () => {
  const { userId } = useToken()
  const { data: events, isFetched } = useQuery(["event-user"], async () => {
    const res = await getAPI(`event/user/${userId}`)
    return res.data
  })

  useEffect(() => {
    document.documentElement.classList.add("light")
  }, [])

  return (
    <div>
      <div className="xl:w-[1280px] mx-auto text-foreground">
        <div className="mt-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="w-full">
                {isFetched && <Overview events={events} />}
              </div>
            </TabsContent>
            <TabsContent value="events">
              {isFetched && <Events events={events} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

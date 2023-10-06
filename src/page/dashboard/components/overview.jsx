import { Calendar, DollarSign, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import MyResponsiveLine from "./charts/LineCharts"
import { FormatToIDR } from "@/lib/utils"
import Attendee from "./attendee"
import { Button } from "@/components/ui/button"

const Overview = ({ events }) => {
  const data = events.map((event) => ({
    name: event.name,
    attendees: event.attendees.length,
  }))

  const totalRevenue = events.reduce((sum, event) => {
    const attendeesCount = event.attendees.length
    if (attendeesCount > 0) {
      const eventRevenue = event.price * attendeesCount
      return sum + eventRevenue
    }
    return sum
  }, 0)

  const totalRatings = events.reduce((sum, event) => {
    const reviews = event.reviews
    if (reviews.length > 0) {
      const eventRatingSum = reviews.reduce(
        (eventSum, review) => eventSum + review.rating,
        0
      )
      return sum + eventRatingSum / reviews.length
    }
    return sum
  }, 0)

  const totalEventsWithReviews = events.filter(
    (event) => event.reviews.length > 0
  ).length

  const overalRating =
    totalEventsWithReviews > 0 ? totalRatings / totalEventsWithReviews : 0

  let ratingEvaluate = ""
  if (overalRating > 0 && overalRating <= 1.0) {
    ratingEvaluate = "Very Poor"
  } else if (overalRating > 1 && overalRating <= 1.5) {
    ratingEvaluate = "Poor"
  } else if (overalRating > 1.5 && overalRating <= 2.0) {
    ratingEvaluate = "Below Average"
  } else if (overalRating > 2.0 && overalRating <= 2.5) {
    ratingEvaluate = "Average"
  } else if (overalRating > 2.5 && overalRating <= 3.0) {
    ratingEvaluate = "Good"
  } else if (overalRating > 3.0 && overalRating <= 3.5) {
    ratingEvaluate = "Above Average"
  } else if (overalRating > 3.5 && overalRating <= 4.0) {
    ratingEvaluate = "Exellent"
  } else if (overalRating > 4.0 && overalRating <= 4.5) {
    ratingEvaluate = "Outstanding"
  } else if (overalRating > 4.5 && overalRating <= 5.0) {
    ratingEvaluate = "Perfect"
  } else {
    ratingEvaluate = "No Rating"
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="border rounded-md p-4 bg-background">
          <span className="flex justify-between">
            <p>Total Revenue</p>
            <DollarSign className="w-4 h-4" />
          </span>
          <p className="font-bold text-xl">{FormatToIDR(totalRevenue)}</p>
          <p className="font-bold text-xs text-muted-foreground">
            Your Revenue for {events.length} events
          </p>
        </div>

        <div className="border rounded-md p-4 bg-background">
          <span className="flex justify-between">
            <p>Total Events</p>
            <Calendar className="w-4 h-4" />
          </span>
          <p className="font-bold text-xl">{events.length}</p>
          <p className="font-bold text-xs text-muted-foreground">
            Your make {events.length} events so far
          </p>
        </div>
        <div className="border rounded-md p-4 bg-background">
          <span className="flex justify-between">
            <p>Your Overal Ratings</p>
            <Star className="w-4 h-4" />
          </span>
          <span className="font-bold text-xl flex gap-2">
            <Star className="text-primary" /> {overalRating}
          </span>
          <p className="font-bold text-xs text-muted-foreground">
            Your are an {ratingEvaluate} Event Planner
          </p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 mt-6">
        <div className="col-span-3 h-[400px] border border-border rounded-md p-2 ">
          <MyResponsiveLine data={data} />
        </div>
        <div className="border col-span-2 rounded-md p-2 space-y-2 overflow-y-auto">
          <p className="font-bold mb-4">Recent Registration</p>

          {events
            .toReversed()
            .slice(0, 3)
            .map((event) => (
              <div key={event.id} className="border px-2 rounded-md">
                <span className="flex items-center justify-between">
                  <p className="text-muted-foreground">{event.name}</p>
                  <p className="py-2 text-muted-foreground">
                    {event.attendees.length <= 1
                      ? `${event.attendees.length} attendee`
                      : `${event.attendees.length} attendees`}
                  </p>
                </span>
                {event.attendees.length > 0 && <Separator />}
                <div className="flex p-2">
                  {event.attendees.length > 0 &&
                    event.attendees
                      .toReversed()
                      .slice(0, 3)
                      .map((attendee, i) => (
                        <div
                          key={attendee.name + i}
                          className={`flex gap-2  ${
                            i % 2 !== 0 &&
                            "transform -translate-x-4 border-2 rounded-full"
                          }`}
                        >
                          {i !== 2 ? (
                            <Attendee attendee={attendee} />
                          ) : (
                            <div className="w-[40px] h-[40px] grid place-content-center transform -translate-x-8 border-2 rounded-full bg-secondary">
                              {event.attendees.length - 3}+
                            </div>
                          )}
                        </div>
                      ))}
                </div>
              </div>
            ))}
          <Button className="w-full bg-primary hover:bg-primary/80">
            See more
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Overview

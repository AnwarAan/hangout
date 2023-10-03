import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocation } from "@/hooks/useLocation"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { FormatToIDR } from "@/lib/utils"
import { format } from "date-fns"
import {
  ArrowLeft,
  Check,
  Heart,
  Loader2,
  Share,
  Star,
  Ticket,
} from "lucide-react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventRegisterSchema } from "@/schema"

import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import CommentSection from "./components/CommentSection"
import Comment from "./components/Comment"
import useToken from "@/hooks/useToken"
import { getAPI, putAPI } from "@/api/api"
import ShareEvent from "./components/Share"
import * as Toast from "@radix-ui/react-toast"
import "../../assets/css/toast.css"

const EventDetails = () => {
  const { eventId } = useParams()
  const [open, setOpen] = useState(false)
  const { userId, isLogin, token } = useToken()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const { data: user, isSuccess } = useQuery(["user"], async () => {
    const res = await getAPI(`user/${userId}`)
    return res.data
  })

  const { data: event, isFetched: eventFetched } = useQuery(
    ["event"],
    async () => {
      const res = await getAPI(`event/${eventId}`)
      return res.data
    },
    { refetchInterval: 2000 }
  )

  const { data: reviews, isFetched: reviewFetched } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await getAPI(`review/${eventId}`)
      return res.data
    },
    refetchInterval: 2000,
  })

  const eventRating =
    reviewFetched && reviews.length > 0
      ? reviews.reduce(
          (acc, curr) => acc + (curr.rating ? curr.rating : 0),
          0
        ) / reviews.filter((review) => review.rating !== null).length
      : -1

  let ratingEvaluate = ""
  if (eventRating > 0 && eventRating <= 1.0) {
    ratingEvaluate = "Very Poor"
  } else if (eventRating > 1 && eventRating <= 1.5) {
    ratingEvaluate = "Poor"
  } else if (eventRating > 1.5 && eventRating <= 2.0) {
    ratingEvaluate = "Below Average"
  } else if (eventRating > 2.0 && eventRating <= 2.5) {
    ratingEvaluate = "Average"
  } else if (eventRating > 2.5 && eventRating <= 3.0) {
    ratingEvaluate = "Good"
  } else if (eventRating > 3.0 && eventRating <= 3.5) {
    ratingEvaluate = "Above Average"
  } else if (eventRating > 3.5 && eventRating <= 4.0) {
    ratingEvaluate = "Exellent"
  } else if (eventRating > 4.0 && eventRating <= 4.5) {
    ratingEvaluate = "Outstanding"
  } else if (eventRating > 4.5 && eventRating <= 5.0) {
    ratingEvaluate = "Perfect"
  } else {
    ratingEvaluate = "No Rating"
  }

  const { data: province } = useLocation(
    "province",
    eventFetched && event.province
  )
  const { data: regency } = useLocation(
    "regency",
    eventFetched && event.regency
  )
  const { data: district } = useLocation(
    "district",
    eventFetched && event.district
  )

  const form = useForm({
    resolver: zodResolver(eventRegisterSchema),
    defaultValues: {
      referral: "",
      firstName: isLogin && isSuccess ? user.first_name : "",
      lastName: isLogin && isSuccess ? user.last_name : "",
      email: isLogin && isSuccess ? user.email : "",
    },
  })

  const transactions = useMutation({
    mutationFn: async (data) => {
      return putAPI(`user/transaction`, data, token)
    },
  })

  const price = eventFetched && event.type === "paid" ? Number(event.price) : 0
  const discount =
    eventFetched && event.promo !== null
      ? price - price * (Number(eventFetched && event.promo.percentage) / 100)
      : 0

  const isAlreadyAttend =
    eventFetched &&
    event.attendees.filter((attendee) => attendee.userId === userId).length > 0
  const onSubmit = (values) => {
    // checking if current event.user loggin is already attend to the event
    if (userId !== event.userId && !isAlreadyAttend) {
      transactions.mutate({
        name: values.firstName + " " + values.lastName,
        email: values.email,
        code: values.referral,
        eventId: event.id,
        userId: userId,
      })
    } else {
      console.log("cant register to own event")
    }
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        referral: "",
        firstName: "",
        lastName: "",
        email: "",
      })
    }
    if (transactions.isError || transactions.isSuccess) {
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
        // window.location.reload();
      }, 2000)
    }
  }, [
    form.formState,
    form,
    transactions.isError,
    transactions.isSuccess,
    isAlreadyAttend,
  ])

  return (
    eventFetched && (
      <div className="flex flex-col gap-4 pb-10">
        <Toast.Provider>
          {transactions.isError ? (
            <Toast.Provider swipeDirection="right">
              <Toast.Root
                className="ToastRootFailed"
                open={open}
                onOpenChange={setOpen}
              >
                <Toast.Title className="ToastTitle">Failed</Toast.Title>
              </Toast.Root>
              <Toast.Viewport className="ToastViewport" />
            </Toast.Provider>
          ) : (
            <Toast.Provider swipeDirection="right">
              <Toast.Root
                className="ToastRoot"
                open={open}
                onOpenChange={setOpen}
              >
                <Toast.Title className="ToastTitle">Success</Toast.Title>
              </Toast.Root>
              <Toast.Viewport className="ToastViewport" />
            </Toast.Provider>
          )}
          <span className="cursor-pointer" onClick={() => navigate(-1)}>
            <span className="flex items-center gap-2">
              <ArrowLeft className="text-primary w-4 h-4" />{" "}
              <p className="hover:underline text-muted-foreground hover:text-foreground">
                back
              </p>
            </span>
          </span>
          <div className="w-full h-[250px] rounded-md bg-secondary">
            <img
              className="w-full h-full rounded-xl"
              crossOrigin="anonymous"
              src={eventFetched && `http://localhost:8000/${event.image_url}`}
              alt=""
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {format(new Date(event.date), "PPP")}
            </p>
            <div className="flex flex-col items-center">
              <span className="p-2 rounded-md flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                {eventRating > 0 ? eventRating.toFixed(2) : "-"}
              </span>
              <p className="text-xs text-muted-foreground">
                {ratingEvaluate + " Event"}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="order-2 md:order-1 flex flex-col flex-1">
              <h2 className="font-bold text-2xl md:text-4xl">{event.name}</h2>
              <p>{event.description}</p>
              {event.user && (
                <div className="w-full p-2 mt-4 rounded-md bg-secondary flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      className="object-cover rounded-full w-[30px] h-[30px] self-start"
                      src={event.user.image_url}
                    />
                    <span className="flex flex-col">
                      <p className="font-bold">{event.user.first_name}</p>
                      {/* <p className="text-sm text-muted-foreground">{event.user.follower.length} Follower</p> */}
                    </span>
                  </div>
                  <Button className="bg-primary rounded-full hover:bg-primary/80">
                    FOLLOW
                  </Button>
                </div>
              )}
              <div className="space-y-6 mt-6">
                <span className="block">
                  <p className="font-bold">Date & Time</p>
                  <span className="flex gap-2">
                    <p>{format(new Date(event.date), "PPP")}</p>
                    <span className="text-muted-foreground">{event.time}</span>
                  </span>
                </span>
                <span className="block">
                  <p className="font-bold">Location</p>
                  {event.isOnline === "online" ? (
                    <p className="text-sm">{event.isOnline}</p>
                  ) : (
                    <span className="text-sm flex gap-2 capitalize">
                      {district ? (
                        <p>{`${district.name.toLowerCase()},`}</p>
                      ) : (
                        <Skeleton className="h4 w-10" />
                      )}
                      {regency ? (
                        <p>{`${regency.name.toLowerCase()},`}</p>
                      ) : (
                        <Skeleton className="h4 w-10" />
                      )}
                      {province ? (
                        <p>{`${province.name.toLowerCase()}`}</p>
                      ) : (
                        <Skeleton className="h4 w-10" />
                      )}
                    </span>
                  )}
                </span>
                <span className="block">
                  <p className="font-bold">Tags</p>
                  <span className="space-x-2">
                    {/* {event.tags.map((tag) => (
                    <Badge className="cursor-pointer" key={tag}>
                      {tag}
                    </Badge>
                  ))} */}
                  </span>
                </span>
              </div>
            </div>
            <div className="order-1 md:order-2 flex flex-col self-start gap-4 w-full md:w-max">
              <span className="flex items-center gap-4 self-end">
                <Heart className="w-6 h-6 cursor-pointer" />
                <Dialog>
                  <DialogTrigger>
                    <Share className="w-6 h-6 cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent>
                    <ShareEvent />
                  </DialogContent>
                </Dialog>
              </span>
              {!isAlreadyAttend ? (
                <div className="md:border md:border-border rounded-md w-full md:w-[250px] justify-between py-3 gap-2 md:px-6 md:py-4 flex flex-row md:flex-col items-center h-max">
                  {discount > 0 ? (
                    <span>
                      <p className="font-bold">{FormatToIDR(discount)}</p>
                      <span className="flex gap-2">
                        <Badge className="text-xs">{`${event.promo.percentage}%`}</Badge>
                        <p className="line-through text-muted-foreground text-sm">
                          {FormatToIDR(price)}
                        </p>
                      </span>
                    </span>
                  ) : (
                    <p className=" font-bold text-lg">
                      {event.type === "paid" ? FormatToIDR(price) : event.type}
                    </p>
                  )}

                  <Dialog>
                    <DialogTrigger>
                      <span className="flex items-center gap-2 hover:bg-secondary w-full order-2 md:order-1 border p-2 rounded-md">
                        <Ticket className="text-primary" />
                        <p>Get Ticket</p>
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {currentPage === 1
                            ? "Contact Information"
                            : "Checkout"}
                        </DialogTitle>
                      </DialogHeader>
                      <div>
                        {currentPage === 1 &&
                          (isLogin ? (
                            <p>
                              logged in as{" "}
                              <span className="text-muted-foreground">
                                {eventFetched && event.user.email}
                              </span>
                            </p>
                          ) : (
                            <p>register for the event</p>
                          ))}
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2"
                          >
                            {currentPage === 1 && (
                              <>
                                <div className="flex gap-4 items-center mt-4">
                                  <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                          <Input id="firstName" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                          <Input id="lastName" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input id="email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <span
                                  onClick={async () => {
                                    const inputErr = await form.trigger(
                                      ["email", "firstName", "lastName"],
                                      {
                                        shouldFocus: true,
                                      }
                                    )
                                    if (inputErr)
                                      setCurrentPage(currentPage + 1)
                                  }}
                                  className="bg-primary p-2 px-4 rounded-md hover:bg-primary/80 block w-max text-primary-foreground cursor-pointer"
                                >
                                  Register
                                </span>
                              </>
                            )}
                            {
                              currentPage === 2 && (
                                <div className="p-2">
                                  <span
                                    onClick={() =>
                                      setCurrentPage(currentPage - 1)
                                    }
                                    className="flex gap-2 items-center mb-4  hover:text-muted-foreground cursor-pointer"
                                  >
                                    <ArrowLeft className="w-4 h-4 cursor-pointer" />
                                    <p>back</p>
                                  </span>
                                  <span className="grid grid-cols-3">
                                    <p>Name</p>
                                    <p className="span-2 text-muted-foreground">{`${form.getValues(
                                      "firstName"
                                    )} ${form.getValues("lastName")}`}</p>
                                  </span>
                                  <span className="grid grid-cols-3">
                                    <p>Email</p>
                                    <p className="span-2 text-muted-foreground">
                                      {form.getValues("email")}
                                    </p>
                                  </span>
                                  <span className="grid grid-cols-3">
                                    <p>Items</p>
                                    <p className="span-2 text-muted-foreground">{`1 x ${event.name} Ticket`}</p>
                                  </span>
                                  <span className="grid grid-cols-3">
                                    <p>Price</p>
                                    <p className="span-2 text-muted-foreground">
                                      {FormatToIDR(price)}
                                    </p>
                                  </span>
                                  {discount > 0 && (
                                    <span className="grid grid-cols-3">
                                      <p>Discount</p>
                                      <p className="span-2 text-muted-foreground">
                                        {FormatToIDR(price - discount)}
                                      </p>
                                    </span>
                                  )}
                                  <Separator className="my-3" />
                                  <span className="grid grid-cols-3">
                                    <p className="font-bold">Total</p>
                                    <p className="span-2 text-foreground">
                                      {discount
                                        ? FormatToIDR(
                                            price - (price - discount)
                                          )
                                        : FormatToIDR(price)}
                                    </p>
                                  </span>

                                  <span
                                    onClick={async () => {
                                      const inputErr = await form.trigger(
                                        ["email", "firstName", "lastName"],
                                        {
                                          shouldFocus: true,
                                        }
                                      )
                                      if (inputErr)
                                        setCurrentPage(currentPage + 1)
                                    }}
                                    className="bg-yellow-500 p-2 px-4 rounded-md hover:bg-yellow-400/80 block text-primary-foreground cursor-pointer w-full mt-4 text-center"
                                  >
                                    Redeem Referral
                                  </span>

                                  <Button
                                    className="mt-6 bg-primary hover:bg-primary/80 w-full"
                                    type="submit"
                                  >
                                    {transactions.isLoading && (
                                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                    )}
                                    {transactions.isLoading
                                      ? "Processing..."
                                      : "Checkout"}
                                  </Button>
                                </div>
                              )
                              // : (
                              //   (transactions.isSuccess && (
                              //     <div>
                              //       <div className="flex items-center gap-2 p-2 bg-green-100 rounded-full text-green-600 justify-center">
                              //         <p>Checkout Success</p>
                              //         <Check className="h-4 w-4" />
                              //       </div>
                              //       <p className="text-muted-foreground text-center my-4">you can close(x) the modal</p>
                              //     </div>
                              //   )) ||
                              //   (transactions.isError && (
                              //     <div>
                              //       <div className="flex items-center gap-2 p-2 bg-red-100 rounded-full text-red-600 justify-center">
                              //         <p>Checkout Failed</p>
                              //         <Check className="h-4 w-4" />
                              //       </div>
                              //       <p className="text-muted-foreground text-center my-4">you can close(x) the modal</p>
                              //     </div>
                              //   ))
                              // )
                            }
                            {
                              currentPage === 3 && (
                                <div className="p-2">
                                  <span
                                    onClick={() =>
                                      setCurrentPage(currentPage - 1)
                                    }
                                    className="flex gap-2 items-center mb-4  hover:text-muted-foreground cursor-pointer"
                                  >
                                    <ArrowLeft className="w-4 h-4 cursor-pointer" />
                                    <p>back</p>
                                  </span>

                                  <FormField
                                    control={form.control}
                                    name="referral"
                                    render={({ field }) => (
                                      <FormItem className="mt-6">
                                        <FormLabel>Referral Code</FormLabel>
                                        <FormControl>
                                          <Input
                                            id="referral"
                                            {...field}
                                            placeholder="ex. 30eb68f-e0fa-5ecc-887a-7c7a62614681"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button
                                    className="mt-6 bg-primary hover:bg-primary/80 w-full"
                                    type="submit"
                                  >
                                    {transactions.isLoading && (
                                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                    )}
                                    {transactions.isLoading
                                      ? "Processing..."
                                      : "Checkout"}
                                  </Button>
                                </div>
                              )
                              // (
                              //   (transactions.isSuccess && (
                              //     <div>
                              //       <div className="flex items-center gap-2 p-2 bg-green-100 rounded-full text-green-600 justify-center">
                              //         <p>Checkout Success</p>
                              //         <Check className="h-4 w-4" />
                              //       </div>
                              //     </div>
                              //   )) ||
                              //   (transactions.isError && (
                              //     <div>
                              //       <div className="flex items-center gap-2 p-2 bg-red-100 rounded-full text-red-600 justify-center">
                              //         <p>Checkout Failed</p>
                              //         <Check className="h-4 w-4" />
                              //       </div>
                              //     </div>
                              //   ))
                              // )
                            }
                          </form>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="md:border md:border-border rounded-md w-full md:w-[250px] justify-between py-3 gap-2 md:px-6 md:py-4 flex flex-row md:flex-col items-center h-max">
                  <p className="font-bold">Registered</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full my-8">
            <CommentSection event={event} />
            <p>{`${reviewFetched && reviews.length} Comments`}</p>
            <Separator className="my-6" />
            <div className="flex flex-col gap-4">
              {reviewFetched &&
                reviews.length > 0 &&
                reviews.map((comment) => (
                  <Comment key={comment.id} comment={comment} event={event} />
                ))}
            </div>
          </div>
        </Toast.Provider>
      </div>
    )
  )
}

export default EventDetails

import { formatToUnits } from "@/lib/utils";
import { categories } from "../../../../../constant";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader, Ticket } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventPromos } from "@/schema";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { postAPI } from "@/api/api";

const MyEventCard = ({ event }) => {
  const icons = categories.filter((category) => category.value === event.category)[0];

  const form = useForm({
    resolver: zodResolver(eventPromos),
    defaultValues: {
      name: "",
      percentage: "",
      limit: "",
    },
  });

  const eventMutation = useMutation({
    mutationFn: async (promo) => {
      return postAPI("promo", promo);
    },
  });

  const onSubmit = (values) => {
    eventMutation.mutate({
      name: values.name,
      percentage: values.percentage,
      limit: values.limit,
      eventId: event.id,
    });
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        name: "",
        percentage: "",
        limit: "",
      });
    }
  }, [form.formState, form]);
  console.log(event.price);
  return (
    <div className="flex items-center justify-between border border-border p-2 rounded-md">
      <div className="flex gap-2 items-center">
        <span className="grid place-content-center h-[50px] w-[50px] rounded-md bg-secondary border border-border text-primary">
          {icons.icon}
        </span>
        <div className="flex flex-col gap-2">
          <Link to={`/event/${event.id}`}>
            <p className="font-bold">{event.name}</p>
          </Link>
          <p className="font-bold rounded-full text-sm px-2 w-max bg-primary text-primary-foreground">
            {event.type === "paid" ? formatToUnits(parseInt(event.price)) : event.type}
          </p>
        </div>
      </div>

      {event.price !== 0 ? (
        event.promo ? (
          <div className="h-10 flex  gap-2 items-center rounded-full bg-primary hover:bg-primary/80 text-white text-center px-10">
            <p className="my-auto">limit</p>
            <p>{event.promo.limit}</p>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex gap-2 items-center rounded-full bg-primary hover:bg-primary/80">
                <Ticket />
                add promos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Promos</DialogTitle>
                <DialogDescription>
                  Easily create and manage enticing discounts and promotions for your events, driving higher ticket
                  sales and increasing event attendance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))} className="space-y-4">
                    {/* <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promo Name</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input {...field} placeholder="ex. PROMO75" />
                          </FormControl>
                          <FormDescription>give your promo unique identifier</FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        name="percentage"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel id="percentage">Percentage</FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input id="percentage" {...field} placeholder="ex. 35" />
                              </FormControl>
                              <FormDescription>How big is your promo</FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="limit"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel id="limit">Limit</FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input id="limit" {...field} placeholder="ex. 10" />
                              </FormControl>
                              <FormDescription>How many people can have your promo</FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/80" type="submit">
                      {eventMutation.isLoading && <Loader className="w-4 h-4 animate-spin" />}
                      {eventMutation.isLoading ? "Processing..." : "Set Promo"}
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyEventCard;

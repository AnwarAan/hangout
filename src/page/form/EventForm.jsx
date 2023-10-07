import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Plus, X, ArrowLeft, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/schema";

// import Container from "@/components/layout/Container";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
import { categories } from "../../../constant/index.jsx";
import PickedTime from "@/page/form/components/PickedTime";
import DateAndTime from "@/page/form/components/DateAndTime";
import LocationField from "@/page/form/components/LocationField";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { postAPI } from "@/api/api.js";

const emptyForm = {
  name: "",
  location: {
    isOnline: "online",
    provinces: "",
    regency: "",
    district: "",
    address: "",
  },
  date: new Date(),
  time: {
    hours: "0",
    minutes: "0",
    type: "PM",
  },
  description: "",
  type: "free",
  price: "",
  tags: [],
};

const EventForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // const [tag, setTag] = useState("");
  // const [tags, setTags] = useState([]);
  const [type, setType] = useState("free");

  const mutation = useMutation({
    mutationFn: async (newEvents) => {
      return postAPI("event", newEvents);
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset(emptyForm);
    }
  }, [form]);

  const onSubmit = (values) => {
    // setTags([]);
    mutation.mutate({
      ...values,
      price: values.type === "free" ? 0 : values.price,
      isOnline: values.location.isOnline,
      province: values.location.province,
      regency: values.location.regency,
      district: values.location.district,
      address: values.location.address,
      date: new Date(values.date).getTime(),
      time: `${values.time.hours}:${values.time.minutes} ${values.time.type.toUpperCase()}`,
    });
  };

  // const handleAddTag = () => {
  //   setTag("");
  //   if (tag.length > 0) {
  //     setTags([...tags, tag]);
  //     form.setValue("tags", [...form.getValues("tags"), tag]);
  //   }
  // };

  const formSuccess = mutation.isSuccess ? { title: "Success", desc: "Event sucessfully created." } : {};

  return (
    // <Container>
    <div className="w-full space-y-4 border rounded-md p-4">
      <span className="flex items-center gap-2">
        <ArrowLeft className="w-6 h-6" onClick={() => navigate(-1)} />
        <h2 className="font-bold text-lg">Lets create your event</h2>
      </span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}>
          <div className="flex gap-4 w-full">
            <div className="w-full space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel htmlFor="name">Event Name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="What is your event called" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* location form control  */}
              <LocationField form={form} />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about the event" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full space-y-4">
              <div className="flex gap-4">
                {type === "paid" ? (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col gap-2">
                        <span className="flex gap-2">
                          <span onClick={() => setType("free")}>
                            <ArrowLeft className="w-4 h-4 cursor-pointer" />
                          </span>
                          <FormLabel htmlFor="price">Event Price</FormLabel>
                        </span>
                        <FormControl>
                          <div className="flex border rounded-md">
                            <span className="block p-2 bg-secondary rounded-l-md  text-muted-foreground">Rp.</span>
                            <Input
                              className="border-none"
                              id="price"
                              value={field.value === "paid" ? "" : field.value}
                              onChange={field.onChange}
                              placeholder="how much your event cost"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="type"
                    render={() => (
                      <FormItem className="w-full">
                        <FormLabel>Event Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              setType(value);
                              form.setValue("type", value);
                            }}
                            value={type}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Event Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Event Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                          defaulValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Event Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.text}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4 justify-between">
                <DateAndTime form={form} />
                <PickedTime form={form} />
              </div>

              {/* <div className="flex flex-col text-sm gap-3 h-max">
                <label htmlFor="tag">tag(s)</label>
                <div className="flex gap-2">
                  <span className="border w-max rounded-md flex">
                    <Input
                      className="border-none focus-visible:rounded-none py-1 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-gray-200 focus-visible:outline-none w-[100px] "
                      id="tag"
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="ex. Book"
                    />
                    <span onClick={handleAddTag} className="p-2 cursor-pointer bg-secondary rounded-r-md text-gray-500">
                      <Plus size={20} />
                    </span>
                  </span>
                  <span className="flex flex-wrap max-w[400px] gap-2 h-max">
                    {tags.map((tag, i) => (
                      <Badge key={i} className="flex gap-2 justify-between">
                        <span>{tag}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            setTags((preTags) => preTags.filter((_, index) => i !== index));
                            form.setValue(
                              "tags",
                              form.getValues("tags").filter((_, index) => i !== index)
                            );
                          }}
                        >
                          <X size={15} />
                        </span>
                      </Badge>
                    ))}
                  </span>
                </div>
              </div> */}
            </div>
          </div>
          <Button
            className="mt-4  bg-primary hover:bg-primary/80 dark:bg-primary dark:hover:bg-primary/80"
            type="submit"
            onClick={() =>
              toast({
                title: formSuccess && formSuccess.title,
                description: formSuccess && formSuccess.desc,
              })
            }
          >
            {mutation.isLoading && <Loader2 className={`animate-spin w-4 h-4`} />}
            {mutation.isLoading ? "creating..." : "Create Event"}
          </Button>
        </form>
      </Form>
    </div>
    // </Container>
  );
};

export default EventForm;

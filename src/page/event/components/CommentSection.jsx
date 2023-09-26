import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { eventComment } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReviewStar from "./ReviewStar";
import useToken from "@/hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import { getAPI, postAPI } from "@/api/api";

const CommentSection = ({ event, isChild }) => {
  const { userId, isLogin } = useToken();
  //   const { user, isLogin } = useUser();
  const [rating, setRating] = useState(null);
  const form = useForm({
    resolver: zodResolver(eventComment),
    defaultValues: {
      review: "",
    },
  });

  const { data: user, isFetched: userFetched } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await getAPI(`user/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (comment) => {
      return postAPI("review", comment);
    },
  });

  const onSubmit = (values) => {
    mutate({
      ...values,
      rating: rating,
      eventId: event.id,
      userId: userId,
    });
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        review: "",
      });
      setRating(null);
    }
  }, [form, form.formState]);

  const handleRating = (value) => {
    setRating(value);
  };
  return (
    <div className="p-2 flex gap-4">
      <Avatar className="w-7 h-7">
        <AvatarImage
          src={isLogin ? userFetched && user.image_url : ""}
          alt={isLogin ? userFetched && user.fullName : "user avatar"}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))} className="w-full flex flex-col gap-2">
          {!isChild && <ReviewStar rating={rating} handleRating={handleRating} />}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea className="w-full resize-none" rows={isChild ? "1" : "4"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="self-end flex items-center gap-2">
            <Button className="bg-secondary hover:bg-secondary text-muted-foreground border rounded-full">
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/80 rounded-full">
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : isChild ? "Reply" : "Comment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CommentSection;

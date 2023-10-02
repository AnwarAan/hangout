import { format } from "date-fns";
import { Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatToUnits } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useToken from "@/hooks/useToken";

const EventCard = ({ event }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  // const { userId } = useAuth();
  const { userId } = useToken;

  const eventMutation = useMutation({
    mutationFn: async (event) => {
      return services.put(`/events`, event, { params: { id: event.id, userId } });
    },
  });

  // const { data: currentUser, isFetched } = useQuery({
  //   queryKey: ["user", userId],
  //   queryFn: async () => {
  //     const res = await services.get(`/users/${userId}`);
  //     return res.data;
  //   },
  //   enabled: !!userId,
  // });

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isFavorite) {
      eventMutation.mutate({
        ...event,
        // favorites: [...event.favorites, userId],
      });
    }
  };

  // const userFavoriteId = isFetched ? currentUser.favorites.filter(id => event.id === id).length > 0 : false
  return (
    <div className="rounded-lg bg-background shadow-sm border border-border  w-full z-[1]">
      <div className="flex items-start justify-between p-2">
        <span className=" top-2 left-2 bg-white/30 border-border border backdrop-blur-md w-max px-2 py-1 rounded-md flex flex-col items-center justify-center">
          <p className="font-bold text-xl leading-none text-foreground">{new Date(event.date).getDate()}</p>
          <p className="text-sm text-foreground/50">{format(new Date(event.date), "LLLL").slice(0, 3)}</p>
        </span>
        <form onSubmit={handleOnSubmit}>
          <button type="submit">
            <Heart
              className=" top-2 right-2 text-primary transform hover:scale-110  cursor-pointer transition-all duration-75"
              size={20}
              // fill={`${isFavorite || userFavoriteId ? "#2563eb" : "transparent"}`}
              onClick={() => setIsFavorite(!isFavorite)}
            />
          </button>
        </form>
      </div>
      <div className="bg-muted m-2 p-2 flex flex-col border border-border shadow-sm backdrop-blur-lg rounded-md">
        <Link to={`/event/${event.id}`} className="font-bold hover:underline">
          {event.name}
        </Link>
        <span className="flex justify-between items-center gap-2">
          <p className="text-xs text-gray-500">{format(new Date(event.date), "PPP")}</p>
          <Badge
            className={`text-xs bg-primary hover:bg-primary/80 ${
              event.type === "free" &&
              "bg-transparent text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {event.type === "paid" ? formatToUnits(parseInt(event.price)) : event.type}
          </Badge>
        </span>
      </div>
    </div>
  );
};

export default EventCard;

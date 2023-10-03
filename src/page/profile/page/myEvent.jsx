import MyEventCard from "./components/MyEventCard";
import useToken from "@/hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/api";

const MyEvent = () => {
  const { userId } = useToken();

  const { data: user, isFetched } = useQuery(
    ["user-event"],
    async () => {
      const res = await getAPI(`user/${userId}`);
      return res.data;
    },
    { refetchInterval: 2000 }
  );

  return <div>{isFetched && user.events.map((event) => <MyEventCard key={event.id} event={event} />)}</div>;
};

export default MyEvent;

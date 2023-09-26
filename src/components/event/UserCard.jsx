import { formatToUnits } from "@/lib/utils";
import { categories } from "../../../constant";
import { Link } from "react-router-dom";

const userCard = ({ event }) => {
  const icons = categories.filter((category) => category.value === event.category)[0];

  return (
    <div className="flex items-center justify-between border border-border p-2 rounded-md">
      <div className="flex gap-2 items-center">
        <span className="grid place-content-center h-[50px] w-[50px] rounded-md bg-secondary border border-border text-primary">
          {icons.icon}
        </span>
        <div className="flex flex-col gap-2">
          <Link to={`/event/${event.id}`}>
            <p className="font-bold hover:underline">{event.name}</p>
          </Link>
          <p className="font-bold rounded-full text-sm px-2 w-max bg-primary text-primary-foreground">
            {event.type === "paid" ? formatToUnits(parseInt(event.price)) : event.type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default userCard;

import Container from "@/components/layout/Container";
import { Calendar, Heart, Ticket } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Profile = () => {
  return (
    // <Container>
    <div className="flex border rounded-md h-[calc(100vh_-_100px)]">
      <div className="w-[300px] bg-secondary rounded-l-md pl-2 py-2">
        <ul className="mt-6 text-foreground">
          <NavLink
            className={`${({ isActive }) =>
              isActive
                ? "active"
                : "flex"} flex items-center gap-2 py-2 pl-2 pr-0 hover:bg-primary hover:text-primary-foreground rounded-l-md cursor-pointer`}
            to="/profile/my-referals"
          >
            <Ticket className="w-4 h-4" />
            <p>My Referal Codes</p>
          </NavLink>
          <NavLink
            className={`${({ isActive }) =>
              isActive
                ? "active"
                : "flex"} flex items-center gap-2 py-2 pl-2 pr-0 hover:bg-primary hover:text-primary-foreground rounded-l-md cursor-pointer`}
            to="/profile/my-events"
          >
            <Calendar className="w-4 h-4" />
            <p>My Events</p>
          </NavLink>
          <NavLink
            className={`${({ isActive }) =>
              isActive
                ? "active"
                : "flex"} flex items-center gap-2 py-2 pl-2 pr-0 hover:bg-primary hover:text-primary-foreground rounded-l-md cursor-pointer`}
            to="/profile/my-favorites"
          >
            <Heart className="w-4 h-4" />
            <p>Favorite Events</p>
          </NavLink>
        </ul>
      </div>
      <div className="flex-1 bg-background rounded-r-md">
        <div className="w-full flex flex-col gap-2 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
    // </Container>
  );
};

export default Profile;

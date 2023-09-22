import { toggleSearch } from "@/features/slice/eventSlice";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, LayoutDashboard, LogOut, Plus, Search, Ticket } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import { getAPI } from "@/api/api";

const UserProfile = () => {
  const { userId, logout } = useToken();
  const { data: user, isFetched } = useQuery(["user"], async () => {
    const res = await getAPI(`user/${userId}`);
    return res.data;
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="ring-2 ring-primary">
          <AvatarImage className="object-cover" src={isFetched && user.imageUrl ? user.imageUrl : ""} />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="">
          <div className="flex gap-2 items-center">
            <Avatar className="w-8 h-8">
              <AvatarImage src={isFetched && user.imageUrl ? user.imageUrl : ""} />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <div>
              <p>{isFetched && `${user.first_name} ${user.last_name}`}</p>
              <p className="text-gray-400 text-xs">{isFetched && user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <span className="flex gap-2 items-center">
            <p>My Points</p>
            <Badge className="bg-primary hover:bg-primary/80 cursor-pointer">{isFetched && user.points}</Badge>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-2 items-center">
          <Link to={`/profile/my-referals`} className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            <span>My Referal Code</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 items-center">
          <Link to={`/profile/my-events`} className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>My Events</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 items-center">
          <Link to={`/dashboard`} target="_blank" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-2 items-center mt-6">
          <Button className="h-6" onClick={logout}>
            <LogOut className="w-4 h-4 " />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);

  const { isLogin } = useToken();
  useEffect(() => {
    const mode = darkMode ? "dark" : "light";
    localStorage.setItem("mode", mode);
  }, [darkMode]);

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    document.documentElement.classList.add(mode);

    return () => {
      document.documentElement.classList.remove(mode);
    };
  }, [darkMode]);

  return (
    <nav className="z-20 w-full flex items-center dark:bg-background dark:border-b dark:border-border justify-between  gap-4 px-6 sm:px-10 py-2 shadow-sm fixed top-0 left-0 bg-white">
      <div className="flex gap-8 items-center">
        <Link className="text-xl font-bold leading-4 hidden md:block text-primary dark:text-foreground" to="/">
          Hangout.id
        </Link>
        <div
          onClick={() => dispatch(toggleSearch(true))}
          className="flex cursor-pointer bg-background border-primary dark:border-border backdrop-blur-sm w-[350px] gap-2 rounded-full items-center border p-1"
        >
          <Search size={20} className="ml-2 text-primary dark:text-foreground" />
          <button className="px-2 py-1 text-primary/50 dark:text-foreground">Search...</button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Link
          to={`/${isLogin ? "event-form" : "login"}`}
          className="flex items-center bg-primary text-primary-foreground hover:bg-primary/80  backdrop-blur-sm gap-4 px-4 py-2 border  rounded-full"
        >
          <Plus size={20} />
          <span>Event</span>
        </Link>
        <div className={`${isLogin && "p-1 rounded-md w-12 h-12 ml-8"}`}>
          {isLogin ? (
            <UserProfile />
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className=" text-black p-2 px-4">
                Login
              </Link>
              <Link to="/register" className="rounded-full border hover:bg-gray-100 black text-black p-2 px-4">
                Register
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="theme-mode" checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
        </div>
      </div>
    </nav>
  );
};

export default Header;

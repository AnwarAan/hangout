import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { toggleSearch } from "@/features/slice/eventSlice";
import EventCard from "../event/EventCard";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Search, X } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { Skeleton } from "../ui/skeleton";
import { useDebounce } from "use-debounce";
import { categories } from "../../../constant/index.jsx";

const SearchBox = () => {
  const dispatch = useDispatch();
  const { isSearch } = useSelector((state) => state.events);
  const [keyword, setKeyword] = useState("");
  const [debounceKeyword] = useDebounce(keyword, 1000);
  // Filters hold object that contains filter conditions for [date, price, category].
  const [filters, setFilters] = useState(["", "", ""]);
  const isShow = filters.filter((filter) => filter.length > 0).length > 0;
  console.log("this", isSearch);
  const { data: filterData } = useQuery({
    queryKey: [`search/filter`, filters, debounceKeyword],
    queryFn: async () => {
      const res = await services.get(
        `/events/f?date=${filters[0]}&price=${filters[1]}&category=${filters[2]}&q=${debounceKeyword}`
      );
      return res.data.data;
    },
    enabled: Boolean(filters || debounceKeyword),
    refetchOnWindowFocus: false,
  });

  const handleRadioCange = (value, key) => {
    const copyFilters = [...filters];
    copyFilters[key] = value;
    setFilters(copyFilters);
  };

  return (
    <div
      className={`fixed top-0 left-0 p-4 bg-white w-full h-full transform origin-center ${
        isSearch ? "translate-y-0" : "translate-y-full"
      } transition-all duration-200 z-50`}
    >
      <span
        onClick={() => dispatch(toggleSearch(false))}
        className="p-2 border rounded-full float-right mt-2 mr-2 cursor-pointer hover:bg-gray-100/50"
      >
        <X />
      </span>
      <div className="w-[1280px] mx-auto space-y-2 flex gap-4">
        <div className="w-[768px]">
          <div
            onClick={() => dispatch(toggleSearch(true))}
            className="flex bg-white w-[350px] gap-2 rounded-full items-center border px-4 py-1"
          >
            <Search className="ml-2" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="p-2 w-full border-none focus-visible:outline-none"
              type="text"
              placeholder="Search..."
            />
          </div>
          <div className="mt-8 space-y-4">
            <h3 className="font-bold text-xl">Filters</h3>
            <RadioGroup value={filters[0]} onValueChange={(value) => handleRadioCange(value, 0)}>
              <p className="font-bold text-lg">Date</p>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="r1" />
                <Label htmlFor="r1">Today</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2">Tomorrow</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7" id="r3" />
                <Label htmlFor="r3">This Weekend</Label>
              </div>
            </RadioGroup>
            <RadioGroup value={filters[1]} onValueChange={(value) => handleRadioCange(value, 1)}>
              <p className="font-bold text-lg">Price</p>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="rfree" />
                <Label htmlFor="rfree">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="rpaid" />
                <Label htmlFor="rpaid">Paid</Label>
              </div>
            </RadioGroup>
            <RadioGroup value={filters[2]} onValueChange={(value) => handleRadioCange(value, 2)}>
              <p className="font-bold text-lg">Category</p>
              {categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.value} id={category.value} />
                  <Label htmlFor={category.value}>{category.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <span className="flex gap-2 w-full">
            {filters[0] && isShow && (
              <Badge className="flex items-center gap-4 bg-primary hover:bg-primary/80">
                <span>{filters[0] === "0" ? "Today" : filters[0] === "2" ? "Tomorrow" : "This Weekend"}</span>
                <X onClick={() => handleRadioCange("", 0)} className="h-3 w-3 cursor-pointer" />
              </Badge>
            )}
            {filters[1] && isShow && (
              <Badge className="flex items-center gap-4 bg-primary hover:bg-primary/80">
                <span>{filters[1]}</span>
                <X onClick={() => handleRadioCange("", 1)} className="h-3 w-3 cursor-pointer" />
              </Badge>
            )}
            {filters[2] && isShow && (
              <Badge className="flex items-center gap-4 bg-primary hover:bg-primary/80">
                <span>{filters[2]}</span>
                <X onClick={() => handleRadioCange("", 2)} className="h-3 w-3 cursor-pointer" />
              </Badge>
            )}
            {isShow && (
              <button onClick={() => setFilters(["", "", ""])} className="underline hover:text-muted-foreground">
                clear filter
              </button>
            )}
          </span>
          <div className="grid grid-cols-4 gap-4 w-full">
            {filterData ? (
              filterData.map((event) => <EventCard event={event} key={event.id} />)
            ) : (
              <Skeleton className="w-[200px] h-[250px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;

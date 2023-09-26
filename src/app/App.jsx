import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";

const App = () => {
  return (
    <Fragment>
      <div className="">
        <Header />
      </div>
      <div className="w-full px-14 md:px-20 lg:px-0 lg:w-[1280px] mx-auto mt-20">{<Outlet />}</div>
    </Fragment>
  );
};

export default App;

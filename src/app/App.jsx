import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";

const App = () => {
  return (
    <Fragment>
      <div className="">
        <Header />
      </div>
      <div className="mt-20">{<Outlet />}</div>
    </Fragment>
  );
};

export default App;

import Bridge from "./components/Bridge";
import DepositBtn from "./components/DepositBtn";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import KycTosLink from "./components/KycTosLink";
import CustomerStatus from "./components/CustomerStatus";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <DepositBtn />,
  },
  {
    path: "/customerKyc",
    element: <Bridge />,
  },
  {
    path: "/kycTos",
    element: <KycTosLink />,
  },
  {
    path: "/userStatus",
    element: <CustomerStatus />,
  },
]);

function App() {
  return (
    <div className="m-5 p-5 text-center text-3xl">
      <h1>Parifi x Bridge</h1>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;

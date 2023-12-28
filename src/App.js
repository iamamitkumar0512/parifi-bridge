import Bridge from "./components/Bridge";
import DepositBtn from "./components/DepositBtn";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import KycTosLink from "./components/KycTosLink";
import CustomerStatus from "./components/CustomerStatus";
import { Provider } from "react-redux";
import store from "./utils/store";
import AddFunds from "./components/AddFunds";
import WithdrawFunds from "./components/WithdrawFunds";

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
  {
    path: "/addFunds",
    element: <AddFunds />,
  },
  {
    path: "/withdrawFunds",
    element: <WithdrawFunds />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <div className="m-5 p-5 text-center text-3xl">
        <h1>Parifi x Bridge</h1>
        <RouterProvider router={appRouter} />
      </div>
    </Provider>
  );
}

export default App;

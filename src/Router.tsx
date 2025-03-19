import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";

import Disclaimer from "./pages/Disclaimer";

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/APP",
      element: <App />,
    },
    {
      path: "https://calorie-calculator-project.vercel.app/Disclaimer",
      element: <Disclaimer />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
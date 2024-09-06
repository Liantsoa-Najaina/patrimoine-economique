import { createBrowserRouter, RouterProvider } from "react-router-dom";

const ROUTER = createBrowserRouter([
/*  {
    path: "/possession",
    element: <Possession/>,
    children: [
      {
        path: ":libelle/close",
        element: <Possession />
      },
    ]
  },
  {
    path: "/possession/create",
    element: <CreatePossession />
  },
  {
    path: "/possession/:libelle/update",
    element: <UpdatePossession />
  },
  {
    path: "/patrimoine",
    element: <Patrimoine />,
    children: [
      {
        path: ":date",
        element: <Patrimoine />
      },
      {
        path: "range",
        element: <Patrimoine />
      }
    ]
  },
  {
    path: "*",
    element: <Menu />
  }*/
]);

export default function App() {
  return (
    <RouterProvider router={ROUTER} />
  )
}
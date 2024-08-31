import React from 'react'
import Possession from './Header/Possession'
import UpdatePossession from "./Pages/UpdatePossession";
import CreatePossession from './Pages/CreatePossession'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from './Header/Menu';
import Patrimoine from './Header/Patrimoine';

const ROUTER = createBrowserRouter([
  {
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
  }
]);

export default function App() {
  return (
    <RouterProvider router={ROUTER} />
  )
}
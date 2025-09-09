import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from '../components/SideBar/Sidebar';
import EmailMessages from '../components/EmailMessages/EmailMessages';
import MailPage from '../Pages/MailPage';
import Inbox from '../components/EmailLayout/Inbox';
import Starred from '../components/EmailLayout/Starred';
import Sent from '../components/EmailLayout/Sent';
import Drafts from '../components/EmailLayout/Drafts';
import Importants from '../components/EmailLayout/Importants';
import Spam from '../components/EmailLayout/Spam';
import Deleted from '../components/EmailLayout/Deleted';



const PageRouter = () => {
    const router =createBrowserRouter([
      {
      path: "/",
      element:<MailPage/>,

      
      children:[
        {
          path:'inbox',
          element:<Inbox/>
        },
        {
          path:'starred',
          element:<Starred/>
        },
        {
          path:'sent',
          element:<Sent/>
        },
         {
          path:'drafts',
          element:<Drafts/>
        },
        {
          path:'important',
          element:<Importants/>
        },
        {
          path:'allemails',
          element:<EmailMessages/>
        },
        {
          path:'spam',
          element:<Spam/>
        },
        {
          path:'deleted',
          element:<Deleted/>
        },
      ]
    },
       {
      path: "/sidebar",
      element: (
        <>
          <Sidebar/>
        </>
      ),
    },
    {
      path: "/email",
      element: (
        <>
          <EmailMessages/>
        </>
      ),
    },
    ])
  return (

    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default PageRouter;
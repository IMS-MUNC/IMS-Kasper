// import { createContext, useContext, useState } from "react";

// const InboxContext = createContext();

// export const InboxProvider = ({ children }) => {
//   const [inboxCount, setInboxCount] = useState(0);

//     // Optional: you can store the full emails list here if needed
//   const [emails, setEmails] = useState([]);

//   return (
//     <InboxContext.Provider value={{ inboxCount, setInboxCount,  emails, setEmails }}>
//       {children}
//     </InboxContext.Provider>
//   );
// };

// export const useInbox = () => useContext(InboxContext);


import { createContext, useContext, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";



const InboxContext = createContext();

export const InboxProvider = ({ children }) => {
  const [inboxCount, setInboxCount] = useState(0);
  const [emails, setEmails] = useState([]);

  const fetchInboxCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/email/mail/inbox-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.count !== undefined) {
        // console.log("📊 Fetched inboxCount from backend:", res.data.count);
        setInboxCount(res.data.count);
      }
    } catch (error) {
      console.log("Error fetching inbox count:", error);
    }
  };

  return (
    <InboxContext.Provider
      value={{ inboxCount, setInboxCount, emails, setEmails, fetchInboxCount }}
    >
      {children}
    </InboxContext.Provider>
  );
};

export const useInbox = () => useContext(InboxContext);

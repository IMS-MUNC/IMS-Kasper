import axios from "axios";
import React, { useEffect, useState } from "react";
import EmailMessages from "../EmailMessages/EmailMessages";
import BASE_URL from "../../../../pages/config/config";

const Deleted = () => {
  const [deletedEmails, setDeletedEmails] = useState([]);

  useEffect(() => {
    const fetchDeletedEmails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/email/mail/deleted`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📩 Deleted API raw response:", res.data);

        const formatted = res.data.data.map((email) => {
          const senderName = email.from?.firstName
            ? `${email.from.firstName} ${email.from.lastName || ""}`.trim()
            : email.from?.email || "Unknown";
          let profileImage = null;

if (typeof email.from?.profileImage === "string") {
  const match = email.from.profileImage.match(/url:\s*'([^']+)'/);
  profileImage = match ? match[1] : null;
} else {
  profileImage = email.from?.profileImage?.url || null;
}


          const initials = senderName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);


          return {
            ...email,
            sender: { name: senderName, profileImage, initials, backgroundColor: "#5e35b1" },
            subject: email.subject,
            messagePreview: (email.body || "").slice(0, 50) + "...",
            time:
              email.createdAt && !isNaN(new Date(email.createdAt))
                ? new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }).format(new Date(email.createdAt))
                : "Invalid Date",
            status: { dotColor: "red" },
            folders: { galleryCount: email.attachments?.length || 0 },
            tags: {
              starred: email.starred,
              extraLabelCount: 0,
            },
          };
        });

        setDeletedEmails(formatted);
      } catch (error) {
        console.error("❌ Failed to fetch deleted emails", error);
      }
    };

    fetchDeletedEmails();
    const interval = setInterval(fetchDeletedEmails, 15000); // every 15 sec
    return () => clearInterval(interval);
  }, []);


  return (

    <EmailMessages filteredEmails={deletedEmails} isDeletedPage={true}  />

  )
}

export default Deleted;

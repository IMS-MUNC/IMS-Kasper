import React, { useEffect, useState } from "react";
import axios from "axios";
import EmailMessages from "../EmailMessages/EmailMessages";
import BASE_URL from "../../../../pages/config/config";

const Starred = () => {
  const [starredEmails, setStarredEmails] = useState([]);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchStarredEmails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/email/mail/starred`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formatted = res.data.data.map((email) => {
          const senderName = email.from?.firstName
            ? `${email.from.firstName} ${email.from.lastName || ''}`.trim()
            : "Unknown";
          let profileImage = null;

if (typeof email.from?.profileImage === "string") {
  const match = email.from.profileImage.match(/url:\s*'([^']+)'/);
  profileImage = match ? match[1] : null;
} else {
  profileImage = email.from?.profileImage?.url || null;
}
          const initials = senderName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
          return {
            ...email,
            sender: {
              name: senderName,
              profileImage,
              initials,
              backgroundColor: "#5e35b1",
            },
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
            folders: {
              galleryCount: email.attachments?.length || 0,
            },
            tags: {
              starred: email.starred,
              extraLabelCount: 0,
            },
          };
        });

        const starredOnly = formatted.filter((email) => email.starred);
        setStarredEmails(starredOnly);
      } catch (error) {
        console.error("Failed to fetch starred emails", error);
      }
    };

    fetchStarredEmails();
    const interval = setInterval(() => {
      fetchStarredEmails();
    }, 1000);
    return () => clearInterval(interval)
  }, []);

  const handleToggleStar = async (id, currentStarred) => {
    try {
      await axios.put(`${BASE_URL}/api/email/mail/star/${id}`, {
        starred: !currentStarred,
      });

      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === id
            ? { ...email, tags: { ...email.tags, starred: !currentStarred } }
            : email
        )
      );
    } catch (error) {
      console.error("Failed to update starred status", error);
    }
  };

  return (
    <EmailMessages
      filteredEmails={starredEmails}
      handleToggleStar={handleToggleStar}
    />
  );
};

export default Starred;

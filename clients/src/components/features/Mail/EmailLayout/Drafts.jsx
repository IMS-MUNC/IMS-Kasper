import React, { useEffect, useState } from "react";
import EmailMessages from "../EmailMessages/EmailMessages";
import EmailModal from "../EmailModal/EmailModal";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [composeData, setComposeData] = useState(null);


  useEffect(() => {
    const saved = localStorage.getItem("emailDrafts");
    if (saved) {
      let parsedDrafts = [];
      try {
        parsedDrafts = JSON.parse(saved);
      } catch {
        console.error("Failed to parse drafts");
        return;
      }

      const now = new Date();

      const filtered = parsedDrafts.filter((email) => {
        if (!email.timestamp) return true; // keep if no timestamp
        const timestamp = new Date(email.timestamp);
        if (isNaN(timestamp)) return true; // keep if invalid date
        const ageInDays = (now - timestamp) / (1000 * 60 * 60 * 24);
        return ageInDays <= 30;
      });

      localStorage.setItem("emailDrafts", JSON.stringify(filtered));

      const formatted = filtered.map((email) => {
        const senderName = "You"; // drafts are always from the current user
        const initials = "Y";

        return {
          ...email,
          sender: {
            name: senderName,
            profileImage: null,
            initials,
            backgroundColor: "#5e35b1",
          },
          subject: email.subject || "(No Subject)",
          messagePreview: (email.body || "").slice(0, 50) + "...",
          time: email.timestamp
            ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }).format(new Date(email.timestamp))
            : "Unknown Time",
          status: { dotColor: "orange" },
          folders: { galleryCount: 0 },
          tags: { starred: false, extraLabelCount: 0 },
          type: "draft",
        };
      });


      setDrafts(formatted);
    }
  }, []);
  const handleDraftClick = (draft) => {
    setComposeData(draft)
  }

  const handleDeleteDraft = (draftToDelete) => {
    const savedDrafts = JSON.parse(localStorage.getItem("emailDrafts")) || [];
    //remove the draft with matching timestamp
    const updatedDrafts = savedDrafts.filter((d) => d.timestamp !== draftToDelete.timestamp);
    // save back to localstorage
    localStorage.setItem("emailDrafts", JSON.stringify(updatedDrafts))

    // update state so UI reflects deletion
    setDrafts((prev) => prev.filter((d) => d.timestamp !== draftToDelete.timestamp))
    // close compose modal if the deleted draft is currently open
    if (composeData?.timestamp === draftToDelete.timestamp) {
      setComposeData(null);
    }
  }
  return (<>
    <EmailMessages filteredEmails={drafts} isDraftPage={true} onDraftClick={handleDraftClick} onDelete={handleDeleteDraft} onDraftsChange={setDrafts} />;
    {composeData && (
      <EmailModal
        show={true}
        draft={composeData}
        onClose={() => setComposeData(null)}
        onDelete={() => handleDeleteDraft(composeData)}
        onDraftsChange={setDrafts}
      />
    )}
  </>
  )
};

export default Drafts;

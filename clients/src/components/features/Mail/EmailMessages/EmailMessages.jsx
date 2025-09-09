import React, { useState, useEffect, useRef } from "react";
import "../EmailMessages/EmailMessages.css";
import { IoIosSearch } from "react-icons/io";
import { RiFilterOffLine } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";
import { AiOutlineSetting } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { GrGallery } from "react-icons/gr";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import EmailDetail from "../EmailDetails/EmailDetail";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaReply } from "react-icons/fa";
import { Link } from "react-router-dom";
import BASE_URL from "../../../../pages/config/config";
import { useLocation } from "react-router-dom";
import Alk from "../../../../assets/images/alk.jpg"




const EmailMessages = ({
  filteredEmails,
  handleToggleStar: externalToggleStar,
  isDraftPage,
  onDraftClick,
  isDeletedPage,
  starredEmails

}) => {

  // to dynamic render name
  const location = useLocation();
  const mailboxName = location.pathname.split("/").pop();
  const displayMailboxName = mailboxName.charAt(0).toUpperCase() + mailboxName.slice(1)
  const [search, setSearch] = useState("");
  const [emails, setEmails] = useState([]);

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [selectedEmail, setSelectedEmail] = useState(null);

  const menuRef = useRef();
  const [users, setUsers] = useState([]);
  const [inboxEmails, setInboxEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);



  const fetchUsers = async () => {
    console.log("fetchUsers called");
    try {
      const token = localStorage.getItem("token"); // ⬅️ Get token from localStorage
      console.log('trken', token)
      const res = await axios.get(`${BASE_URL}/api/user/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('usersss', res.data)
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    console.log("EmailMessages mounted");
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   if (users.length === 0) return;
  //   const fetchEmail = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(`${BASE_URL}/api/email/mail/receive`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log("📩 EMAILS RECEIVED FROM BACKEND:", res.data.data);

  //       const formattedData = res.data.data.map((email) => {
  //         const senderName = email.from?.firstName
  //           ? `${email.from.firstName} ${email.from.lastName || ''}`.trim()
  //           : "Unknown";
  //         const profileImage = email.from?.profileImage?.url || email.from?.profileImage || null;
  //         const initials = senderName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  //         return {
  //           ...email,
  //           sender: {
  //             name: senderName,
  //             profileImage,
  //             initials,
  //             backgroundColor: "#5e35b1",
  //           },
  //           subject: email.subject,
  //           messagePreview: (email.body || "").slice(0, 140) + "...", //trim preview
  //           time:
  //             email.createdAt && !isNaN(new Date(email.createdAt))
  //               ? new Intl.DateTimeFormat("en-GB", {
  //                 day: "2-digit",
  //                 month: "short",
  //                 year: "numeric",
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //                 hour12: true,
  //               }).format(new Date(email.createdAt))
  //               : "Invalid Date",
  //           status: { dotColor: "red" },
  //           folders: {
  //             galleryCount: email.attachments?.length || 0,
  //           },
  //           tags: {
  //             starred: email.starred,
  //             extraLabelCount: 0,
  //           },
  //         };
  //       });

  //       console.log("✅ FINAL FORMATTED EMAILS FOR STATE:", formattedData);
  //       setEmails(formattedData);
  //     } catch (error) {
  //       console.error("❌ Failed to fetch emails", error);
  //     }
  //   };
  //   fetchEmail();
  // }, [users]);

  const formatEmails = (emailsArray, mailboxType) => {
    return emailsArray.map(email => {
      const isSent = mailboxType === "sent";
      const displayUser = isSent
        ? email.to?.[0]   // show recipient in Sent
        : email.from;     // show sender in Inbox
      const senderName = displayUser?.firstName
        ? `${displayUser.firstName} ${displayUser.lastName || ""}`.trim()
        : "Unknown";

      const profileImage = displayUser?.profileImage?.url || displayUser?.profileImage || null;
      const initials = senderName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

      return {
        ...email,
        type: mailboxType,
        sender: {
          name: senderName,
          profileImage,
          initials,
          backgroundColor: "#5e35b1",
        },
        subject: email.subject,
        messagePreview: (email.body || "").slice(0, 140) + "...",
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
        tags: { starred: email.starred || false },
        folders: {
          galleryCount: email.attachments?.length || 0,
        },
      };
    });
  };



  useEffect(() => {
    if (users.length === 0) return;

    const token = localStorage.getItem("token");

    // Inbox
    axios.get(`${BASE_URL}/api/email/mail/receive`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setInboxEmails(formatEmails(res.data.data, "inbox")))
      .catch(err => console.error(err));

    // Sent
    axios.get(`${BASE_URL}/api/email/mail/getsentemail`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSentEmails(formatEmails(res.data.data, "sent")))  // ✅ use formatEmails here too
      .catch(err => console.error(err));

  }, [users]);

  // const emailsToShow = displayMailboxName.toLowerCase() === "sent" ? sentEmails : inboxEmails;
  const emailsToShow = isDraftPage
    ? filteredEmails || []
    : isDeletedPage
      ? filteredEmails || []
       : displayMailboxName.toLowerCase() === "starred"
        ? filteredEmails || []
        : displayMailboxName.toLowerCase() === "sent"
          ? sentEmails : displayMailboxName.toLowerCase() === "allemails" ? [...inboxEmails, ...sentEmails].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : inboxEmails;


  console.log("emailsToShow", emailsToShow);


  const setEmailsState = (updateFn) => {
    if (displayMailboxName.toLowerCase() === "sent") {
      setSentEmails(updateFn);
    }
    else if (displayMailboxName.toLowerCase() === "allemails") {
      setInboxEmails(updateFn);
      setSentEmails(updateFn);
    }
    else {
      setInboxEmails(updateFn);
    }
  };

  const handleDeleteSelected = async () => {
    if (isDraftPage) {
      let drafts = JSON.parse(localStorage.getItem("emailDrafts")) || [];
      drafts = drafts.filter((d) => !selectedEmails.includes(d._id));
      localStorage.setItem("emailDrafts", JSON.stringify(drafts));
      // Update parent state so UI re-renders automatically
      if (onDraftsChange) onDraftsChange(drafts);
      setEmailsState(prev => prev.filter(email => !selectedEmails.includes(email._id)));
      setSelectedEmails([]);
    } else {
      try {
        const token = localStorage.getItem("token");
        await axios.post(`${BASE_URL}/api/email/mail/delete`,
          { ids: selectedEmails },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setEmailsState((prev) =>
          prev.filter((email) => !selectedEmails.includes(email._id))
        );
        setSelectedEmails([]);
      } catch (error) {
        console.error("Failed to delete emails", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (isDraftPage) {
      let drafts = JSON.parse(localStorage.getItem("emailDrafts")) || [];
      drafts = drafts.filter(d => d._id !== id);
      localStorage.setItem("emailDrafts", JSON.stringify(drafts));
      // Update parent state so UI re-renders automatically
      if (onDraftsChange) onDraftsChange(drafts);
      setEmailsState(prev => prev.filter(email => email._id !== id));
      setMenuOpenId(null);
    } else {
      try {
        const token = localStorage.getItem("token");
        await axios.post(`${BASE_URL}/api/email/mail/delete`,
          { ids: [id] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setEmailsState((prev) => prev.filter((email) => email._id !== id));
        setMenuOpenId(null);
      } catch (error) {
        console.error("Failed to delete email", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBackToInbox = () => {
    setSelectedEmail(null);
  };

  const handleToggleStar = async (id, currentStarred) => {
    try {
      const token = localStorage.getItem("token");
      const updated = await axios.put(
        `${BASE_URL}/api/email/mail/star/${id}`,
        { starred: !currentStarred },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setEmailsState((prevEmails) =>
        prevEmails.map((email) =>
          email._id === id
            ? { ...email, tags: { ...email.tags, starred: !currentStarred } }
            : email
        )
      );
      //  update selectedEmail too if its open in detail view
      if (selectedEmail?._id === id) {
        setSelectedEmail((prev) => ({
          ...prev,
          tags: {
            ...prev.tags,
            starred: !currentStarred,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to update starred status", error);
    }
  };
  const toggleStar = externalToggleStar || handleToggleStar;

  // for delete permanently via delete page code
  const handlePermanentDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/email/mail/permanent-delete`,
        { ids: selectedEmails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setEmailsState((prev) =>
        prev.filter((email) => !selectedEmails.includes(email._id))
      );
      setSelectedEmails([]);
    } catch (error) {
      console.error("Failed to permanently delete emails", error);
    }
  };

  // for handlereply and forward
  const [modalData, setModalData] = useState({
    show: false,
    to: "",
    subject: "",
    body: "",
  });

  // function for handle reply and forward
  const handleReply = () => {
    setModalData({
      show: true,
      to: selectedEmail?.sender?.name || "",
      // subject: `Re: ${email.subject}`,
      body: `\n\n------------------ Original Message ------------------\n${selectedEmail?.body || ""}`,
    });
  };

  // const [activeTabs, setActiveTabs] = useState('All')
  // const tabs = ['All', 'Unread', 'Archived']

  return (
    <div className="mainemailmessage">
      <div className="filter">
        <span className="searchinputdiv">
          <span style={{ marginTop: "5px" }}>
            <IoIosSearch style={{ marginTop: '-5px' }} />
          </span>
          <input
            className="searchtext"
            type="text"
            placeholder="Search Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
        {/* <span className="settingrefreshdiv">
            <RiFilterOffLine />
            <AiOutlineSetting />
            <BiRefresh onClick={() => window.location.reload()} />
          </span> */}
      </div>
      <div className="header22">
        {/* inbox */}
        <div className="inbox">
          <span style={{ color: "black", fontSize: "18px", fontWeight: 600 }}>
            {/* {displayMailboxName} */}
          </span>
          <span className="twothreemail">
            {/* {(filteredEmails || emails).length}Emails{" "} */}
            {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', width: '350px', height: '30px', borderRadius: '4px', padding: '5px 0px 5px 0px', marginTop: '20px', backgroundColor: '#F7F7F7', }}>
              {tabs.map((tab) => (
                <span key={tab} onClick={() => setActiveTabs(tab)} style={{ fontSize: '14px', fontWeight: 400, width: '200px', textAlign: 'center', cursor: 'pointer', borderRadius: '4px', backgroundColor: activeTabs === tab ? '#BBE1FF' : 'transparent', transition: 'background-color 0.3s', }}>{tab}</span>
              ))}
            </div> */}
            <span
              style={{
                fontSize: "22px",
                borderRadius: "50%",
                fontWeight: "bold",
              }}
            >
            </span>
            <span>
              {selectedEmails.length > 0 && (
                <div className="selectdt" style={{ marginTop: '20px' }}>
                  <span>{selectedEmails.length} selected</span>
                  <button
                    className="dt-icon"
                    onClick={handleDeleteSelected}
                    style={{ marginLeft: "20px" }}
                  >
                    <RiDeleteBinLine />
                  </button>
                  {/* for permanently delete mail via delete page */}
                  {isDeletedPage && selectedEmails.length > 0 && (
                    <button
                      onClick={handlePermanentDelete}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#d32f2f",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      Delete Forever
                    </button>
                  )}
                  {/*end of permanently delete mail via delete page */}
                </div>
              )}
            </span>{" "}
          </span>
        </div>
        {/* filter */}
      </div>

      {/* email message div */}
      <div className="justinmaindivmap">
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onBack={handleBackToInbox}
            handleToggleStar={handleToggleStar}
          />
        ) : (

          emailsToShow
            .filter(
              (email) =>
                email.sender.name.toLowerCase().includes(search.toLowerCase()) ||
                email.subject.toLowerCase().includes(search.toLowerCase()) ||
                email.messagePreview.toLowerCase().includes(search.toLowerCase())
            )
            .map((email) => (
              <div
                className={`justinmaindiv ${selectedEmails.includes(email._id) ? "selected-email" : ""
                  }`}
                key={email._id}
              >
                <div
                  className="justinleftrightmaindiv"
                  style={{ cursor: "pointer" }}
                >
                  {/* left */}
                  <div className="justinmaindivleftdiv">
                    {/* <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    > */}
                    <label className="custom-checkbox">
                      <input
                        className="checkmarkinput"
                        type="checkbox"
                        checked={selectedEmails.includes(email._id)}
                        onChange={() => {
                          if (selectedEmails.includes(email._id)) {
                            setSelectedEmails(
                              selectedEmails.filter((id) => id !== email._id)
                            );
                          } else {
                            setSelectedEmails([...selectedEmails, email._id]);
                          }
                        }}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "5px",
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span
                      onClick={() =>
                        toggleStar(email._id, email.tags.starred)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <AiFillStar
                        style={{
                          fontSize: "18px",
                          color: email.tags.starred ? "#fba64b" : "#ccc",
                        }}
                      />
                    </span>
                    <span>
                      {email.sender.profileImage ? (
                        <img src={email.sender.profileImage} alt="alk" style={{ width: '25px', height: '25px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          backgroundColor: '#ccc',
                          width: '25px',
                          height: '25px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: '#fff'
                        }}>
                          {email.sender.name?.[0]?.toUpperCase()}
                        </div>
                      )
                      }
                    </span>
                    {/* <span
                      style={{
                        backgroundColor: email.sender.backgroundColor,
                        color: "white",
                        borderRadius: "50%",
                        width: "40px", height: "40px", display: 'flex', alignItems: 'center', justifyContent: 'center', objectFit: 'contain'
                      }}
                    >
                      {email.sender.initials}
                    </span> */}
                    {/* </div> */}
                    <div
                      style={{ display: "flex", flexDirection: 'column' }}
                      onClick={() => { if (isDraftPage && onDraftClick) { onDraftClick(email); } else { setSelectedEmail(email) } }}
                    >
                      <span
                        style={{
                          color: "#262626",
                          fontSize: "14px",
                          fontWeight: 400,
                          marginBottom: "5px",
                          lineHeight: '14px',
                          marginRight: "22px",
                        }}
                      >
                        <span>{email.sender.name}</span>

                      </span>
                      <span
                        style={{
                          color: "#262626",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        {email.subject.slice(0, 30)}
                      </span>
                      <span style={{ color: "#888888", fontSize: "12px", fontWeight: 400, }}>
                        {email.messagePreview}
                      </span>
                      {/* image and attachment */}
                      {/* image and attachment combined display */}
                      {(email.attachments?.length > 0 || email.image?.length > 0) && (
                        <div
                          className="attachment-section"

                        >
                          <div
                            style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                          >
                            {[
                              ...(email.attachments || []),
                              ...(email.image || []),
                            ].slice(0, 2).map((fileUrl, index) => {
                              const fileName = fileUrl.split("/").pop();
                              const extension = fileUrl
                                .split(".")
                                .pop()
                                .toLowerCase();
                              const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif)$/i);
                              const isPdf = extension === "pdf";

                              return (
                                <a
                                  key={index}
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    border: "1px solid #ccc",
                                    padding: "5px 5px",
                                    borderRadius: "20px",
                                    textDecoration: "none",
                                    backgroundColor: "#f0f0f0",
                                    color: "#333",
                                  }}
                                >
                                  <img
                                    src={
                                      isImage
                                        ? fileUrl
                                        : isPdf
                                          ? "/pdf.png"
                                          : "/file-icon.png"
                                    }
                                    alt="file"
                                    width="20"
                                    height="20"
                                    style={{
                                      objectFit: "cover",
                                      borderRadius: "5px",
                                    }}
                                  />

                                  <span
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "150px",
                                      display: "inline-block",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {fileName}
                                  </span>
                                </a>
                              );
                            })}
                            {[
                              ...(email.attachments || []),
                              ...(email.image || [])
                            ].length > 2 && (
                                <span
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: "20px",
                                    backgroundColor: "#ddd",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "#333",
                                  }}
                                >
                                  +{[...(email.attachments || []), ...(email.image || [])].length - 2} more
                                </span>
                              )}
                          </div>
                        </div>
                      )}

                      {/* folder gallery */}
                      <div className="foldergallerydiv">
                        {/* <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            color: "#676969",
                            fontWeight: 600,
                          }}
                        >
                          <span>
                            <AiOutlineFolderOpen />
                          </span>
                          <span>{email.attachments?.length}</span>
                          <span>
                            <GrGallery />
                          </span>
                          <span>{email.image?.length}</span>
                        </div> */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {/* <span
                    style={{
                      padding: "4px 7px",
                      backgroundColor: "#010c27",
                      borderRadius: "45%",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    +{email.attachments?.length}
                  </span> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* right */}
                  <div className="justinmaindivrightdiv">
                    <span onClick={() => setMenuOpenId(email._id)}>
                      {/* <div style={{ position: "relative" }}>
                          <span
                            onClick={() =>
                              setMenuOpenId(
                                menuOpenId === email._id ? null : email._id
                              )
                            }
                            className="three-dot-icon"
                          >
                            <HiOutlineDotsHorizontal />
                          </span>

                          {menuOpenId === email._id && (
                            <div className="custom-popup-menu" ref={menuRef}>
                              <div onClick={handleReply}>
                                <FaReply /> Reply
                              </div>
                              <div onClick={() => handleDelete(email._id)}>
                                {" "}
                                <RiDeleteBinLine /> Delete
                              </div>
                            </div>
                          )}
                        </div> */}
                    </span>
                    <span
                      style={{
                        fontSize: "22px",
                        borderRadius: "50%",
                        fontWeight: "bold",
                      }}
                    ></span>
                    <span
                      className="time-label"
                      style={{ marginBottom: "5px", fontSize: "16px" }}
                    >
                      {email.time}
                    </span>
                    <span
                      className="delete-icon"
                      style={{ cursor: "pointer", fontSize: "14px" }}
                      onClick={() => handleDelete(email._id)}
                    >
                      <RiDeleteBinLine />
                    </span>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default EmailMessages;

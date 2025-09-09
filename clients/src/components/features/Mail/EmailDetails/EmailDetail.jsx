import React, { useState, useRef, useEffect } from "react";
import "../EmailDetails/EmailDetail.css";
import { MdExpandMore } from "react-icons/md";
import { FaArrowLeft, FaReply } from "react-icons/fa";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { LuForward, LuReply } from "react-icons/lu";
import { AiFillStar } from "react-icons/ai";
import { GrEmoji } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import EmailModal from "../EmailModal/EmailModal.jsx";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import axios from "axios";
import { Link } from "react-router-dom";

import { BsEyeFill } from "react-icons/bs";
import { MdFileDownload } from "react-icons/md";
import { BiSolidFilePdf } from "react-icons/bi";
import BASE_URL from "../../../../pages/config/config.js";

const EmailDetail = ({ email, onBack, handleToggleStar }) => {
  const [showDetails, setShowDetails] = useState(false);
  // const [emailshow, setEmailShow] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [emails, setEmails] = useState([]);
  const [body, setBody] = useState(""); //store emoji input
  const [emojiList, setEmojiList] = useState([]); //emojis to show below email body
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // for handlereply and forward
  const [modalData, setModalData] = useState({
    show: false,
    to: "",
    subject: "",
    body: "",
  });

  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteSelected = async () => {
    try {
      await axios.post(`${BASE_URL}/api/email/mail/delete`, {
        ids: selectedEmails,
      });
      setEmails((prev) =>
        prev.filter((email) => !selectedEmails.includes(email._id))
      );
      setSelectedEmails([]);
    } catch (error) {
      console.error("Failed to delete emails", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/email/mail/delete`, {
        ids: [id],
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmails((prev) => prev.filter((email) => email._id !== id));
      setMenuOpenId(null);
    } catch (error) {
      console.error("Failed to delete email", error);
    }
  };

  // function for handle reply and forward
  const handleReply = () => {
    setModalData({
      show: true,
      to: email.from,
      // subject: `Re: ${email.subject}`,
      body: `\n\n------------------ Original Message ------------------\n${email.body}`,
    });
  };

  const handleForward = () => {
    setModalData({
      show: true,
      to: "",
      subject: `Fwd: ${email.subject}`,
      body: `\n\n------------------ Forwarded Message ------------------\nFrom: ${email.from
        }\nDate: ${new Date(
          email.createdAt
        ).toLocaleString()}\nTo: ${email.to.join(", ")}\nSubject: ${email.subject
        }\n\n${email.body}`,
    });
  };

  const handleEmojiClick = (emojiData) => {
    setEmojiList((prev) => [...prev, emojiData.emoji]);
    // setBody("")
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && body.trim() !== "") {
        setEmojiList((prev) => [...prev, body]);
        // setBody("")
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [body]);

  if (!email) return null;

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image.");
    }
  };
  // safely get sender name/email
  const getSenderDisplay = (sender) => {
    if (!sender) return "Unknown";
    if (typeof sender === "string") return sender;
    if (typeof sender === "object") {
      return sender.firstName || sender.lastName
        ? `${sender.firstName || ""} ${sender.lastName || ""}`.trim()
        : sender.email || "Unknown";
    }
    return "Unknown";
  };

  // safely get recipients list
  const getRecipientsDisplay = (recipients) => {
    if (!recipients) return "";
    if (typeof recipients === "string") return recipients;
    if (Array.isArray(recipients)) {
      return recipients
    //     .map((r) => (typeof r === "object" ? r.email : r))
    //     .join(", ");
    // }
     .map((r) => {
        if (!r) return ""; // skip nulls
        if (typeof r === "string") return r;
       if (typeof r === "object") {
          // use firstName + lastName if available, else email
          return r.firstName || r.lastName
            ? `${r.firstName || ""} ${r.lastName || ""}`.trim()
            : r.email || "";
        }
        return "";
      })
      .filter(Boolean) // remove empty strings
      .join(", ");
  }
    if (typeof recipients === "object") return recipients.email || "";
    return "";
  };


  return (
    <div className="email-detail">
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          className=""
          style={{
            color: "#676767",
            fontSize: "14px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 400,
          }}
        >
          <button
            style={{
              border: "none",
              background: "none",
              fontWeight: 400,
              cursor: "pointer",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              lineHeight: "14px",
              color: "#676767",
            }}
            onClick={onBack}
          >
            <FaArrowLeft />
          </button>
          Back
        </div>
        {/* <button
          style={{
            border: "none",
            background: "none",
            fontWeight: 800,
            cursor: "pointer",
          }}
          onClick={() => handleDelete(email._id)}
        >
          <RiDeleteBin6Line />
        </button> */}
        {/* <span
          style={{ display: "flex", gap: "5px", cursor: "pointer" }}
          onClick={() => setEmailShow(true)}
        >
          <button
            onClick={handleForward}
            style={{
              border: "none",
              background: "none",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <LuForward />
          </button>
          <span>Forward</span>
        </span> */}
      </div>
      <div className="subject-header">
        <div className="subject-left">
          {/* <h2 className="emailsub">{email.subject}</h2> */}
          <div
            style={{
              display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>
              {email.sender.profileImage ? (
                <img
                  src={email.sender.profileImage}
                  alt="alk"
                  style={{
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: "#ccc",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                >
                  {email.sender.name?.[0]?.toUpperCase()}
                </div>
              )}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
              <span style={{ display: "block", margin: 0, padding: 0, marginTop: '-20px', marginBottom: '-10px' }}>
                <span style={{ margin: 0, paddingRight: '4px', color: '#262626', fontSize: '14px', fontWeight: 500, lineHeight: '14px' }}>{email.type === "sent" ? getRecipientsDisplay(email.to) : email.sender?.name || getSenderDisplay(email.from) || "Unknown"}</span>
                <span style={{ margin: 0, paddingRight: '4px', fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767' }}>&lt;{email.type === "sent" ? getRecipientsDisplay(email.to) : getRecipientsDisplay(email.from)}&gt;</span>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="toggle-meta"
                  style={{ paddingTop: '4px' }}
                >
                  <MdExpandMore />
                </button>
              </span>
              {/* <span style={{ margin: '2px 0px 2px 0px', fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767' }}>To: {email.type === "sent" ? getRecipientsDisplay(email.to) : getRecipientsDisplay(email.from)}</span> */}
              <span style={{ margin: '2px 0px 2px 0px', fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767' }}>Subject: <span style={{ color: '#262626' }}>{email.subject}</span></span>
            </div>
          </div>
        </div>
        <div className="subject-right">
          <span className="email-time" style={{ color: "#262626" }}>
            {email.createdAt && !isNaN(new Date(email.createdAt))
              ? new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }).format(new Date(email.createdAt))
              : "Invalid Date"}
          </span>
          <span
            className="icon"
            onClick={() => handleToggleStar(email._id, email.tags.starred)}
          >
            <AiFillStar
              style={{
                fontSize: "20px",
                color: email.tags.starred ? "#fba64b" : "ccc",
              }}
            />
          </span>
          <span
            className="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <GrEmoji />
          </span>
          <span
            className="icon"
            style={{
              border: "none",
              background: "none",
              fontWeight: 800,
              cursor: "pointer",
              color: "#919191ff",
            }}
            onClick={() => handleDelete(email._id)}
          >
            <RiDeleteBin6Line />
          </span>
          {/* <span className="icon" onClick={handleReply}>
            <LuReply />
          </span> */}
          <EmailModal
            show={modalData.show}
            onClose={() => setModalData({ ...modalData, show: false })}
            to={modalData.to}
            subject={modalData.subject}
            body={modalData.body}
          />
          <span onClick={() => setMenuOpenId(email._id)}>
            <div style={{ position: "relative" }}>
              <span
                onClick={() =>
                  setMenuOpenId(menuOpenId === email._id ? null : email._id)
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
            </div>
          </span>
        </div>
      </div>
      {showDetails && (
        <div className="email-meta">
          {console.log("📌 Email detailsws:", email)}
          <p
            style={{
              fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767'
            }}
          >
            From:{" "}
            <span style={{
              fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626'
            }}>
              {email.sender?.firstName && email.sender?.lastName
                ? `${email.sender.firstName} ${email.sender.lastName}`
                : email.sender?.email || getSenderDisplay(email.from) || "Unknown"}
            </span>
          </p>
          <p
            style={{
              fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767'
            }}
          >
            To:{" "}
            <span style={{
              fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626'
            }}>
              {getRecipientsDisplay(email.to)}
            </span>
          </p>
          <p
            style={{
              fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767'
            }}
          >
            Cc:{" "}
            <span style={{
              fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626'
            }}>
              {getRecipientsDisplay(email.cc)}
            </span>
          </p>
          <p
            style={{
              fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767'
            }}
          >
            Bcc:{" "}
            <span style={{
              fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626'
            }}>
              {getRecipientsDisplay(email.bcc)}
            </span>
          </p>
          <p
            style={{
              fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767'
            }}
          >
            Date:{" "}
            <span style={{
              fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626'
            }}>
              {email.createdAt && !isNaN(new Date(email.createdAt))
                ? new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(email.createdAt))
                : "Invalid Date"}
            </span>
          </p>
          <p
            style={{
              fontSize: '12px', fontWeight: 400, lineHeight: '14px', color: '#676767'
            }}
          >
            Subject:{" "}
            <span style={{
              fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626'
            }}>
              {email.subject}
            </span>
          </p>
        </div>
      )}
      <hr style={{ color: '#b8b8b8ff', height: '1px', fontWeight: 400 }} />
      <div
        style={{ border: "none", fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626' }}
        className="email-body"
        dangerouslySetInnerHTML={{
          __html: email.body.replace(/\n/g, "<br/>"),
        }}
      />

      {/* image and attachment */}
      <div style={{ marginTop: "20px" }}>
        <h4
          style={{
            fontSize: '14px', fontWeight: 400, lineHeight: '14px', color: '#262626'
          }}
        >Attachments</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {/* Images */}
          {email.image?.map((imgUrl, index) => {
            // const imgUrl = `http://localhost:5000/${imgPath.replace(
            //   /\\/g,
            //   "/"
            // )}`;
            return (
              <div className="attachment-box" key={index}>
                <img
                  src={imgUrl}
                  alt={`attachment-${index}`}
                  className="attachment-img"
                />
                <div className="hover-download-btn">
                  <a
                    className="acker"
                    onClick={() =>
                      handleDownload(imgUrl, `attachment-${index}.jpeg`)
                    }
                    href="#"
                  >
                    <MdFileDownload />
                  </a>
                  <a
                    className="acker"
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BsEyeFill />
                  </a>
                </div>
              </div>
            );
          })}

          {/* PDFs and Others */}
          {email.attachments?.map((fileUrl, index) => {
            const fileName = fileUrl.split("/").pop();
            const extension = fileUrl.split(".").pop().toLowerCase();
            const isImage = /\.(jpeg|jpg|png|gif)$/i.test(fileUrl);
            if (isImage) return null;

            const isPdf = extension === "pdf";
            // const iconPreview = isPdf
            //   ? fileUrl.replace("/upload/", "/upload/pg_1,w_120,h_120,c_thumb/")
            //   : "/file-icon.png";
            const iconPreview = isPdf ? "/pdf.png" : "/file-icon.png";

            return (
              <div className="attachment-box" key={index}>
                <img
                  src={iconPreview}
                  // alt={fileName}
                  className="attachment-img"
                />
                <div className="hover-download-btn">
                  <a
                    className="acker"
                    onClick={() => handleDownload(fileUrl, fileName)}
                    href="#"
                  >
                    <MdFileDownload />
                  </a>
                  <a
                    className="acker"
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BsEyeFill />
                  </a>
                </div>
                <a
                  className="acker"
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  style={{
                    display: "block",
                    marginTop: "10px",
                    color: "#333",
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                  title={fileName}
                >
                  {fileName}
                </a>
              </div>
            );
          })}
        </div>
        {emojiList.length > 0 && (
          <div
            className="emoji-preview"
            style={{ marginTop: "10px", fontSize: "22px" }}
          >
            {emojiList.map((emoji, index) => (
              <span key={index} style={{ marginRight: "10px" }}>
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginTop: "20px",
          color: "gray",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            border: "1px solid black",
            borderRadius: "20px",
            padding: "5px 20px",
          }}
          onClick={handleReply}
        >
          <LuReply style={{ marginRight: "10px" }} />
          Reply
        </span>
        <span
          style={{
            border: "1px solid black",
            borderRadius: "20px",
            padding: "5px 20px",
          }}
          onClick={handleForward}
        >
          <LuForward style={{ marginRight: "10px" }} />
          Forward
        </span>
        <span
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid black",
            borderRadius: "50%",
            padding: "10px 10px",
            width: "30px",
            height: "30px",
            fontWeight: 500,
          }}
        >
          <GrEmoji style={{ color: "#3b3b3bff" }} />
        </span>
        {console.log("Email body being sent:", email.body)}
      </div>
      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default EmailDetail;

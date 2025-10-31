import React, { useState, useRef, useEffect } from "react";
import "../EmailModal/EmailModal.css";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { RiAttachment2 } from "react-icons/ri";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineMinimize, MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { CiFaceSmile } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineEditCalendar } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { GoScreenFull } from "react-icons/go";
import { toast } from "react-toastify";
import BASE_URL from "../../../../pages/config/config";
import Ma from "../../../../assets/images/sewc.png";
import { FiXSquare } from "react-icons/fi";


const EmailModal = ({
  show,
  onClose,
  draft = {},
  to: initialTo = "",
  subject: initialSubject = "",
  body: initialBody = "",
  onSent,
  onDelete,
}) => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [images, setImages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailHistory, setEmailHistory] = useState([]);
  const emojiRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("emailHistory")) || [];
    setEmailHistory(stored);
  }, [show]); // reload every time modal opens

  useEffect(() => {
    if (!show) return; // do nothing if modal closed

    if (draft && Object.keys(draft).length > 0) {
      setTo(draft.to || "");
      setSubject(draft.subject || "");
      setBody(draft.body || "");
    } else {
      setTo(initialTo);
      setSubject(initialSubject);
      setBody(initialBody);
    }
  }, [show]); // <-- only depend on `show`

  const fileInputRef = useRef();
  const imageInputRef = useRef();

  // for attachment
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const nonImageFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );
    setAttachments((prev) => [...attachments, ...nonImageFiles]);
  };
  // for image
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setImages((prev) => [...prev, ...imageFiles]);
  };

  // for emoji
  const handleEmojiClick = (emojiData) => {
    setBody((prev) => prev + emojiData.emoji);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showEmojiPicker])

  if (!show) return null;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateEmails = (emails) => {
    if (!emails) return true; // allow empty cc/bcc
    return emails
      .split(",")
      .map((e) => e.trim())
      .every(isValidEmail);
  };

  const saveEmailsToHistory = (emails) => {
    if (!emails) return;
    const history = JSON.parse(localStorage.getItem("emailHistory")) || [];
    const newEmails = emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const merged = Array.from(new Set([...history, ...newEmails])); // unique
    localStorage.setItem("emailHistory", JSON.stringify(merged));
  };

  const handleSend = async () => {
    if (!validateEmails(to)) {
      toast.error("Invalid email address in To field");
      return;
    }
    if (!validateEmails(cc)) {
      toast.error("Invalid email address in Cc field");
      return;
    }
    if (!validateEmails(bcc)) {
      toast.error("Invalid email address in Bcc field");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // get token
      const formData = new FormData();
      to.split(",")
        .map((t) => t.trim())
        .forEach((email) => formData.append("to", email));
      cc.split(",")
        .map((t) => t.trim())
        .forEach((email) => formData.append("cc", email));
      bcc
        .split(",")
        .map((t) => t.trim())
        .forEach((email) => formData.append("bcc", email));
      // formData.append("from", ""); // use default or actual
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("name", "You");
      formData.append("starred", false);
      formData.append("bin", false);
      formData.append("type", "sent");

      //append files
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(`${BASE_URL}/api/email/mail/send`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ include token here
        },
      });
      saveEmailsToHistory(to);
      saveEmailsToHistory(cc);
      saveEmailsToHistory(bcc);
      toast.success("Email sent successfully!", {
        position: "top-center",
      });
      if (onSent) {
        onSent();
      }
      onClose();
    } catch (error) {
      console.error("Error sending email", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleDelete = () => {
    // Clear all input fields
    setTo("");
    setSubject("");
    setBody("");
    setCc("");
    setBcc("");
    setAttachments([]);
    setShowCc(false);
    setShowBcc(false);
    setShowEmojiPicker(false);
    setIsExpanded(false); // Optional: shrink modal back

    // Close the modal
    onClose();
  };

  const handleInsertLink = () => {
    if (!linkText || !linkUrl) {
      alert("Please enter both text and URL");
      return;
    }

    // Append formatted link to body
    const formattedLink = `${linkText} (${linkUrl})`;
    setBody((prev) => prev + formattedLink);

    // Reset
    setShowLinkInput(false);
    setLinkText("");
    setLinkUrl("");
  };

  // handledraftdelete
  const handleDraftDelete = () => {
    const isContentFilled =
      to || subject || body || attachments.length || images.length;

    if (isContentFilled) {
      const newDraft = {
        to,
        subject,
        body,
        cc,
        bcc,
        attachments: [], // Don't save File objects, just names or empty
        images: [],
        timestamp: draft?.timestamp || new Date().toISOString(),
        type: "draft",
      };

      let existingDrafts =
        JSON.parse(localStorage.getItem("emailDrafts")) || [];
      if (draft?.timestamp) {
        existingDrafts = existingDrafts.map((d) =>
          d.timestamp === draft.timestamp ? newDraft : d
        );
      } else {
        existingDrafts.push(newDraft);
      }
      localStorage.setItem("emailDrafts", JSON.stringify(existingDrafts));
    }
    // Reset all fields
    setTo("");
    setSubject("");
    setBody("");
    setCc("");
    setBcc("");
    setAttachments([]);
    setImages([]);
    setShowCc(false);
    setShowBcc(false);
    setShowEmojiPicker(false);
    setIsExpanded(false);
    onClose();
  };


  return (
    <div className="mailmdl-modal-overlay">
      <div
        className={`mailmdl-email-modal ${isExpanded ? "expanded-modal" : ""}`}
      >
        <div className="mailmdl-modal-header">
          <span className="mailmdl-nwemsfg">New Message</span>
          <div className="mailmdl-header-actions">
            <button
              className="mailmdlbutton"
              style={{
                color: "black",
                border: "none",
                backgroundColor: "transparent",
              }}
              onClick={onClose}
            >
              <MdOutlineMinimize style={{ fontWeight: 300 }} />
            </button>
            <button
              className="mailmdlbutton"
              style={{
                color: "black",
                border: "none",
                backgroundColor: "transparent",
              }}
              onClick={toggleExpanded}
            >
              <GoScreenFull style={{ fontWeight: 300 }} />
            </button>
            <button
              className="mailmdlbutton"
              style={{
                color: "black",
                border: "none",
                backgroundColor: "transparent",
              }}
              onClick={handleDraftDelete}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mailmdl-modal-body" style={{ margin: "10px" }}>
          <div>
            <div
              className="mailmdl-to-field"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <label
                style={{
                  color: "#676767",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "10px",
                  letterSpacing: "0",
                  marginTop: "10px",
                }}
              >
                To:
              </label>
              {/* <hr style={{width:'100%', height:'1px'}} /> */}
              <input
                className="mailmdl"
                type="text"
                list="email-suggestions"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={{
                  border: "none",
                  borderBottom: "1px solid #D9D9D9",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  marginLeft: "-10px",
                  padding: "4px 0",
                  width: "100%",
                }}
              />
              {!showCc && (
                <span
                  style={{
                    color: "#676767",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "10px",
                    letterSpacing: "0",
                    cursor: "pointer",
                  }}
                  className="cc-bcc"
                  onClick={() => {
                    setShowCc(true);
                  }}
                >
                  Cc
                </span>
              )}
              {!showBcc && (
                <span
                  style={{
                    color: "#676767",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "10px",
                    letterSpacing: "0",
                    cursor: "pointer",
                  }}
                  className=""
                  onClick={() => {
                    setShowBcc(true);
                  }}
                >
                  Bcc
                </span>
              )}
            </div>
            {/* for cc */}
            {showCc && (
              <div className="mailmdl-to-field">
                <label
                  style={{
                    color: "#676767",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "10px",
                    letterSpacing: "0",
                  }}
                  htmlFor=""
                >
                  Cc:
                </label>
                <input
                  className="mailmdl"
                  type="text"
                  list="email-suggestions"
                  // placeholder="Add Cc"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #D9D9D9",
                    outline: "none",
                    background: "transparent",
                    fontSize: "16px",
                    padding: "4px 0",
                    width: "100%",
                  }}
                />
              </div>
            )}
            {/* for Bcc */}
            {showBcc && (
              <div className="mailmdl-to-field">
                <label
                  style={{
                    color: "#676767",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "10px",
                    letterSpacing: "0",
                  }}
                  htmlFor=""
                >
                  Bcc:
                </label>
                <input
                  className="mailmdl"
                  type="text"
                  list="email-suggestions"
                  // placeholder="Add Bcc"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #D9D9D9",
                    outline: "none",
                    background: "transparent",
                    fontSize: "16px",
                    padding: "4px 0",
                    width: "100%",
                  }}
                />
              </div>
            )}
            <datalist id="email-suggestions">
              {emailHistory.map((email, i) => (
                <option key={i} value={email} />
              ))}
            </datalist>
          </div>
          <div>
            <div className="mailmdl-to-field">
              <label
                style={{
                  color: "#676767",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "10px",
                  letterSpacing: "0",
                }}
                htmlFor=""
              >
                Subject:{" "}
              </label>
              <input
                type="text"
                className="subject mailmdl"
                // placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  border: "none",
                  borderBottom: "1px solid #D9D9D9",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  padding: "4px 0",
                  width: "100%",
                }}
              />
            </div>
            <textarea
              className="mailmdl-email-body" style={{ margin: '0px' }}
              placeholder="Compose Email"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {/* image preview */}
            {images.length > 0 && (
              <div className="mailmdl-image-preview">
                <h4>Images</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: "relative", display: "inline-block" }}>
                      <img
                        key={i}
                        src={URL.createObjectURL(img)}
                        alt={`preview-${i}`}
                        width="100"
                        style={{ borderRadius: "5px" }}
                      />
                      <FiXSquare
                        className="x-square-add image-close remove-product fs-12 text-white bg-danger rounded-1"
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setImages((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Attachment preview */}
            {attachments.length > 0 && (
              <div className="mailmdl-attachment-preview">
                <h4>Attachments:</h4>
                {attachments.map((file, i) => (
                  <div key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "5px",
                    }}
                  >
                    <span>{file.name}</span>
                    <FiXSquare
                      className="x-square-add image-close remove-product fs-12 text-white bg-danger rounded-1"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mailmdl-modal-footer">
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="mailmdl-send-btn"
              onClick={handleSend}
              disabled={loading}
            >
              <img
                src={Ma}
                alt="mma"
                style={{ color: "white", marginRight: "10px" }}
              />
              {loading ? "Sending" : "Send "}
            </button>
            <div
              className="mailmdl-footer-icons"
              style={{ display: "flex", gap: "10px", color: "#676767" }}
            >
              <button
                className="mailmdlbutton"
                mailmdlbutton
                onClick={handleAttachmentClick}
                title="Upload files, folders,Excel file or pdf"
              >
                <RiAttachment2 />
              </button>
              <button
                className="mailmdlbutton"
                mailmdlbutton
                onClick={() => imageInputRef.current.click()}
                title="Upload JPEG, Png Image upto 1mb"
                
              >
                <HiOutlinePhotograph />
              </button>
              <button
                className="mailmdlbutton"
                onClick={() => setShowLinkInput((prev) => !prev)}
              >
                {/* <AiOutlineLink /> */}
              </button>
              <button
                className="mailmdlbutton"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Emoji"
              >
                <CiFaceSmile />
              </button>

              {/* for handle input */}
              <input
                className="mailmdl"
                type="file"
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
              />

              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                className="mailmdl"
              />

              {showEmojiPicker && (
                <div ref={emojiRef} className="mailmdl-emoji-wrapper">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </div>
          <div>
            {/* <button
                className="btns"
                onClick={() => setShowCalendar((prev) => !prev)}
              >
                <MdOutlineEditCalendar />
              </button> */}
            <button onClick={handleDelete} className="mailmdl-btns">
              <RiDeleteBinLine />
            </button>
          </div>
        </div>
        {showCalendar && (
          <div className="mailmdl-calendar-popup">
            <input className="mailmdl" type="date" />
          </div>
        )}

        {showLinkInput && (
          <div
            className="mailmdl-link-input-box"
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <input
              type="text"
              placeholder="Text to display"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="mailmdl"
            />
            <input
              type="text"
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="mailmdl"
            />
            <button className="mailmdlbutton" onClick={handleInsertLink}>
              Insert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailModal;

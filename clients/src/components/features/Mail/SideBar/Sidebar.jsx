import "./Sidebar.css";
import Img from "../../../../assets/img/dp.jpg";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineInbox } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa6";
import { IoRocketOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { RiDeleteBinLine, RiSpam2Line } from "react-icons/ri";
import { ImCompass } from "react-icons/im";
import { PiUploadLight } from "react-icons/pi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaSquarePlus } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa";
import { useEffect, useState } from "react";

import EmailModal from "../EmailModal/EmailModal";
import { NavLink } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";
import Ma from "../../../../assets/images/ma.png"
import Mb from "../../../../assets/images/mb.png"
import Mc from "../../../../assets/images/mc.png"
import Md from "../../../../assets/images/md.png"
import Me from "../../../../assets/images/me.png"
import Mf from "../../../../assets/images/mee.png"
import Mg from "../../../../assets/images/mg.png"
import Mh from "../../../../assets/images/mh.png"
import Mi from "../../../../assets/images/mi.png"

const Sidebar = () => {
  const [emailshow, setEmailShow] = useState(false);
  const [showMore, setshowMore] = useState(false);
  const [showMores, setshowMores] = useState(false);
  const [showMoref, setshowMoref] = useState(false);
  const [emails, setEmails] = useState([]);

  const [customLabels, setCustomLabels] = useState(() => {
    const stored = localStorage.getItem("customLabels");
    return stored ? JSON.parse(stored) : [];
  });
  const [newLabelName, setNewLabelName] = useState("");
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const drafts = JSON.parse(localStorage.getItem("emailDrafts")) || [];


  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      // Fetch received emails
      const resInbox = await axios.get(`${BASE_URL}/api/email/mail/receive`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch sent emails
      const resSent = await axios.get(`${BASE_URL}/api/email/mail/getsentemail`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Merge both arrays
      const allEmails = [...resInbox.data.data, ...resSent.data.data];

      setEmails(allEmails);
    } catch (error) {
      console.error("Failed to fetch emails", error);
    }
  };
  // for deleted
  const fetchDeletedCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/email/mail/deleted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeletedCount(res.data.data.length);
    } catch (error) {
      console.error("Failed to fetch deleted emails", error);
    }
  };
  useEffect(() => {
    fetchEmails();
    fetchDeletedCount();

    const interval = setInterval(() => {
      fetchEmails();
      fetchDeletedCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="sidebarm">
        <div className="content">
          <div className="compose" style={{ backgroundColor: '#1368ec' }} onClick={() => setEmailShow(true)}>
            <FaRegEdit />
            Compose
          </div>
          <hr style={{ height: '1px', color: '#bdbdbdff' }} />
          <EmailModal show={emailshow} onClose={() => setEmailShow(false)} onSent={fetchEmails} />

          <div className="section border-bootom">
            <div className="section-title">Mail</div>
            <NavLink
              className={({ isActive }) => (isActive ? "item active" : "item")}
              style={{ textDecoration: "none" }}
              to="/mail/inbox"
            >
              <span className="sectionnnemmailc">
                <img src={Mf} alt="mf" style={{ marginRight: '10px' }} />
                Inbox
              </span>{" "}
              <span className="count">
                {
                  emails.filter(
                    (email) => email.type === "inbox" && !email.deleted
                  ).length
                }
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "item active" : "item")}
              style={{ textDecoration: "none" }}
              to="/mail/starred"
            >
              <span className="sectionnnemmailc">
                <img src={Mh} alt="mh" style={{ marginRight: '10px' }} />
                Starred
              </span>{" "}
              <span>
                {emails.filter((email) => email.starred && !email.deleted).length}
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "item active" : "item")}
              style={{ textDecoration: "none" }}
              to="/mail/sent"
            >
              <span className="sectionnnemmailc">
                <img src={Ma} alt="ma" style={{ marginRight: '10px' }} />
                Sent
              </span>{" "}
              <span>
                {
                  emails.filter(
                    (email) => email.type === "sent" && !email.deleted
                  ).length
                }
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "item active" : "item")}
              style={{ textDecoration: "none" }}
              to="/mail/drafts"
            >
              <span className="sectionnnemmailc">
                <img src={Mb} alt="mb" style={{ marginRight: '10px' }} />
                Drafts
              </span>{" "}
              <span>
                <span>{drafts.length}</span>
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "item active" : "item")}
              style={{ textDecoration: "none" }}
              to="/mail/deleted"
            >
              <span className="sectionnnemmailc">
                <img src={Mc} alt="mc" style={{ marginRight: '10px' }} />
                Deleted{" "}
              </span>
              <span>{deletedCount}</span>
            </NavLink>
            {/* <NavLink
              className={({ isActive }) => (isActive ? "item active" : "item")}
              style={{ textDecoration: "none" }}
              to="/mail/spam"
            >
              <span className="sectionnnemmailc">
                <img src={Md} alt="md" style={{ marginRight: '10px' }} />
                Spam{" "}
              </span>
              <span>
                {emails.filter((email) => email.spam && !email.deleted).length}
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "item active" : "item"
              }
              style={{ textDecoration: "none" }}
              to="/mail/important"
            >
              <span className="sectionnnemmailc">
                <img src={Mi} alt="mi" style={{ marginRight: '10px' }} />
                Important{" "}
              </span>
              <span>
                {
                  emails.filter((email) => email.important && !email.deleted)
                    .length
                }
              </span>
            </NavLink> */}
            <NavLink
              className={({ isActive }) =>
                isActive ? "item active" : "item"
              }
              style={{ textDecoration: "none" }}
              to="/mail/allemails"
            >
              <span className="sectionnnemmailc">
                <img src={Me} alt="me" style={{ marginRight: '10px' }} />
                All Emails{" "}
              </span>
              <span>{emails.length}</span>
            </NavLink>

          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './chat.css';
import { CiSearch } from "react-icons/ci";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { CiCamera } from "react-icons/ci";
import { GrGallery } from "react-icons/gr";
import { MdOutlineAudiotrack } from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import { RiUserFollowLine } from "react-icons/ri";
import { GrEmoji } from "react-icons/gr";
import { CiFolderOn } from "react-icons/ci";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { TbClearAll } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdBlockFlipped } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { LuRefreshCcw, LuChevronUp, LuMic, LuSend } from "react-icons/lu";
import { TbFolderUp } from "react-icons/tb";

import { useSocket } from '../../../Context/SocketContext';
import ChatIcon from '../../../assets/img/icons/chat.png';
import BASE_URL from '../../../pages/config/config';

import axios from "axios";

const SOCKET_URL = BASE_URL;
// const socket = io("http://localhost:5000"); // same as backend port

const Chat = () => {
  // console.log('🔍 Chat component rendered');
  const [users, setUsers] = useState([]);
  // console.log('🔍 Initial unreadCounts state:', {});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState({}); // Store messages per user
  const [message, setMessage] = useState('');
  const [readStatus, setReadStatus] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({}); // Track unread counts per user
  
  // Debug unreadCounts changes
  useEffect(() => {
    // console.log('🔍 unreadCounts state changed:', unreadCounts);
  }, [unreadCounts]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering friends
  const [searchSuggestions, setSearchSuggestions] = useState([]); // Search suggestions dropdown
  const [showSearchDropdown, setShowSearchDropdown] = useState(false); // Show/hide search dropdown
  const [searchTimeout, setSearchTimeout] = useState(null); // For debouncing search

  const socket = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  
  // const backendurl = import.meta.env.BACKEND_URL || 'http://localhost:5000';
  const backendurl = BASE_URL;

  const [clickDropdown, setClickDropdown] = useState();
  const [clickDropdowntwo, setClickDropdownTwo] = useState();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { idx, x, y }
  const [replyTo, setReplyTo] = useState(null); // message object
  const [popup, setPopup] = useState({ show: false, message: '' });

  // Get the current user ID - handle both id and _id fields
  const currentUserId = user?.id || user?._id;

  // Helper function to normalize user IDs for comparison
  const normalizeUserId = (userId) => {
    return userId ? String(userId) : null;
  };

  // Normalized current user ID for consistent comparison
  const normalizedCurrentUserId = normalizeUserId(currentUserId);

  const { connectSocket, getSocket } = useSocket();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };



  // Function to handle search input changes
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.trim().length > 0) {
      // Set a new timeout for debouncing
      const timeoutId = setTimeout(async () => {
        try {
          // Search users by email using the backend API
          const token = localStorage.getItem('token');

          const res = await fetch(`${BASE_URL}/api/user/search?email=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) throw new Error('Failed to search users');

          const data = await res.json();

          // Filter out current user and users already in conversation list
          const conversationUserIds = users.map(u => u._id);
          const filteredSuggestions = data.users.filter(userItem =>
            userItem._id !== currentUserId && !conversationUserIds.includes(userItem._id)
          ).slice(0, 5); // Limit to 5 suggestions

          setSearchSuggestions(filteredSuggestions);
          setShowSearchDropdown(true);
        } catch (err) {
          console.error("Error searching users:", err);
          setSearchSuggestions([]);
          setShowSearchDropdown(false);
        }
      }, 300); // 300ms delay

      setSearchTimeout(timeoutId);
    } else {
      setSearchSuggestions([]);
      setShowSearchDropdown(false);
    }
  };

  // Function to select a user from search suggestions (do not add to left panel until first message)
  const selectUserFromSearch = async (selectedUser) => {
    try {
      const token = localStorage.getItem('token');

      // Only open chat view without adding to left list until a message exists
      // Initialize local message array but don't push into users list yet
      setMessages(prev => ({ ...prev, [selectedUser._id]: prev[selectedUser._id] || [] }));

      // Select the user for chat (right panel)
      setSelectedUser(selectedUser);

      // Clear search
      setSearchQuery('');
      setSearchSuggestions([]);
      setShowSearchDropdown(false);

      // Initialize unread count for this user locally
      setUnreadCounts(prev => ({ ...prev, [selectedUser._id]: prev[selectedUser._id] || 0 }));

    } catch (err) {
      console.error("Error adding user to conversation list:", err);
      setError('Failed to add user to conversation list');
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setClickDropdownTwo(false); // Close file options when opening emoji picker
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    // Check file size and type for each file
    const maxSize = 10 * 1024 * 1024; // 10MB - more reasonable for chat files
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/quicktime',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'application/zip', 'application/x-rar-compressed'
    ];

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setPopup({
          show: true,
          message: `${file.name}: File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
        });
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        setPopup({
          show: true,
          message: `${file.name}: File type not supported. Allowed types: Images, Videos, PDFs, Documents, Archives, and Text files.`
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setShowEmojiPicker(false);
      // console.log(`Selected ${validFiles.length} valid files:`, validFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length || !selectedUser) return;
    setIsUploading(true);
    setUploadProgress(0);

    for (const file of selectedFiles) {
      try {
        // Try signed Cloudinary upload first
        const token = localStorage.getItem('token');
        const sigRes = await fetch(`${BASE_URL}/api/cloudinary-signature`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!sigRes.ok) {
          throw new Error('Failed to get Cloudinary signature');
        }

        const { timestamp, signature, apiKey, cloudName, folder } = await sigRes.json();

        // Validate Cloudinary configuration
        if (!timestamp || !signature || !apiKey || !cloudName) {
          throw new Error('Invalid Cloudinary configuration');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        // console.log('Uploading to Cloudinary:', {
        //   cloudName,
        //   folder,
        //   fileName: file.name,
        //   fileSize: file.size
        // });

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: 'POST', body: formData }
        );

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error?.message || 'Cloudinary upload failed');
        }

        const data = await uploadRes.json();
        // console.log('Cloudinary upload successful:', data);

        // Success: use Cloudinary URL
        const fileMessage = {
          from: currentUserId,
          to: selectedUser._id,
          message: `📎 ${file.name}`,
          fileUrl: data.secure_url,
          fileType: file.type,
          fileName: file.name,
          timestamp: new Date(),
          read: false,
          replyTo: null
        };

        // Save file message to backend for persistence
        try {
          const saveResponse = await fetch(`${BASE_URL}/api/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(fileMessage),
          });

          if (!saveResponse.ok) {
            const errorData = await saveResponse.json();
            console.warn('Failed to save message to backend:', errorData);
            // Continue with local state update even if backend save fails
          } else {
            console.log('Message saved to backend successfully');
          }
        } catch (saveError) {
          console.warn('Error saving message to backend:', saveError);
          // Continue with local state update even if backend save fails
        }

        // Add message to sender's local state immediately
        setMessages(prev => {
          const newMessages = {
            ...prev,
            [selectedUser._id]: [...(prev[selectedUser._id] || []), fileMessage]
          };
          return newMessages;
        });

        // Only add user to left panel if they're not already there
        setUsers(prev => {
          const exists = prev.some(u => u._id === selectedUser._id);
          return exists ? prev : [selectedUser, ...prev];
        });

        socket.current.emit('send-msg', {
          from: currentUserId,
          to: selectedUser._id,
          message: fileMessage.message,
          fileUrl: fileMessage.fileUrl,
          fileType: fileMessage.fileType,
          fileName: fileMessage.fileName,
          replyTo: fileMessage.replyTo
        });

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);

        // Fallback: upload to backend for local storage
        try {
          // console.log('Attempting fallback upload to backend...');
          const token = localStorage.getItem('token');
          const formData = new FormData();
          formData.append('file', file);
          formData.append('from', currentUserId);
          formData.append('to', selectedUser._id);

          const uploadUrl = `${BASE_URL}/api/cloudinary-signature/upload-file`;
          const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Backend upload failed');
          }

          const data = await response.json();
          // console.log('Backend upload successful:', data);

          // Success: use local file URL
          const fileMessage = {
            from: currentUserId,
            to: selectedUser._id,
            message: `📎 ${file.name}`,
            fileUrl: data.fileUrl,
            fileType: file.type,
            fileName: file.name,
            timestamp: new Date(),
            read: false,
            replyTo: null
          };

          // Add message to sender's local state immediately
          setMessages(prev => {
            const newMessages = {
              ...prev,
              [selectedUser._id]: [...(prev[selectedUser._id] || []), fileMessage]
            };
            return newMessages;
          });

          setUsers(prev => {
            const exists = prev.some(u => u._id === selectedUser._id);
            return exists ? prev : [selectedUser, ...prev];
          });

          socket.current.emit('send-msg', {
            from: currentUserId,
            to: selectedUser._id,
            message: fileMessage.message,
            fileUrl: fileMessage.fileUrl,
            fileType: fileMessage.fileType,
            fileName: fileMessage.fileName,
            replyTo: fileMessage.replyTo
          });

          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);

        } catch (fallbackError) {
          console.error('Both Cloudinary and backend upload failed:', fallbackError);
          setPopup({
            show: true,
            message: `Failed to upload ${file.name}. Please try again or contact support.`
          });
        }
      }
    }

    setSelectedFiles([]);
    setIsUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const calculateUnreadCount = (userId) => {
    const userMessages = messages[userId] || [];
    const unreadMessages = userMessages.filter(msg => msg.from === userId && !msg.read);
    const unreadCount = unreadMessages.length;
    // console.log(`calculateUnreadCount for ${userId}:`, {
    //   totalMessages: userMessages.length,
    //   messagesFromUser: userMessages.filter(msg => msg.from === userId).length,
    //   unreadFromUser: unreadCount,
    //   currentUserId,
    //   sampleMessages: userMessages.slice(0, 2).map(m => ({ from: m.from, read: m.read, message: m.message?.substring(0, 20) }))
    // });
    return unreadCount;
  };

  const scrollToFirstUnreadMessage = () => {
    if (!messageContainerRef.current || !selectedUser) return;

    const userMessages = messages[selectedUser._id] || [];
    const firstUnreadIndex = userMessages.findIndex(msg => msg.from === selectedUser._id && !msg.read);

    if (firstUnreadIndex !== -1) {
      const messageElements = messageContainerRef.current.children;
      if (messageElements[firstUnreadIndex]) {
        messageElements[firstUnreadIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    } else {
      // If no unread messages, scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const getLastMessage = (userId) => {
    const safeMessages = messages || {};
    const userMessages = safeMessages[userId] || [];
    if (userMessages.length === 0) return 'No conversation';

    const lastMessage = userMessages[userMessages.length - 1];
    const isFromCurrentUser = lastMessage.from === currentUserId;
    const prefix = isFromCurrentUser ? 'You: ' : '';
    const messageText = lastMessage.message && lastMessage.message.length > 20
      ? lastMessage.message.substring(0, 20) + '...'
      : lastMessage.message || '';

    return prefix + messageText;
  };

  const getLastMessageTime = (userId) => {
    const safeMessages = messages || {};
    const userMessages = safeMessages[userId] || [];
    if (userMessages.length === 0) return '';

    const lastMessage = userMessages[userMessages.length - 1];
    return lastMessage && lastMessage.timestamp ? formatTime(lastMessage.timestamp) : '';
  };

  const getLastMessageTimestamp = (userId) => {
    const safeMessages = messages || {};
    const userMessages = safeMessages[userId] || [];
    if (userMessages.length === 0) return new Date(0);
    const lastMessage = userMessages[userMessages.length - 1];
    return lastMessage && lastMessage.timestamp ? new Date(lastMessage.timestamp) : new Date(0);
  };

  const getLastMessageStatus = (userId) => {
    const safeMessages = messages || {};
    const userMessages = safeMessages[userId] || [];
    if (userMessages.length === 0) return null;

    const lastMessage = userMessages[userMessages.length - 1];
    // Only show status for messages sent by current user
    if (lastMessage && lastMessage.from === currentUserId) {
      return lastMessage.read ? '✓✓' : '✓';
    }
    return null;
  };

  // Left panel list: show only users with whom you have chat history, filtered by search
  const getFilteredUsers = () => {
    const query = searchQuery.trim().toLowerCase();
    const baseUsers = (users || []).filter(u => u && u._id);
    if (!query) return baseUsers;
    return baseUsers.filter((userItem) =>
      (userItem.firstName && userItem.firstName.toLowerCase().includes(query)) ||
      (userItem.lastName && userItem.lastName.toLowerCase().includes(query)) ||
      (userItem.email && userItem.email.toLowerCase().includes(query))
    );
  };


  // Close emoji picker and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
      if (clickDropdowntwo && !event.target.closest('.file-dropdown-container')) {
        setClickDropdownTwo(false);
      }
      if (clickDropdown && !event.target.closest('.settings-dropdown-container')) {
        setClickDropdown(false);
      }
      if (showSearchDropdown && !event.target.closest('.chat-list-search-box')) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Cleanup search timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [showEmojiPicker, clickDropdowntwo, clickDropdown, showSearchDropdown, searchTimeout]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        // ✅ Get conversations for the logged-in user first
        let conversationsRes = await fetch(`${BASE_URL}/api/messages/${currentUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("Primary API status:", conversationsRes.status);
        let conversationsData;
        try {
          conversationsData = await conversationsRes.json();
        } catch (e) {
          conversationsData = [];
        }
        if (!Array.isArray(conversationsData)) {
          // console.log('Primary conversations response not array, raw:', conversationsData);
        }
        if ((!conversationsRes.ok || !Array.isArray(conversationsData) || conversationsData.length === 0)) {
          // Fallback to alternate mount
          try {
            const altRes = await fetch(`${BASE_URL}/api/conversations/${currentUserId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            // console.log("Fallback API status:", altRes.status);
            const altData = await altRes.json();
            if (altRes.ok && Array.isArray(altData)) {
              conversationsRes = altRes;
              conversationsData = altData;
            }
          } catch (e) {
            // console.log('Fallback fetch failed:', e.message);
          }
        }

        // console.log("Conversations data (final):", conversationsData);
        // console.log("Current user ID:", currentUserId);

        if (Array.isArray(conversationsData) && conversationsData.length > 0) {
          // Extract user IDs from conversations and build messages
          const conversationUserIds = [];
          const allMessages = {};
          const usersWithConversations = [];

          conversationsData.forEach((conversation, index) => {
            // console.log(`Processing conversation ${index}:`, conversation);
            // console.log("Conversation participants:", conversation.participants);
            // Normalize participants as objects with _id
            const normalizedParticipants = (conversation.participants || []).map((p) =>
              typeof p === 'string' ? { _id: p } : p
            );
            // Find the other participant (not the current user)
            const otherParticipant = normalizedParticipants.find(p => String(p._id) !== String(currentUserId));
            // console.log("Other participant found:", otherParticipant);

            if (otherParticipant) {
              conversationUserIds.push(otherParticipant._id);
              // Add user to the list
              usersWithConversations.push({
                _id: otherParticipant._id,
                firstName: otherParticipant.firstName || otherParticipant.name || otherParticipant.username || otherParticipant.email || 'User',
                lastName: otherParticipant.lastName || '',
                email: otherParticipant.email || '',
                profileImage: otherParticipant.profileImage ?
                  (Array.isArray(otherParticipant.profileImage) && otherParticipant.profileImage.length > 0 ?
                    otherParticipant.profileImage[0].url :
                    (typeof otherParticipant.profileImage === 'string' ? otherParticipant.profileImage :
                      (otherParticipant.profileImage.url || otherParticipant.profileImage))) :
                  (otherParticipant.profilePicture || null)
              });
              // Build messages for this conversation (may be empty)
              const convMessages = Array.isArray(conversation.messages) ? conversation.messages : [];
              allMessages[otherParticipant._id] = convMessages.map((msg) => ({
                from: msg.from,
                message: msg.message,
                read: msg.read,
                timestamp: msg.timestamp,
                fileUrl: msg.fileUrl,
                fileType: msg.fileType,
                fileName: msg.fileName,
                replyTo: msg.replyTo
              }));
            }
          });

          // console.log("Users with conversations:", usersWithConversations);
          // console.log("All messages:", allMessages);
          // console.log("Conversation user IDs:", conversationUserIds);

          setMessages(allMessages);
          // Deduplicate users by _id in case of duplicates
          const uniqueUsers = usersWithConversations.filter((u, idx, arr) =>
            idx === arr.findIndex(x => String(x._id) === String(u._id))
          );
          setUsers(uniqueUsers);

          // Calculate initial unread counts
          const initialUnreadCounts = {};
          usersWithConversations.forEach(userItem => {
            const unreadCount = calculateUnreadCount(userItem._id);
            initialUnreadCounts[userItem._id] = unreadCount;
          });
          setUnreadCounts(initialUnreadCounts);


        } else {
          // console.log("No conversations found or response not ok");
          // If no conversations, don't show any users in left panel
          setUsers([]);
          setMessages({});
        }
      } catch (err) {
        console.error("Error fetching users and conversations:", err);
        setError(err.message);
      }
    };

    if (currentUserId) fetchUsers();
  }, [currentUserId]);




  useEffect(() => {
    if (!currentUserId) return;

    // Use the centralized socket connection
    const socketInstance = connectSocket(BASE_URL);

    if (socketInstance) {
      socket.current = socketInstance;

      // Emit add-user when connected
      if (socketInstance.connected) {
        // console.log("🟢 Socket connected successfully");
        // console.log("🟢 Emitting add-user with ID:", currentUserId);
        socketInstance.emit('add-user', currentUserId);
      } else {
        socketInstance.on('connect', () => {
          // console.log("🟢 Socket connected successfully");
          // console.log("🟢 Emitting add-user with ID:", currentUserId);
          socketInstance.emit('add-user', currentUserId);
        });
      }

      socketInstance.on('online-users', (online) => {
        // console.log("🟢 Online users received:", online);
        // console.log("🟢 Online users types:", online.map(id => typeof id));
        // console.log("🟢 Current user ID:", currentUserId, "Type:", typeof currentUserId);
        setOnlineUsers(online);
      });

      socketInstance.on('msg-receive', (data) => {
        setMessages((prev) => {
          const userId = data.from === currentUserId ? data.to : data.from;
          const userMessages = prev[userId] || [];
          
          // Check for duplicate messages to prevent multiple additions
          const newMessage = {
            from: data.from,
            message: data.message,
            fileUrl: data.fileUrl,
            fileType: data.fileType,
            fileName: data.fileName,
            read: false,
            timestamp: data.timestamp || new Date(),
            replyTo: data.replyTo
          };
          
          // Create a unique key for the message to check for duplicates (same format as mergeMessages)
          const messageKey = `${data.timestamp || new Date()}-${data.message || ''}-${data.from}-${data.fileUrl || ''}-${data.fileType || ''}`;
          const isDuplicate = userMessages.some(msg => {
            const existingKey = `${msg.timestamp}-${msg.message || ''}-${msg.from}-${msg.fileUrl || ''}-${msg.fileType || ''}`;
            return existingKey === messageKey;
          });
          
          // Only add the message if it's not a duplicate
          if (isDuplicate) {
            return prev;
          }
          
          return {
            ...prev,
            [userId]: [...userMessages, newMessage]
          };
        });
        // Only add the other user to left panel if they're not already there (ensures only users with actual conversations appear)
        const otherId = data.from === currentUserId ? data.to : data.from;
        if (otherId !== currentUserId) {
          // Try to find the user in existing users list; otherwise fetch minimal details from search pool
          setUsers(prev => {
            if (prev.some(u => u._id === otherId)) return prev;
            // Fallback: synthesize minimal object to show; will get enriched on next fetch
            return [{ _id: otherId, firstName: 'User', lastName: '', email: '', profileImage: null }, ...prev];
          });
        }

        // Increment unread count for received messages
        if (data.from !== currentUserId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [data.from]: (prev[data.from] || 0) + 1
          }));
        }
      });

      socketInstance.on('msg-read', (data) => {
        setReadStatus((prev) => ({ ...prev, [data.from]: true }));

        // Update message read status for messages sent by this user to the user who just read them
        setMessages((prev) => {
          const updatedMessages = { ...prev };
          if (updatedMessages[data.from]) {
            updatedMessages[data.from] = updatedMessages[data.from].map(msg =>
              normalizeUserId(msg.from) === normalizedCurrentUserId ? { ...msg, read: true } : msg
            );
          }
          return updatedMessages;
        });
      });

      // Listen for real-time message deletion
      socketInstance.on('delete-msg', (data) => {
        setMessages(prev => {
          // Update messages for the conversation between current user and the sender
          const conversationKey = data.from;
          const userMessages = prev[conversationKey] || [];
          return {
            ...prev,
            [conversationKey]: userMessages.filter(msg => String(msg.timestamp) !== String(data.messageTimestamp))
          };
        });
      });

      // Listen for real-time chat clear
      socketInstance.on('clear-chat', (data) => {
        setMessages(prev => ({
          ...prev,
          [data.from]: []
        }));
      });
    }

    return () => {
      // Don't disconnect here, let the socket context manage the connection
    };
  }, [currentUserId, connectSocket]);

  // Fetch chat history when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${BASE_URL}/api/messages?from=${currentUserId}&to=${selectedUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch messages');

        // console.log('Fetched messages for selected user:', data);
        // console.log('Message count:', data.length);
        // console.log('User messages:', data.filter(msg => msg.from === currentUserId).length);
        // console.log('Sample message structure:', data[0]);

        // Helper function to merge messages and avoid duplicates
        const mergeMessages = (existingMessages, newMessages) => {
          const messageMap = new Map();
          
          // Add existing messages to map
          existingMessages.forEach(msg => {
            // Create a more comprehensive key that includes file info for better deduplication
            const key = `${msg.timestamp}-${msg.message || ''}-${msg.from}-${msg.fileUrl || ''}-${msg.fileType || ''}`;
            messageMap.set(key, msg);
          });
          
          // Add new messages, overwriting duplicates
          newMessages.forEach(msg => {
            // Create a more comprehensive key that includes file info for better deduplication
            const key = `${msg.timestamp}-${msg.message || ''}-${msg.from}-${msg.fileUrl || ''}-${msg.fileType || ''}`;
            messageMap.set(key, msg);
          });
          
          // Convert back to array and sort by timestamp
          return Array.from(messageMap.values()).sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
        };

        setMessages((prev) => {
          // For refresh scenarios, replace existing messages with server data to avoid timestamp conflicts
          const newMessages = data.map((msg) => ({
            from: msg.from,
            message: msg.message,
            read: msg.read,
            timestamp: msg.timestamp,
            fileUrl: msg.fileUrl,
            fileType: msg.fileType,
            fileName: msg.fileName,
            replyTo: msg.replyTo
          }));
          
          return {
            ...prev,
            [selectedUser._id]: newMessages
          };
        });

        // Check if there are any unread messages from the selected user
        const unreadMessages = data.filter(msg => msg.from === selectedUser._id && !msg.read);
        
        // Only mark messages as read if there are actually unread messages
        if (unreadMessages.length > 0) {
          await fetch(`${BASE_URL}/api/messages/read`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ from: selectedUser._id, to: currentUserId }),
          });
          socket.current.emit('message-read', { from: currentUserId, to: selectedUser._id });
          setReadStatus((prev) => ({ ...prev, [selectedUser._id]: true }));

          // Update messages to mark them as read
          setMessages((prev) => ({
            ...prev,
            [selectedUser._id]: (prev[selectedUser._id] || []).map(msg => ({
              ...msg,
              read: msg.from === selectedUser._id ? true : msg.read
            }))
          }));
        }

        // Update unread counts after marking messages as read
        setUnreadCounts((prev) => ({
          ...prev,
          [selectedUser._id]: 0
        }));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMessages();
  }, [selectedUser, currentUserId]);

  // Calculate unread counts whenever messages change
  useEffect(() => {
    const newUnreadCounts = {};
    Object.keys(messages).forEach(userId => {
      newUnreadCounts[userId] = calculateUnreadCount(userId);
    });
    // console.log("Updating unread counts:", newUnreadCounts);
    setUnreadCounts(newUnreadCounts);
  }, [messages, selectedUser]);

  // Scroll to first unread message when messages are loaded
  useEffect(() => {
    if (selectedUser && messages[selectedUser._id]) {
      setTimeout(() => {
        scrollToFirstUnreadMessage();
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [messages, selectedUser]);

  const handleMessageSelection = (messageIndex) => {
    if (!isSelectionMode) return;

    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageIndex)) {
        newSet.delete(messageIndex);
      } else {
        newSet.add(messageIndex);
      }
      return newSet;
    });
  };

  const handleDeleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedMessages.size} selected message(s)?`)) {
      try {
        const token = localStorage.getItem('token');
        const userMessages = messages[selectedUser._id] || [];
        const selectedMessageData = Array.from(selectedMessages)
          .map(index => userMessages[index])
          .filter(msg => normalizeUserId(msg.from) === normalizedCurrentUserId) // Only allow deletion of user's own messages
          .map(msg => ({
            timestamp: msg.timestamp,
            message: msg.message,
            from: msg.from
          }));

        // console.log('Selected messages to delete:', selectedMessageData);

        const requestBody = {
          messages: selectedMessageData,
          from: currentUserId,
          to: selectedUser._id
        };
        // console.log('Request body:', requestBody);

        const response = await fetch(`${BASE_URL}/api/messages/delete-selected`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();
        // console.log('Backend response:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to delete messages');
        }

        // Refresh messages from server to ensure consistency
        const refreshRes = await fetch(
          `${BASE_URL}/api/messages?from=${currentUserId}&to=${selectedUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const refreshData = await refreshRes.json();
        // console.log('Refreshed messages from server:', refreshData);
        // console.log('Refreshed message count:', refreshData.length);

        if (refreshRes.ok) {
          setMessages(prev => ({
            ...prev,
            [selectedUser._id]: refreshData.map((msg) => ({
              from: msg.from,
              message: msg.message,
              read: msg.read,
              timestamp: msg.timestamp,
              fileUrl: msg.fileUrl,
              fileType: msg.fileType,
              fileName: msg.fileName,
              replyTo: msg.replyTo
            }))
          }));
        } else {
          // Fallback: manually remove selected messages from local state
          // console.log('Server refresh failed, using local state fallback');
          setMessages(prev => ({
            ...prev,
            [selectedUser._id]: (prev[selectedUser._id] || []).filter((msg, index) =>
              !selectedMessages.has(index)
            )
          }));
        }

        // Emit socket event for real-time bulk deletion
        selectedMessageData.forEach(msg => {
          socket.current.emit('delete-msg', {
            from: currentUserId,
            to: selectedUser._id,
            messageTimestamp: msg.timestamp
          });
        });

        // Exit selection mode
        setIsSelectionMode(false);
        setSelectedMessages(new Set());
      } catch (error) {
        console.error('Error deleting selected messages:', error);
        alert('Failed to delete messages. Please try again.');
      }
    }
  };

  const handleMessageClick = (msg, idx, event) => {
    if (normalizeUserId(msg.from) === normalizedCurrentUserId) {
      event.preventDefault();
      setContextMenu({ idx, x: event.clientX, y: event.clientY });
    }
  };

  const handleDeleteSingleMessage = async (idx) => {
    if (!selectedUser) return;
    const userMessages = messages[selectedUser._id] || [];
    const msg = userMessages[idx];
    if (!msg || msg.from !== currentUserId) return;
    if (!window.confirm('Delete this message?')) return;
    try {
      const token = localStorage.getItem('token');
      const requestBody = {
        messages: [{
          timestamp: new Date(msg.timestamp).toISOString(),
          message: msg.message,
          from: msg.from
        }],
        from: currentUserId,
        to: selectedUser._id
      };
      // console.log('Deleting message with request body:', requestBody);

      const response = await fetch(`${BASE_URL}/api/messages/delete-selected`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      // console.log('Delete response status:', response.status);
      const responseData = await response.json();
      // console.log('Delete response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete message');
      }

      // Remove from local state
      setMessages(prev => ({
        ...prev,
        [selectedUser._id]: (prev[selectedUser._id] || []).filter((_, i) => i !== idx)
      }));

      // Emit socket event for real-time deletion
      socket.current.emit('delete-msg', {
        from: currentUserId,
        to: selectedUser._id,
        messageTimestamp: msg.timestamp
      });

      // console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message: ' + error.message);
    } finally {
      setContextMenu(null);
    }
  };

  const handleReplyToMessage = (msg) => {
    setReplyTo(msg);
    setContextMenu(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;
    // Prepare replyTo object if replying
    const replyToObj = replyTo ? {
      message: replyTo.message,
      timestamp: replyTo.timestamp,
      from: replyTo.from,
      username: replyTo.username || (selectedUser && selectedUser.username)
    } : undefined;
    // Send to backend for persistence
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from: currentUserId,
          to: selectedUser._id,
          message,
          replyTo: replyToObj
        }),
      });
    } catch {
      setError('Failed to send message');
    }
    // Send via socket for real-time
    setMessages((prev) => {
      const userMessages = prev[selectedUser._id] || [];
      return {
        ...prev,
        [selectedUser._id]: [...userMessages, {
          from: currentUserId,
          message,
          read: false,
          timestamp: new Date(),
          replyTo: replyToObj
        }]
      };
    });
    // Only add user to left panel if they're not already there (this ensures only users with actual conversations appear)
    setUsers(prev => {
      const exists = prev.some(u => u._id === selectedUser._id);
      return exists ? prev : [selectedUser, ...prev];
    });
    setReadStatus((prev) => ({ ...prev, [selectedUser._id]: false }));
    socket.current.emit('send-msg', {
      to: selectedUser._id,
      from: currentUserId,
      message,
      replyTo: replyToObj
    });
    setMessage('');
    setReplyTo(null);
  };

  // Test Cloudinary configuration
  const testCloudinaryConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      // console.log('Testing Cloudinary with token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`${BASE_URL}/api/cloudinary-signature/test-cloudinary`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // console.log('Cloudinary test response status:', response.status);
      // console.log('Cloudinary test response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary test failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Response is not JSON:', contentType);
        console.error('Response text:', responseText);
        throw new Error(`Expected JSON but got ${contentType}`);
      }

      const data = await response.json();
      // console.log('Cloudinary test result:', data);

      if (data.message) {
        setPopup({
          show: true,
          message: `Cloudinary Test: ${data.message}`
        });
      }

      return data;
    } catch (error) {
      console.error('Failed to test Cloudinary config:', error);
      setPopup({
        show: true,
        message: `Cloudinary test failed: ${error.message}`
      });
      return null;
    }
  };

  // Check environment configuration
  const checkEnvironment = async () => {
    try {
      const token = localStorage.getItem('token');
      // console.log('Checking environment with token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`${BASE_URL}/api/cloudinary-signature/env-check`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // console.log('Environment check response status:', response.status);
      // console.log('Environment check response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Environment check failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Response is not JSON:', contentType);
        console.error('Response text:', responseText);
        throw new Error(`Expected JSON but got ${contentType}`);
      }

      const data = await response.json();
      // console.log('Environment check result:', data);

      if (!data || !data.cloudinary) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from server');
      }

      // Show results in popup
      const message = `Environment Check:\n\nCloudinary:\n- Cloud Name: ${data.cloudinary.cloud_name}\n- API Key: ${data.cloudinary.api_key}\n- API Secret: ${data.cloudinary.api_secret}\n\nUploads:\n- Directory: ${data.uploads.directory}\n- Exists: ${data.uploads.exists}\n- Writable: ${data.uploads.writable}`;

      setPopup({
        show: true,
        message: message
      });

      return data;
    } catch (error) {
      console.error('Failed to check environment:', error);
      setPopup({
        show: true,
        message: `Failed to check environment: ${error.message}`
      });
      return null;
    }
  };

  // Simple ping test to verify routing
  const testPing = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/cloudinary-signature/ping`);
      const data = await response.json();
      // console.log('Ping test result:', data);
      setPopup({
        show: true,
        message: `Ping test successful: ${data.message}`
      });
      return data;
    } catch (error) {
      console.error('Failed to ping:', error);
      setPopup({
        show: true,
        message: `Ping test failed: ${error.message}`
      });
      return null;
    }
  };

  return (
    <>
      <div className='page-wrapper' style={{ display: 'flex', flexDirection: 'column', height: '88vh', marginTop: '60px', padding: '10px' }}>

        {/* header */}
        {/* <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>

      <div>
      <span style={{fontWeight:'bold', fontSize:'25px'}}>Chat</span>
      <br/>
      <span style={{color:'rgb(73, 73, 73)'}}>Manage your chats</span>
      </div>

      <div style={{display:'flex', gap:'10px', height:'35px'}}>
        <button style={{backgroundColor:'white', color:'gray', padding:'5px 10px', display:'flex', alignItems:'center', border:'none', cursor:'pointer'}} onClick={() => location.reload()}><LuRefreshCcw /></button>
        <button style={{backgroundColor:'white', color:'gray', padding:'5px 10px', display:'flex', alignItems:'center', border:'none'}}><LuChevronUp /></button>
      </div>

      </div> */}

        {/* Main content */}
        <div className="content" style={{ display: 'flex', flex: 1, height: '100vh', gap: '15px' }}>

          {/* Left panel: User list */}
          <div style={{
            width: '25%',
            border: '1px solid #E6E6E6',
            padding: '15px',
            height: 'calc(100vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '10px'
          }}>

            <div style={{ flexShrink: 0 }}>

              <span style={{ fontWeight: '500', fontSize: '20px' }}>Chats</span>

              {/* Search Box */}
              <div style={{ marginBottom: '15px', padding: '0px 10px', position: 'relative' }} className="chat-list-search-box" >

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>

                  <CiSearch style={{ fontSize: '20px' }} />

                  <input
                    type="text"
                    placeholder="Search"
                    className="chat-list-search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                      width: '100%',
                    }}
                  />

                </div>

                {/* Search Suggestions Dropdown */}
                {showSearchDropdown && searchSuggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '10px',
                    right: '10px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {searchSuggestions.map((userItem) => (
                      <div
                        key={userItem._id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          gap: '10px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => selectUserFromSearch(userItem)}
                      >

                        <div style={{display:'flex',gap:'5px'}}>
                        {/* User Avatar */}
                        {userItem.profileImage ? (
                          <img
                            src={userItem.profileImage}
                            alt={userItem.firstName}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #ddd'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: '#007AFF',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              border: '2px solid #ddd'
                            }}
                          >
                            {(userItem.firstName || userItem.email || 'U').slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        {/* User Info */}
                        <div style={{}}>
                          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {userItem.firstName} {userItem.lastName}
                            <br/>
                            <span style={{ fontSize: '12px', color: '#666' }}>
                            {userItem.email}
                            </span>
                          </span>
                          
                        </div>
                        
                      </div>

                        {/* Start Conversation Button */}
                        <div style={{
                          fontSize: '12px',
                          color: '#007AFF',
                          fontWeight: 'bold'
                        }}>
                          Start Chat
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <div style={{ color: 'red' }}>{error}</div>}

            </div>

            <ul style={{ listStyle: 'none', padding: 0, overflowY: 'auto', flex: 1, marginTop: '1px' }} className="chat-list-usersection">
              {getFilteredUsers().length > 0 ? (
                getFilteredUsers()
                  .sort((a, b) => {
                    const aTimestamp = getLastMessageTimestamp(a._id);
                    const bTimestamp = getLastMessageTimestamp(b._id);
                    return bTimestamp - aTimestamp; // Sort by most recent first
                  })
                  .map((userItem) => (
                    <li
                      key={userItem._id}
                      className="chat-list-user"
                      style={{
                        padding: '12px 15px',
                        cursor: 'pointer',
                        background: selectedUser && selectedUser._id === userItem._id ? '#E3F3FF' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '12px',
                        borderRadius: '5px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                      onClick={() => {
                        setSelectedUser(userItem);
                        // Immediately clear unread count for this user
                        setUnreadCounts((prev) => ({
                          ...prev,
                          [userItem._id]: 0
                        }));
                        // console.log("Selected user:", userItem._id, "Clearing unread count");
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {userItem.profileImage ? (
                          <>
                            <div>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#007AFF',
                                color: 'white',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                border: '2px solid #ddd',
                                display: 'flex',
                                position: 'relative',
                                textAlign: 'center',
                              }}>
                                <img
                                  src={userItem.profileImage}
                                  alt={userItem.firstName}
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />

                                {onlineUsers.includes(normalizeUserId(userItem._id)) ? (
                                  <div style={{ position: 'absolute', top: '-10px', right: '-5px' }}>
                                    <span style={{ color: 'rgb(43, 216, 66)', fontSize: 21, }}>●</span>
                                  </div>
                                ) : (
                                  <div style={{ position: 'absolute', top: '-10px', right: '-5px' }}>
                                    <span style={{ color: 'gray', fontSize: 1 }}>●</span>
                                  </div>
                                )}

                              </div>

                              {/* {console.log(`User ${userItem._id} online status:`, onlineUsers.includes(normalizeUserId(userItem._id)), 'Online users:', onlineUsers)} */}
                              {/* {console.log(`User ID type:`, typeof userItem._id, 'Online users types:', onlineUsers.map(id => typeof id))} */}

                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: '#007AFF',
                                  color: 'white',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  border: '2px solid #ddd',
                                  display: 'flex',
                                  position: 'relative',
                                  textAlign: 'center',
                                }}
                              >
                                {(userItem.firstName || userItem.email || 'U').slice(0, 2).toUpperCase()}

                                {onlineUsers.includes(normalizeUserId(userItem._id)) ? (
                                  <div style={{ position: 'absolute', top: '-10px', right: '-5px' }}>
                                    <span style={{ color: 'rgb(43, 216, 66)', fontSize: 21, }}>●</span>
                                  </div>
                                ) : (
                                  <div style={{ position: 'absolute', top: '-10px', right: '-5px' }}>
                                    <span style={{ color: 'gray', fontSize: 1 }}>●</span>
                                  </div>
                                )}
                              </div>


                              {/* {console.log(`User ${userItem._id} online status:`, onlineUsers.includes(normalizeUserId(userItem._id)), 'Online users:', onlineUsers)} */}
                              {/* {console.log(`User ID type:`, typeof userItem._id, 'Online users types:', onlineUsers.map(id => typeof id))} */}

                            </div>
                          </>
                        )}

                        {/* name and message */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>
                              {(userItem.firstName || userItem.email || 'User')} {userItem.lastName || ''}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '150px'
                          }}>
                            {getLastMessage(userItem._id)}
                          </span>
                        </div>

                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span style={{
                          fontSize: '10px',
                          color: '#999',
                          whiteSpace: 'nowrap'
                        }}>
                          {getLastMessageTime(userItem._id)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {getLastMessageStatus(userItem._id) && (
                            <span style={{
                              fontSize: '10px',
                              color: getLastMessageStatus(userItem._id) === '✓✓' ? 'rgb(43, 216, 66)' : '#999'
                            }}>
                              {getLastMessageStatus(userItem._id)}
                            </span>
                          )}
                          {(() => {
                            const count = unreadCounts[userItem._id] || 0;
                            // console.log(`Badge check for user ${userItem._id} (${userItem.firstName}): count=${count}, show=${count > 0}`);
                            return count > 0 ? (
                              <span style={{
                                backgroundColor: 'orange',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                minWidth: '20px'
                              }}>
                                {count}
                              </span>
                            ) : null;
                          })()}
                        </div>
                      </div>

                    </li>
                  ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  {searchQuery ? 'No users found matching your search' : 'No chat history yet. Start a conversation to see users here.'}
                </div>
              )}
            </ul>
          </div>

          {/* Right panel: Chat area */}
          <div style={{
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 140px)',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E6E6E6',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>

            {selectedUser ? (
              <>
                {/* friend header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgb(231, 230, 230)', padding: '10px 15px' }}>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                    {selectedUser.profileImage ? (
                      <>
                        <div style={{
                          borderRadius: '50%',
                          color: 'white',
                        }}>
                          <img
                            src={selectedUser.profileImage}
                            alt={selectedUser.firstName}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #ddd'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <>

                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#007AFF',
                            color: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: '2px solid #ddd',
                            display: 'flex'
                          }}
                        >

                          {(selectedUser.firstName || selectedUser.email || 'U').slice(0, 2).toUpperCase()}

                        </div>

                      </>
                    )}



                    <div>
                      <span><b>{selectedUser.firstName} {selectedUser.lastName}</b></span>

                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        {onlineUsers.includes(normalizeUserId(selectedUser._id)) && (
                          <span style={{ color: 'rgb(43, 216, 66)', fontSize: 15 }}>●</span>
                        )}
                        <span style={{ color: 'rgb(182, 180, 180)' }}>{onlineUsers.includes(normalizeUserId(selectedUser._id)) ? 'online' : 'offline'}</span>
                      </div>
                    </div>
                  </div>

                  {isSelectionMode ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        {selectedMessages.size} selected
                      </span>
                      <button
                        onClick={handleDeleteSelectedMessages}
                        disabled={selectedMessages.size === 0}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: selectedMessages.size === 0 ? '#ccc' : '#ff4757',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: selectedMessages.size === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete ({selectedMessages.size})
                      </button>
                      <button
                        onClick={() => {
                          setIsSelectionMode(false);
                          setSelectedMessages(new Set());
                        }}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ color: "grey", position: "relative", marginTop: '8px', marginRight: '10px' }}>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '20px' }}>
                          {/* <span><CiSearch /></span> */}
                          <span onClick={() => setClickDropdown(!clickDropdown)} style={{ transform: 'rotate(90deg)', cursor: 'pointer' }}>
                            <HiOutlineDotsVertical className="threedot-setting" />
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {clickDropdown && (
                    <div
                      className="settings-dropdown-container"
                      style={{
                        position: "absolute",
                        top: "50px",
                        right: "100px",
                        zIndex: "100",
                      }}
                    >
                      <div>
                        <div
                          className="setting-notification-container"
                          style={{
                            backgroundColor: "white",
                            width: "200px",
                            height: "auto",
                            border: "1px solid #dfd8d8",
                            padding: "10px 15px",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: '10px'
                          }}
                        >
                          {/* <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <IoVolumeMuteOutline style={{ color: "#4a4848" }} />
                            <span style={{ color: "#4a4848" }}>Mute Notification</span>
                          </div>
                          <br />
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <GoClock style={{ color: "#4a4848" }} />
                            <span style={{ color: "#4a4848" }}>Disappearing</span>
                          </div>
                          <br /> */}
                          <div
                            style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }}
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to clear all messages in this conversation?')) {
                                try {
                                  const token = localStorage.getItem('token');
                                  await fetch(`${BASE_URL}/api/messages/clear`, {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                      from: currentUserId,
                                      to: selectedUser._id
                                    }),
                                  });

                                  // Clear messages from local state
                                  setMessages(prev => ({
                                    ...prev,
                                    [selectedUser._id]: []
                                  }));

                                  // Emit socket event for real-time chat clear
                                  socket.current.emit('clear-chat', {
                                    from: currentUserId,
                                    to: selectedUser._id
                                  });

                                  // Close the dropdown
                                  setClickDropdown(false);
                                } catch (error) {
                                  console.error('Error clearing messages:', error);
                                  alert('Failed to clear messages. Please try again.');
                                }
                              }
                            }}
                          >
                            <TbClearAll style={{ color: "#4a4848" }} />
                            <span style={{ color: "#4a4848" }}>Clear Message</span>
                          </div>
                          <br />
                          <div
                            style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }}
                            onClick={() => {
                              setIsSelectionMode(true);
                              setSelectedMessages(new Set());
                              setClickDropdown(false);
                            }}
                          >
                            <RiDeleteBinLine style={{ color: "#4a4848" }} />
                            <span style={{ color: "#4a4848" }}>Delete Chat</span>
                          </div>
                          {/* <br />
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <MdBlockFlipped style={{ color: "#4a4848" }} />
                            <span style={{ color: "#4a4848" }}>Block</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* message box */}
                <div
                  ref={messageContainerRef}
                  style={{
                    height: 'calc(100vh - 200px)',
                    marginTop: 12,
                    marginBottom: 12,
                    padding: '32px',
                    minHeight: '300px',
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                  }}
                  onClick={() => setContextMenu(null)}
                >
                  {(messages[selectedUser._id] || []).map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: normalizeUserId(msg.from) === normalizedCurrentUserId ? 'flex-end' : 'flex-start',
                        position: 'relative',
                        width: '100%'
                      }}
                      onClick={() => handleMessageSelection(idx)}
                    >
                      {/* Checkbox for selection mode */}
                      {isSelectionMode && normalizeUserId(msg.from) === normalizedCurrentUserId && (
                        <input
                          type="checkbox"
                          checked={selectedMessages.has(idx)}
                          onChange={() => handleMessageSelection(idx)}
                          style={{ position: 'absolute', top: 0, right: -30, zIndex: 2 }}
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                      {/* Reply preview above message row */}
                      {msg.replyTo && (
                        <div style={{
                          background: '#f1f1f1',
                          borderLeft: '3px solid #007AFF',
                          padding: '6px 10px',
                          marginBottom: 4,
                          borderRadius: 6,
                          maxWidth: 260,
                          fontSize: 12,
                          color: '#555',
                          textAlign: 'left',
                          alignSelf: normalizeUserId(msg.from) === normalizedCurrentUserId ? 'flex-end' : 'flex-start',
                          marginRight: normalizeUserId(msg.from) === normalizedCurrentUserId ? 0 : undefined,
                          marginLeft: normalizeUserId(msg.from) !== normalizedCurrentUserId ? 0 : undefined
                        }}>
                          <span style={{ fontWeight: 500, color: '#007AFF' }}>
                            {msg.replyTo.username ? msg.replyTo.username : (msg.replyTo.from === currentUserId ? 'You' : 'Friend')}
                          </span>
                          <br />
                          <span style={{ color: '#333' }}>{msg.replyTo.message}</span>
                        </div>
                      )}
                      {/* Message row: avatar + message bubble + menu */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: normalizeUserId(msg.from) === normalizedCurrentUserId ? 'row-reverse' : 'row',
                          alignItems: 'flex-end',
                          gap: '8px',
                          width: '100%'
                        }}
                      >

                        {/* Profile Picture */}
                        {/* <div style={{ flexShrink: 0 }}>
                      {normalizeUserId(msg.from) === normalizedCurrentUserId ? (
                        // Current user's profile picture
                        user?.profileImage ? (
                          <img 
                            src={Array.isArray(user.profileImage) && user.profileImage.length > 0 ? 
                              user.profileImage[0].url : 
                              (typeof user.profileImage === 'string' ? user.profileImage : 
                               (user.profileImage.url || user.profileImage))} 
                            alt={user?.firstName}
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              objectFit: 'cover',
                              border: '2px solid #ddd'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              // e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              backgroundColor: '#007bff',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              border: '2px solid #ddd'
                            }}
                          >
                            {user?.firstName?.slice(0, 2).toUpperCase() || 'U'}
                          </div>
                        )
                      ) : (
                        // Other user's profile picture
                        selectedUser?.profileImage ? (
                          <img 
                            src={selectedUser.profileImage} 
                            alt={selectedUser?.firstName}
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              objectFit: 'cover',
                              border: '2px solid #ddd'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              // e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              backgroundColor: '#007AFF',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              border: '2px solid #ddd'
                            }}
                          >
                            {selectedUser?.firstName?.slice(0, 2).toUpperCase()}
                          </div>
                        )
                      } */}

                        {/* Message Content */}
                        <div style={{
                          display: 'flex', flexDirection: 'column', alignItems: normalizeUserId(msg.from) === normalizedCurrentUserId ? 'flex-end' : 'flex-start', maxWidth: '70%',
                          background: normalizeUserId(msg.from) === normalizedCurrentUserId ? '#EBF7FF' : '#F9F9F9',
                          border: normalizeUserId(msg.from) === normalizedCurrentUserId ? '1px solid #BBE1FF' : '1px solid #E6E6E6',
                          padding: '6px 12px',
                          borderTopLeftRadius: normalizeUserId(msg.from) === normalizedCurrentUserId ? '12px' : '0px',
                          borderTopRightRadius: normalizeUserId(msg.from) === normalizedCurrentUserId ? '0px' : '12px',
                          borderBottomLeftRadius: '12px 12px',
                          borderBottomRightRadius: '12px 12px',
                          wordWrap: 'break-word',
                        }}>
                          <div
                            style={{
                              display: 'inline-block',
                              margin: '2px 0',
                              cursor: msg.fileUrl ? 'pointer' : 'default'
                            }}
                            onClick={msg.fileUrl ? () => window.open(msg.fileUrl, '_blank') : undefined}
                          >
                            {msg.message}
                            {msg.fileUrl && (
                              <div style={{ marginTop: '8px' }}>
                                {msg.fileType?.startsWith('image/') && (
                                  <img
                                    src={msg.fileUrl}
                                    alt={msg.fileName || 'Image'}
                                    style={{
                                      maxWidth: '200px',
                                      maxHeight: '200px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(msg.fileUrl, '_blank');
                                    }}
                                  />
                                )}
                                {msg.fileType?.startsWith('video/') && (
                                  <video
                                    src={msg.fileUrl}
                                    controls
                                    style={{
                                      maxWidth: '200px',
                                      maxHeight: '200px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(msg.fileUrl, '_blank');
                                    }}
                                  />
                                )}
                                {msg.fileType === 'application/pdf' && (
                                  <div
                                    style={{
                                      padding: '8px',
                                      backgroundColor: '#f0f0f0',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                    onClick={(e) => {

                                      e.stopPropagation();
                                      window.open(msg.fileUrl, '_blank');
                                    }}
                                  >
                                    <span role="img" aria-label="PDF">📄</span> {msg.fileName || 'PDF File'}
                                  </div>
                                )}
                                {/* For other file types, show a generic link */}
                                {!msg.fileType?.startsWith('image/') && !msg.fileType?.startsWith('video/') && msg.fileType !== 'application/pdf' && (
                                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', textDecoration: 'underline' }}>
                                    {msg.fileName || 'Download file'}
                                  </a>
                                )}
                              </div>
                            )}

                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <span style={{ fontSize: '10px', color: '#666' }}>
                              {msg.timestamp ? formatTime(msg.timestamp) : ''}
                            </span>
                            {normalizeUserId(msg.from) === normalizedCurrentUserId && (
                              <span style={{ fontSize: 10, color: msg.read ? 'rgb(43, 216, 66)' : '#999' }}>
                                {msg.read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>

                        </div>
                        {/* Show three-dots icon for all messages (not in selection mode) */}
                        {!isSelectionMode && (
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: 0,
                              right: normalizeUserId(msg.from) === normalizedCurrentUserId ? '-30px' : 'auto',
                              left: normalizeUserId(msg.from) !== normalizedCurrentUserId ? '-30px' : 'auto',
                              zIndex: 10,
                              padding: 2
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              // Menu size (should match the rendered menu)
                              const menuWidth = 70;
                              const menuHeight = 40;
                              let x = e.clientX;
                              let y = e.clientY;
                              // For your own messages, if menu would overflow right, show to the left
                              if (normalizeUserId(msg.from) === normalizedCurrentUserId) {
                                // Find the chat area right edge
                                const chatArea = e.target.closest('[style*="background-color:white"][style*="border-radius:10px"]');
                                const chatAreaRect = chatArea ? chatArea.getBoundingClientRect() : null;
                                const chatAreaRight = chatAreaRect ? chatAreaRect.right : window.innerWidth;
                                if (x + menuWidth > chatAreaRight) {
                                  x = x - menuWidth;
                                }
                              } else {
                                if (x + menuWidth > window.innerWidth) {
                                  x = window.innerWidth - menuWidth - 8;
                                }
                              }
                              if (y + menuHeight > window.innerHeight) {
                                y = window.innerHeight - menuHeight - 8;
                              }
                              setContextMenu({ idx, x, y });
                            }}
                            title="Message options"
                          >
                            <HiOutlineDotsVertical style={{ fontSize: 18, color: '#888' }} />
                          </button>
                        )}
                        {/* Context menu for message */}
                        {contextMenu && contextMenu.idx === idx && (
                          <div
                            style={{
                              position: 'fixed',
                              top: contextMenu.y,
                              left: contextMenu.x,
                              background: 'white',
                              border: '1px solid #ccc',
                              borderRadius: 6,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              zIndex: 2000,
                              minWidth: 70,
                              minHeight: 40,
                              width: 70
                            }}
                          >
                            {normalizeUserId(msg.from) === normalizedCurrentUserId ? (
                              <div
                                style={{ padding: '8px', cursor: 'pointer', textAlign: 'left' }}
                                onClick={() => handleDeleteSingleMessage(idx)}
                              >
                                Delete
                              </div>
                            ) : (
                              <div
                                style={{ padding: '8px', cursor: 'pointer', textAlign: 'left' }}
                                onClick={() => handleReplyToMessage({
                                  ...msg,
                                  username: selectedUser && selectedUser._id === msg.from ? selectedUser.firstName : undefined
                                })}
                              >
                                Reply
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* text message box */}
                <div style={{ padding: '8px 16px', borderTop: '1px solid rgb(231, 230, 230)', backgroundColor: 'white' }}>

                  {/* Reply preview */}
                  {replyTo && (
                    <div style={{
                      background: '#f1f1f1',
                      borderLeft: '4px solid #007AFF',
                      padding: '8px 12px',
                      marginBottom: 6,
                      borderRadius: 6,
                      maxWidth: 400
                    }}>
                      <span style={{ fontWeight: 'bold', color: '#007AFF' }}>Replying to:</span>
                      <br />
                      <span style={{ color: '#333' }}>{replyTo.message}</span>
                      <button
                        style={{ marginLeft: 10, background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                        onClick={() => setReplyTo(null)}
                      >✕</button>
                    </div>
                  )}
                  <form onSubmit={handleSend} style={{
                    display: 'flex',
                    marginTop: 'auto',
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: 'white',
                    padding: '5px 15px',
                    alignItems: 'center',
                    border: '1px solid rgb(212, 212, 212)',
                    borderRadius: '10px',
                    gap: '12px'
                  }}>

                    {/* <LuMic /> */}

                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      style={{ flex: 1, padding: 8, border: 'none', outline: 'none', backgroundColor: 'white' }}
                    />

                    <GrEmoji
                      style={{ fontSize: "20px", cursor: "pointer", color: 'gray' }}
                      onClick={toggleEmojiPicker}
                    />
                    {showEmojiPicker && (
                      <div
                        className="emoji-picker-container"
                        style={{
                          position: "absolute",
                          bottom: "70px",
                          right: "5px",
                          zIndex: "1000"
                        }}
                      >
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}


                    <span
                      onClick={() => setClickDropdownTwo(!clickDropdowntwo)}
                      style={{ color: "grey", position: "relative" }}
                    >
                      <HiOutlineDotsVertical style={{ fontSize: "25px", color: 'gray' }} />
                    </span>
                    {clickDropdowntwo && (
                      <div
                        className="file-dropdown-container"
                        style={{
                          position: "absolute",
                          top: "-50px", //178
                          right: "130px",
                          zIndex: "100",
                        }}
                      >

                        {/* files options */}
                        <div>
                          <div
                            className="send-file-container"
                            style={{
                              backgroundColor: "white",
                              width: "150px",
                              height: "auto",
                              border: "1px solid #dfd8d8",
                              padding: "10px 15px",
                              display: "flex",
                              flexDirection: "column",
                              borderRadius: '10px'
                            }}
                          >
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <label htmlFor="file-upload2" className="custom-file-upload2" style={{ color: "gray" }}>
                                <CiCamera />
                                <span>Camera</span>
                              </label>
                              <input
                                id="file-upload2"
                                type="file"
                                accept="image/*"
                                capture="environment"
                                style={{ color: "#4a4848" }}
                                onChange={handleFileSelect}
                              />
                            </div>
                            <br />
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <label for="file-upload3" className="custom-file-upload3" style={{ color: "gray" }}><GrGallery /> Gallery</label>
                              <input id="file-upload3" type="file" accept=".jpg,.jpeg,.pdf" style={{ color: "#4a4848" }}
                                onChange={handleFileSelect} />
                            </div>
                            {/* <br />
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "gray" }}>
                              <MdOutlineAudiotrack />
                              <span>Audio</span>
                            </div>
                            <br />
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", color: 'gray' }}>
                              <VscLocation />
                              <span>Location</span>
                            </div>
                            <br />
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", color: 'gray' }}>
                              <RiUserFollowLine />
                              <span>Contact</span>
                            </div> */}

                          </div>
                        </div>
                      </div>
                    )}

                    {/* send files */}
                    <label
                      htmlFor="file-upload1"
                      className="custom-file-upload1"
                      style={{ cursor: "pointer" }}
                    >
                      <TbFolderUp style={{ fontSize: "25px", color: 'gray' }} />
                    </label>
                    <input
                      id="file-upload1"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.wmv,.pdf"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />

                    {/* File preview and upload button */}
                    {selectedFiles.length > 0 && (
                      <div style={{
                        position: "absolute",
                        bottom: "60px",
                        left: "10px",
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "12px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        zIndex: "1000",
                        minWidth: "250px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "bold" }}>📎 {selectedFiles.length} files selected</span>
                          <button
                            onClick={() => setSelectedFiles([])}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                              color: "#666"
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                          Total Size: {formatFileSize(selectedFiles.reduce((sum, file) => sum + file.size, 0))}
                        </div>
                        {selectedFiles.map((file, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>{file.name}</span>
                            <button
                              onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                color: "#666"
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button
                            onClick={handleFileUpload}
                            disabled={isUploading}
                            style={{
                              flex: 1,
                              padding: "8px",
                              backgroundColor: isUploading ? "#ccc" : "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: isUploading ? "not-allowed" : "pointer"
                            }}
                          >
                            {isUploading ? "Uploading..." : "Send Files"}
                          </button>
                        </div>
                      </div>
                    )}

                    <button type="submit" style={{ border: 'none', backgroundColor: '#007AFF', color: 'white', display: 'flex', justifyContent: 'center', borderRadius: '8px', padding: '8px 10px' }}>
                      <LuSend />
                    </button>
                  </form>
                </div>

              </>
            ) : (
              <div style={{ padding: 60, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                <div style={{ marginTop: '150px', textAlign: 'center' }}>
                  <img src={ChatIcon} style={{ width: '172px', marginBottom: '50px' }} />
                  <h2 style={{ margin: 0, color: '#495057' }}>Welcome, {user?.firstName || 'User'} !</h2>

                  Select a user to start chatting.

                  <br /><br />
                  {/* 
            <button 
            onClick={handleLogout}
            style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Logout
            </button> */}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {popup.show && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{
            background: 'white',
            padding: '32px 40px',
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            fontSize: 18,
            color: '#333',
            textAlign: 'center',
            minWidth: 300
          }}>
            {popup.message}
            <br />
            <button style={{ marginTop: 20, padding: '8px 24px', borderRadius: 6, background: '#007AFF', color: 'white', border: 'none', fontSize: 16, cursor: 'pointer' }} onClick={() => setPopup({ show: false, message: '' })}>OK</button>
          </div>
        </div>
      )}

    </>
  );
};

export default Chat;
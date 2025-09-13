import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const isConnected = useRef(false);

  const connectSocket = (url) => {
    if (socket.current && socket.current.connected) {
      // console.log('🔔 Socket already connected');
      return socket.current;
    }

    // console.log('🔔 Initializing socket connection to:', url);
    
    socket.current = io(url, {
      transports: ['websocket'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false
    });

    socket.current.on('connect', () => {
      // console.log('🔔 Socket connected:', socket.current.id);
      isConnected.current = true;
    });

    socket.current.on('disconnect', (reason) => {
      // console.log('🔔 Socket disconnected:', reason);
      isConnected.current = false;
    });

    socket.current.on('connect_error', (error) => {
      console.error('🔔 Socket connection error:', error);
      isConnected.current = false;
    });

    return socket.current;
  };

  const disconnectSocket = () => {
    if (socket.current) {
      // console.log('🔔 Disconnecting socket');
      socket.current.disconnect();
      socket.current = null;
      isConnected.current = false;
    }
  };

  const getSocket = () => {
    return socket.current;
  };

  const isSocketConnected = () => {
    return isConnected.current;
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const value = {
    connectSocket,
    disconnectSocket,
    getSocket,
    isSocketConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

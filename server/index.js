
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const countryRoutes = require('./routes/countryRoutes');
const stateRoutes = require('./routes/stateRoutes');
const cityRoutes = require('./routes/cityRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const unitsRoutes = require('./routes/unitsRoutes');
const roleRoutes = require('./routes/roleRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require("path");
const moduleRoutes = require("./routes/moduleRoutes");
const couponRoutes = require('./routes/CouponsRoute');
const GiftcardRoutes = require("./routes/GiftCardRoutes");
const customerRoutes = require("./routes/customerRoutes");
// const conversations = require('./routes/message')
// const messages = require('./routes/message')
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationsRoutes');

const purchaseRoutes = require('./routes/purchaseRoutes');
const stockHistoryRoutes = require('./routes/stockHistoryRoutes');
const purchaseSettingsRoutes = require('./routes/purchaseSettingRoutes');
const hsnRoutes = require('./routes/hsnRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const VarientRoutes = require('./routes/variantRoutes');
const WarrantyRoutes = require('./routes/warrantyRoutes');
const debitNoteRoutes = require('./routes/debitNoteRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const salesRoutes = require('./routes/salesRoutes');

const notificationRoutes = require('./routes/notificationRoutes');
const userProfileRoutes = require("./routes/profileRoutes");

const emailverifyroute = require("./routes/settings/EmailVerificationroute.js");
const authrouter = require("./routes/settings/authroutes.js");
const mobileverifyrouter = require("./routes/settings/mobileverifyroute.js");
const devicemanagementrouter = require("./routes/settings/devicemanagementroute.js");
const companysettingrouter = require("./routes/settings/companysettingroute.js");
const localizationrouter = require("./routes/settings/Localizationroute.js");
const balanceSheetRoutes = require("./routes/balanceSheetRoutes.js");
const posSaleRoutes = require('./routes/posSaleRoutes.js');
const invoiceSettingsRoutes = require('./routes/invoiceSettings');
const creditNoteRoutes = require('./routes/creditNoteRoutes');

const expenseRoutes = require('./routes/expenseRoutes.js')
const GstRoutes = require("./routes/gstRoutes.js")
const stockRoutes = require('./routes/stockRoutes');



const http = require('http');
const emailrouter = require('./routes/emailroutes.js');
const { Server } = require('socket.io');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// const corsOptions = {
//   origin: "http://localhost:3000","http://localhost:3001",
//   methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
//   credentials: true,
// };
const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
};


app.use(express.urlencoded({ extended: true }));

// File uploads path (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use(cors(corsOptions));

// Routes
app.use("/api/gst", GstRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/city", cityRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/unit", unitsRoutes);
app.use("/api/modules", moduleRoutes);
app.use('/api/coupons', couponRoutes);
app.use("/api/giftcard", GiftcardRoutes);
app.use("/api/customers", customerRoutes);
app.use('/api/suppliers', supplierRoutes);
// app.use("/api/conversations", conversations);
// app.use("/api/messages", messages);
app.use('/api/messages', messageRoutes);          // ✅ Correct
app.use('/api/conversations', conversationRoutes); // ✅ Correct
app.use("/api/notifications", notificationRoutes);

app.use("/api/purchases", purchaseRoutes);
app.use("/api/stock-history", stockHistoryRoutes);
app.use("/api/settings", purchaseSettingsRoutes);
app.use('/api/hsn', hsnRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/variant-attributes", VarientRoutes);
app.use("/api/warranty", WarrantyRoutes);
app.use('/api/debit-notes', debitNoteRoutes);
app.use("/api/profile", userProfileRoutes);

app.use('/api/invoice', invoiceRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/pos-sales', posSaleRoutes);

// api for mail 
app.use("/api/email/mail", emailrouter)
// email verify via otp api security
app.use("/api/email", emailverifyroute);
// google auth api
app.use("/api/auth", authrouter);
// mobile verify via sms
app.use("/api/mobile", mobileverifyrouter);
// device management api
app.use("/api/devices", devicemanagementrouter);
app.use('/uploads', express.static('uploads'));
// company setting
// register companyprofile api
app.use("/api/companyprofile", companysettingrouter);
// Localization api
app.use("/api/localizationsetting", localizationrouter);
// cloudnary configuration
app.use("/api/cloudinary-signature", require("./routes/file"));
//balancesheet api
app.use("/api/balancesheet", balanceSheetRoutes);

app.use('/api/invoice-settings', invoiceSettingsRoutes);

//expenseReport api
app.use("/api/expenses", expenseRoutes);
app.use('/api/credit-notes', creditNoteRoutes);
app.use('/api/stock', stockRoutes);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/category", express.static(path.join(__dirname, "category")));



// Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend origin
    methods: ["GET", "POST"]
  }
});

// Online users map (you can replace this with DB or Redis later)
const onlineUsers = new Map();
io.on("connection", (socket) => {
  // console.log("🟢 Socket connected:", socket.id);

  socket.on("add-user", (userId) => {
    // console.log("👤 User added to online list:", userId, "Type:", typeof userId);
    onlineUsers.set(userId, socket.id);
    // console.log("👤 Current online users:", Array.from(onlineUsers.keys()));
    // Emit the updated online users list to all connected clients
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
      // Emit notification to the recipient
      socket.to(sendUserSocket).emit("new-notification", {
        type: 'message',
        sender: data.from,
        message: data.message,
        timestamp: new Date()
      });
    }
  });

  socket.on("delete-msg", (data) => {
    const recipientSocket = onlineUsers.get(data.to);
    if (recipientSocket) {
      socket.to(recipientSocket).emit("delete-msg", {
        from: data.from,
        messageTimestamp: data.messageTimestamp
      });
    }
  });

  socket.on("message-read", (data) => {
    const senderSocket = onlineUsers.get(data.from);
    if (senderSocket) {
      socket.to(senderSocket).emit("msg-read", {
        from: data.to,
        to: data.from
      });
    }
  });

  socket.on("disconnect", () => {
    // console.log("🔴 Socket disconnected:", socket.id);
    let disconnectedUserId = null;
    [...onlineUsers.entries()].forEach(([uid, sid]) => {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        disconnectedUserId = uid;
      }
    });
    // Emit the updated online users list to all connected clients
    if (disconnectedUserId) {
      // console.log("👤 User removed from online list:", disconnectedUserId);
      // console.log("👤 Remaining online users:", Array.from(onlineUsers.keys()));
      io.emit("online-users", Array.from(onlineUsers.keys()));
    }
  });
});


// Start server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running with Socket.IO on port ${PORT}`));
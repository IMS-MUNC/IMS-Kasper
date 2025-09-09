import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "brand"
  actions: [
    {
      type: String,
      enum: ["create", "read", "update", "delete", "all"],
    },
  ],
});

export default mongoose.model("Permission", permissionSchema);

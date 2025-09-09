const mongoose = require('mongoose');

// ✅ Now includes import/export
const permissionSchema = new mongoose.Schema({
  read: { type: Boolean, default: false },
  write: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  import: { type: Boolean, default: false },
  export: { type: Boolean, default: false },
  all: { type: Boolean, default: false }
}, { _id: false });

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  modulePermissions: {
    type: Map,
    of: permissionSchema,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);

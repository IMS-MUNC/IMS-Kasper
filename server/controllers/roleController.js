const Role = require('../models/roleModels');

// Create role
exports.createRole = async (req, res) => {
  try {
    const { roleName, status, modulePermissions } = req.body;

    const existingRole = await Role.findOne({ roleName });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const newRole = new Role({ roleName, status, modulePermissions });
    await newRole.save();

    res.status(201).json({ message: 'Role created', role: newRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error });
  }
};

// Get role by ID


exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get only active roles
exports.getActiveRoles = async (req, res) => {
  try {
    const activeRoles = await Role.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.status(200).json(activeRoles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active roles', error });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { roleName, status, modulePermissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { roleName, status, modulePermissions },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Assign permissions separately (optional)
// This is a duplicate - remove this:
exports.assignPermissions = async (req, res) => {
  const { roleId, permissions } = req.body;
  try {
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    role.modulePermissions = permissions;
    await role.save();

    res.status(200).json({ message: 'Permissions updated successfully', role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error });
  }
};

// POST /api/roles/assign-permissions
exports.assignPermissions = async (req, res) => {
  const { roleId, permissions } = req.body;
  try {
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    role.modulePermissions = permissions;
    await role.save();

    res.status(200).json({ message: 'Permissions updated successfully', role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
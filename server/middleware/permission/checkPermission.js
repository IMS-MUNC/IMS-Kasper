exports.checkPermission = (module, action) => {
  return (req, res, next) => {
    try {
      const role = req.user?.role;
      if (!role || !role.modulePermissions) {
        return res.status(403).json({ message: "Access denied: No role permissions found" });
      }

      const perms = role.modulePermissions[module];
      if (!perms) {
        return res.status(403).json({ message: `Access denied: No permission for '${module}'` });
      }

      const allowed = perms.all || perms[action.toLowerCase()];
      if (!allowed) {
        return res.status(403).json({
          message: `Access denied: '${action}' not allowed for '${module}'`,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({ message: "Permission middleware error" });
    }
  };
};

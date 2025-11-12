// exports.checkPermission = (module, action) => {
//   return (req, res, next) => {
//     try {
//       const role = req.user?.role;
//       if (!role || !role.modulePermissions) {
//         return res.status(403).json({ message: "Access denied: No role permissions found" });
//       }

//       // const perms = role.modulePermissions[module];
//       let perms;

// if (role.modulePermissions instanceof Map) {
//   perms = role.modulePermissions.get(module) || role.modulePermissions.get(module.toLowerCase());
// } else {
//   perms = role.modulePermissions[module] || role.modulePermissions[module.toLowerCase()];
// }

//       if (!perms) {
//         return res.status(403).json({ message: `Access denied: No permission for '${module}'` });
//       }
//       // fix: handle both map and object for `perms`
//       const hasAll = perms.all || (typeof perms.get === "function" && perms.get("all"));
//       const hasAction = perms[action.toLowerCase()] || (typeof perms.get === "function" && perms.get(action.toLowerCase()));

//       const allowed = hasAll || hasAction;
//       // const allowed = perms.all || perms[action.toLowerCase()];
//       if (!allowed) {
//         return res.status(403).json({
//           message: `Access denied: '${action}' not allowed for '${module}'`,
//         });
//       }
//       console.log(`✅ Allowed → ${module} ${action}`);
//       next();
//     } catch (error) {
//       console.error("Permission check error:", error);
//       return res.status(500).json({ message: "Permission middleware error" });
//     }
//   };
// };


exports.checkPermission = (module, action) => {
  return (req, res, next) => {
    try {
      const role = req.user?.role;
      if (!role || !role.modulePermissions) {
        return res.status(403).json({ message: "Access denied: No role permissions found" });
      }

      // Normalize module name
      const moduleKey = Object.keys(role.modulePermissions).find(
        (key) => key.toLowerCase() === module.toLowerCase()
      );

      if (!moduleKey) {
        return res.status(403).json({ message: `Access denied: No permission for '${module}'` });
      }

      const perms = role.modulePermissions[moduleKey];

      // Handle both object and Map
      const getPerm = (obj, key) => {
        if (!obj) return false;
        if (typeof obj.get === "function") return obj.get(key);
        return obj[key];
      };

      const hasAll = getPerm(perms, "all");
      const hasAction = getPerm(perms, action.toLowerCase());

      if (!hasAll && !hasAction) {
        return res.status(403).json({
          message: `Access denied: '${action}' not allowed for '${module}'`,
        });
      }

      // console.log(`Allowed → ${moduleKey} ${action}`);
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({ message: "Permission middleware error" });
    }
  };
};
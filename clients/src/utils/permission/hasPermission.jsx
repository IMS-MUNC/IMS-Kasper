// // export const hasPermission = (module, action) => {
// //     const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
// //     const mod = perms.find(p => p.module === module);
// //     return mod?.actions.includes(action) || mod?.actions.includes("all");
// //   };
// export const hasPermission = (module, action) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user || !user.role || !user.role.permissions) return false;

//   // Use exact casing for module and action as stored
//   const modulePermissions = user.role.permissions[module];
//   if (!modulePermissions) return false;

//   return modulePermissions.includes(action) || modulePermissions.includes("Allow All");
// };


// // export const hasPermission = (module, action) => {
// //   const user = JSON.parse(localStorage.getItem("user"));
// //   if (!user || !user.role || !user.role.permissions) return false;



// //   const modulePermissions = user.role.permissions[module];
// //   if (!modulePermissions) return false;

// //   return modulePermissions.includes(action) || modulePermissions.includes("Allow All");
// // };

  
// utils/permission/hasPermission.jsx
export const hasPermission = (module, action) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const modulePermissions = user?.role?.modulePermissions || {};

    // Case-insensitive module lookup
    const moduleKey = Object.keys(modulePermissions).find(
      (key) => key.toLowerCase() === module.toLowerCase()
    );

    if (!moduleKey) return false;

    const perms = modulePermissions[moduleKey];

    // Check 'all' or specific action
    const allowed = perms.all || perms[action.toLowerCase()];

    return Boolean(allowed);
  } catch (error) {
    console.error("hasPermission error:", error);
    return false;
  }
};
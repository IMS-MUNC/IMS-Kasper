

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/config";

// Define modules and permissions (matches backend modules)
const modules = [
  "Employee",
  "Holidays",
  "Leaves",
  "Events",
  "Sales",
  "Training",
  "Reports",
  "Tickets",
  "Payroll",
  "Brand",
  "Category",
  "Role",
  // add more modules as needed
];

// Define permissions as per your backend schema
const permissionsList = [
  "Allow All",
  "Read",
  "Write",
  "Create",
  "Delete",
  "Import",
  "Export",
];

const Permission = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({}); 
  // rolePermissions = { Category: ["Read", "Write"], Role: ["Allow All"], ... }
const token = localStorage.getItem("token");
  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) fetchRolePermissions(selectedRole);
    else setRolePermissions({});
  }, [selectedRole]);

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/role/getRole`,{
         headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles", err);
    }
  };

  // Fetch permissions for selected role and convert array to object for UI
  const fetchRolePermissions = async (roleId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/role/roleById${roleId}`,{
         headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const perms = res.data.modulePermissions || [];
      // Convert array of {module, permissions} to object { module: [permissions] }
      const permsObj = {};
      perms.forEach(({ module, permissions }) => {
        permsObj[module] = permissions;
      });
      setRolePermissions(permsObj);
    } catch (err) {
      console.error("Error fetching role permissions", err);
      setRolePermissions({});
    }
  };

  // Handle toggling permission for a module
  const handlePermissionChange = (module, permission) => {
    setRolePermissions((prev) => {
      const currentPerms = prev[module] || [];

      // If 'Allow All' is toggled ON, select all permissions for the module
      if (permission === "Allow All") {
        if (currentPerms.includes("Allow All")) {
          // Deselect all permissions for that module
          const updated = [];
          return { ...prev, [module]: updated };
        } else {
          // Select all permissions for that module
          return { ...prev, [module]: [...permissionsList] };
        }
      }

      // If any other permission is toggled
      let updatedPermissions;
      if (currentPerms.includes(permission)) {
        // Remove permission
        updatedPermissions = currentPerms.filter((p) => p !== permission);
      } else {
        // Add permission
        updatedPermissions = [...currentPerms, permission];
      }

      // If not all permissions are selected, remove 'Allow All'
      if (
        updatedPermissions.length !== permissionsList.length &&
        updatedPermissions.includes("Allow All")
      ) {
        updatedPermissions = updatedPermissions.filter((p) => p !== "Allow All");
      }

      // If all except 'Allow All' are selected, add 'Allow All'
      const allExceptAllowAll = permissionsList.filter((p) => p !== "Allow All");
      const hasAllExceptAllowAll = allExceptAllowAll.every((p) =>
        updatedPermissions.includes(p)
      );
      if (hasAllExceptAllowAll && !updatedPermissions.includes("Allow All")) {
        updatedPermissions.push("Allow All");
      }

      return { ...prev, [module]: updatedPermissions };
    });
  };

  // Submit updated permissions to backend
  const handleSubmit = async () => {
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    // Convert from { module: [permissions] } to array of objects
    const payload = Object.entries(rolePermissions).map(([module, perms]) => ({
      module,
      permissions: perms,
    }));

    try {
      await axios.put(`${BASE_URL}/api/role/update/${selectedRole}`, {
        permissions: payload,
         headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Permissions updated successfully.");
    } catch (err) {
      console.error("Error updating permissions", err);
      alert("Failed to update permissions.");
    }
  };

  return (
    <div className="content p-3">
      {/* Role Selector */}
      <div className="mb-4">
        <label htmlFor="role-select" className="form-label">
          Select Role:
        </label>
        <select
          id="role-select"
          className="form-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>

      {/* Permissions Table */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Module</th>
            {permissionsList.map((perm) => (
              <th key={perm} className="text-center">
                {perm}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module}>
              <td>{module}</td>
              {permissionsList.map((perm) => (
                <td key={perm} className="text-center">
                  <input
                    type="checkbox"
                    checked={(rolePermissions[module] || []).includes(perm)}
                    onChange={() => handlePermissionChange(module, perm)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-primary mt-3"
        onClick={handleSubmit}
        disabled={!selectedRole}
      >
        Save Permissions
      </button>
    </div>
  );
};

export default Permission;


// // Add to top of Permission.jsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../config/config';

// const modules = ['Employee', 'Holidays', 'Leaves', 'Events', 'Sales', 'Training', 'Reports', 'Tickets', 'Payroll', 'Brand'];
// const permissions = ['Allow All', 'Read', 'Write', 'Create', 'Delete', 'Import', 'Export'];

// const Permission = () => {
//   const [selectedRole, setSelectedRole] = useState('');
//   const [roles, setRoles] = useState([]);
//   const [rolePermissions, setRolePermissions] = useState({}); // e.g. { Brand: ['Read', 'Create'] }

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//     const fetchRoles = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/role/getRole`);
//         setRoles(res.data);
//       } catch (err) {
//         console.error("Error fetching roles", err);
//       }
//     };

//   const handlePermissionChange = (module, permission) => {
//     setRolePermissions(prev => {
//       const existing = prev[module] || [];
//       const updated = existing.includes(permission)
//         ? existing.filter(p => p !== permission)
//         : [...existing, permission];
//       return { ...prev, [module]: updated };
//     });
//   };

//   const handleSubmit = async () => {
//     await axios.put(`${BASE_URL}/api/role/update/${selectedRole}`, {
//       permissions: Object.entries(rolePermissions).map(([module, permissions]) => ({
//         module,
//         permissions,
//       })),
//     });
//     alert('Permissions updated');
//   };

//   return (
//     <div className="content">
//       {/* Role Selector */}
//       <div className="mb-4">
//         <label>Role:</label>
//         <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//           <option value="">Select Role</option>
//           {roles.map(role => (
//             <option key={role._id} value={role._id}>{role.roleName}</option>
//           ))}
//         </select>
//       </div>

//       {/* Permission Table */}
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Module</th>
//             {permissions.map(p => <th key={p}>{p}</th>)}
//           </tr>
//         </thead>
//         <tbody>
//           {modules.map(module => (
//             <tr key={module}>
//               <td>{module}</td>
//               {permissions.map(p => (
//                 <td key={p}>
//                   <input
//                     type="checkbox"
//                     checked={(rolePermissions[module] || []).includes(p)}
//                     onChange={() => handlePermissionChange(module, p)}
//                   />
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button onClick={handleSubmit} className="btn btn-primary mt-3">
//         Save Permissions,,,,,,,,,,
//       </button>
//     </div>
//   );
// };

// export default Permission;


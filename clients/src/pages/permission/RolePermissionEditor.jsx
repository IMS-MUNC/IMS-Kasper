
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
import "../../styles/permissions.css"; // Ensure this includes switch styling

const modules = [
  "Dashboard",
  "Application",
  // Inventory
  "Product",
  "Category",
  "SubCategory",
  "Brand",
  "Unit",
  "HSN",
  "VariantAttributes",
  "Warranty",
  "Barcode",
  "DebitNote",
  "CreditNote",

  // Peoples
  "Customers",
  "Suppliers",
  "Warehouse",   // ✅ keep (sidebar has Warehouse submenu)
  // Removed "Billers" & "Stores" (not in sidebar)

  // Purchases
  "Purchases",
  "PurchaseOrder",
  "PurchaseReturn",

  // Stock
  "Stocks",          // ✅ sidebar groups multiple under "Stocks"
  "StockAdjustment",
  "StockTransfer",

  // Sales
  "Sales",
  "Invoices",
  "SalesReturn",
  "Quotation",
  "POS",

  // Promo
  "Coupons",
  "GiftCards",

  // Location
  "Location",       // ✅ parent in sidebar
  "Countries",
  "States",
  "Cities",

  // User Management
  "Users",
  "RolesPermissions",  // ✅ match sidebar (not just "Role")

  // Settings
  "Settings",          // ✅ generalSettings parent
  "WebsiteSettings",

  // Reports
  "Reports",          // ✅ sidebar groups reports
  "SalesReport",
  "PurchaseReport",
  // InventoryReport & EmployeeReport not in sidebar → ❌ remove unless you plan to add

  // Finance & Accounts
  "Finance",          // ✅ sidebar groups all finance items
  "BalanceSheet",
  "ProfitLoss",
  "OverdueReport",
  "ExpenseReport",
  "B2B_B2C",
  "PaymentHistory",
  "CreditDebitNote",
];

const permissionFields = ["Allow All", "Read", "Write", "Update", "Delete", "Import", "Export"];

const Permission = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
         const token = localStorage.getItem("token"); 
      const res = await axios.get(`${BASE_URL}/api/role/getRole`,{
          headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      setRoles(res.data);

      const roleName = localStorage.getItem("selectedRoleName");
      if (roleName) {
        const matched = res.data.find((role) => role.roleName === roleName);
        if (matched) {
          setSelectedRole(matched);
        }
      }
    } catch (err) {
      console.error("Error fetching roles", err);
    }
  };

  useEffect(() => {
    if (selectedRole?._id) {
      fetchRolePermissions(selectedRole._id);
    }
  }, [selectedRole]);

  const fetchRolePermissions = async (roleId) => {
    try {
      const token = localStorage.getItem("token"); 
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/role/roleById/${roleId}`,{
          headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      setRolePermissions(res.data?.modulePermissions || {});
    } catch (err) {
      console.error("Error fetching role permissions", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (module, field) => {
    setRolePermissions((prev) => {
      const current = prev[module] || {
        read: false, write: false, update: false, delete: false,
        import: false, export: false, all: false
      };

      if (field === "Allow All") {
        const toggleAll = !current.all;
        return {
          ...prev,
          [module]: {
            read: toggleAll,
            write: toggleAll,
            update: toggleAll,
            delete: toggleAll,
            import: toggleAll,
            export: toggleAll,
            all: toggleAll
          }
        };
      }

      const lowerKey = field.toLowerCase();
      const updated = { ...current, [lowerKey]: !current[lowerKey] };
      updated.all = ["read", "write", "update", "delete", "import", "export"].every(key => updated[key]);

      return { ...prev, [module]: updated };
    });
  };

  const handleSubmit = async () => {
    if (!selectedRole?._id) {
      toast.error("Please select a role.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); 
      await axios.put(`${BASE_URL}/api/role/update/${selectedRole._id}`, {
        modulePermissions: rolePermissions,
          headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      toats.success("Permissions updated successfully.");
    } catch (err) {
      console.error("Error updating permissions", err);
      tost.aler("Failed to update permissions.");
    }
  };

  return (
    <div className="container mt-4">
      <h4>Manage Permissions</h4>

      <div className="mb-4">
        <label className="form-label">Select Role:</label>
        <select
          className="form-select"
          value={selectedRole?._id || ""}
          onChange={(e) => {
            const selected = roles.find(role => role._id === e.target.value);
            setSelectedRole(selected || null);
          }}
        >
          <option value="">-- Select Role --</option>
          {roles.map(role => (
            <option key={role._id} value={role._id}>{role.roleName}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading permissions...</p>
      ) : selectedRole ? (
        <>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Module</th>
                {permissionFields.map(perm => (
                  <th key={perm} className="text-center">{perm}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map(module => {
                const perms = rolePermissions[module] || {};
                return (
                  <tr key={module}>
                    <td>{module}</td>
                    {permissionFields.map(p => {
                      const key = p === "Allow All" ? "all" : p.toLowerCase();
                      return (
                        <td key={p}>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={!!perms[key]}
                              onChange={() => handlePermissionChange(module, p)}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            {/* <tbody>
              {modules.map(module => {
                const currentPerm = rolePermissions[module] || {};
                return (
                  <tr key={module}>
                    <td>{module}</td>
                    {permissionFields.map(perm => {
                      const key = perm === "Allow All" ? "all" : perm.toLowerCase();
                      return (
                        <td key={perm} className="text-center">
                          <input
                            type="checkbox"
                            checked={!!currentPerm[key]}
                            onChange={() => handlePermissionChange(module, perm)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody> */}
          </table>

          <button className="btn btn-primary mt-3" onClick={handleSubmit}>
            Save Permissions
          </button>
        </>
      ) : (
        <p>Please select a role to edit permissions.</p>
      )}
    </div>
  );
};

export default Permission;


// mid final
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import BASE_URL from "../config/config";

// const modules = ["Brand", "Category", "Product"];

// const permissionFields = [
//   "Allow All",
//   "Read",
//   "Write",
//   "Update",
//   "Delete",
//   "Import",
//   "Export",
// ];


// const Permission = () => {
//   const [selectedRole, setSelectedRole] = useState(null); // Store full role object
//   const [roles, setRoles] = useState([]);
//   const [rolePermissions, setRolePermissions] = useState({});
//   const [loading, setLoading] = useState(false);


//   const { role_id } = useParams();

//   useEffect(() => {
//     fetchRoles();
//   }, []);



//   // Auto-select role if role_id param is present and not already selected
//   useEffect(() => {
//     if (roles.length && role_id && (!selectedRole || selectedRole._id !== role_id)) {
//       const found = roles.find(r => r._id === role_id);
//       if (found) setSelectedRole(found);
//     }
//   }, [roles, role_id, selectedRole]);

//   useEffect(() => {
//     if (selectedRole?._id) {
//       fetchRolePermissions(selectedRole._id);
//     } else {
//       setRolePermissions({});
//     }
//   }, [selectedRole]);


//   const fetchRoles = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/role/getRole`);
//       setRoles(res.data);
//     } catch (err) {
//       console.error("Error fetching roles", err);
//     }
//   };


//   const fetchRolePermissions = async (roleId) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/api/role/roleById/${roleId}`);
//       setRolePermissions(res.data?.modulePermissions || {});
//     } catch (err) {
//       console.error("Error fetching role permissions", err);
//       alert("Failed to load permissions.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handlePermissionChange = (module, field) => {
//     setRolePermissions((prev) => {
//       const current = prev[module] || {
//         read: false,
//         write: false,
//         update: false,
//         delete: false,
//         import: false,
//         export: false,
//         all: false,
//       };

//       if (field === "Allow All") {
//         const isAllEnabled = current.all;
//         const updated = {
//           read: !isAllEnabled,
//           write: !isAllEnabled,
//           update: !isAllEnabled,
//           delete: !isAllEnabled,
//           import: !isAllEnabled,
//           export: !isAllEnabled,
//           all: !isAllEnabled,
//         };
//         return { ...prev, [module]: updated };
//       }

//       const lowerKey = field.toLowerCase();
//       const updated = { ...current, [lowerKey]: !current[lowerKey] };

//       const allKeys = ["read", "write", "update", "delete", "import", "export"];
//       updated.all = allKeys.every((key) => updated[key]);

//       return { ...prev, [module]: updated };
//     });
//   };

//   const handleSubmit = async () => {
//     if (!selectedRole?._id) {
//       alert("Please select a role.");
//       return;
//     }

//     try {
//       await axios.put(`${BASE_URL}/api/role/update/${selectedRole._id}`, {
//         modulePermissions: rolePermissions,
//       });
//       alert("Permissions updated successfully.");
//     } catch (err) {
//       console.error("Error updating permissions", err);
//       alert("Failed to update permissions.");
//     }
//   };

//   return (
//     <div className="content p-3">
//       <h4 className="mb-3">Role Permission Editor</h4>

//       <div className="mb-4">
//         <label htmlFor="role-select" className="form-label">Select Role:</label>
//         <select
//           id="role-select"
//           className="form-select"
//           value={selectedRole?._id || ""}
//           onChange={(e) => {
//             const selected = roles.find((role) => role._id === e.target.value);
//             setSelectedRole(selected || null);
//           }}
//         >
//           <option value="">-- Select Role --</option>
//           {roles.map((role) => (
//             <option key={role._id} value={role._id}>
//               {role.roleName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <p>Loading permissions...</p>
//       ) : selectedRole ? (
//         <>
//           <table className="table table-bordered table-hover">
//             <thead>
//               <tr>
//                 <th>Module</th>
//                 {permissionFields.map((perm) => (
//                   <th key={perm} className="text-center">{perm}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {modules.map((module) => {
//                 const currentPerm = rolePermissions[module] || {};
//                 return (
//                   <tr key={module}>
//                     <td>{module}</td>
//                     {permissionFields.map((perm) => {
//                       const key = perm === "Allow All" ? "all" : perm.toLowerCase();
//                       return (
//                         <td key={perm} className="text-center">
//                           <input
//                             type="checkbox"
//                             checked={!!currentPerm[key]}
//                             onChange={() => handlePermissionChange(module, perm)}
//                           />
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           <button
//             className="btn btn-primary mt-3"
//             onClick={handleSubmit}
//           >
//             Save Permissions
//           </button>
//         </>
//       ) : (
//         <p className="text-muted">Please select a role to edit permissions.</p>
//       )}

//       <p className="mt-3 text-muted">
//         <strong>Selected Role:</strong> {selectedRole?.roleName || "None"}<br />
//         <strong>Role ID:</strong> {selectedRole?._id || "N/A"}
//       </p>
//     </div>
//   );
// };

// export default Permission;

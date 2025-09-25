import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
import "../../styles/permissions.css"; // Ensure this includes switch styling
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { toast } from "react-toastify";



// ✅ Keep your modules in sync with sidebar
const modules = {
  Dashboard: ["Dashboard"],
  Connect: [ "Chat", "Mail"],
  Inventory: [
    "Product",
    "Category",
    "SubCategory",
    "Brand",
    "Unit",
    "HSN",
    "VariantAttributes",
    "Warranties",
    "PrintBarcode",
  ],
  Peoples: ["Customer", "Supplier"],
   Warehouse : ["Warehouse","Stock Movement Log"],
  Purchases: ["Purchase",  "DebitNote"],
  Stocks: ["Stock", "StockAdjustment"],
  Sales: ["Sales", "Invoices", "POS", "CreditNote"],
  Promo: ["Coupons", "GiftCards"],
  Locations: [ "Country", "State", "City"],
  "User Management": ["Users", "Roles"],
  Settings: [
    "Profile Settings",
    "Security",
    "Website",
    "CompanySettings",
    "Localization",
  ],
  Reports: [ "PurchaseReport"],
  "Finance & Accounts": [
    "BalanceSheet",
    "ProfitLoss",
    "OverdueReport",
    "ExpenseReport",
    "B2B_B2C",
    "PaymentHistory",
    "CreditDebitNote",
  ],
};

const permissionFields = [
  "Read",
  "Write",
  "Update",
  "Delete",
  "Import",
  "Export",
];

// ✅ ToggleSwitch Component
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="slider"></span>
  </label>
);
const Permission = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const token = localStorage.getItem("token");

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/role/getRole`, {
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
      const res = await axios.get(`${BASE_URL}/api/role/roleById/${roleId}`, {
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
        read: false,
        write: false,
        update: false,
        delete: false,
        import: false,
        export: false,
        all: false,
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
            all: toggleAll,
          },
        };
      }

      const lowerKey = field.toLowerCase();
      const updated = { ...current, [lowerKey]: !current[lowerKey] };
      updated.all = [
        "read",
        "write",
        "update",
        "delete",
        "import",
        "export",
      ].every((key) => updated[key]);

      return { ...prev, [module]: updated };
    });
  };

  const handleGroupChange = (group) => {
    const groupModules = modules[group];

    setRolePermissions((prev) => {
      const updatedPermissions = { ...prev };
      // toggle: if first module of group is fully checked, uncheck all, else check all
      const first = prev[groupModules[0]] || {};
      const toggleOn = !(
        first.read &&
        first.write &&
        first.update &&
        first.delete &&
        first.import &&
        first.export
      );

      groupModules.forEach((m) => {
        updatedPermissions[m] = {
          read: toggleOn,
          write: toggleOn,
          update: toggleOn,
          delete: toggleOn,
          import: toggleOn,
          export: toggleOn,
          all: toggleOn,
        };
      });

      return updatedPermissions;
    });
  };

  const isGroupChecked = (group) => {
    const groupModules = modules[group];
    return groupModules.every((m) => {
      const perms = rolePermissions[m] || {};
      return (
        perms.read &&
        perms.write &&
        perms.update &&
        perms.delete &&
        perms.import &&
        perms.export
      );
    });
  };

  const handleSubmit = async () => {
    if (!selectedRole?._id) {
      toast.info("Please select a role.", {
        position: 'top-center'
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/role/update/${selectedRole._id}`, {
        modulePermissions: rolePermissions
      },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          }
        },
      );
      fetchRolePermissions();
      toast.success("Permissions updated successfully.",
         {
        position: 'top-center'
      }
    );
    } catch (err) {
      console.error("Error updating permissions", err);
      toast.error("Failed to update permissions.", {
        position: 'top-center'
      });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="">
          <h4 className="roleshder">Roles & Permission</h4>
          <hr style={{ color: "#E6E6E6", height: "1px" }} />

          <div className="mb-4">
            <label className="form-label slctlble">Select Role:</label>
            <select
              className="form-select slctlblechose"
              value={selectedRole?._id || ""}
              onChange={(e) => {
                const selected = roles.find((role) => role._id === e.target.value);
                setSelectedRole(selected || null);
              }}
            >
              <option value="">-- Select Role --</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Loading permissions...</p>
          ) : selectedRole ? (
            <>
              {Object.entries(modules).map(([group, modules]) => {
                const expanded = expandedGroups[group] ?? false; //default open
                return (
                  <div key={group} className="mb-3 border rounded">
                    {/* group header */}
                    <div
                      className="d-flex align-items-center justify-content-between p-2"
                      style={{ background: "#f5f5f5", cursor: "pointer" }}
                      onClick={() => toggleGroup(group)}
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={isGroupChecked(group)}
                          title={`Select all for ${group}`}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleGroupChange(group);
                          }}
                        />{" "}
                        <strong>{group}</strong>
                      </div>
                      <span>
                        {expanded ? <IoIosArrowDown /> : <IoIosArrowUp />}{" "}
                        {/* simple caret toggle */}
                      </span>
                    </div>
                    {expanded && (
                      <table className="table table-bordered tpermsion">
                        <thead className="tpermsionthd">
                          <tr>
                            <th>{group}</th>
                            <th className="text-center">Allow All</th>
                            {permissionFields.map((perm) => (
                              <th key={perm} className="text-center">
                                {perm}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {modules.map((module) => {
                            const perms = rolePermissions[module] || {};
                            return (
                              <tr key={module}>
                                <td style={{ paddingLeft: "30px" }}>{module}</td>
                                <td className="text-center">
                                  <ToggleSwitch
                                    checked={!!perms.all}
                                    onChange={() =>
                                      handlePermissionChange(module, "Allow All")
                                    }
                                  />
                                </td>
                                {permissionFields.map((p) => {
                                  const key = p.toLowerCase();
                                  return (
                                    <td key={p} className="text-center">
                                      <ToggleSwitch
                                        checked={!!perms[key]}
                                        onChange={() =>
                                          handlePermissionChange(module, p)
                                        }
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
              <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                Save Permissions
              </button>
            </>
          ) : (
            <p>Please select a role to edit permissions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Permission;


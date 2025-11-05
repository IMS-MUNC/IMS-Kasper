const Role = require("../models/roleModels");
const defaultRoles = [
    {
        roleName:"SuperAdmin",
        status:"Active",
        modulePermissions: {
             users: { read: true, write: true, update: true, delete: true, import: true, export: true, all: true },
             roles: { read: true, write: true, update: true, delete: true, import: true, export: true, all: true }
        }
    },
];

const seedRoles = async () => {
    try {
        for(const r of defaultRoles) {
            await Role.findOneAndUpdate(
                {roleName:r.roleName},
                {$setOnInsert:r},
                {upsert:true, new:true}
            );
        }
        console.log("Role seeded");
    }catch(error) {
        console.error("Role seeded error:", error)
    }
}

module.exports = seedRoles;
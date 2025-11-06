const User = require("../models/usersModels");
const Role = require("../models/roleModels");
const bcrypt = require("bcryptjs");

const SUPERADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
const SUPERADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@123";

const seedSuperAdmin = async () => {
    try {
        const superRole = await Role.findOne({roleName:"SuperAdmin"});
        if(!superRole) {
            console.warn("SuperAdmin role not found. Run role seeder first")
            return;
        }
        // check existing user
        const existing = await User.findOne({email:SUPERADMIN_EMAIL.toLowerCase()});
        if(existing) {
            console.log("SuperAdmin already exists:", SUPERADMIN_EMAIL);
            return;
        }
        const hashed = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);
        const newUser = new User({
      firstName: "Super",
      lastName: "Admin",
      email: SUPERADMIN_EMAIL.toLowerCase(),
      password: hashed,
      role: superRole._id,
      phone: "7645993354",
      country: "India",
      state: "Bihar",
      city: "Patna",
      address: "Patna",
      status: "Active",
      passwordChangedAt: new Date(),
      // optional: set a flag to force password change on first login
      mustChangePassword: true
        })
        await newUser.save();
        console.log(`SuperAdmin created: ${SUPERADMIN_EMAIL}`)
    }catch(error) {
        console.error("User seeded error:", error)
    }
}
module.exports = seedSuperAdmin;
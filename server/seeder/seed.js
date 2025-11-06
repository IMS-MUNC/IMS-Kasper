require("dotenv").config();
const mongoose = require("mongoose")
const seedRoles = require("./roleSeeder");
const seedSuperAdmin = require("./userSeeder");

const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongo connected for seeding");
        await seedRoles();
        await seedSuperAdmin();
        console.log("Seeding finished");
        process.exit(0);
    }catch(error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
};

if(require.main === module) runSeed();
module.exports = {runSeed};
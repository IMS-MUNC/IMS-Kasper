const mongoose = require('mongoose');
const assignCategoryCodesToExisting = require('../utils/category/categoryCodeMigrator');


const connectDB = async () => {
  try {
    const conn = await
      mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Run migration logic after DB connects
    // await assignCategoryCodesToExisting();/

  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;



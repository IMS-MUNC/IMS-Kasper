const mongoose = require('mongoose');
require('dotenv/config');

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // List all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Check if there's a unique index on username
    const usernameIndex = indexes.find(index =>
      index.key && index.key.username === 1 && index.unique === true
    );

    if (usernameIndex) {
      console.log('Found unique index on username, dropping it...');
      await collection.dropIndex('username_1');
      console.log('Successfully dropped unique index on username');
    } else {
      console.log('No unique index found on username field');
    }

    // List indexes again to confirm
    const newIndexes = await collection.indexes();
    console.log('Updated indexes:', newIndexes);

    console.log('Index fix completed successfully');
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixIndexes();


// const mongoose = require('mongoose');
// require('dotenv/config');

// async function fixIndexes() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log('Connected to MongoDB');

//     const db = mongoose.connection.db;
//     const collection = db.collection('users');

//     // List all indexes
//     const indexes = await collection.indexes();
//     console.log('Current indexes:', indexes);

//     // Check if there's a unique index on username
//     const usernameIndex = indexes.find(index =>
//       index.key && index.key.username === 1 && index.unique === true
//     );

//     if (usernameIndex) {
//       console.log('Found unique index on username, dropping it...');
//       await collection.dropIndex('username_1');
//       console.log('Successfully dropped unique index on username');
//     } else {
//       console.log('No unique index found on username field');
//     }

//     // List indexes again to confirm
//     const newIndexes = await collection.indexes();
//     console.log('Updated indexes:', newIndexes);

//     console.log('Index fix completed successfully');
//   } catch (error) {
//     console.error('Error fixing indexes:', error);
//   } finally {
//     await mongoose.disconnect();
//     console.log('Disconnected from MongoDB');
//   }
// }

// fixIndexes(); 
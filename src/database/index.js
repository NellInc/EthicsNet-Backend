import mongoose from 'mongoose';
import { DATABASE } from '../globals';

if (process.env.NODE_ENV === 'test') {
  mongoose
    .connect('mongodb://localhost:27017/ethics-net-test', {
      useNewUrlParser: true,
    })
    .then(() => console.log('Connected to test DB...'))
    .catch(err => console.error(err, 'Could not connect to MongoDB...'));
} else {
  mongoose
    .connect('mongodb://localhost:27017/ethics-net', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error(err, 'Could not connect to MongoDB...'));
}

// mongoose
//   .connect('mongodb://localhost:27017/ethics-net', {
//     user: 'lupuselit',
//     pass: 'QCT-yXV-aTx-8Xya',
//     useNewUrlParser: true,
//   })
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch(err => console.error(err, 'Could not connect to MongoDB...'));

mongoose.Promise = global.Promise;

export default mongoose;

/*

Auth shit

use admin
db.createUser(
  {
    user: "lupuselit",
    pwd: "QCT-yXV-aTx-8Xy",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)

db.createUser(
  {
    user: "lupuselit",
    pwd: "QCT-yXV-aTx-8Xy",
    roles: [
       { role: "read", db: "ethics-net" },
       { role: "readWrite", db: "ethics-net" }
    ]
  }
)

*/

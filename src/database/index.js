import mongoose from 'mongoose';

// mongoose.connect(
//   'mongodb://lupuselit:aZbThggzLma5pVi@ds345587.mlab.com:45587/node-api-react',
//   { useNewUrlParser: true }
// );

// mongoose.connect(
//   'mongodb://localhost:27017/node-api-react',
//   { useNewUrlParser: true }
// );

mongoose.connect(
  'mongodb://mongo:27017/ethics-net-production',
  { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...")
);

mongoose.Promise = global.Promise;

export default mongoose;

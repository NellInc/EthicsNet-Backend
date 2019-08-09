import mongoose from 'mongoose';

// mongoose.connect(
//   'mongodb://lupuselit:aZbThggzLma5pVi@ds345587.mlab.com:45587/node-api-react',
//   { useNewUrlParser: true }
// );

mongoose.connect(
  'mongodb://localhost:27017/node-api-react',
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

export default mongoose;

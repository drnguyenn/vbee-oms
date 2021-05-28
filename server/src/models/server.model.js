const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, default: '', unique: true },
    service: { type: mongoose.Types.ObjectId, require: true, ref: 'Service' }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false,
    autoIndex: true
  }
);

ServerSchema.virtual('domains', {
  ref: 'Domain',
  localField: '_id',
  foreignField: 'server'
});

ServerSchema.pre('findOne', function populateMembersAndCluster() {
  this.populate({ path: 'domains' });
});

ServerSchema.post('findOne', server => {
  if (server) {
    server._doc.domains = server.domains;
  }
});

module.exports = mongoose.model('Server', ServerSchema);

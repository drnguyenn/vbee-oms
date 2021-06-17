const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, unique: true, sparse: true },
    service: { type: mongoose.Types.ObjectId, require: true, ref: 'Service' }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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

module.exports = mongoose.model('Server', ServerSchema);

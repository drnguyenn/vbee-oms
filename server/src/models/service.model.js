const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    description: { type: String, default: '' },
    version: { type: String, default: '1.0.0' },
    status: {
      type: String,
      enum: ['healthy', 'unhealthy'],
      default: 'healthy'
    },
    server: {
      ipAddress: { type: String, default: '' },
      domain: { type: String, default: '' },
      ssl: {
        lastPurchaseAt: { type: Date, default: Date.now() },
        expiresAt: { type: Date, default: Date.now() }
      }
    },
    docs: [
      {
        _id: { type: mongoose.Types.ObjectId, require: true },
        name: { type: String, require: true },
        url: { type: String, require: true }
      }
    ],
    cluster: { type: mongoose.Types.ObjectId, require: true, ref: 'Cluster' }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false,
    autoIndex: true
  }
);

ServiceSchema.index(
  { '$**': 'text' },
  {
    weights: {
      name: 5
    }
  }
);

ServiceSchema.virtual('members', {
  ref: 'ServiceMember',
  localField: '_id',
  foreignField: 'service'
});

ServiceSchema.virtual('memberCount', {
  ref: 'ServiceMember',
  localField: '_id',
  foreignField: 'service',
  count: true
});

ServiceSchema.pre('find', function populateMemberCount() {
  this.populate('memberCount');
});

ServiceSchema.post('find', services => {
  services.forEach(service => {
    service._doc.memberCount = service.memberCount;
  });
});

ServiceSchema.pre('findOne', function populateMembersAndCluster() {
  this.populate('memberCount');
  this.populate({ path: 'members', select: 'role -_id -service' });
  this.populate({ path: 'cluster', select: 'name' });
});

ServiceSchema.post('findOne', service => {
  if (service) {
    service._doc.memberCount = service.memberCount;
    service._doc.members = service.members;
  }
});

ServiceSchema.pre('findOneAndUpdate', function populateMemberCount() {
  this.populate('memberCount');
});

ServiceSchema.post('findOneAndUpdate', service => {
  if (service) service._doc.memberCount = service.memberCount;
});

ServiceSchema.pre('findOneAndDelete', function populateMemberCount() {
  this.populate('memberCount');
});

ServiceSchema.post('findOneAndDelete', service => {
  if (service) service._doc.memberCount = service.memberCount;
});

module.exports = mongoose.model('Service', ServiceSchema);

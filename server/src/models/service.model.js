const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, default: '' },
    version: { type: String, default: '1.0.0' },
    status: {
      type: String,
      enum: ['healthy', 'unhealthy'],
      default: 'healthy'
    },
    cluster: { type: mongoose.Types.ObjectId, require: true, ref: 'Cluster' }
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

ServiceSchema.virtual('server', {
  ref: 'Server',
  localField: '_id',
  foreignField: 'service',
  justOne: true
});

ServiceSchema.pre('find', function populateMemberCount() {
  this.populate('memberCount');
});

ServiceSchema.pre('findOne', function populateMembersAndCluster() {
  this.populate('memberCount');
  this.populate({ path: 'members', select: 'role -_id -service' });
  this.populate({ path: 'server', select: 'ipAddress' });
  this.populate({ path: 'cluster', select: 'name' });
});

ServiceSchema.pre('findOneAndUpdate', function populateMemberCount() {
  this.populate('memberCount');
});

ServiceSchema.pre('findOneAndDelete', function populateMemberCount() {
  this.populate('memberCount');
});

module.exports = mongoose.model('Service', ServiceSchema);

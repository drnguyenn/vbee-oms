const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    description: { type: String, default: '' },
    diagram: {
      type: mongoose.Types.ObjectId,
      ref: 'Diagram'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false,
    autoIndex: true
  }
);

ClusterSchema.index(
  { '$**': 'text' },
  {
    weights: {
      name: 5
    }
  }
);

ClusterSchema.virtual('members', {
  ref: 'ClusterMember',
  localField: '_id',
  foreignField: 'cluster'
});

ClusterSchema.virtual('memberCount', {
  ref: 'ClusterMember',
  localField: '_id',
  foreignField: 'cluster',
  count: true
});

ClusterSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'cluster'
});

ClusterSchema.virtual('serviceCount', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'cluster',
  count: true
});

ClusterSchema.pre('find', function populateMemberAndServiceCount() {
  this.populate('memberCount');
  this.populate('serviceCount');
});

ClusterSchema.post('find', clusters => {
  clusters.forEach(cluster => {
    cluster._doc.memberCount = cluster.memberCount;
    cluster._doc.serviceCount = cluster.serviceCount;
  });
});

ClusterSchema.pre('findOne', function populateMembersAndServices() {
  this.populate('memberCount');
  this.populate('serviceCount');
  this.populate({ path: 'members', select: 'role -_id -cluster' });
  this.populate({
    path: 'services',
    select: 'name description version status -cluster'
  });
});

ClusterSchema.post('findOne', cluster => {
  if (cluster) {
    cluster._doc.memberCount = cluster.memberCount;
    cluster._doc.members = cluster.members;
    cluster._doc.serviceCount = cluster.serviceCount;
    cluster._doc.services = cluster.services;
  }
});

ClusterSchema.pre('findOneAndUpdate', function populateMemberAndServiceCount() {
  this.populate('memberCount');
  this.populate('serviceCount');
});

ClusterSchema.post('findOneAndUpdate', cluster => {
  if (cluster) {
    cluster._doc.memberCount = cluster.memberCount;
    cluster._doc.serviceCount = cluster.serviceCount;
  }
});

ClusterSchema.pre('findOneAndDelete', function populateMemberAndServiceCount() {
  this.populate('memberCount');
  this.populate('serviceCount');
  this.populate({ path: 'services', select: 'members' });
});

ClusterSchema.post('findOneAndDelete', cluster => {
  if (cluster) {
    cluster._doc.memberCount = cluster.memberCount;
    cluster._doc.serviceCount = cluster.serviceCount;
    cluster._doc.services = cluster.services;
  }
});

module.exports = mongoose.model('Cluster', ClusterSchema);

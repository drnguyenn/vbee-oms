const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
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
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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

ClusterSchema.virtual('servers', {
  ref: 'Server',
  localField: '_id',
  foreignField: 'cluster'
});

ClusterSchema.virtual('serverCount', {
  ref: 'Server',
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

ClusterSchema.pre('findOne', function populate() {
  this.populate('memberCount');
  this.populate('serviceCount');
  this.populate('serverCount');
  this.populate({ path: 'members', select: 'role -_id -cluster' });
  this.populate({
    path: 'services',
    select: 'name description version -cluster',
    populate: { path: 'memberCount' }
  });
});

ClusterSchema.pre('findOneAndDelete', function populate() {
  this.populate({ path: 'services', select: 'members' });
});

module.exports = mongoose.model('Cluster', ClusterSchema);

const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, default: '' },
    version: { type: String, default: '1.0.0' },
    cluster: { type: mongoose.Types.ObjectId, require: true, ref: 'Cluster' },
    server: { type: mongoose.Types.ObjectId, ref: 'Server' }
  },
  {
    timestamps: true,
    versionKey: false,
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

ServiceSchema.virtual('repositories', {
  ref: 'Repository',
  localField: '_id',
  foreignField: 'service'
});

ServiceSchema.virtual('repositoryCount', {
  ref: 'Repository',
  localField: '_id',
  foreignField: 'service',
  count: true
});

ServiceSchema.pre('findOne', function populate() {
  this.populate({ path: 'members', select: 'role -_id -service' });
  this.populate('memberCount');
  this.populate({
    path: 'repositories',
    select: 'name url owner',
    populate: { path: 'memberCount' }
  });
  this.populate('repositoryCount');
  this.populate({ path: 'cluster', select: 'name' });
  this.populate({ path: 'server', select: 'name ipAddress macAddress' });
});

ServiceSchema.pre('findOneAndUpdate', function populate() {
  this.populate({ path: 'server' });
});

module.exports = mongoose.model('Service', ServiceSchema);

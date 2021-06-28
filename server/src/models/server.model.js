const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    ipAddress: { type: String, require: true, unique: true, lowercase: true },
    macAddress: { type: String, require: true, unique: true, lowercase: true },
    cluster: { type: mongoose.Types.ObjectId, ref: 'Cluster' }
  },
  {
    timestamps: true,
    versionKey: false,
    autoIndex: true
  }
);

ServerSchema.index(
  { '$**': 'text' },
  {
    weights: {
      name: 5
    }
  }
);

ServerSchema.virtual('domains', {
  ref: 'Domain',
  localField: '_id',
  foreignField: 'server'
});

ServerSchema.virtual('domainCount', {
  ref: 'Domain',
  localField: '_id',
  foreignField: 'server',
  count: true
});

ServerSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'server'
});

ServerSchema.virtual('serviceCount', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'server',
  count: true
});

ServerSchema.pre('findOne', function populate() {
  this.populate({ path: 'domains' });
  this.populate({ path: 'domainCount' });
  this.populate({ path: 'services' });
  this.populate({ path: 'serviceCount' });
  this.populate({ path: 'cluster', select: 'name description' });
});

ServerSchema.pre('findOneAndDelete', function populate() {
  this.populate({ path: 'services', select: '_id' });
});

module.exports = mongoose.model('Server', ServerSchema);

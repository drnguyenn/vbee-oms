const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, require: true },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    fullName: { type: String, default: '' },
    githubId: { type: String, require: true, unique: true },
    githubUsername: { type: String, require: true, unique: true },
    avatarUrl: { type: String, default: '' },
    preferences: {
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    autoIndex: true
  }
);

UserSchema.index({
  username: 'text',
  email: 'text',
  role: 'text',
  fullName: 'text',
  githubId: 'text',
  githubUsername: 'text'
});

UserSchema.virtual('clusters', {
  ref: 'ClusterMember',
  localField: '_id',
  foreignField: 'user'
});

UserSchema.virtual('clusterCount', {
  ref: 'ClusterMember',
  localField: '_id',
  foreignField: 'user',
  count: true
});

UserSchema.virtual('repositories', {
  ref: 'RepositoryMember',
  localField: '_id',
  foreignField: 'user'
});

UserSchema.virtual('repositoryCount', {
  ref: 'RepositoryMember',
  localField: '_id',
  foreignField: 'user',
  count: true
});

UserSchema.virtual('services', {
  ref: 'ServiceMember',
  localField: '_id',
  foreignField: 'user'
});

UserSchema.virtual('serviceCount', {
  ref: 'ServiceMember',
  localField: '_id',
  foreignField: 'user',
  count: true
});

UserSchema.pre('findOne', function populate() {
  this.populate('clusterCount');
  this.populate('repositoryCount');
  this.populate('serviceCount');
  this.populate({ path: 'clusters', populate: { path: 'cluster' } });
  this.populate({ path: 'repositories', populate: { path: 'repository' } });
  this.populate({ path: 'services', populate: { path: 'service' } });
});

module.exports = mongoose.model('User', UserSchema);

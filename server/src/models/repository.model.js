const mongoose = require('mongoose');

const RepositorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    url: { type: String, require: true },
    owner: { type: String, require: true },
    private: { type: Boolean, default: false },
    githubId: { type: String, require: true, unique: true },
    ghAppInstallationId: { type: String, require: true }
  },
  {
    timestamps: true,
    versionKey: false,
    autoIndex: true
  }
);

RepositorySchema.index(
  { '$**': 'text' },
  {
    weights: {
      name: 5,
      owner: 3,
      githubId: 2
    }
  }
);

RepositorySchema.virtual('members', {
  ref: 'RepositoryMember',
  localField: '_id',
  foreignField: 'repository'
});

RepositorySchema.virtual('memberCount', {
  ref: 'RepositoryMember',
  localField: '_id',
  foreignField: 'repository',
  count: true
});

RepositorySchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'repository'
});

RepositorySchema.virtual('serviceCount', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'repository',
  count: true
});

RepositorySchema.pre('findOne', function populate() {
  this.populate('memberCount');
  this.populate('serviceCount');
  this.populate({ path: 'members', select: '-_id -createdAt -updatedAt' });
  this.populate({
    path: 'services',
    select: 'name description version -repository',
    populate: { path: 'memberCount' }
  });
});

module.exports = mongoose.model('Repository', RepositorySchema);

const mongoose = require('mongoose');

const RepositorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    url: { type: String, require: true },
    owner: { type: String, require: true },
    members: [
      {
        _id: { type: mongoose.Types.ObjectId, ref: 'User' },
        permission: {
          type: String,
          enum: ['read', 'write', 'admin'],
          default: 'write'
        },
        invitation: {
          githubId: { type: String },
          status: {
            type: String,
            enum: ['pending', 'accepted'],
            default: 'pending'
          }
        }
      }
    ],
    githubId: { type: String, unique: true, sparse: true },
    ghAppInstallationId: { type: String },
    serviceId: { type: String }
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

RepositorySchema.virtual('members.details', {
  ref: 'User',
  localField: 'members._id',
  foreignField: '_id',
  justOne: true
});

RepositorySchema.virtual('memberCount', {
  ref: 'User',
  localField: 'members._id',
  foreignField: '_id',
  count: true
});

RepositorySchema.pre('findOne', function populate() {
  this.populate('memberCount');
});

module.exports = mongoose.model('Repository', RepositorySchema);

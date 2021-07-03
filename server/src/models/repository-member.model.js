const mongoose = require('mongoose');

const RepositoryMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
      autopopulate: {
        select: '-password -createdAt -updatedAt'
      }
    },
    repository: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Repository'
    },
    permission: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'write'
    },
    invitation: {
      githubId: { type: String, unique: true, sparse: true },
      status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    autoIndex: true
  }
);

RepositoryMemberSchema.index({ user: 1, repository: 1 }, { unique: true });

RepositoryMemberSchema.plugin(require('mongoose-autopopulate'));

RepositoryMemberSchema.pre('find', function populate() {
  this.populate('repository');
});

module.exports = mongoose.model('RepositoryMember', RepositoryMemberSchema);

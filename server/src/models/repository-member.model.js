const mongoose = require('mongoose');

const RepositoryMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
      autopopulate: {
        select: '-password -preferences -createdAt -updatedAt'
      }
    },
    repository: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Repository',
      autopopulate: {
        select: 'ghAppInstallationId'
      }
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
      },
      expiresAt: { type: Date }
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

module.exports = mongoose.model('RepositoryMember', RepositoryMemberSchema);

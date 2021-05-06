const mongoose = require('mongoose');

const ClusterMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
      autopopulate: {
        select: '-password -createdAt -updatedAt'
      }
    },
    cluster: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Cluster'
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false
  }
);

ClusterMemberSchema.index({ user: 1, cluster: 1 }, { unique: true });

ClusterMemberSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ClusterMember', ClusterMemberSchema);

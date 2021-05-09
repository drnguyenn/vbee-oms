const mongoose = require('mongoose');

const ServiceMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
      autopopulate: {
        select: '-password -createdAt -updatedAt'
      }
    },
    service: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Service'
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

ServiceMemberSchema.index({ user: 1, service: 1 }, { unique: true });

ServiceMemberSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ServiceMember', ServiceMemberSchema);
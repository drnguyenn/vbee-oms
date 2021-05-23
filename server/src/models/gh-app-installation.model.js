const mongoose = require('mongoose');

const GhAppInstallationSchema = new mongoose.Schema(
  {
    githubId: { type: String, require: true, unique: true },
    account: { type: String, require: true },
    status: {
      type: String,
      enum: ['available', 'suspended'],
      default: 'available'
    },
    accessToken: {
      token: { type: String, require: true },
      expiresAt: { type: Date, require: true },
      permissions: {
        type: Object,
        require: true
      }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false,
    autoIndex: true
  }
);

module.exports = mongoose.model('GhAppInstallation', GhAppInstallationSchema);

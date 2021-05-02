const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, enum: ['admin', 'member'], required: true },
    fullName: { type: String, default: '' },
    githubId: { type: String },
    githubUsername: { type: String },
    avatarUrl: { type: String, default: '' }
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

module.exports = mongoose.model('User', UserSchema);

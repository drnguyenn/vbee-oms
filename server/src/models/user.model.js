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

module.exports = mongoose.model('User', UserSchema);

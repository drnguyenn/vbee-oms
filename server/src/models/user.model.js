const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, enum: ['admin', 'member'], required: true },
    fullName: { type: String, default: '' },
    githubId: { type: String, unique: true },
    githubUsername: { type: String, unique: true },
    avatarUrl: { type: String, default: '' },
    preferences: {
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false,
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

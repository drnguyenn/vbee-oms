const mongoose = require('mongoose');

const DomainSchema = new mongoose.Schema(
  {
    value: { type: String, require: true, unique: true },
    server: { type: mongoose.Types.ObjectId, require: true, ref: 'Server' }
  },
  {
    timestamps: true,
    versionKey: false,
    autoIndex: true
  }
);

module.exports = mongoose.model('Domain', DomainSchema);

const mongoose = require('mongoose');

const DiagramLinkSchema = new mongoose.Schema(
  {
    sourcePort: {
      type: mongoose.Types.ObjectId,
      ref: 'DiagramPort'
    },
    targetPort: {
      type: mongoose.Types.ObjectId,
      ref: 'DiagramPort'
    },
    points: [
      {
        position: {
          type: {
            _id: false,
            x: { type: Number, required: true },
            y: { type: Number, required: true }
          },
          required: true
        }
      }
    ],
    diagram: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Diagram'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('DiagramLink', DiagramLinkSchema);

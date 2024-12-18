const mongoose = require('mongoose');

const DiagramPortSchema = new mongoose.Schema(
  {
    options: {
      in: { type: Boolean, default: false },
      alignment: {
        type: String,
        enum: ['top', 'right', 'bottom', 'left'],
        default: 'left'
      }
    },
    node: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'DiagramNode'
    },
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

DiagramPortSchema.virtual('outLinks', {
  ref: 'DiagramLink',
  localField: '_id',
  foreignField: 'sourcePort'
});

DiagramPortSchema.virtual('inLinks', {
  ref: 'DiagramLink',
  localField: '_id',
  foreignField: 'targetPort'
});

DiagramPortSchema.pre('findOneAndDelete', function populate() {
  this.populate({ path: 'outLinks', select: '_id' });
  this.populate({ path: 'inLinks', select: '_id' });
});

module.exports = mongoose.model('DiagramPort', DiagramPortSchema);

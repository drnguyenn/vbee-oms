const mongoose = require('mongoose');

const DiagramPortSchema = new mongoose.Schema(
  {
    position: {
      x: { type: Number },
      y: { type: Number }
    },
    options: {
      in: { type: Boolean, default: false }
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
    versionKey: false,
    typePojoToMixed: false
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

DiagramPortSchema.pre('findOneAndDelete', function populateLinks() {
  this.populate({ path: 'outLinks', select: '_id' });
  this.populate({ path: 'inLinks', select: '_id' });
});

DiagramPortSchema.post('findOneAndDelete', port => {
  if (port) {
    port._doc.links = [...port.outLinks, ...port.inLinks];
  }
});

module.exports = mongoose.model('DiagramPort', DiagramPortSchema);
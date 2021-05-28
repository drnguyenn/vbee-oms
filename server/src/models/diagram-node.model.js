const mongoose = require('mongoose');

const DiagramNodeSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    diagram: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Diagram'
    },
    service: {
      type: mongoose.Types.ObjectId,
      ref: 'Service'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false
  }
);

DiagramNodeSchema.virtual('ports', {
  ref: 'DiagramPort',
  localField: '_id',
  foreignField: 'node'
});

DiagramNodeSchema.pre('find', function populatePorts() {
  this.populate({ path: 'ports' });
});

DiagramNodeSchema.post('find', nodes => {
  nodes.forEach(node => {
    node._doc.ports = node.ports;
  });
});

DiagramNodeSchema.pre('findOneAndDelete', function populatePorts() {
  this.populate({ path: 'ports', select: '_id' });
});

DiagramNodeSchema.post('findOneAndDelete', node => {
  if (node) {
    node._doc.ports = node.ports;
  }
});

module.exports = mongoose.model('DiagramNode', DiagramNodeSchema);

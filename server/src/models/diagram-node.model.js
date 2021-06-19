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
    typePojoToMixed: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

DiagramNodeSchema.virtual('ports', {
  ref: 'DiagramPort',
  localField: '_id',
  foreignField: 'node'
});

DiagramNodeSchema.pre('find', function populate() {
  this.populate({ path: 'ports' });
  this.populate({
    path: 'service',
    select: 'name description version',
    populate: {
      path: 'server',
      select: 'ipAddress'
    }
  });
});

DiagramNodeSchema.pre('findOneAndUpdate', function populate() {
  this.populate({
    path: 'service',
    select: 'name description version',
    populate: {
      path: 'server',
      select: 'ipAddress'
    }
  });
});

DiagramNodeSchema.pre('findOneAndDelete', function populatePorts() {
  this.populate({ path: 'ports', select: '_id' });
});

module.exports = mongoose.model('DiagramNode', DiagramNodeSchema);

const mongoose = require('mongoose');

const DiagramSchema = new mongoose.Schema(
  {
    cluster: { type: mongoose.Types.ObjectId, require: true, ref: 'Cluster' }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

DiagramSchema.virtual('nodes', {
  ref: 'DiagramNode',
  localField: '_id',
  foreignField: 'diagram'
});

DiagramSchema.virtual('links', {
  ref: 'DiagramLink',
  localField: '_id',
  foreignField: 'diagram'
});

DiagramSchema.pre('find', function populateNodesAndLinks() {
  this.populate({ path: 'nodes' });
  this.populate({ path: 'links' });
  this.populate({ path: 'cluster', select: 'name' });
});

DiagramSchema.pre('findOne', function populateNodesAndLinks() {
  this.populate({ path: 'nodes' });
  this.populate({ path: 'links' });
  this.populate({ path: 'cluster', select: 'name' });
});

DiagramSchema.pre('findOneAndDelete', function populateNodesAndLinks() {
  this.populate({ path: 'nodes' });
  this.populate({ path: 'links' });
});

module.exports = mongoose.model('Diagram', DiagramSchema);

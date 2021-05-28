const mongoose = require('mongoose');

const DiagramSchema = new mongoose.Schema(
  {
    cluster: { type: mongoose.Types.ObjectId, require: true, ref: 'Cluster' }
  },
  {
    timestamps: true,
    versionKey: false,
    typePojoToMixed: false
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

DiagramSchema.post('find', diagrams => {
  diagrams.forEach(diagram => {
    diagram._doc.nodes = diagram.nodes;
    diagram._doc.links = diagram.links;
  });
});

DiagramSchema.pre('findOne', function populateNodesAndLinks() {
  this.populate({ path: 'nodes' });
  this.populate({ path: 'links' });
  this.populate({ path: 'cluster', select: 'name' });
});

DiagramSchema.post('findOne', diagram => {
  if (diagram) {
    diagram._doc.nodes = diagram.nodes;
    diagram._doc.links = diagram.links;
  }
});

DiagramSchema.pre('findOneAndDelete', function populateNodesAndLinks() {
  this.populate({ path: 'nodes' });
  this.populate({ path: 'links' });
});

DiagramSchema.post('findOneAndDelete', diagram => {
  if (diagram) {
    diagram._doc.nodes = diagram.nodes;
    diagram._doc.links = diagram.links;
  }
});

module.exports = mongoose.model('Diagram', DiagramSchema);

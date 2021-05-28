import { NodeModel } from '@projectstorm/react-diagrams';

class CustomNodeModel extends NodeModel {
  constructor(options = {}) {
    super({
      ...options,
      type: 'js-custom-node'
    });

    this.id = options.id;
    this.name = options.name;
    this.editMode = options.editMode || false;
  }

  serialize() {
    return {
      ...super.serialize(),
      id: this.id,
      name: this.name,
      editMode: this.editMode
    };
  }

  deserialize(obj, engine) {
    super.deserialize(obj, engine);

    this.id = obj.id;
    this.name = obj.name;
    this.editMode = obj.editMode;
  }

  getEditMode() {
    return this.editMode;
  }

  setEditMode(editMode) {
    this.editMode = editMode;
  }
}

export default CustomNodeModel;

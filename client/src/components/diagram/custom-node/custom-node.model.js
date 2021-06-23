import { NodeModel } from '@projectstorm/react-diagrams';

class CustomNodeModel extends NodeModel {
  constructor(options = {}, service) {
    super({
      ...options,
      type: 'js-custom-node'
    });

    this.id = options.id;
    this.name = options.name;
    this.editMode = options.editMode || false;
    this.service = service;
  }

  serialize() {
    return {
      ...super.serialize(),
      id: this.id,
      name: this.name,
      editMode: this.editMode,
      service: this.service
    };
  }

  deserialize(obj, engine) {
    super.deserialize(obj, engine);

    this.id = obj.id;
    this.name = obj.name;
    this.editMode = obj.editMode;
    this.service = obj.service;
  }

  getEditMode() {
    return this.editMode;
  }

  setEditMode(editMode) {
    this.editMode = editMode;
  }
}

export default CustomNodeModel;

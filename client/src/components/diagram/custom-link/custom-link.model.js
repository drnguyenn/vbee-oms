import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';

class CustomLinkModel extends DefaultLinkModel {
  constructor(options = {}) {
    super({
      ...options,
      type: 'advanced'
    });

    this.id = options.id;
  }

  serialize() {
    return {
      ...super.serialize(),
      id: this.id
    };
  }

  deserialize(obj, engine) {
    super.deserialize(obj, engine);

    this.id = obj.id;
  }
}

export default CustomLinkModel;

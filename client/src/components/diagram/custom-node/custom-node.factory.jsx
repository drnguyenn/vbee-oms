/* eslint class-methods-use-this: ["error", { "exceptMethods": ["generateModel"] }] */
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

import CustomNodeModel from './custom-node.model';
import CustomNodeWidget from './custom-node.widget';

class CustomNodeFactory extends AbstractReactFactory {
  constructor() {
    super('js-custom-node');
  }

  generateModel() {
    return new CustomNodeModel();
  }

  generateReactWidget(event) {
    return <CustomNodeWidget engine={this.engine} node={event.model} />;
  }
}

export default CustomNodeFactory;

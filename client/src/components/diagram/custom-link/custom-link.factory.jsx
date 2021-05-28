/* eslint class-methods-use-this: ["error", { "exceptMethods": ["generateModel"] }] */
import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';

import CustomLinkModel from './custom-link.model';
import CustomLinkWidget from './custom-link.widget';

class CustomLinkFactory extends DefaultLinkFactory {
  constructor() {
    super('advanced');
  }

  generateModel() {
    return new CustomLinkModel();
  }

  generateReactWidget(event) {
    return <CustomLinkWidget link={event.model} diagramEngine={this.engine} />;
  }
}

export default CustomLinkFactory;

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["createLinkModel", "canLinkToPort"] }] */
import { PortModel } from '@projectstorm/react-diagrams-core';

import CustomLinkModel from '../custom-link/custom-link.model';

class CustomPortModel extends PortModel {
  createLinkModel() {
    return new CustomLinkModel();
  }

  canLinkToPort() {
    return true;
  }

  reportPosition() {
    Object.values(this.getLinks()).forEach(link => {
      const point = link.getPointForPort(this);

      point.setPosition(link.getInitPointForPort(this).getPosition());
    });

    this.fireEvent(
      {
        entity: this
      },
      'reportInitialPosition'
    );
  }
}

export default CustomPortModel;

import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';
import { PointModel } from '@projectstorm/react-diagrams';

class CustomLinkModel extends DefaultLinkModel {
  constructor(options = {}) {
    super({
      ...options,
      type: 'advanced'
    });

    this.id = options.id;
    this.initFirstPoint = new PointModel({ link: this });
    this.initLastPoint = new PointModel({ link: this });
  }

  getInitFirstPoint() {
    return this.initFirstPoint;
  }

  getInitLastPoint() {
    return this.initLastPoint;
  }

  setInitFirstPoint(x, y) {
    this.initFirstPoint.setPosition(x, y);
  }

  setInitLastPoint(x, y) {
    this.initLastPoint.setPosition(x, y);
  }

  getInitPointForPort(port) {
    if (this.sourcePort !== null && this.sourcePort.getID() === port.getID())
      return this.initFirstPoint;

    if (this.targetPort !== null && this.targetPort.getID() === port.getID())
      return this.initLastPoint;

    return null;
  }

  setInitPointForPort(port, x, y) {
    if (this.sourcePort !== null && this.sourcePort.getID() === port.getID())
      this.setInitFirstPoint(x, y);

    if (this.targetPort !== null && this.targetPort.getID() === port.getID())
      this.setInitLastPoint(x, y);

    return null;
  }

  setSourcePort(port) {
    if (port) {
      port.addLink(this);
    }
    if (this.sourcePort) {
      this.sourcePort.removeLink(this);
    }
    this.sourcePort = port;
    this.fireEvent({ port }, 'sourcePortChanged');

    // if (port.reportedPosition) {
    //   this.getPointForPort(port).setPosition(port.getCenter());
    // }
  }

  setTargetPort(port) {
    if (port) {
      port.addLink(this);
    }
    if (this.targetPort) {
      this.targetPort.removeLink(this);
    }
    this.targetPort = port;
    this.fireEvent({ port }, 'targetPortChanged');

    // if (port.reportedPosition) {
    //   this.getPointForPort(port).setPosition(port.getCenter());
    // }
  }
}

export default CustomLinkModel;

import { Action, InputType, State } from '@projectstorm/react-canvas-core';
import { PortModel } from '@projectstorm/react-diagrams-core';

/**
 * This state controls the creation of a link
 */
class CustomCreateLinkState extends State {
  constructor() {
    super({ name: 'create-new-link' });

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: actionEvent => {
          // Only trigger if the port is left-clicked
          if (actionEvent.event.button === 0) {
            const element = this.engine
              .getActionEventBus()
              .getModelForEvent(actionEvent);

            const relativeMousePoint = this.engine.getRelativeMousePoint(
              actionEvent.event
            );

            if (element instanceof PortModel && !this.sourcePort) {
              this.sourcePort = element;

              const link = this.sourcePort.createLinkModel();
              link.setSourcePort(this.sourcePort);
              link.getFirstPoint().setPosition(relativeMousePoint);
              link.getLastPoint().setPosition(relativeMousePoint);

              this.link = this.engine.getModel().addLink(link);
            } else if (
              element instanceof PortModel &&
              this.sourcePort &&
              element !== this.sourcePort
            ) {
              if (this.sourcePort.canLinkToPort(element)) {
                this.link.setTargetPort(element);
                // element.reportPosition();
                this.clearState();
                this.eject();
              }
            } else if (this.link && element === this.link.getLastPoint()) {
              this.link.point(relativeMousePoint.x, relativeMousePoint.y, -1);
            }

            // this.engine.repaintCanvas();
          }
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_MOVE,
        fire: actionEvent => {
          if (!this.link) return;

          this.link
            .getLastPoint()
            .setPosition(this.engine.getRelativeMousePoint(actionEvent.event));

          this.engine.repaintCanvas();
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.KEY_UP,
        fire: actionEvent => {
          // On Esc press remove any started link and pop back to default state
          if (actionEvent.event.key === 'Escape' && this.link) {
            this.link.remove();
            this.clearState();
            this.eject();
            this.engine.repaintCanvas();
          }
        }
      })
    );
  }

  clearState() {
    this.link = undefined;
    this.sourcePort = undefined;
  }
}

export default CustomCreateLinkState;

import {
  SelectingState,
  State,
  Action,
  InputType,
  DragCanvasState
} from '@projectstorm/react-canvas-core';
import {
  PortModel,
  DragDiagramItemsState
} from '@projectstorm/react-diagrams-core';

import CustomCreateLinkState from './custom-create-link/custom-create-link.state';

class CustomDefaultState extends State {
  constructor() {
    super({ name: 'starting-state' });
    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.createLink = new CustomCreateLinkState();
    this.dragItems = new DragDiagramItemsState();

    // Determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          // The canvas was clicked on, transition to the dragging canvas state
          if (!element) this.transitionWithEvent(this.dragCanvas, event);
          // Initiate dragging a new link
          else if (element instanceof PortModel);
          else
            // Move the items (and potentially link points)
            this.transitionWithEvent(this.dragItems, event);
        }
      })
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: event => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          if (element instanceof PortModel)
            this.transitionWithEvent(this.createLink, event);
        }
      })
    );
  }
}

export default CustomDefaultState;

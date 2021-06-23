import { Action, InputType } from '@projectstorm/react-canvas-core';
import {
  DragDiagramItemsState,
  PointModel
} from '@projectstorm/react-diagrams';

class CustomDragDiagramItemsState extends DragDiagramItemsState {
  constructor() {
    super();

    this.registerAction(
      new Action({
        type: InputType.MOUSE_MOVE,
        fire: ({ event }) => {
          const item = this.engine.getMouseElement(event);

          if (item instanceof PointModel) {
            const link = item.getParent();

            link.fireEvent({ link }, 'linksUpdated');
          }
        }
      })
    );
  }
}

export default CustomDragDiagramItemsState;

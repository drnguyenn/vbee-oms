import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * This action controls the movement of canvas when mouse wheeling
 */
class CustomMoveCanvasAction extends Action {
  constructor() {
    super({
      type: InputType.MOUSE_WHEEL,
      fire: ({ event }) => {
        // Trigger canvas moving action only while not holding Ctrl key (for CustomZoomAction)
        if (!event.ctrlKey) {
          const model = this.engine.getModel();

          model.setOffset(
            model.getOffsetX() - event.deltaX,
            model.getOffsetY() - event.deltaY
          );

          this.engine.repaintCanvas();
        }
      }
    });
  }
}

export default CustomMoveCanvasAction;

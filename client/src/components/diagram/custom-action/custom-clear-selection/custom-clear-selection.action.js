import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * Unselect all items when pressing 'Escape' key
 */
class CustomClearSelectionAction extends Action {
  constructor() {
    super({
      type: InputType.KEY_UP,
      fire: actionEvent => {
        if (actionEvent.event.key === 'Escape')
          this.engine.getModel().clearSelection();
      }
    });
  }
}

export default CustomClearSelectionAction;

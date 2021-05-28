import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * This action controls the zoom behavior of canvas
 */
class CustomZoomAction extends Action {
  constructor(options = {}) {
    super({
      type: InputType.MOUSE_WHEEL,
      fire: ({ event }) => {
        // Trigger zoom action only while holding Ctrl key
        if (event.ctrlKey) {
          const model = this.engine.getModel();

          // We can block layer rendering because we are only targeting the transforms
          model.getLayers().forEach(layer => layer.allowRepaint(false));

          event.stopPropagation();
          const oldZoomFactor = this.engine.getModel().getZoomLevel() / 100;
          let scrollDelta = options.inverseZoom ? event.deltaY : -event.deltaY;

          // Check if it is pinch gesture
          // if (event.ctrlKey && scrollDelta % 1 !== 0) {
          //   /*
          // 	Chrome and Firefox sends wheel event with deltaY that
          // 	have fractional part, also `ctrlKey` prop of the event is true
          // 	though ctrl isn't pressed
          // */
          //   scrollDelta /= 3;
          // } else {
          //   scrollDelta /= 60;
          // }

          scrollDelta /= 10;
          if (model.getZoomLevel() + scrollDelta > 10) {
            model.setZoomLevel(model.getZoomLevel() + scrollDelta);
          }

          const zoomFactor = model.getZoomLevel() / 100;

          const boundingRect = event.currentTarget.getBoundingClientRect();
          const clientWidth = boundingRect.width;
          const clientHeight = boundingRect.height;
          // Compute difference between rect before and after scroll
          const widthDiff =
            clientWidth * zoomFactor - clientWidth * oldZoomFactor;
          const heightDiff =
            clientHeight * zoomFactor - clientHeight * oldZoomFactor;
          // Compute mouse coords relative to canvas
          const clientX = event.clientX - boundingRect.left;
          const clientY = event.clientY - boundingRect.top;

          // Compute width and height increment factor
          const xFactor =
            (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
          const yFactor =
            (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;

          model.setOffset(
            model.getOffsetX() - widthDiff * xFactor,
            model.getOffsetY() - heightDiff * yFactor
          );
          this.engine.repaintCanvas();

          // Re-enable rendering
          model.getLayers().forEach(layer => layer.allowRepaint(true));
        }
      }
    });
  }
}

export default CustomZoomAction;

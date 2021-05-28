import { Action, InputType } from '@projectstorm/react-canvas-core';
import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';
import { PointModel } from '@projectstorm/react-diagrams-core';

import store from '../../../../redux/store';

import {
  removeClusterDiagramElementsStart,
  removeClusterDiagramLinkStart,
  setSelectedDiagramElements,
  setSelectedDiagramNode
} from '../../../../redux/diagram/diagram.actions';
import {
  toggleDiagramElementsRemoveConfirmationModal,
  toggleDiagramNodeRemoveConfirmationModal
} from '../../../../redux/modal/modal.actions';

import { removeElementsChanges } from '../../../../utils/diagram.utils';

import CustomNodeModel from '../../custom-node/custom-node.model';
import CustomLinkModel from '../../custom-link/custom-link.model';

const removeItem = item => {
  if (!item.isLocked()) item.remove();
};

/**
 * This action controls the items delete action
 */
class CustomDeleteItemsAction extends Action {
  constructor(opts = {}) {
    const options = {
      keyCodes: [8, 46],
      ...opts
    };

    super({
      type: InputType.KEY_UP,
      fire: actionEvent => {
        if (options.keyCodes.indexOf(actionEvent.event.keyCode) !== -1) {
          const selectedEntities = this.engine.getModel().getSelectedEntities();

          if (selectedEntities.length > 1) {
            const itemsToRemove = { nodes: [], ports: [], links: [] };
            const { nodes, ports, links } = itemsToRemove;

            selectedEntities.forEach(item => {
              if (item instanceof CustomNodeModel) {
                nodes.push(item.id);
                ports.push(...Object.keys(item.ports));
              }
              if (item instanceof DefaultLinkModel) links.push(item.options.id);
            });

            if (nodes.length) {
              store.dispatch(
                setSelectedDiagramElements({
                  ...itemsToRemove,
                  callback: () => {
                    selectedEntities.forEach(item => removeItem(item));
                  }
                })
              );

              store.dispatch(toggleDiagramElementsRemoveConfirmationModal());

              return;
            }

            store.dispatch(
              removeClusterDiagramElementsStart(itemsToRemove, () =>
                selectedEntities.forEach(item => removeItem(item))
              )
            );

            removeElementsChanges(links.map(linkId => `links.${linkId}`));
          } else if (selectedEntities.length === 1) {
            const item = selectedEntities[0];

            if (item instanceof CustomNodeModel)
              if (!item.getEditMode()) {
                store.dispatch(
                  setSelectedDiagramNode({
                    id: item.id,
                    name: item.name,
                    callback: () => {
                      removeItem(selectedEntities[0]);
                    }
                  })
                );

                store.dispatch(toggleDiagramNodeRemoveConfirmationModal());

                return;
              }

            if (item instanceof CustomLinkModel) {
              store.dispatch(
                removeClusterDiagramLinkStart(item.id, () => removeItem(item))
              );

              removeElementsChanges([`links.${item.id}`]);

              return;
            }

            if (item instanceof PointModel) {
              removeItem(item);
              this.engine.repaintCanvas();
            }
          }
        }
      }
    });
  }
}

export default CustomDeleteItemsAction;

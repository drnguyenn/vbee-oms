import { LinkWidget } from '@projectstorm/react-diagrams-core';
import { DefaultLinkWidget } from '@projectstorm/react-diagrams-defaults';

import CustomLinkPointWidget from '../custom-link-point/custom-link-point.widget';

const CustomLinkArrowWidget = ({ point, previousPoint, color }) => {
  const angle =
    90 +
    (Math.atan2(
      point.getY() - previousPoint.getY(),
      point.getX() - previousPoint.getX()
    ) *
      180) /
      Math.PI;

  return (
    <g
      className='arrow'
      transform={`translate(${point.getX()}, ${point.getY()})`}
    >
      <g style={{ transform: `rotate(${angle}deg)` }}>
        <g transform='translate(0, -10)'>
          <polygon
            points='0,5 5,20 -5,20'
            fill={color}
            data-id={point.getID()}
            data-linkid={point.getLink().getID()}
          />
        </g>
      </g>
    </g>
  );
};

class CustomLinkWidget extends DefaultLinkWidget {
  generateArrow(point, previousPoint) {
    const { link } = this.props;

    return (
      <CustomLinkArrowWidget
        key={point.getID()}
        point={point}
        previousPoint={previousPoint}
        colorSelected={link.getOptions().selectedColor}
        color={link.getOptions().color}
      />
    );
  }

  generatePoint(point) {
    const { link } = this.props;

    return (
      <CustomLinkPointWidget
        key={point.getID()}
        point={point}
        colorSelected={link.getOptions().selectedColor}
        color={link.getOptions().color}
      />
    );
  }

  render() {
    const { link } = this.props;

    // Ensure id is present for all points on the path
    const points = link.getPoints();
    const paths = [];
    this.refPaths = [];

    // Draw the multiple anchors and complex line instead
    for (let j = 0; j < points.length - 1; j += 1) {
      paths.push(
        this.generateLink(
          LinkWidget.generateLinePath(points[j], points[j + 1]),
          {
            'data-linkid': link.getID(),
            'data-point': j,
            onMouseDown: event => this.addPointToLink(event, j + 1)
          },
          j
        )
      );
    }

    // Render the circles
    for (let i = 1; i < points.length - 1; i += 1) {
      paths.push(this.generatePoint(points[i]));
    }

    if (link.getTargetPort()) {
      paths.push(
        this.generateArrow(points[points.length - 1], points[points.length - 2])
      );
    } else {
      paths.push(this.generatePoint(points[points.length - 1]));
    }

    return <g>{paths}</g>;
  }
}

export default CustomLinkWidget;

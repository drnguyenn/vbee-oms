import { LinkWidget } from '@projectstorm/react-diagrams-core';
import { DefaultLinkWidget } from '@projectstorm/react-diagrams-defaults';

const CustomLinkArrowWidget = ({ point, previousPoint, color }) => {
  const angle =
    90 +
    (Math.atan2(
      point.getPosition().y - previousPoint.getPosition().y,
      point.getPosition().x - previousPoint.getPosition().x
    ) *
      180) /
      Math.PI;

  return (
    <g
      className='arrow'
      transform={`translate(${point.getPosition().x}, ${
        point.getPosition().y
      })`}
    >
      <g style={{ transform: `rotate(${angle}deg)` }}>
        <g transform='translate(0, -3)'>
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

  // generatePoint(point) {
  //   const p = this.props.link
  //     .getPoints()
  //     .find(({ options: { id } }) => id === point.options.id);

  //   if (
  //     !p ||
  //     p.getPosition().x !== point.getPosition().x ||
  //     p.getPosition().y !== point.getPosition().y
  //   )
  //     this.props.link.fireEvent({ point }, 'customLinkUpdated');

  //   return super.generatePoint(point);
  // }

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

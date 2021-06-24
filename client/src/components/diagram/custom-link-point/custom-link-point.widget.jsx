import { DefaultLinkPointWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';

const PointTop = styled.circle`
  pointer-events: all;
`;

class CustomLinkPointWidget extends DefaultLinkPointWidget {
  render() {
    const { point, color, colorSelected } = this.props;
    const { selected } = this.state;

    return (
      <g>
        <circle
          cx={point.getX()}
          cy={point.getY()}
          r={3}
          fill={selected || point.isSelected() ? colorSelected : color}
        />
        <PointTop
          className='point'
          onMouseLeave={() => {
            this.setState({ selected: false });
          }}
          onMouseEnter={() => {
            this.setState({ selected: true });
          }}
          data-id={point.getID()}
          data-linkid={point.getLink().getID()}
          cx={point.getX()}
          cy={point.getY()}
          r={15}
          opacity={0.0}
        />
      </g>
    );
  }
}

export default CustomLinkPointWidget;

import * as React from "react";
import { getControlsData } from "../utils";
import { fieldTypes } from "../fieldTypes";
import * as Fields from "../mocks/fields.json";
import * as Jira from "../mocks/jira.json";
import { scaleLinear, interpolateHclLong } from "d3";

export default class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorItems: null
    };
    this.getColorId = () => null;
  }

  componentDidMount() {
    this.initializeColorItems();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.colorField !== this.props.colorField) {
      this.initializeColorItems();
    }
  }

  initializeColorItems = () => {
    const { colorField } = this.props;

    const { getId: getColorId, getName: getColorName } = fieldTypes[
      Fields.fields.find(field => field.id == colorField).schema.type
    ];
    this.getColorId = getColorId;

    let colorItems = {};
    let colorNum = 1;

    Jira.issues.forEach(issue => {
      let colorId = issue.fields[colorField]
        ? getColorId(issue.fields[colorField])
        : 0;

      if (colorItems[colorId] === undefined) {
        if (colorId) {
          colorItems[colorId] = {
            num: colorNum++,
            name: getColorName(issue.fields[colorField])
          };
        } else {
          colorItems[0] = {
            num: 0,
            name: "Undefined"
          };
        }
      }
    });
    this.setState({ colorItems: colorItems });

    this.generateColor = scaleLinear()
      .domain([0, colorNum])
      .range(["hsl(0,70%,50%)", "hsl(280,70%,50%)"])
      .interpolate(interpolateHclLong);
  };

  renderLegends = () => {
    if (!this.state.colorItems) {
      return null;
    }
    return Object.values(this.state.colorItems).map(c => {
      return (
        <>
          <dt style={{ backgroundColor: this.generateColor(c.num) }}></dt>
          <dd>{c.name}</dd>
        </>
      );
    });
  };

  colorMapper = value => {
    return this.generateColor(
      this.state.colorItems[value ? this.getColorId(value) : 0].num
    );
  };

  render() {
    return (
      <dl id="Legend" className="legend">
        {this.renderLegends()}
      </dl>
    );
  }
}

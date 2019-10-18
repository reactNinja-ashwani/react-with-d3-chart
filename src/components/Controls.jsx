import * as React from "react";
import { getControlsData } from "../utils";

export default class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      controlData: null
    }
    this.currentFields = {
      clusterFields: "components",
      sizeFields: "customfield_10021",
      colorFields: "status"
    };
  }
  componentDidMount() {
    this.setState({
      controlData:getControlsData()
    }) 
  }

  renderOptions = controlType => {
    return this.state.controlData[controlType].map(v => (
      <option value={v.id} selected={v.id === this.currentFields[controlType]}>
        {v.name}
      </option>
    ));
  };

  handleChange = e => {
    const { OnSelectChange } = this.props;
    this.currentFields[e.target.id] = e.target.value;
    OnSelectChange(this.currentFields);
  };

  render() {
    if(!this.state.controlData){
      return null;
    }
    return (
      <div className="controls">
        <div>
          <label htmlFor="clusterFields">Cluster field:</label>
          <select id="clusterFields" onChange={this.handleChange}>
            {this.renderOptions("clusterFields")}
          </select>
        </div>
        <div>
          <label htmlFor="sizeFields">Size field:</label>
          <select id="sizeFields" onChange={this.handleChange}>
            {this.renderOptions("sizeFields")}
          </select>
        </div>
        <div>
          <label htmlFor="colorFields">Color field:</label>
          <select id="colorFields" onChange={this.handleChange}>
            {this.renderOptions("colorFields")}
          </select>
        </div>
      </div>
    );
  }
}

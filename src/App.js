import React from "react";
import "./App.css";
import Controls from "./components/Controls";
import Legend from "./components/Legend";
import Bubbles from "./components/Bubbles";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorFields: "status",
      clusterFields: "components",
      sizeFields: "customfield_10021"
    };
  }
  render() {
    return (
      <div className="App">
        <Controls OnSelectChange={value => this.setState(value)} />
        {this.state.colorFields && (
          <Legend colorField={this.state.colorFields} />
        )}

        <Bubbles
          width={960}
          height={960}
          clusterField={this.state.clusterFields}
          sizeField={this.state.sizeFields}
          colorField={this.state.colorFields}
        />
      </div>
    );
  }
}

export default App;

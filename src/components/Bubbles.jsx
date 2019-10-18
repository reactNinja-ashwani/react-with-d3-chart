import * as React from "react";
import { getControlsData } from "../utils";
import * as d3 from "d3";
import { fieldTypes } from "../fieldTypes";
import * as Fields from "../mocks/fields.json";
import * as Jira from "../mocks/jira.json";

export default class Bubbles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: null,
      diameter: this.props.width | 0
    };
    this.root = null;
    this.margin = 20;
    this.svg = null;
    this.g = null;
    this.pack = null;
  }

  componentDidMount() {
    this.drawChart();
    this.setState({ diameter: this.props.width });
  }
  componentDidUpdate(prevprops, PrevState){
      debugger;
      if(prevprops !== this.props) {
          this.redraw();
      }

  }

  drawChart() {
    const { width, height } = this.props;
    const diameter = width;

    this.svg = d3.select("svg");
    this.g = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + diameter / 2 + "," + diameter / 2 + ")"
      );
    this.generateColor = d3
      .scaleLinear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    this.svg
      .style("background", this.generateColor(-1))
      .on("click", () => this.zoom(this.root));

    this.pack = d3
      .pack()
      .size([diameter - this.margin, diameter - this.margin])
      .padding(2);

    this.draw();
  }

  draw = () => {
    const rootData = this.prepareHierarchy(this.props);

    this.root = d3
      .hierarchy(rootData)
      .sum(d => d.size)
      .sort((a, b) => b.value - a.value);
    this.setState({ focus: this.root });

    const nodeData = this.pack(this.root).descendants();

    this.generateUniqueId(nodeData);

    this.addNodes(
      this.g
        .selectAll(".node")
        .data(nodeData, (d, i) => d.uniqueId || i)
        .enter()
    );

    this.addClusterLabels(
      this.g
        .selectAll(".label--cluster")
        .data(
          nodeData.filter(d => d.height > 0 && d.depth > 0),
          (d, i) => d.uniqueId || i
        )
        .enter()
    );
  };

  redraw = () => {
    const rootData = this.prepareHierarchy(this.props);
    this.root = d3
      .hierarchy(rootData)
      .sum(d => d.size)
      .sort((a, b) => b.value - a.value);

    this.setState({ focus: this.root });
    const nodeData = this.pack(this.root).descendants();

    var clusterNodeData = nodeData.filter(d => d.height > 0 && d.depth > 0);

    this.g.selectAll(".node--cluster").remove();
    this.g.selectAll(".label--cluster").remove();

    var k = this.state.diameter / (this.root.r * 2 + this.margin);

    this.addNodes(
      this.g
        .selectAll(".node--cluster")
        .data(clusterNodeData)
        .enter()
    );

    this.generateUniqueId(nodeData);

    var bubbles = this.g
      .selectAll(".node--leaf")
      .data(nodeData.filter(d => d.height == 0), d => d.uniqueId);

    bubbles
      .raise()
      .transition()
      .duration(1000)
      .attr(
        "transform",
        d =>
          "translate(" +
          (d.x - this.root.x) * k +
          "," +
          (d.y - this.root.y) * k +
          ")"
      )
      .selectAll("circle")
      .attr("r", d => d.r * k)
      .style("fill", d => d.data.color);

    bubbles.exit().remove();

    this.addNodes(bubbles.enter());

    this.addClusterLabels(
      this.g
        .selectAll(".label--cluster")
        .data(clusterNodeData)
        .enter()
    );
  };

  addNodes = nodesSelection => {
    var k = this.state.diameter / (this.root.r * 2 + this.margin);

    var group = nodesSelection
      .append("g")
      .attr("class", d =>
        d.parent
          ? d.children
            ? "node node--cluster"
            : "node node--leaf"
          : "node node--root"
      )
      .attr(
        "transform",
        d =>
          "translate(" +
          (d.x - this.root.x) * k +
          "," +
          (d.y - this.root.y) * k +
          ")"
      )
      .on("click", d => {
        if (this.state.focus !== d) {
          this.zoom(d);
        }
        d3.event.stopPropagation();
      });

    group
      .append("circle")
      .attr("r", d => d.r * k)
      .style("fill", d =>
        d.children ? this.generateColor(d.depth) : d.data.color
      );

    group
      .filter(d => d.height == 0)
      .append("text")
      .attr("class", d =>
        d.parent
          ? d.children
            ? "label label--cluster"
            : "label label--leaf"
          : "label label--root"
      )
      .style("fill-opacity", d => (d.parent === this.state.focus ? 1 : 0))
      .style("display", d => (d.parent === this.root ? "inline" : "none"))
      .text(d => d.data.name);
  };

  generateUniqueId = nodeData => {
    var duplicateIds = {};

    nodeData.forEach(d => {
      if (!d.data.id) {
        return;
      }
      if (!duplicateIds[d.data.id]) {
        duplicateIds[d.data.id] = 0;
      }

      duplicateIds[d.data.id]++;

      d.uniqueId = d.data.id + " " + duplicateIds[d.data.id];
    });
  };

  addClusterLabels = labelsSelection => {
    var k = this.state.diameter / (this.root.r * 2 + this.margin);

    labelsSelection
      .append("text")
      .attr("class", "label label--cluster")
      .attr(
        "transform",
        d =>
          "translate(" +
          (d.x - this.root.x) * k +
          "," +
          (d.y - this.root.y) * k +
          ")"
      )
      .style("fill-opacity", d => (d.parent === this.state.focus ? 1 : 0))
      .style("display", d => (d.parent === this.root ? "inline" : "none"))
      .text(d => d.data.name);
  };

  prepareHierarchy = ({ clusterField, sizeField, colorField }) => {
    const getColor = () => "white"; /*createLegend( colorField*/

    let clusters = {};

    const clusterFieldSchema = Fields.fields.find(
      field => field.id == clusterField
    ).schema;
    const clusterFieldType = clusterFieldSchema.type;
    const { getId, getName } = fieldTypes[
      clusterFieldType == "array" ? clusterFieldSchema.items : clusterFieldType
    ];

    function addToCluster(bubble, valueObj) {
      var id = valueObj == undefined ? 0 : getId(valueObj);

      if (!clusters[id]) {
        clusters[id] = {
          name: id == 0 ? "Undefined" : getName(valueObj),
          children: []
        };
      }
      clusters[id].children.push(bubble);
    }

    Jira.issues.forEach(issue => {
      let bubble = {
        size: issue.fields[sizeField] * 10 || 1,
        id: issue.key,
        name: issue.key,
        color: getColor(issue.fields[colorField]),
        ref: issue
      };

      if (
        clusterFieldType == "array" ||
        Array.isArray(issue.fields[clusterField])
      ) {
        if (
          issue.fields[clusterField] &&
          issue.fields[clusterField].length > 0
        ) {
          issue.fields[clusterField].forEach(valueObj =>
            addToCluster(bubble, valueObj)
          );
        } else {
          addToCluster(bubble);
        }
      } else {
        addToCluster(bubble, issue.fields[clusterField]);
      }
    });

    return {
      name: "root",
      children: Object.values(clusters)
    };
  };

  zoom = d => {
    this.setState({ focus: d });
    const focus = d;
    const k = this.state.diameter / (focus.r * 2 + this.margin);

    const transition = d3.transition().duration(750);

    transition
      .selectAll(".node,.label--cluster")
      .attr(
        "transform",
        d =>
          "translate(" + (d.x - focus.x) * k + "," + (d.y - focus.y) * k + ")"
      )
      .selectAll("circle")
      .attr("r", d => d.r * k);

    transition
      .selectAll(".label")
      .filter(function(d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", d => (d.parent === focus ? 1 : 0))
      .on("start", function(d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function(d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  };

  render() {
    return <svg width={this.props.width} height={this.props.height}></svg>;
  }
}

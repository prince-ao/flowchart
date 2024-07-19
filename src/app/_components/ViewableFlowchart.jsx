import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  MarkerType,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import CourseBuilderBar from "./CourseBuilderBar";

import Legend from "./Legend";
/**
 * ViewableFlowchart Component
 *
 * Props:
 *
 * nodes: An array of node objects. Each node object should have an id, type, position, and data.
 *        The data object should contain a label and fullName. If no nodes are provided, a default node is used.
 *
 * edges: An array of edge objects. Each edge object should have an id, source, and target.
 *
 * enableMouseEvents: A boolean that determines whether mouse enter and leave events are handled.
 *                    If true, tooltips will be displayed when the mouse enters a node.
 *
 * backgroundColor: The background color of the nodes. Default is "#FFF".
 *
 * borderColor: The border color of the nodes. Default is "#79BDE8".
 *
 * textColor: The color of the text inside the nodes. Default is "black".
 *
 * borderRadius: The border radius of the nodes. Default is "0.375rem".
 *
 * padding: The padding inside the nodes. Default is "1rem".
 *
 * arrowColor: The color of the arrows that connect nodes. Default is "#79BDE8".
 *
 * strokeColor: The color of the stroke around the nodes. Default is "#79BDE8".
 *
 * strokeWidth: The width of the stroke around the nodes. Default is 3.
 *
 * viewHeight: The height of the view that contains the flowchart. Default is "90vh".
 *
 * chartBackgroundColor: The background color of the flowchart. Default is "white".
 *
 * chartBorderColor: The border color of the flowchart. Default is "transparent".
 *
 * chartBorderRadius: The border radius of the flowchart. Default is "0.375rem".
 *
 * chartPadding: The padding inside the flowchart. Default is "1rem".
 *
 * backgroundGap: The gap between the grid lines in the background of the flowchart. Default is 16.
 *
 * backgroundGridColor: The color of the grid lines in the background of the flowchart. Default is "#aaa".
 *
 * enableMouseEvents: A boolean that determines whether mouse enter and leave events are handled.
 *
 * nodeTypes: An object that defines the types of nodes that can be displayed in the flowchart.
 *
 * Always use the ViewableFlowchart component to display a flowchart in the application.
 * Wrap the component in a ReactFlowProvider to enable drag and drop functionality.
 *
 * Example usage:
 *
 * <ReactFlowProvider>
 *  <ViewableFlowchart nodes={nodes} edges={edges} />
 * </ReactFlowProvider>
 */

const ViewableFlowchart = ({
  nodes,
  edges,
  enableMouseEvents,
  backgroundColor,
  borderColor,
  textColor,
  borderRadius,
  padding,
  arrowColor,
  strokeColor,
  strokeWidth,
  viewHeight,
  chartBackgroundColor,
  chartBorderColor,
  chartBorderRadius,
  chartPadding,
  backgroundGap,
  enableTooltip,
  backgroundGridColor,
  nodeTypes,
  onNodeClick,
  hasCourseBuilder,
  setNodes,
  setEdges,
}) => {
  const [tooltip, setTooltip] = useState({
    display: false,
    content: "",
    x: 0,
    y: 0,
  });

  const reactflowInstance = useReactFlow();

  useEffect(() => {
    /*
       This useEffect hook is used to handle the resize event of the window.
       When the window is resized, the flowchart is resized to fit the view.
    */
    const handleResize = () => {
      reactflowInstance.fitView();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [reactflowInstance]);

  const handleMouseEnter = (event, node) => {
    setTooltip({
      display: true,
      content: node.data.fullName,
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      display: false,
      content: "",
      x: 0,
      y: 0,
    });
  };

  // If no nodes are provided, use a default node
  const defaultNodes = !nodes
    ? [
        {
          id: "1",
          type: "default",
          position: { x: 250, y: 250 },
          data: { label: "Edges and Nodes are not added" },
        },
      ]
    : nodes;

  const defaultEdges = !edges
    ? [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          animated: true,
          style: { stroke: arrowColor, strokeWidth: strokeWidth },
          arrowHeadType: "arrowclosed",
        },
      ]
    : edges;

  return (
    <div
      style={{
        height: viewHeight,
        backgroundColor: chartBackgroundColor,
        padding: chartPadding,
        borderRadius: chartBorderRadius,
        borderColor: chartBorderColor,
      }}
    >
      {enableTooltip && tooltip.display && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: "lightblue",
            color: "black",
            padding: "0.5rem",
            borderRadius: "0.375rem",
            zIndex: 1000,
          }}
        >
          {tooltip.content}
        </div>
      )}

      <ReactFlow
        nodes={defaultNodes}
        edges={defaultEdges}
        nodeTypes={
          nodeTypes
            ? nodeTypes
            : {
                default: {
                  type: "default",
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: borderRadius,
                  padding: padding,
                  strokeColor: strokeColor,
                  strokeWidth: strokeWidth,
                },
              }
        }
        onNodeMouseEnter={enableMouseEvents ? handleMouseEnter : undefined}
        onNodeMouseLeave={enableMouseEvents ? handleMouseLeave : undefined}
        onNodeClick={onNodeClick}
        minZoom={0.05}
        maxZoom={1.5}
        defaultViewport={{ x: 100, y: -100, zoom: 0.5 }}
        fitView={false}
      >
        <Panel position="top-left">
          <Legend />
        </Panel>
        <Panel position="top-right" className="">
          {hasCourseBuilder && (
            <CourseBuilderBar setEdges={setEdges} setNodes={setNodes} />
          )}
        </Panel>

        <Background color={backgroundGridColor} gap={backgroundGap} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

ViewableFlowchart.defaultProps = {
  backgroundColor: "#FFF",
  borderColor: "#79BDE8",
  textColor: "black",
  borderRadius: "0.375rem",
  padding: "1rem",
  arrowColor: "#79BDE8",
  strokeColor: "#79BDE8",
  strokeWidth: 3,
  viewHeight: "90vh",
  chartBackgroundColor: "white",
  chartBorderColor: "transparent",
  chartBorderRadius: "0.375rem",
  chartPadding: "1rem",
  enableMouseEvents: true,
  backgroundGap: 16,
  backgroundGridColor: "#aaa",
  mobileView: false, // default value
  enableTooltip: false,
  hasCourseBuilder: false,
  setNodes: () => {},
  setEdges: () => {},
};

export default ViewableFlowchart;

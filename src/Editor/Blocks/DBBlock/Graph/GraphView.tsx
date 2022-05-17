import React, { useEffect, useRef } from "react";

import './Graph.css'

//import { useRecoilValue } from "recoil";
//import { blockSelector, DBSelector } from "../../../recoil/atom";

import * as d3 from 'd3'

import ViewMenu from "../Components/ViewMenu/ViewMenu";

const Graph = (props: BlockProps) => {
  //const block = useRecoilValue(blockSelector(props)) as any
  //const db = useRecoilValue(DBSelector(block.data.id))

  const ref = useRef<HTMLDivElement>(null)

  var margin = {top: 30, right: 30, bottom: 70, left: 60}

  useEffect(() => {
    return () => {
      var width = ref.current!.offsetWidth
      const d3base = d3.select(ref.current!)
        .append("svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "0 0 " + width + " " + (width))
          .classed("Graph", true)
        .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      generateBarCharts(d3base)
    }
  },[])

  const generateBarCharts = (d3base: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    const data = [{Country: 'USA', Value: 100}, {Country: 'JPN', Value: 300}]

    var x = d3.scaleBand()
      .range([ 0, ref.current!.offsetWidth])
      .domain(data.map(function(d) { return d.Country; }))
      .padding(0.2);
    d3base.append("g")
      .attr("transform", "translate(0," + ref.current!.offsetWidth*0.75 + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    var y = d3.scaleLinear()
      .domain([0, 500])
      .range([ref.current!.offsetWidth*0.75, 0]);
    d3base.append("g")
      .call(d3.axisLeft(y));

    console.log(y(0), y(500))

    d3base.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d):number { return x(d.Country) as number })
        .attr("y", function(d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return ref.current!.offsetWidth*0.75 - y(d.Value); })
        .attr("fill", "#69b3a2")
  }

  return (
    <>
      <ViewMenu row_index={props.row_index} col_index={props.col_index}/>
      <div className="GraphBase" ref={ref} />
    </>)
}

export default Graph
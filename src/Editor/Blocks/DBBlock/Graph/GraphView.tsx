import React, { useEffect, useRef } from "react";

import './Graph.css'

import { useRecoilValue } from "recoil";
import { blockSelector, DBSelector } from "../../../recoil/atom";

import * as d3 from 'd3'

import DropDownMenu from "../../../Components/Menu/DropDownMenu/DropDownMenu";
import { MenuOptions } from "./GraphMenuOptions";

const Graph = (props: BlockProps) => {
  const block = useRecoilValue(blockSelector(props)) as any
  const db = useRecoilValue(DBSelector(block.data.id)) as Data

  const ref = useRef<HTMLDivElement>(null)

  var margin = {top: 30, right: 30, bottom: 70, left: 60}

  var d3base: d3.Selection<SVGGElement, unknown, null, undefined>
  var data: any[][] = new Array(db.data.length).fill([0, 0])

  useEffect(() => {
    var width = ref.current!.offsetWidth
    d3base = d3.select(ref.current!)
      .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + (width*0.75))
        .classed("Graph", true)
      .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    drawLineCharts()
    return () => {}
  },[])

  const setData = (index: number, action: string) => {
    switch(action){
      case('setXAxis'):
        data = db.data.map((row, row_index) => {
          data[row_index][0] = row[index].data
          return data
        })
        break
      case('setYAxis'):
        data = db.data.map((row, row_index) => {
          data[row_index][1] = row[index].data
          return data
        })
        break
    }
  }

  const scaleTime = (data: any[], width: number) => {
    return d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date }) as any[])
      .range([ 0, width ]);
  }

  const scaleBand = (data: any[], width: number) => {
    return d3.scaleBand()
      .range([ 0, width])
      .domain(data.map(function(d) { return d.Country; }))
      .padding(0.2);
  }

  const scaleLinear = (data: any[], height: number) => {
    return d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);
  }

  const drawBarCharts = () => {
    const data = [{Country: 'USA', Value: 100}, {Country: 'JPN', Value: 300}]

    var height = ref.current!.offsetWidth*0.75
    var margin = 70

    var x = scaleBand(data, 100)
    
    d3base.append("g")
      .attr("transform", "translate(0," + (height-margin) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    var y = scaleLinear(data, height-margin)
    d3base.append("g")
      .call(d3.axisLeft(y));

    d3base.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d):number { return x(d.Country) as number })
        .attr("y", function(d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height-margin - y(d.Value); })
        .attr("fill", "#69b3a2")
  }

  const drawLineCharts = () => {
    const data = [{date: '2022-05-15', Value: 10}, {date: '2022-05-17', Value: 30}]

    var height = ref.current!.offsetWidth*0.75
    var margin = 70

    var x = d3.scaleTime()
      .domain([new Date('2022-05-10'), new Date('2022-05-20')])
      .range([0, 500])
    d3base.append("g")
      .attr("transform", "translate(0," + (height-margin) + ")")
      .call(d3.axisBottom(x))
    
    var y = scaleLinear(data, height-margin)
    d3base.append("g")
      .call(d3.axisLeft(y))

    console.log(d3.timeParse("%Y-%m-%d")('2022-05-15')!, x(d3.timeParse("%Y-%m-%d")('2022-05-15')!))

    d3base.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", (d3.line() as any)
        .x(function(d: any):number { return x(new Date(d.date)) as number })
        .y(function(d: any) { return y(d.Value) })
        )
  }

  return (
    <>
      <div className="column_name_wrapper">
        {db.column.map((column, index) => {
          return <div key={index}><DropDownMenu title={column.name} Action ={() => {}} contents={MenuOptions} icon="" id={String(index)}/></div>
        })}
      </div>
      <div className="GraphBase" ref={ref} />
    </>)
}

export default Graph
import React, { useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import Modal from 'react-modal'
import Iframe from 'react-iframe'
import Checkbox from './Checkbox'
import AxisX from './AxisX'
import AxisY from './AxisY'

const TYPE = {
  green: 'green',
  red: 'red'
}
const TYPE_COLOR = {
  [TYPE.green]: 'green',
  [TYPE.red]: 'red'
}
const NODE_RADIUS = 10
const CHAR_WIDTH = 8
const nodes = [
  {
    id: 1,
    type: 'red',
    title: 'title node 1',
    x: 20,
    y: 68
  },
  {
    id: 2,
    type: 'green',
    title: 'title node 2',
    x: 20,
    y: 72
  },
  {
    id: 3,
    type: 'red',
    title: 'title node 3',
    x: 25,
    y: 75
  },
  {
    id: 4,
    type: 'red',
    title: 'title node 4',
    x: 70,
    y: 25
  },
  {
    id: 5,
    type: 'green',
    title: 'title node 5',
    x: 74,
    y: 27
  },
  {
    id: 6,
    type: 'red',
    title: 'title node 6',
    x: 80,
    y: 20
  },
  {
    id: 7,
    type: 'red',
    title: 'title node 7',
    x: 20,
    y: 20
  },
  {
    id: 8,
    type: 'green',
    title: 'title node 8',
    x: 20,
    y: 30
  },
  {
    id: 9,
    type: 'red',
    title: 'title node 9',
    x: 25,
    y: 35
  },
  {
    id: 10,
    type: 'red',
    title: 'title node 10',
    x: 75,
    y: 75
  },
  {
    id: 11,
    type: 'green',
    title: 'title node 11',
    x: 73,
    y: 80
  },
  {
    id: 12,
    type: 'red',
    title: 'title node 12 22222222',
    x: 70,
    y: 85
  }
]
const App = ({
  containerWidth = 800,
  containerHeight = 800,
  axisLabel3 = '333333333333',
  axisLabel4 = '4444',
  axisLabel5 = '5555',
  axisLabel6 = '666666',
  axisLabel1 = '111111111111111111111111111111111111111111111111',
  axisLabel1a = '1aaaaa',
  axisLabel1b = '1bbbbBBBBBB',
  axisLabel2 = '222',
  axisLabel2a = '2aa',
  axisLabel2b = '2bb'
}) => {

  const [visibleDialog, setVisibleDialog] = useState(false)
  const [visibleText, setVisibleText] = useState(true)
  const [appContext, setAppContext] = useState({})
  const [transformInfo, setTransformInfo] = useState(null)
  const { axis, scatterSvg } = appContext

  const getTextWidth = text => text.length * CHAR_WIDTH
  const xTypes = [axisLabel1a, axisLabel1, axisLabel1b]
  const yTypes = [axisLabel2a, axisLabel2, axisLabel2b]
  const innerTexts = [
    { x: 25, y: 25, title: axisLabel3 },
    { x: 75, y: 25, title: axisLabel4 },
    { x: 25, y: 75, title: axisLabel5 },
    { x: 75, y: 75, title: axisLabel6 }
  ]
  const appMargin = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerLineData = [
    { 
      x1: 0,
      y1: 50,
      x2: 100,
      y2: 50
    },
    { 
      x1: 50,
      y1: 0,
      x2: 50,
      y2: 100
    }
  ]

  const drawLine = ({ begin, end }) => {
    // axisContext.lineWidth = 1
    // axisContext.strokeStyle = 'rgb(37 37 37)'
    // axisContext.beginPath()
    // axisContext.moveTo(...begin)
    // axisContext.lineTo(...end)
    // axisContext.stroke()
  }

  const drawNormalAxis = () => {
    axis.width = containerWidth
    axis.height = containerHeight

    drawLine({ begin: [0, axis.clientHeight / 2], end: [axis.clientWidth, axis.clientHeight / 2] })
    drawLine({ begin: [axis.clientWidth / 2, 0], end: [axis.clientWidth / 2, axis.clientHeight] })
  }

  const drawNodes = useCallback(() => {
    d3.selectAll('#myTexts').style('opacity', visibleText ? 1 : 0)
  }, [scatterSvg, visibleText, transformInfo])

  useEffect(() => {
    if (appContext.axis) {
      drawNormalAxis()
    }
  }, [appContext.axis])

  useEffect(() => {
    if (!scatterSvg) return
    drawNodes()
  }, [scatterSvg, visibleText])

  function center(event, target) {
    if (event.sourceEvent) {
      const p = d3.pointers(event, target);
      return [d3.mean(p, d => d[0]), d3.mean(p, d => d[1])];
    }
    return [containerWidth / 2, containerHeight / 2];
  }

  useEffect(() => {
    let data = nodes.map(item => [item.x, item.y])
    data = [...data, ...Array.from({length: 50}, () => [100 * Math.random(), Math.random()])]
    // data = nodes.map(item => [item.x, item.y])
    console.error('data', data)

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]))
      .range([30, containerWidth - 10])
      .nice()
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[1]))
      .range([containerHeight - 30, 10])
      .nice()
    const xAxis = (g, scale) => g
      .attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(scale).ticks(8))
      .call(g2 => g2.select(".domain").attr("display", "none"))
    const yAxis = (g, scale) => g
      .attr("transform", `translate(${x(0)},0)`)
      .call(d3.axisLeft(scale).ticks(8))
      .call(g2 => g2.select(".domain").attr("display", "none"))

    const svg = d3.select('#svg-app').attr("viewBox", [0, 0, containerWidth, containerHeight])
    // const vo = svg.append("path")
    const gx = svg.append("g")
    const gy = svg.append("g")
    // const dots = svg.append("g")
    //   .selectAll("ellipse")
    //   .data(data)
    //   .join("ellipse")
    //   .attr("fill", () => d3.schemeOranges[9][(Math.random() * 9) | 0]);
    const innerText = svg.append('g')
      .selectAll('text')
      .data(innerTexts)
      .join('text')
      .text(d => d.title)
      .style('fill', 'rgb(224, 222, 222)')
      .style('font-size', '20')
      .style('text-align', 'center')
    const innerLine = svg.append('g')
      .selectAll("line")
      .data(innerLineData)
      .join('line')
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      
      const myTexts = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.title)
      .style('fill', 'black')
      .attr('id', 'myTexts')
    const myCircle = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('stroke', d => TYPE_COLOR[d.type])
      .attr('cursor', 'pointer')
      .style('fill', d => TYPE_COLOR[d.type])
    // z holds a copy of the previous transform, so we can track its changes
    let z = d3.zoomIdentity;

    // set up the ancillary zooms and an accessor for their transforms
    const zoomX = d3.zoom().scaleExtent([1, 3]);
    const zoomY = d3.zoom().scaleExtent([1, 3]);
    const tx = () => d3.zoomTransform(gx.node());
    const ty = () => d3.zoomTransform(gy.node());
    gx.call(zoomX).attr("pointer-events", "none");
    gy.call(zoomY).attr("pointer-events", "none");

    // active zooming
    const zoom = d3.zoom().on("zoom", function(e) {
      const t = e.transform;
      const k = t.k / z.k;
      const point = center(e, this);

      // is it on an axis? is the shift key pressed?
      const doX = point[0] > x.range()[0];
      const doY = point[1] < y.range()[0];
      const shift = e.sourceEvent && e.sourceEvent.shiftKey;

      if (k === 1) {
        // pure translation?
        doX && gx.call(zoomX.translateBy, (t.x - z.x) / tx().k, 0);
        doY && gy.call(zoomY.translateBy, 0, (t.y - z.y) / ty().k);
      } else {
        // if not, we're zooming on a fixed point
        doX && gx.call(zoomX.scaleBy, shift ? 1 / k : k, point);
        doY && gy.call(zoomY.scaleBy, k, point);
      }

      z = t;

      const xr = tx().rescaleX(x);
      const yr = ty().rescaleY(y);

      gx.call(xAxis, xr);
      gy.call(yAxis, yr);
      
      innerText
        .attr('x', d => xr(d.x) - getTextWidth(d.title))
        .attr('y', d => yr(d.y))
      
      innerLine
        .attr("x1", d => xr(d.x1))
        .attr("y1", d => yr(d.y1))
        .attr("x2", d => xr(d.x2))
        .attr("y2", d => yr(d.y2))
        
      myTexts
        .attr('x', d => xr(d.x) + NODE_RADIUS - getTextWidth(d.title) / 2)
        .attr('y', d => yr(d.y) + NODE_RADIUS * 3)

      myCircle
        .attr('cx', d => xr(d.x))
        .attr('cy', d => yr(d.y))
        .attr('r', NODE_RADIUS)
    });
    
    d3.selectAll('circle').on('click', d => onClickNode(d.id))
    svg.call(zoom)
      .call(zoom.transform, d3.zoomIdentity.scale(1))
      .node();
    
    const canvasAxis = document.getElementById('axis')
    setAppContext({
      axis: canvasAxis,
      axisContext: canvasAxis.getContext('2d'),
      scatterSvg: svg
    })
  }, [])

  const onClickNode = (id) => {
    setVisibleDialog(true)
  }

  const onCloseDialog = () => {
    setVisibleDialog(false)
  }

  const onToggleTitle = (event) => {
    setVisibleText(event.target.checked)
  }

  return (
    <div style={{ display: 'flex' }}>
      <AxisY originalHeight={containerHeight} axisHeight={containerHeight + 170} axisLabel2={axisLabel2} axisLabel2a={axisLabel2a} axisLabel2b={axisLabel2b} />
      <div style={{ width: containerWidth, height: containerHeight + 70, padding: '40px 60px 60px 0', boxSizing: 'content-box', background: '#e0dede' }}>
        <Checkbox label='Hide labels' checked={visibleText} onChange={onToggleTitle} />
        <div style={{ position: 'relative', width: containerWidth, height: containerHeight, background: 'white' }}>
          <svg id='svg-app' style={{ position: 'absolute' }} />
          <canvas id='axis' />

          {visibleDialog && (
            <Modal width='300' height='300' ariaHideApp={false} isOpen={true} onRequestClose={onCloseDialog} contentLabel='Example Modal'>
              <Iframe url='http://www.youtube.com/embed/xDMP3i36naA'
                width='100%'
                height='100%'
                id='myId'
                display='initial'
                position='relative' />
            </Modal>
          )}
        </div>
        <AxisX originalWidth={containerWidth} axisWidth={containerWidth} axisLabel1={axisLabel1} axisLabel1a={axisLabel1a} axisLabel1b={axisLabel1b} />
      </div>
    </div>
  )
}

export default App
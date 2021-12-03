import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import AxisX from './AxisX'
import AxisY from './AxisY'
import {getPhenomenonUrl} from '../../helpers/contentCard'
import { requestTranslation } from '@sangre-fp/i18n'

const NODE_RADIUS = 10
const SPECIAL_NODE_RADIUS = 6

// const requestTranslation = () => 'request Translation'
// const getPhenomenonUrl = (a, b) => 'http://google.com'

const App = ({
  containerWidth = 500,
  containerHeight = 500,
  axisLabel3 = 'BottomLeft',
  axisLabel4 = 'BottomRight',
  axisLabel5 = 'TopLeft',
  axisLabel6 = 'TopRight',
  axisLabel1 = 'Horizontal Axis Default',
  axisLabel1a = 'Left End Default',
  axisLabel1b = 'Right End Default',
  axisLabel2 = 'Vertical Axis Default',
  axisLabel2a = 'Low End Default',
  axisLabel2b = 'High End Default',
  phenomena = [],
  radar
}) => {

  const [visibleDialog, setVisibleDialog] = useState(false)
  const [visibleText, setVisibleText] = useState(true)
  const [appContext, setAppContext] = useState({})
  const { axis, scatterSvg } = appContext
  const [isAverage, setIsAverage] = useState(true)

  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }
  
  const innerTexts = [
    { x: 25, y: 25, title: axisLabel3, gutter: -margin.left / 2 },
    { x: 75, y: 25, title: axisLabel4, gutter: margin.left / 2 },
    { x: 25, y: 75, title: axisLabel5, gutter: -margin.left / 2 },
    { x: 75, y: 75, title: axisLabel6, gutter: margin.left / 2 }
  ]

  const innerLineData = [
    {
      x1: -1500,
      y1: 50,
      x2: 1500,
      y2: 50
    },
    {
      x1: 50,
      y1: -1500,
      x2: 50,
      y2: 1500
    }
  ]

  const maxTextWidth = 90

  const rectNodes = React.useMemo(() => {
    return [
      {
        x: 0,
        y: 100,
        width: containerWidth,
        height: containerHeight
      }
    ]
  }, [containerWidth, containerHeight])

  const setNodeColor = (phenomenon) => {
    let innerStroke = 'transparent'
    let outerStroke = 'transparent'
    let fillSymbol = 'rgb(0, 202, 141)'

    if (phenomenon['content-type-alias'] === 'summary') {
      innerStroke = '#fff'
    }

    if (phenomenon['content-type-alias'] === 'rising') {
      innerStroke = 'transparent'
    }

    if (phenomenon['content-type-alias'] === 'weaksignal') {
      innerStroke = 'transparent'
      fillSymbol = 'rgb(168, 168, 168)'
    }

    if (phenomenon['content-type-alias'] === 'cooling') {
      innerStroke = 'transparent'
      fillSymbol = 'rgb(0, 152, 255)'
    }

    if (phenomenon['content-type-alias'] === 'wildcard') {
      innerStroke = 'transparent'
      fillSymbol = 'rgb(233, 87, 87)'
    }
    return { innerStroke, outerStroke, fillSymbol }
  }

  const nodeListAsMedian = React.useMemo(() => {
    let nodes = []
    !!phenomena?.length && phenomena.map((phen) => {
      if (phen['rating_x']['median'] !== null && phen['rating_y']['median'] !== null) {
        const { innerStroke, outerStroke, fillSymbol } = setNodeColor(phen)
        let node = {}
        node['id'] = phen['id']
        node['color'] = phen['color']
        node['content-type-alias'] = phen['content-type-alias']

        if (phen?.color === 'none') {
          if ((node['content-type-alias'] !== undefined) || node['content-type-alias'] !== 'undefined') {
            // normal nodes
            node['type'] = [].concat({ innerStroke, outerStroke, fillSymbol })
          } else {
             // undefined types
          node['type'] = [].concat({ innerStroke , outerStroke, fillSymbol })
          }
        } 
        else {
          // customer custom types
          node['type'] = [].concat({ innerStroke, outerStroke: 'transparent', fillSymbol: phen.color })
        }

        node['title'] = String(phen['content']['short_title']) || String(phen['content']['title'])
        node['x'] = phen['rating_x']['median']
        node['y'] = phen['rating_y']['median']
        node['avg'] = false

        nodes.push(node)
      }
    })
    return nodes
  }, [phenomena])

  const nodeListAsAverage = React.useMemo(() => {
    let nodes = []

    !!phenomena?.length && phenomena.map((phen) => {
      if (phen['rating_x']['avg'] && phen['rating_y']['avg']) {
        
        const { innerStroke, outerStroke, fillSymbol } = setNodeColor(phen)
        let node = {}
        node['id'] = phen['id']
        node['color'] = phen['color']
        node['content-type-alias'] = phen['content-type-alias']
        if (phen?.color === 'none') {
          if ((node['content-type-alias'] !== undefined) || node['content-type-alias'] !== 'undefined') {
            // normal nodes
            node['type'] = [].concat({ innerStroke, outerStroke, fillSymbol })
          } else {
             // undefined types
          node['type'] = [].concat({ innerStroke , outerStroke, fillSymbol })
          }
        } 
        else {
          // customer custom types
          node['type'] = [].concat({ innerStroke, outerStroke: 'transparent', fillSymbol: phen.color })
        }
        node['title'] = String(phen['content']['short_title']) || String(phen['content']['title'])
        node['x'] = phen['rating_x']['avg']
        node['y'] = phen['rating_y']['avg']
        node['avg'] = true

        nodes.push(node)
      }
    })
    return nodes
  }, [phenomena])

  function center(event, target) {
    if (event.sourceEvent) {
      const p = d3.pointers(event, target)
      return [d3.mean(p, d => d[0]), d3.mean(p, d => d[1])]
    }
    return [containerWidth / 2, containerHeight / 2]
  }

  const getTextWidth = (text, fontSize = 10, fontFace = 'Roboto') => {
    const canvasAxis = document.getElementById('axis')
    const context = canvasAxis.getContext('2d')
    context.font = fontSize + 'px ' + fontFace
    return context.measureText(text).width
  }

  useEffect(() => {
    if (appContext.axis) {
      axis.width = containerWidth
      axis.height = containerHeight
    }
  }, [appContext.axis])

  useEffect(() => {
    if (!scatterSvg) return
    d3.selectAll('#myNewTextsAvg').style('opacity', visibleText ? 1 : 0)
    d3.selectAll('#myNewTextsMedian').style('opacity', visibleText ? 1 : 0)
    if (isAverage) {
      d3.selectAll('#myNewTextsAvg').style('opacity', visibleText ? 1 : 0)
      d3.selectAll('#myNewTextsMedian').style('opacity', 0)
      d3.selectAll('#circleAvg').style('opacity', 1)
      d3.selectAll('#circleMedian').style('opacity', 0)
    }
    else if (!isAverage) {
      d3.selectAll('#myNewTextsMedian').style('opacity', visibleText ? 1 : 0)
      d3.selectAll('#myNewTextsAvg').style('opacity', 0)
      d3.selectAll('#circleMedian').style('opacity', 1)
      d3.selectAll('#circleAvg').style('opacity', 0)
    }
  }, [scatterSvg, visibleText])

  useEffect(() => {
    if (!scatterSvg) return

    d3.selectAll('#circleAvg').style('opacity', 0)
    d3.selectAll('#circleMedian').style('opacity', 0)
    if (isAverage) {
      d3.selectAll('#myNewTextsAvg').style('opacity', visibleText ? 1 : 0)
      d3.selectAll('#myNewTextsMedian').style('opacity', 0)
      d3.selectAll('#circleAvg').style('opacity', 1)
      d3.selectAll('#circleMedian').style('opacity', 0)
    }
    else if (!isAverage) {
      d3.selectAll('#myNewTextsMedian').style('opacity', visibleText ? 1 : 0)
      d3.selectAll('#myNewTextsAvg').style('opacity', 0)
      d3.selectAll('#circleMedian').style('opacity', 1)
      d3.selectAll('#circleAvg').style('opacity', 0)
    }

  }, [scatterSvg, isAverage])

  useEffect(() => {
    const svg = d3.select('#svg-app').attr("viewBox", [0, 0, containerWidth, containerHeight])

    const canvasAxis = document.getElementById('axis')
    setAppContext({
      axis: canvasAxis,
      axisContext: canvasAxis.getContext('2d'),
      scatterSvg: svg
    })
  }, [containerWidth])

  useEffect(() => {
    
    try {
      if (phenomena.length < 1 || !scatterSvg) return
    let nodes = [...nodeListAsAverage, ...nodeListAsMedian]

    let data = nodes.map(item => [item.x, item.y])
    data = [...data, ...Array.from({ length: 50 }, () => [100 * Math.random(), 100 * Math.random()])]

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]))
      .nice()
      .rangeRound([margin.left, containerWidth - margin.right])
      
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]))
      .nice()
      .rangeRound([containerHeight - margin.bottom, margin.top])

    const xAxis = (g, scale) => g
      .attr("transform", `translate(0,${y(0) + 10})`)
      .style('opacity', 0)
      .call(d3.axisBottom(scale).ticks(8))
      .call(g2 => g2.select(".domain").attr("display", "none"))
      .call(g2 => g2.selectAll(".tick line").attr("display", "none"))

    const yAxis = (g, scale) => g
      .attr("transform", `translate(${x(0) - 5},0)`)
      .style('opacity', 0)
      .call(d3.axisLeft(scale).ticks(8))
      .call(g2 => g2.select(".domain").attr("display", "none"))
      .call(g2 => g2.selectAll(".tick line").attr("display", "none"))

    const myWhiteRect = scatterSvg.append('g')
      .selectAll('rect')
      .data(rectNodes)
      .join('rect')
      .attr('fill', 'white')

      const innerText = scatterSvg.append('g').selectAll('foreignObject').data(innerTexts).join('foreignObject')
    innerText
      .attr('width', containerWidth / 2)
      .attr('height', 60)
      .style('fill', 'rgb(224, 222, 222)')
      .style('font-style', 'italic')
      .style('font-weight', '700')
      .style('font-family', 'L10')
      .style('font-size', '18')
      .style('text-align', 'center')
      .style('color', 'rgb(224, 222, 222)')
      .append("xhtml:div")
      .html(d => d.title)

    

    const innerLine = scatterSvg.append('g')
      .selectAll("line")
      .data(innerLineData)
      .join('line')
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)

    const gx = scatterSvg.append("g")
    const gy = scatterSvg.append("g")

    const myForeignObjectsAvg = scatterSvg.append('g').selectAll('foreignObject').data(nodeListAsAverage).join('foreignObject')
    myForeignObjectsAvg
      .attr('id', 'myNewTextsAvg')
      .attr('width', maxTextWidth)
      .attr('height', 200)
      .attr('style', "overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; hyphens: auto;")
      .style('transition', 'font-size 0.2s')
      .style('transition-timing-function', 'linear')
      .style('text-align', 'center')
      .append("xhtml:div")
      .html(d => d.title)

    const myForeignObjectsMedian = scatterSvg.append('g').selectAll('foreignObject').data(nodeListAsMedian).join('foreignObject')
      myForeignObjectsMedian
        .attr('id', 'myNewTextsMedian')
        .attr('width', maxTextWidth)
        .attr('height', 200)
        .attr('style', "overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; hyphens: auto;")
        .style('transition', 'font-size 0.2s')
        .style('transition-timing-function', 'linear')
        .style('text-align', 'center')
        .append("xhtml:div")
        .html(d => d.title)

    const myCircleAvg1 = scatterSvg.append('g')
      .selectAll('circle')
      .data(nodeListAsAverage)
      .join('circle')
      .attr('stroke', d => {
        return d.type[0].outerStroke
      })
      .attr('cursor', 'pointer')
      .attr('class', d => {
        return (String(d?.color) === 'none' && (String(d['content-type-alias']) === 'undefined')) ? 'outer_special_circle left' : 'outer_normal_circle left'
      })
      .attr('id', 'circleAvg')
      .style('fill', d => {
        return d.type[0].fillSymbol
      })

    const myCircleAvg = scatterSvg.append('g')
      .selectAll('circle')
      .data(nodeListAsAverage)
      .join('circle')
      .attr('stroke', d => {
        return d.type[0].innerStroke
      })
      .attr('cursor', 'pointer')
      .attr('class', d => {return (String(d?.color) === 'none' && (String(d['content-type-alias']) === 'undefined')) ? 'inner_special_circle left' : 'inner_normal_circle left'})
      .attr('id', 'circleAvg')
      .style('fill', d => {
        if (!!(String(d?.color) === 'none' && (String(d['content-type-alias']) === 'undefined'))) {
          return 'white'
        }

        return d.type[0].fillSymbol
      })
      .attr('cursor', 'pointer')

    const myCircleMedian1 = scatterSvg.append('g')
      .selectAll('circle')
      .data(nodeListAsMedian)
      .join('circle')
      .attr('stroke', d => d.type[0].outerStroke)
      .attr('cursor', 'pointer')
      .attr('id', 'circleMedian')
      .attr('class', d => {
        return (!!(String(d?.color) === 'none' && (String(d['content-type-alias']) === 'undefined'))) ? 'outer_special_circle_median left' : 'outer_normal_circle_median left'
      })
      .style('fill', d => d.type[0].fillSymbol)

    const myCircleMedian = scatterSvg.append('g')
      .selectAll('circle')
      .data(nodeListAsMedian)
      .join('circle')
      .attr('stroke', d => d.type[0].innerStroke)
      .attr('cursor', 'pointer')
      .attr('id', 'circleMedian')
      .attr('class', d => {return (!!(String(d?.color) === 'none' && (String(d['content-type-alias']) === 'undefined'))) ? 'inner_special_circle_median left' : 'inner_normal_circle_median left'})
      .style('fill', d => {
        if (!!(String(d?.color) === 'none' && (String(d['content-type-alias']) === 'undefined'))) {
          return 'white'
        }

        return d.type[0].fillSymbol
      })
      .attr('cursor', 'pointer')

      if (isAverage) {
        d3.selectAll('#myNewTextsAvg').style('opacity', visibleText ? 1 : 0)
        d3.selectAll('#myNewTextsMedian').style('opacity', 0)
        d3.selectAll('#circleAvg').style('opacity', 1)
        d3.selectAll('#circleMedian').style('opacity', 0)
      }
      else if (!isAverage) {
        d3.selectAll('#myNewTextsMedian').style('opacity', visibleText ? 1 : 0)
        d3.selectAll('#myNewTextsAvg').style('opacity', 0)
        d3.selectAll('#circleMedian').style('opacity', 1)
        d3.selectAll('#circleAvg').style('opacity', 0)
      }

    // z holds a copy of the previous transform, so we can track its changes
    let z = d3.zoomIdentity

    // set up the ancillary zooms and an accessor for their transforms
    const zoomX = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [containerWidth, containerHeight]])
    const zoomY = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [containerWidth, containerHeight]])
    const tx = () => d3.zoomTransform(gx.node())
    const ty = () => d3.zoomTransform(gy.node())
    gx.call(zoomX).attr("pointer-events", "none")
    gy.call(zoomY).attr("pointer-events", "none")

    const inner_normal_circle = d3.selectAll('.inner_normal_circle')
    const outer_normal_circle = d3.selectAll('.outer_normal_circle')
    const outer_special_circle = d3.selectAll('.outer_special_circle')
    const inner_special_circle = d3.selectAll('.inner_special_circle')
    const outer_normal_circle_median = d3.selectAll('.outer_normal_circle_median')
    const outer_special_circle_median= d3.selectAll('.outer_special_circle_median')
    const inner_normal_circle_median = d3.selectAll('.inner_normal_circle_median')
    const inner_special_circle_median = d3.selectAll('.inner_special_circle_median')
    const myNewTextsMedianID = d3.selectAll('#myNewTextsMedian')
    const myNewTextsAvgID = d3.selectAll('#myNewTextsAvg')
    
    // active zooming
    const zoom = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [containerWidth, containerHeight]]).on("zoom", function (e) {
      try {
          const trans = d3.transition().duration(150).ease(d3.easeLinear)
          const t = e.transform
    
          const k = t.k / z.k
          const point = center(e, this)
    
          // is it on an axis? is the shift key pressed?
          // const doX = point[0] > x.range()[0]
          // const doY = point[1] < y.range()[0]
          const shift = e.sourceEvent && e.sourceEvent.shiftKey
    
          if (k === 1) {
            // pure translation?
            gx.call(zoomX.translateBy, (t.x - z.x) / tx().k, 0)
            gy.call(zoomY.translateBy, 0, (t.y - z.y) / ty().k)
          } else {
            // if not, we're zooming on a fixed point
          gx.call(zoomX.scaleBy, shift ? 1 / k : k, point)
            gy.call(zoomY.scaleBy, k, point)
            // doY && gy.call(zoomY.scaleBy, k, point)
          }
    
          z = t
    
          const xr = tx().rescaleX(x)
          const yr = ty().rescaleY(y)
          const radius = myCircleAvg.attr('r')
    
          gx.call(xAxis, xr)
          gy.call(yAxis, yr)
    
          myWhiteRect
            .attr('x', d => xr(d.x))
            .attr('y', d => yr(d.y))
            .attr('width', d => d.width * t.k)
            .attr('height', d => d.height * t.k)
    
          innerText
            .transition(trans)
            .attr('x', d => {
              return xr(d.x) - containerWidth / 4 + d.gutter
            })
            .attr('y', d => yr(d.y) - 22)
    
          innerLine
            .transition(trans)
            .attr("x1", d => xr(d.x1))
            .attr("y1", d => yr(d.y1))
            .attr("x2", d => xr(d.x2))
            .attr("y2", d => yr(d.y2))

          outer_normal_circle
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(NODE_RADIUS, Math.floor(NODE_RADIUS + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                outer_normal_circle
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))

          outer_special_circle
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(SPECIAL_NODE_RADIUS, Math.floor(SPECIAL_NODE_RADIUS + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                outer_special_circle
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))

          inner_normal_circle
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(NODE_RADIUS - 3, Math.floor(NODE_RADIUS - 3 + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                inner_normal_circle
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))

          inner_special_circle
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(SPECIAL_NODE_RADIUS - 3, Math.floor(SPECIAL_NODE_RADIUS - 3 + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                inner_special_circle
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))
    
          outer_normal_circle_median
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(NODE_RADIUS, Math.floor(NODE_RADIUS + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                outer_normal_circle_median
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))

          outer_special_circle_median
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(SPECIAL_NODE_RADIUS, Math.floor(SPECIAL_NODE_RADIUS + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                outer_special_circle_median
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))

    
          inner_normal_circle_median
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(NODE_RADIUS - 3, Math.floor(NODE_RADIUS - 3 + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                inner_normal_circle_median
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))

          inner_special_circle_median
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(SPECIAL_NODE_RADIUS - 3, Math.floor(SPECIAL_NODE_RADIUS - 3 + minScale))
              //   const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
                inner_special_circle_median
                  // .transition(tran2)
                  .attr('cx', d => xr(d.x))
                  .attr('cy', d => yr(d.y))
                  .attr('r', r)
              } catch (error) {
                console.error(error)
              }
            })
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('data-href', d => getPhenomenonUrl(radar?.id, d))

          myForeignObjectsAvg
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(10, Math.floor(10 + minScale))
                const fonts = Math.max(10, Math.floor(9 + minScale))
                myNewTextsAvgID.style('font-size', fonts).attr('y', d => yr(d.y) + r / 1 - 3)
              } catch (err) {
                console.log('error', err)
              }
              
            })
            .attr('x', d => {
              return xr(d.x) - maxTextWidth / 2
            })
            .attr('y', d => yr(d.y) + radius / 1)

          myForeignObjectsMedian
            .transition(trans)
            .on('end', () => {
              try {
                const scale = Math.min(t.k, 8)
                const minScale = Math.max(scale, 1)
                const r = Math.max(10, Math.floor(10 + minScale))
                const fonts = Math.max(10, Math.floor(9 + minScale))
                myNewTextsMedianID.style('font-size', fonts).attr('y', d => yr(d.y) + r / 1 - 3)
              } catch (err) {
                console.log('error', err)
              }
            })
            .attr('x', d => {
              return xr(d.x) - maxTextWidth / 2
            })
            .attr('y', d => yr(d.y) + radius / 1)
            
        } catch (error) {
          console.error(error)
        }
      })
      d3.selectAll('circle').on('click', d => onClickNode(d.id))
      scatterSvg.call(zoom)
        .call(zoom.transform, d3.zoomIdentity.scale(1))
        .node()
      return () => {
        scatterSvg.selectAll("*").remove()
      }
    } catch (error) {
      console.error(error)
    }
  }, [phenomena, scatterSvg, containerHeight, containerWidth])

  const onClickNode = (id) => {
    setVisibleDialog(true)
  }

  const onCloseDialog = () => {
    setVisibleDialog(false)
  }

  const onToggleTitle = (event) => {
    setVisibleText(!visibleText)
  }

  const onToggleIsAverage = (event) => {
    setIsAverage(true)
  }

  const onToggleIsMedian = (event) => {
    setIsAverage(false)
  }

  return (
    <div style={{width: '100%'}}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '56px', paddingRight: '60px' }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="customCheckbox_hideTitles_ratings" checked={!visibleText} onChange={onToggleTitle} />
              <label className="custom-control-label" for="customCheckbox_hideTitles_ratings" style={{fontWeight: 400, fontSize: '13px'}}>{ (radar?.radarLanguage === "en" ? 'Hide titles' : 'Piilota otsikot') || requestTranslation('HideTitles_RatingResults')}</label>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', marginRight: '-12px' }}>
          <p style={{ fontSize: "13px", margin: 0, fontWeight: 400}}>{ (radar?.radarLanguage === "en" ? 'Show results as:' : 'Näytä tulokset muodossa:') || requestTranslation('ShowResultsAs_RatingResults')} </p>
          <div className="custom-control custom-radio custom-control-inline" style={{marginLeft: '16px'}}>
            <input 
              type="radio" 
              id="customRadioInline_AsAverage" 
              name="customRadioInline_AsAverage" 
              className="custom-control-input" 
              checked={isAverage} 
              onChange={onToggleIsAverage} 
            />
              <label className="custom-control-label" for="customRadioInline_AsAverage" style={{fontWeight: 400, fontSize: '13px'}}>{ (radar?.radarLanguage === "en" ? 'Average' : 'Keskiarvo') || requestTranslation('Average_RatingResults')}</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input 
              type="radio" 
              id="customRadioInline_AsMedian" 
              name="customRadioInline_AsMedian" 
              className="custom-control-input" 
              checked={!isAverage} 
              onChange={onToggleIsMedian} 
            />
              <label className="custom-control-label" for="customRadioInline_AsMedian" style={{fontWeight: 400, fontSize: '13px'}}>{ (radar?.radarLanguage === "en" ? 'Median' : 'Mediaani') || requestTranslation('Median_RatingResults')}</label>
          </div>
        </div>   
    </div>
    <div className='rating-results-diagram' style={{ display: 'flex', paddingTop: '60px', paddingRight: '60px' }}>
      <AxisY originalHeight={containerHeight} axisHeight={containerHeight} axisLabel2={axisLabel2} axisLabel2a={axisLabel2a} axisLabel2b={axisLabel2b} />
      <div style={{
        width: containerWidth,
        height: containerHeight + 70,
        // padding: '0px 0px 60px 0',
        boxSizing: 'content-box',
        // background: '#e0dede' 
      }}>
        <div style={{ position: 'relative', width: containerWidth, height: containerHeight, background: 'white' }}>
          <svg id='svg-app' style={{ position: 'absolute' }} />
          <canvas id='axis' />
        </div>
        <AxisX originalWidth={containerWidth} axisWidth={containerWidth} axisLabel1={axisLabel1} axisLabel1a={axisLabel1a} axisLabel1b={axisLabel1b} />
      </div>
    </div>
  </div>

  )
}

export default App
import React, { useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import Modal from 'react-modal'
import Iframe from 'react-iframe'
import AxisX from './AxisX'
import AxisY from './AxisY'
import styles from './FourfoldTable.module.css'
import { Checkbox } from '@sangre-fp/ui'
import classes from './FourfoldTable.module.css'
const NODE_RADIUS = 10
const CHAR_WIDTH = 8

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
  phenomena = []
}) => {
  const setNodeColor = (phenomenon) => {
    let innerStroke = 'transparent'
    let outerStroke ='rgb(0, 202, 141)'
    let fillSymbol = '#fff'

    if(phenomenon['content-type-alias'] === 'summary') { 
      innerStroke = '#fff'
      outerStroke = 'rgb(0, 202, 141)' 
      fillSymbol = 'rgb(0, 202, 141)'
    }

    if(phenomenon['content-type-alias'] === 'rising') { 
      innerStroke = 'transparent'
      outerStroke = 'transparent' 
      fillSymbol = 'rgb(0, 202, 141)'
    }

    if(phenomenon['content-type-alias'] === 'weaksignal') { 
      innerStroke = 'transparent'
      outerStroke = 'transparent' 
      fillSymbol = 'rgb(168, 168, 168)'
    }

    if(phenomenon['content-type-alias'] === 'cooling') { 
      innerStroke = 'transparent'
      outerStroke = 'transparent' 
      fillSymbol = 'rgb(0, 152, 255)'
    }

    if(phenomenon['content-type-alias'] === 'wildcard') { 
      innerStroke = 'transparent'
      outerStroke = 'transparent' 
      fillSymbol = 'rgb(233, 87, 87)'
    }
    return {innerStroke, outerStroke, fillSymbol}
  }

  const nodeListAsMedian = React.useMemo(()=> {
    const nodes = []
    !!phenomena?.length && phenomena.map((phen) => {
      if (phen['rating_x']['median'] && phen['rating_y']['median']) {
        const {innerStroke, outerStroke, fillSymbol} = setNodeColor(phen)
        const node = {}
        node['id'] = phen['id']
        node['type'] = []
        node['type'] = [].concat({innerStroke, outerStroke, fillSymbol})

        node['title'] = String(phen['content']['short_title']) || String(phen['content']['title'])
        if (String (phen['rating_x']['median']) >= 100|| String (phen['rating_y']['median']) >= 100) {
          node['x'] = phen['rating_x']['median'] 
          node['y'] = phen['rating_y']['median'] 
        } else if (String (phen['rating_x']['median']) === 0|| String (phen['rating_y']['median']) === 0) {
          node['x'] = phen['rating_x']['median'] 
          node['y'] = phen['rating_y']['median'] 
        } else {
          node['x'] = phen['rating_x']['median']
          node['y'] = phen['rating_y']['median']
        }
        nodes.push(node)
      }
    })
    return nodes
  }, [phenomena])

  const nodeListAsAverage = React.useMemo(() => {
    const nodes = []
    !!phenomena?.length && phenomena.map((phen) => {
      if (phen['rating_x']['avg'] && phen['rating_y']['avg']) {
        const {innerStroke, outerStroke, fillSymbol} = setNodeColor(phen)
        const node = {}
        node['id'] = phen['id']
        node['type'] = []
        node['type'] = [].concat({innerStroke, outerStroke, fillSymbol})

        node['title'] = String(phen['content']['short_title']) || String(phen['content']['title'])
        if (String (phen['rating_x']['avg']) >= 100|| String (phen['rating_y']['avg']) >= 100) {
          node['x'] = phen['rating_x']['avg'] 
          node['y'] = phen['rating_y']['avg']
        } else if (String (phen['rating_x']['avg']) === 0|| String (phen['rating_y']['avg']) === 0) {
          node['x'] = phen['rating_x']['avg'] 
          node['y'] = phen['rating_y']['avg'] 
        } else {
          node['x'] = phen['rating_x']['avg']
          node['y'] = phen['rating_y']['avg']
        }
        nodes.push(node)
      }
    })
    return nodes
  }, [phenomena])

  const [visibleDialog, setVisibleDialog] = useState(false)
  const [visibleText, setVisibleText] = useState(true)
  const [appContext, setAppContext] = useState({})
  const [transformInfo, setTransformInfo] = useState(null)
  const { axis, scatterSvg } = appContext
  const [isAverage, setIsAverage] = useState(true)
  const [isMedian, setIsMedian] = useState(false)

   // each px font size equal with 2px
   const getTextWidth = (text, fontSize = 12, fontFace = 'Roboto') => {
    const canvasAxis = document.getElementById('axis')
    const context = canvasAxis.getContext('2d')
    context.font = fontSize + 'px ' + fontFace
    return context.measureText(text).width
  }
  const innerTexts = [
    { x: 25, y: 25, title: axisLabel3 },
    { x: 75, y: 25, title: axisLabel4 },
    { x: 25, y: 75, title: axisLabel5 },
    { x: 75, y: 75, title: axisLabel6 }
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

  const drawNormalAxis = () => {
    axis.width = containerWidth
    axis.height = containerHeight
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
    d3.select('#svg-app').attr("viewBox", [0, 0, containerWidth, containerHeight])
  }, [containerWidth, containerHeight])

  useEffect(() => {
    const svg = d3.select('#svg-app').attr("viewBox", [0, 0, containerWidth, containerHeight])
    
    const canvasAxis = document.getElementById('axis')
    setAppContext({
      axis: canvasAxis,
      axisContext: canvasAxis.getContext('2d'),
      scatterSvg: svg
    })
  }, [])

  useEffect(() => {
    if (phenomena.length < 1 || !scatterSvg) return ;
    let nodes = []
    if(isAverage) {
      nodes = !!nodeListAsAverage.length ? nodeListAsAverage : []
    }
    else if(isMedian) {
      nodes = !!nodeListAsMedian.length ? nodeListAsMedian : []
    }

    let data = nodes.map(item => [item.x, item.y])
    data = [...data, ...Array.from({length: 50}, () => [100 * Math.random(), Math.random()])]

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]))
      .range([30, containerWidth - 10])
      .nice()
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]))
      .range([containerHeight - 30, 10])
      .nice()

    const xAxis = (g, scale) => g
      .attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(scale).ticks(8))
      .call(g2 => g2.select(".domain").attr("display", "none"))
      .call(g2 => g2.selectAll(".tick line")
        .attr("display","none"))
      
    const yAxis = (g, scale) => g
      .attr("transform", `translate(${x(0)},0)`)
      .call(d3.axisLeft(scale).ticks(8))
      .call(g2 => g2.select(".domain").attr("display", "none"))
      .call(g2 => g2.selectAll(".tick line")
        .attr("display","none"))

    const gx = scatterSvg.append("g")
    const gy = scatterSvg.append("g")

    const innerText = scatterSvg.append('g')
      .selectAll('text')
      .data(innerTexts)
      .join('text')
      .text(d => d.title)
      .style('fill', 'rgb(224, 222, 222)')
      .style('font-size', '20')
      .style('text-align', 'center')

    const innerLine = scatterSvg.append('g')
      .selectAll("line")
      .data(innerLineData)
      .join('line')
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      
      const myTexts = scatterSvg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.title)
      .style('fill', 'black')
      .attr('id', 'myTexts')
      .attr('font-size', 12)

    const myCircle1 = scatterSvg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('stroke', d => d.type[0].outerStroke)
      .attr('cursor', 'pointer')
      .attr('r', 10)
      .style('fill', d => d.type[0].fillSymbol)

    const myCircle = scatterSvg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('stroke', d => d.type[0].innerStroke)
      .attr('cursor', 'pointer')
      .attr('r', 7)
      .style('fill', d => d.type[0].fillSymbol)
      .attr('cursor', 'pointer')

    // z holds a copy of the previous transform, so we can track its changes
    let z = d3.zoomIdentity;

    // set up the ancillary zooms and an accessor for their transforms
    const zoomX = d3.zoom().scaleExtent([1, 8]);
    const zoomY = d3.zoom().scaleExtent([1, 8]);
    const tx = () => d3.zoomTransform(gx.node());
    const ty = () => d3.zoomTransform(gy.node());
    gx.call(zoomX).attr("pointer-events", "none");
    gy.call(zoomY).attr("pointer-events", "none");


    // active zooming
    const zoom = d3.zoom().on("zoom", function(e) {
      if (e.transform.k < 1) {
        e.transform.k = 1
        return
      }
      if (e.transform.k > 8) {
        e.transform.k = 8
        return
      }
      e.transform.k = Math.min(Math.max(e.transform.k, 1), 8)
      
      const trans = d3.transition().duration(150).ease(d3.easeLinear)
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

      const radius1 = myCircle1.attr('r')
      const radius = myCircle.attr('r')

      gx.call(xAxis, xr);
      gy.call(yAxis, yr);
      
      innerText
        .transition(trans)
        .attr('x', d => xr(d.x) - getTextWidth(d.title))
        .attr('y', d => yr(d.y))
      
      innerLine
        .transition(trans)
        .attr("x1", d => xr(d.x1))
        .attr("y1", d => yr(d.y1))
        .attr("x2", d => xr(d.x2))
        .attr("y2", d => yr(d.y2))
        
      myTexts
      .transition(trans)
      .on('end', () => {
        try {
          const scale = Math.min(t.k, 9)
        const minScale = Math.max(scale, 1)
        const fonts = Math.max(12, Math.floor(11 + minScale))
        const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
        myTexts.transition(tran2)
          .attr('font-size', fonts)
          .attr('x', d => xr(d.x) - getTextWidth(d.title, fonts) / 2)
          .attr('y', d => yr(d.y) + 10 * 3)
        } catch (error) {
          console.error(error)
        }
      })
      .attr('x', d => {
        const fontS = myTexts.attr('font-size')
        return xr(d.x) - getTextWidth(d.title, fontS) / 2
      })
      .attr('y', d => yr(d.y) + 10 * 3)

      myCircle1
        .transition(trans)
        .on('end', () => {
          try {
            const scale = Math.min(t.k, 8)
          const minScale = Math.max(scale, 1)
          const r = Math.max(10, Math.floor(10 + minScale))
          const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
          myCircle1.transition(tran2)
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('r', r)
          } catch (error) {
            console.error(error)
          }
        })
        .attr('cx', d => xr(d.x))
        .attr('cy', d => yr(d.y))
        .attr('r', radius1)

        myCircle
        .transition(trans)
        .on('end', () => {
          try {
            const scale = Math.min(t.k, 8)
          const minScale = Math.max(scale, 1)
          const r = Math.max(7, Math.floor(7 + minScale))
          const tran2 = d3.transition().duration(200).ease(d3.easeLinear)
          myCircle.transition(tran2)
            .attr('cx', d => xr(d.x))
            .attr('cy', d => yr(d.y))
            .attr('r', r)
          } catch (error) {
            console.error(error)
          }
        })
        .attr('cx', d => xr(d.x))
        .attr('cy', d => yr(d.y))
        .attr('r', radius)
        
    });
    d3.selectAll('circle').on('click', d => onClickNode(d.id))
    scatterSvg.call(zoom)
      .call(zoom.transform, d3.zoomIdentity.scale(1))
      .node();
    return () => {
      scatterSvg.selectAll("*").remove()
    }
  }, [phenomena, scatterSvg, isAverage, isMedian, visibleText])

  const onClickNode = (id) => {
    setVisibleDialog(true)
  }

  const onCloseDialog = () => {
    setVisibleDialog(false)
  }

  const onToggleTitle = (event) => {
    const isChecked = event.target.checked
    setVisibleText(!visibleText)
  }

  const onToggleIsAverage= (event) => {
    setIsMedian(false)
    setIsAverage(true)
    setVisibleText(visibleText => visibleText)
    
  }

  const onToggleIsMedian= (event) => {
    setIsAverage(false)
    setIsMedian(true)
    setVisibleText(visibleText => visibleText)

  }

  const customStyles = {
    content : {
      width: '30%',
      height: '100%',
      top: 0,
      left: 0
    },
    overlay: {
      background: 'transparent'
    }
  }
  const buttonStyles = {
    position: 'fixed',
    top: '50%',
    left: 'calc(30% - 2px)',
    'zIndex': 100,
    width: '66px',
    height: '74px',
    background: 'white',
    borderColor: 'transparent',
    cursor: 'pointer',
    'boxShadow': '1px 1px 1px 0px #887979',
    fontSize: '48px',
    fontWeight: 540,
  }
  
  return (
    <div style={{ display: 'flex',  paddingTop: '54px', paddingBottom: '54px'}}>
      <AxisY originalHeight={containerHeight} axisHeight={containerHeight + 170} axisLabel2={axisLabel2} axisLabel2a={axisLabel2a} axisLabel2b={axisLabel2b} />
      <div style={{ 
        width: containerWidth, 
        height: containerHeight + 70, 
        padding: '0px 0px 60px 0', 
        boxSizing: 'content-box', 
        // background: '#e0dede' 
        }}>
      <div style={{paddingBottom:"32px", display: 'flex', alignItems: 'center'}}>
          <Checkbox label='Hide labels' checked={!visibleText} onChange={onToggleTitle} className={styles.resetMargin}/>
          <input style={{width:"20px", height: "20px", cursor: 'pointer', margin: 0, marginLeft: '20px'}} type="radio" label='Show as average'  id="rating-view-tab-cb-id" name="rating-view-tab-cb-name" checked={isAverage} onChange={onToggleIsAverage}></input>
          <label style={{fontSize:"13px", fontWeight:'unset', paddingLeft: '12px', marginBottom: 0}} for="rating-view-tab-cb-name"> Show as Average</label><br></br>
          <input style={{width:"20px", height: "20px", cursor: 'pointer', margin: 0, marginLeft: '20px'}} type="radio" label='Show as median'  id="rating-view-tab-cb-id" name="rating-view-tab-cb-name" checked={!isAverage} onChange={onToggleIsMedian}></input>
          <label style={{fontSize:"13px", fontWeight:'unset', paddingLeft: '12px', marginBottom: 0}} for="rating-view-tab-cb-name"> Show as Median</label><br></br>
        </div>
        <div style={{ position: 'relative', width: containerWidth, height: containerHeight, background: 'white' }}>
          <svg id='svg-app' style={{ position: 'absolute' }} />
          <canvas id='axis' />

          {visibleDialog && (
            <Modal style={customStyles} ariaHideApp={false} isOpen={true} contentLabel='Phenomena card label'>
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
      {visibleDialog && <button style={buttonStyles} onClick={onCloseDialog}>X</button>}
    </div>
  )
}

export default App
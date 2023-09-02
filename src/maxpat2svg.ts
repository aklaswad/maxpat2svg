((window:any) => {
const PORT_RADIUS: number = 3
const PORT_MARGIN: number = 6
const LINE_R: number = 10

const tArray: symbol = Symbol('array')
const tObject = Symbol('object')
const tPrimitive = Symbol('primitive')

/**
 * Get structure type of node
 * @param value
 * @returns tArray | tObject | tPrimitive
 */
function getTypeOf (value: any)  {
  // Too cheap for JS values but it might be ok for values coming from JSON I think... :thinking:
  return Array.isArray(value)    ? tArray
       : value instanceof Object ? tObject
       :                           tPrimitive
       ;
}

function deepEqual (left: any, right: any) {
  const type = getTypeOf(left)
  if ( type != getTypeOf(right) ) return false
  if ( type === tPrimitive ) return left === right
  if ( type === tArray ) {
    return left.length === right.length && left.every((e: any, i: number) => deepEqual(e, right[i]))
  }
  return deepEqual(Object.entries(left).sort(), Object.entries(right).sort())
}

type BoxDefinition = { x: number, y: number, width: number, height: number}
type DecoratorResponse = { rect?: BoxDefinition, text?: string }
type Decorator = (_box: Box, _g: Element, rect: Element ) => DecoratorResponse | void

const BoxDecorator: {[name: string]: Decorator  } = {
  comment: function (_box, _g, rect ) {
    rect.setAttribute("stroke-dasharray", "2,2")
  },
  message: function (_box, _g, rect) {
    rect.setAttribute("rx", "5")
    rect.setAttribute("ry", "5")
  },
  newobj: function (box, g, _rect) {
    const lineTop = document.createElementNS("http://www.w3.org/2000/svg", "line")
    lineTop.setAttribute("x1", box.x.toString())
    lineTop.setAttribute("y1", (box.y + 3).toString())
    lineTop.setAttribute("x2", (box.x + box.width).toString())
    lineTop.setAttribute("y2", (box.y + 3).toString())
    g.appendChild(lineTop)
    const lineBottom = document.createElementNS("http://www.w3.org/2000/svg", "line")
    lineBottom.setAttribute("x1", (box.x).toString())
    lineBottom.setAttribute("y1", (box.y + box.height - 3).toString())
    lineBottom.setAttribute("x2", (box.x + box.width).toString())
    lineBottom.setAttribute("y2", (box.y + box.height - 3).toString())
    g.appendChild(lineBottom)
  },

  inlet: function (box, g, _rect) {
    const decoration = document.createElementNS("http://www.w3.org/2000/svg", "path")
    decoration.classList.add('decoration-fill')
    decoration.setAttribute('d', `M ${box.x + box.width * 0.2} ${box.y + box.height / 2} L ${box.x + box.width * 0.8} ${box.y + box.height / 2} L ${box.x + box.width / 2} ${box.y + box.height * 0.9} Z`)
    g.appendChild(decoration)
  },
  outlet: function (box, g, _rect) {
    const decoration = document.createElementNS("http://www.w3.org/2000/svg", "path")
    decoration.classList.add('decoration-fill')
    decoration.setAttribute('d', `M ${box.x + box.width * 0.2} ${box.y + box.height * 0.1} L ${box.x + box.width * 0.8} ${box.y + box.height * 0.1} L ${box.x + box.width / 2} ${box.y + box.height / 2} Z`)
    g.appendChild(decoration)
  },
  number: function (box, g, _rect) {
    const decoration = document.createElementNS("http://www.w3.org/2000/svg", "path")
    decoration.classList.add('decoration-fill')
    const margin = box.height * 0.2
    decoration.setAttribute('d', `M ${box.x + margin} ${box.y + margin} L ${box.x + box.height / 2} ${box.y + box.height / 2} L ${box.x + margin} ${box.y + box.height - margin} Z`)
    g.appendChild(decoration)
    return {rect: {x: box.x + box.height / 2, y: box.y, width: box.width - (box.height / 2), height: box.height }, text: '0'}
  },
  flonum: function (box, g, _rect) {
    const decoration = document.createElementNS("http://www.w3.org/2000/svg", "path")
    decoration.classList.add('decoration-fill')
    const margin = box.height * 0.2
    decoration.setAttribute('d', `M ${box.x + margin} ${box.y + margin} L ${box.x + box.height / 2} ${box.y + box.height / 2} L ${box.x + margin} ${box.y + box.height - margin} Z`)
    g.appendChild(decoration)
    return {rect: {x: box.x + box.height / 2, y: box.y, width: box.width - (box.height / 2), height: box.height }, text: '0.0'}
  },
  'number~': function (_box, _g, _rect) {
    // TODO: svg design
    return {text: '~ 0.0'}
  },
  toggle: function (box, g, _rect) {
    const decoration = document.createElementNS("http://www.w3.org/2000/svg", "path")
    decoration.classList.add('decoration-fill')
    const w = box.height * 0.05 // width of line
    const w2 = w * 2
    const p = box.height * 0.2 // padding
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    decoration.setAttribute('d',
        `M ${cx} ${cy - w2} `
      + `L ${box.x + box.width - p - w} ${box.y              + p - w} L ${box.x + box.width - p + w} ${box.y              + p + w} L ${cx + w2} ${cy} `
      + `L ${box.x + box.width - p + w} ${box.y + box.height - p - w} L ${box.x + box.width - p - w} ${box.y + box.height - p + w} L ${cx} ${cy + w2} `
      + `L ${box.x             + p + w} ${box.y + box.height - p + w} L ${box.x             + p - w} ${box.y + box.height - p - w} L ${cx - w2} ${cy} `
      + `L ${box.x             + p - w} ${box.y              + p + w} L ${box.x             + p + w} ${box.y              + p - w} Z`
    )
    g.appendChild(decoration)
  },
  button: function (box, g, _rect) {
    const decoration = document.createElementNS("http://www.w3.org/2000/svg", "path")
    decoration.classList.add('decoration-fill')
    // Magic number for drawing circle by bezier
    const f = 0.55228
    const r = 0.4 * box.height
    const r2 = 0.3 * box.height
    const fr = f * r
    const fr2 = f * r2
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    decoration.setAttribute('d',
        `M ${cx} ${cy - r} `
      + `C ${cx + fr} ${cy -  r} ${cx +  r} ${cy - fr} ${cx + r} ${cy    }`
      + `C ${cx +  r} ${cy + fr} ${cx + fr} ${cy +  r} ${cx    } ${cy + r}`
      + `C ${cx - fr} ${cy +  r} ${cx -  r} ${cy + fr} ${cx - r} ${cy    }`
      + `C ${cx -  r} ${cy - fr} ${cx - fr} ${cy -  r} ${cx    } ${cy - r}`
      + `M ${cx} ${cy - r2} `
      + `C ${cx - fr2} ${cy -  r2} ${cx -  r2} ${cy - fr2} ${cx - r2} ${cy     }`
      + `C ${cx -  r2} ${cy + fr2} ${cx - fr2} ${cy +  r2} ${cx     } ${cy + r2}`
      + `C ${cx + fr2} ${cy +  r2} ${cx +  r2} ${cy + fr2} ${cx + r2} ${cy     }`
      + `C ${cx +  r2} ${cy - fr2} ${cx + fr2} ${cy -  r2} ${cx     } ${cy - r2}`


    )
    g.appendChild(decoration)
  },
}

class Box {
  box: any  // placeholder for original json data
  id: string
  class: string // maxclass
  x: number
  y: number
  width: number
  height: number
  numInlets: number
  numOutlets: number
  inlets: string[][]
  outlets: string[][]

  constructor (data: any) {
    this.box = data.box
    this.id = this.box.id
    this.class = this.box.maxclass.replace(/~/, '-tilde').replace(/\W/g, '-')
    const rect = this.box.patching_rect
    this.x = rect[0]
    this.y = rect[1]
    this.width = rect[2]
    this.height = rect[3]
    this.numInlets = this.box.numinlets
    this.numOutlets = this.box.numoutlets
    this.inlets = new Array(this.numInlets).fill(0).map( () => [] )
    this.outlets = new Array(this.numOutlets).fill(0).map( () => [] )
  }

  inlet (nth: number) {
    return {
      x: this.x + PORT_MARGIN + PORT_RADIUS + nth * (this.width - PORT_RADIUS * 2 - PORT_MARGIN * 2 - 1) / Math.max(1, this.numInlets - 1),
      y: this.y
    }
  }

  outlet (nth: number) {
    return {
      x: this.x + PORT_MARGIN + PORT_RADIUS + nth * (this.width - PORT_RADIUS * 2 - PORT_MARGIN * 2 - 1) / Math.max(1, this.numOutlets - 1),
      y: this.y + this.height
    }
  }

  svg (patcher: any) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    g.appendChild(rect);
    rect.setAttribute("x", this.x.toString())
    rect.setAttribute("y", this.y.toString())
    rect.setAttribute("width", this.width.toString())
    rect.setAttribute("height", this.height.toString())
    rect.classList.add(this.class, 'box-rect')
    g.classList.add('box')
    // TODO: move to CSS

    const decorator = BoxDecorator[(this.box.maxclass || '').toLowerCase()]
    const decorated = decorator ? (decorator(this, g, rect) || {}) : {}

    const textElem = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")
    const innerRect = decorated.rect || this
    textElem.setAttribute("x", innerRect.x.toString())
    textElem.setAttribute("y", innerRect.y.toString())
    textElem.setAttribute("width", innerRect.width.toString())
    textElem.setAttribute("height", innerRect.height.toString())
    const html = document.createElementNS("http://www.w3.org/1999/xhtml", 'html')
    const div = document.createElement('div')
    if (
         (this.box.fontname && patcher.patcher.default_fontname !== this.box.fontname )
      || (this.box.fontsize && patcher.patcher.default_fontsize !== this.box.fontsize )
    ) {
      div.setAttribute('style', `font-size: ${this.box.fontsize || patcher.patcher.default_fontsize}px; font-family: '${this.box.fontname || patcher.patcher.default_fontname};`)
    }
    div.setAttribute('width', '100%')
    div.setAttribute('height', '100%')
    const text = decorated.text || this.box.text
    if ( text ) {
      div.innerText = text
    }
    else if ( !decorator ) {
      div.classList.add('alt-text')
      div.innerText = this.box.maxclass
    }
    html.appendChild(div)
    textElem.appendChild(html)
    g.appendChild(textElem)
    const connections = []

    for (let i = 0; i < this.numInlets; i++) {
      const portPos = this.inlet(i)
      const arc = document.createElementNS("http://www.w3.org/2000/svg", "path")
      arc.setAttribute('d', `M ${portPos.x - PORT_RADIUS} ${portPos.y} A ${PORT_RADIUS} ${PORT_RADIUS} 0 0 0 ${portPos.x + PORT_RADIUS} ${portPos.y}`)
      arc.classList.add('inlet')
      g.appendChild(arc)

      if ( this.inlets[i].length ) {
        arc.classList.add('connected')
      }

      for ( let sig of this.inlets[i] ) {
        g.classList.add(sig)
        connections.push(sig)
      }
    }
    for (let i = 0; i < this.numOutlets; i++) {
      const portPos = this.outlet(i)
      const arc = document.createElementNS("http://www.w3.org/2000/svg", "path")
      arc.setAttribute('d', `M ${portPos.x - PORT_RADIUS} ${portPos.y} A ${PORT_RADIUS} ${PORT_RADIUS} 0 0 1 ${portPos.x + PORT_RADIUS} ${portPos.y}`)
      arc.classList.add('outlet')
      g.appendChild(arc)

      if ( this.outlets[i].length ) {
        arc.classList.add('connected')
      }

      for ( let sig of this.outlets[i] ) {
        g.classList.add(sig)
        connections.push(sig)
      }
    }

    g.dataset.connections = connections.map(c => '.' + c).join(',')
    g.dataset.box = JSON.stringify(this.box)
    return g
  }
}

type NamedMaxPat = { name: string, patcher: MaxPat }

class MaxPat {
  boxes: { [id: string]: Box }
  lines: any[]
  children: { name: string, patcher: MaxPat }[]
  x: number
  y: number
  width: number
  height: number
  patcher: any // Place to keep original JSON content

  empty () {
    this.boxes = {}
    this.children = []
    this.x = 0
    this.y = 0
    this.width = 140
    this.height = 140
    this.patcher = {}
    this.lines = []
    return this
  }

  constructor (patcher: any) {
    this.boxes = {}
    this.children = []
    this.patcher = patcher.patcher
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.lines = []

    if ( !patcher.patcher ) {
      return this.empty()
    }
    const boxList = patcher.patcher.boxes
    if ( boxList.length === 0 ) {
      return this.empty()
    }
    let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
    for ( const boxData of boxList ) {
      const box = new Box(boxData)
      if ( box.x < minX ) minX = box.x
      if ( box.y < minY ) minY = box.y
      if ( box.x + box.width > maxX ) maxX = box.x + box.width
      if ( box.y + box.height > maxY ) maxY = box.y + box.height
      if ( boxData.box?.patcher ) {
        const child = new MaxPat(boxData.box)
        // cspell:ignore atcher
        const childName = boxData.box.text.replace(/^p(atcher)?\s+/i, '')
        this.children.push({ name: childName || boxData.box.id, patcher: child })
      }
      this.boxes[box.id] = box
    }
    this.width = maxX - minX + 40
    this.height = maxY - minY + 40
    this.lines = patcher.patcher.lines
    for ( const line of this.lines ) {
      const src = line.patchline.source
      const dst = line.patchline.destination
      const lineSignature = [src.join('_'), dst.join('_')].join('__')
      const srcObj = this.boxes[src[0]]
      const dstObj = this.boxes[dst[0]]
      if ( srcObj && dstObj ) {
        srcObj.outlets[parseInt(src[1])].push( lineSignature )
        dstObj.inlets[parseInt(dst[1])].push( lineSignature )
      }
      else {
        console.warn('Found patchline connecting to non existing box.', line)
      }
    }
  }

  subPatchers (parentName: string = ''): NamedMaxPat[] {
    return [
      ...this.children.map( child => ({ name: parentName + '/' + child.name, patcher: child.patcher }) ),
      ...this.children.reduce( (acc: NamedMaxPat[], cur: NamedMaxPat ) => [ ...acc, ...cur.patcher.subPatchers(parentName + '/' + cur.name)], [])
    ]
  }

  gatherViewBoxWith(anotherPatcher: MaxPat) {
    this.x      = anotherPatcher.x      =   Math.min(this.x, anotherPatcher.x),
    this.y      = anotherPatcher.y      =   Math.min(this.y, anotherPatcher.y),
    this.width  = anotherPatcher.width  =   Math.max(this.width, anotherPatcher.width),
    this.height = anotherPatcher.height =   Math.max(this.height, anotherPatcher.height)
  }

  isEqualTo(anotherPatcher: MaxPat) {
    if ( this.lines.length !== anotherPatcher.lines.length ) return false
    if ( Object.keys(this.boxes).length !== Object.keys(anotherPatcher.boxes).length ) return false
    if ( ! deepEqual(this.lines, anotherPatcher.lines) ) return false
    return deepEqual(
      Object.fromEntries( Object.entries(this.boxes).map(e => [e[0], e[1].box])),
      Object.fromEntries( Object.entries(anotherPatcher.boxes).map(e => [e[0], e[1].box]))
    )
  }

  svg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', this.width.toString())
    svg.setAttribute('height', this.height.toString())
    svg.setAttribute('viewBox', [this.x, this.y, this.width, this.height].join(' '))
    svg.classList.add('patcher-view')
    const uuid = crypto.randomUUID()
    svg.setAttribute('data-' + uuid, 'true')
    const style = document.createElement('style')
    // XXX: not sure the relation between svg logical size and foreignObject's pixel size...
    style.innerHTML = `
    svg[data-${uuid}] * {
      font-size: ${this.patcher.default_fontsize}px;
      font-family: '${this.patcher.default_fontname}';
      fill: none;
    }
    svg[data-${uuid}] div {
      padding: 3px;
    }

    svg[data-${uuid}] .patchline {
      stroke-linecap: round;
      stroke-width: 3;
    }
    `
    svg.appendChild(style)

    for ( const line of this.lines ) {
      const sourceBox = this.boxes[line.patchline.source[0]];
      const destBox = this.boxes[line.patchline.destination[0]];
      if ( !sourceBox || !destBox ) {
        console.warn('Found patchline connecting to non existing box.', line)
        continue
      }
      const start = sourceBox.outlet(line.patchline.source[1])
      const end = destBox.inlet(line.patchline.destination[1])

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const lineSignature = [
        line.patchline.source.join('_'),
        line.patchline.destination.join('_')
      ].join('__')

      path.classList.add( 'patchline', lineSignature )
      let d = `M ${start.x} ${start.y}`;
      let prevX = start.x
      let prevY = start.y
      let points: number[] = []
      if (line.patchline.midpoints && line.patchline.midpoints.length) {
        points = [ ...line.patchline.midpoints, end.x, end.y ]
      }
      else if ( Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2) > LINE_R * LINE_R ) {
        points = [ start.x, start.y + 10, end.x, end.y - 10, end.x, end.y ]
      }
      for (let i = 0; i + 2 < points.length; i += 2) {
        const midX = points[i], midY = points[i+1], nextX = points[i+2], nextY = points[i+3]
        let l1X = midX - ( prevX < midX ? Math.min( midX - prevX, LINE_R) : -1 * Math.min(prevX - midX, LINE_R) )
        let l1Y = midY - ( prevY < midY ? Math.min( midY - prevY, LINE_R) : -1 * Math.min(prevY - midY, LINE_R) )
        let l2X = midX + ( midX < nextX ? Math.min( nextX - midX, LINE_R) : -1 * Math.min(midX - nextX, LINE_R) )
        let l2Y = midY + ( midY < nextY ? Math.min( nextY - midY, LINE_R) : -1 * Math.min(midY - nextY, LINE_R) )
        d += ` L ${l1X} ${l1Y} Q ${midX} ${midY}, ${l2X} ${l2Y}`
        prevX = l2X
        prevY = l2Y
      }
      d += ` L ${end.x} ${end.y}`;

      path.setAttribute("d", d);
      svg.appendChild(path);
    }

    for ( const box of Object.values(this.boxes) ) {
      svg.appendChild(box.svg(this))
    }
    return svg
  }
}

window.MaxPat = MaxPat
})(window)
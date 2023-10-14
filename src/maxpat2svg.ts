
const SVG_NS = 'http://www.w3.org/2000/svg'

const PORT_RADIUS: number = 3
const PORT_MARGIN: number = 6
const LINE_R: number = 10

type NodeType = 'array' | 'object' | 'primitive'

/**
 * Get structure type of node
 * @param value
 * @returns NodeType
 */
function getTypeOf(value: any): NodeType {
  // Too cheap for JS values but it might be ok for values coming from JSON I think... :thinking:
  return Array.isArray(value) ? 'array'
    : value instanceof Object ? 'object'
      : 'primitive'
    ;
}

/**
 * Lazy comparison for structured object
 * TODO: Replace this with strict version of MaxPat class specific
 */
function deepEqual(left: any, right: any) {
  const type = getTypeOf(left)
  if (type != getTypeOf(right)) return false
  if (type === 'primitive') return left === right
  if (type === 'array') {
    return left.length === right.length && left.every((e: any, i: number) => deepEqual(e, right[i]))
  }
  return deepEqual(Object.entries(left).sort(), Object.entries(right).sort())
}



type BoxDefinition = { x: number, y: number, width: number, height: number }
/*
const DefaultBoxDefinition: BoxDefinition = { x: 0.0, y: 0.0, width: 140.0, height: 140.0 }

function isBoxDefinition(arg: unknown): arg is BoxDefinition {
  return (
       typeof arg === 'object' && arg !== null
    && 'x'      in arg && typeof arg.x      === 'number'
    && 'y'      in arg && typeof arg.y      === 'number'
    && 'width'  in arg && typeof arg.width  === 'number'
    && 'height' in arg && typeof arg.height === 'number'
  )
}
*/

type PatchLineNode = {
  patchline: PatchLineData
}

type PatchLineData = {
  destination: [toBoxId: string, inletIndex: number],
  source: [fromBoxId: string, outletIndex: number],
  midpoints?: number[],
}

function isPatchLineNode(arg: unknown): arg is PatchLineNode {
  return typeof arg === 'object' && arg !== null
    && 'patchline' in arg && isPatchLine(arg.patchline)
}

function isPatchLine(arg: unknown): arg is PatchLineData {
  if (!(typeof arg === 'object' && arg !== null)) {
    return false
  }
  if ('midpoints' in arg) {
    if (!Array.isArray(arg.midpoints)) {
      return false
    }
    if (!arg.midpoints.every(mp => 'number' === typeof mp)) {
      return false
    }
  }
  if (!('destination' in arg && Array.isArray(arg.destination)
    && arg.destination.length === 2
    && typeof arg.destination[0] === 'string' && typeof arg.destination[1] === 'number'
    && 'source' in arg && Array.isArray(arg.source)
    && arg.source.length === 2
    && typeof arg.source[0] === 'string' && typeof arg.source[1] === 'number')
  ) {
    return false
  }
  return true
}

type BoxNode = {
  box: BoxData
}

function isBoxNode(arg: unknown): arg is BoxNode {
  return typeof arg === 'object' && arg !== null
    && 'box' in arg && isBoxData(arg.box)
}

type RectArray = [left: number, top: number, width: number, height: number]

function isRectArray(arg: unknown): arg is RectArray {
  return Array.isArray(arg) && arg.length === 4 && arg.every(n => typeof n === 'number')
}

type BoxData = {
  id: string
  maxclass: string
  fontname?: string
  fontsize?: number
  numinlets: number
  numoutlets: number
  patching_rect: RectArray
  patcher?: PatcherData
  text?: string
  code?: string
}

function isBoxData(arg: unknown): arg is BoxData {
  return typeof arg === 'object' && arg !== null
    && 'id' in arg && typeof arg.id === 'string'
    && 'maxclass' in arg && typeof arg.maxclass === 'string'
    && ('fontname' in arg ? typeof arg.fontname === 'string' : true)
    && ('fontsize' in arg ? typeof arg.fontsize === 'number' : true)
    && 'numinlets' in arg && typeof arg.numinlets === 'number'
    && 'numoutlets' in arg && typeof arg.numoutlets === 'number'
    && 'patching_rect' in arg && isRectArray(arg.patching_rect)
    && ('patcher' in arg ? isPatcherData(arg.patcher) : true)
    && ('text' in arg ? typeof arg.text === 'string' : true)
    && ('code' in arg ? typeof arg.code === 'string' : true)
}

type PatcherNode = {
  patcher: PatcherData
}

type PatcherData = {
  default_fontsize: number,
  default_fontname: string,
  boxes?: BoxNode[]
  lines?: PatchLineNode[]
}

function isPatcherNode(arg: unknown): arg is PatcherNode {
  return typeof arg === 'object' && arg !== null
    && 'patcher' in arg && isPatcherData(arg.patcher)
}

function isPatcherData(arg: unknown): arg is PatcherData {
  return typeof arg === 'object' && arg !== null
    && 'default_fontsize' in arg && typeof arg.default_fontsize === 'number'
    && 'default_fontname' in arg && typeof arg.default_fontname === 'string'
    && 'boxes' in arg && Array.isArray(arg.boxes) && arg.boxes.every(b => isBoxNode(b))
    && 'lines' in arg && Array.isArray(arg.lines) && arg.lines.every(l => isPatchLineNode(l))
}

function compareDictionary (left: {[key:string]:any}, right: {[key:string]:any}): DiffInfo {
  const ret: DiffInfo = {
    hasDifference: false,
    removed: [],
    modified: [],
    added: []
  }
  const keys = Object.keys(
    Object.fromEntries([
      ...Object.entries(left),
      ...Object.entries(right)
    ] ) )
  for ( const key of keys ) {
    if ( key in left && key in right ) {
      if ( deepEqual(left[key], right[key]) ) {
        continue
      }
      ret.hasDifference = true
      ret.modified.push(key)
    }
    else if ( key in left ) {
      ret.hasDifference = true
      ret.removed.push(key)
    }
    else {
      ret.hasDifference = true
      ret.added.push(key)
    }
  }
  return ret
}

export interface DiffInfo {
  hasDifference: boolean
  removed: string[]
  modified: string[]
  added: string[]
}

export type PatcherDiffInfoAdded = { hasDifference: true, status: 'added' }
export type PatcherDiffInfoRemoved = { hasDifference: true, status: 'removed' }
export type PatcherDiffInfoSame = { hasDifference: false, status: 'same' }

export type PatcherDiffInfoModified = {
  hasDifference: true
  status: 'modified'
  boxes: DiffInfo
  lines?: DiffInfo
  attributes: DiffInfo
}
export type PatcherDiffInfo = PatcherDiffInfoAdded | PatcherDiffInfoRemoved | PatcherDiffInfoSame | PatcherDiffInfoModified

export function patcherDiffSummary(left: MaxPat | undefined | null, right: MaxPat | undefined | null): PatcherDiffInfo {
  return left && right? right.diffSummaryWith(left)
  : right     ? { hasDifference: true, status: 'added' }
  : left      ? { hasDifference: true, status: 'removed' }
  :             { hasDifference: false, status: 'same' }
}

type DecoratorResponse = { rect?: BoxDefinition, text?: string }
type Decorator = (_box: Box, _g: Element, rect: Element) => DecoratorResponse | void

/**
 * Collection of box decoration for each maxclass
 */
const BoxDecorator: { [name: string]: Decorator } = {
  comment: function (_box, _g, rect) {
    rect.setAttribute("stroke-dasharray", "2,2")
  },
  message: function (_box, _g, rect) {
    rect.setAttribute("rx", "5")
    rect.setAttribute("ry", "5")
  },
  newobj: function (box, g, _rect) {
    const lineTop = document.createElementNS(SVG_NS, "line")
    lineTop.setAttribute("x1", box.x.toString())
    lineTop.setAttribute("y1", (box.y + 3).toString())
    lineTop.setAttribute("x2", (box.x + box.width).toString())
    lineTop.setAttribute("y2", (box.y + 3).toString())
    g.appendChild(lineTop)
    const lineBottom = document.createElementNS(SVG_NS, "line")
    lineBottom.setAttribute("x1", (box.x).toString())
    lineBottom.setAttribute("y1", (box.y + box.height - 3).toString())
    lineBottom.setAttribute("x2", (box.x + box.width).toString())
    lineBottom.setAttribute("y2", (box.y + box.height - 3).toString())
    g.appendChild(lineBottom)
  },

  inlet: function (box, g, _rect) {
    const decoration = document.createElementNS(SVG_NS, "path")
    decoration.classList.add('decoration-fill')
    decoration.setAttribute('d', `M ${box.x + box.width * 0.2} ${box.y + box.height / 2} L ${box.x + box.width * 0.8} ${box.y + box.height / 2} L ${box.x + box.width / 2} ${box.y + box.height * 0.9} Z`)
    g.appendChild(decoration)
  },
  outlet: function (box, g, _rect) {
    const decoration = document.createElementNS(SVG_NS, "path")
    decoration.classList.add('decoration-fill')
    decoration.setAttribute('d', `M ${box.x + box.width * 0.2} ${box.y + box.height * 0.1} L ${box.x + box.width * 0.8} ${box.y + box.height * 0.1} L ${box.x + box.width / 2} ${box.y + box.height / 2} Z`)
    g.appendChild(decoration)
  },
  number: function (box, g, _rect) {
    const decoration = document.createElementNS(SVG_NS, "path")
    decoration.classList.add('decoration-fill')
    const margin = box.height * 0.2
    decoration.setAttribute('d', `M ${box.x + margin} ${box.y + margin} L ${box.x + box.height / 2} ${box.y + box.height / 2} L ${box.x + margin} ${box.y + box.height - margin} Z`)
    g.appendChild(decoration)
    return { rect: { x: box.x + box.height / 2, y: box.y, width: box.width - (box.height / 2), height: box.height }, text: '0' }
  },
  flonum: function (box, g, _rect) {
    const decoration = document.createElementNS(SVG_NS, "path")
    decoration.classList.add('decoration-fill')
    const margin = box.height * 0.2
    decoration.setAttribute('d', `M ${box.x + margin} ${box.y + margin} L ${box.x + box.height / 2} ${box.y + box.height / 2} L ${box.x + margin} ${box.y + box.height - margin} Z`)
    g.appendChild(decoration)
    return { rect: { x: box.x + box.height / 2, y: box.y, width: box.width - (box.height / 2), height: box.height }, text: '0.0' }
  },
  'number~': function (_box, _g, _rect) {
    // TODO: svg design
    return { text: '~ 0.0' }
  },
  codebox: function (_box, _g, _rect) {
    return { text: `    codebox\n-----------\n` + _box.box.code}
  },
  toggle: function (box, g, _rect) {
    const decoration = document.createElementNS(SVG_NS, "path")
    decoration.classList.add('decoration-fill')
    const w = box.height * 0.05 // width of line
    const w2 = w * 2
    const p = box.height * 0.2 // padding
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    decoration.setAttribute('d',
      `M ${cx} ${cy - w2} `
      + `L ${box.x + box.width - p - w} ${box.y + p - w} L ${box.x + box.width - p + w} ${box.y + p + w} L ${cx + w2} ${cy} `
      + `L ${box.x + box.width - p + w} ${box.y + box.height - p - w} L ${box.x + box.width - p - w} ${box.y + box.height - p + w} L ${cx} ${cy + w2} `
      + `L ${box.x + p + w} ${box.y + box.height - p + w} L ${box.x + p - w} ${box.y + box.height - p - w} L ${cx - w2} ${cy} `
      + `L ${box.x + p - w} ${box.y + p + w} L ${box.x + p + w} ${box.y + p - w} Z`
    )
    g.appendChild(decoration)
  },
  button: function (box, g, _rect) {
    const decoration = document.createElementNS(SVG_NS, "path")
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
      + `C ${cx + fr} ${cy - r} ${cx + r} ${cy - fr} ${cx + r} ${cy}`
      + `C ${cx + r} ${cy + fr} ${cx + fr} ${cy + r} ${cx} ${cy + r}`
      + `C ${cx - fr} ${cy + r} ${cx - r} ${cy + fr} ${cx - r} ${cy}`
      + `C ${cx - r} ${cy - fr} ${cx - fr} ${cy - r} ${cx} ${cy - r}`
      + `M ${cx} ${cy - r2} `
      + `C ${cx - fr2} ${cy - r2} ${cx - r2} ${cy - fr2} ${cx - r2} ${cy}`
      + `C ${cx - r2} ${cy + fr2} ${cx - fr2} ${cy + r2} ${cx} ${cy + r2}`
      + `C ${cx + fr2} ${cy + r2} ${cx + r2} ${cy + fr2} ${cx + r2} ${cy}`
      + `C ${cx + r2} ${cy - fr2} ${cx + fr2} ${cy - r2} ${cx} ${cy - r2}`
    )
    g.appendChild(decoration)
  },
}

class Box {
  box: BoxData  // placeholder for original json data
  id: string
  text: string
  maxclass: string
  class: string // maxclass
  childPatcher?: MaxPat
  x: number
  y: number
  width: number
  height: number
  numInlets: number
  numOutlets: number
  inlets: string[][]
  outlets: string[][]

  constructor(data: unknown) {
    if (!isBoxNode(data)) {
      throw "It's not box"
    }
    this.box = Object.assign({}, data.box)
    if ( this.box.patcher ) {
      this.childPatcher = new MaxPat(this.box.patcher)
      delete this.box.patcher
    }
    this.id = this.box.id
    this.text = data.box.text || ''
    this.maxclass = this.box.maxclass
    this.class = this.box.maxclass.replace(/~/, '-tilde').replace(/\W/g, '-')
    const rect = this.box.patching_rect
    this.x = rect[0]
    this.y = rect[1]
    this.width = rect[2]
    this.height = rect[3]
    this.numInlets = this.box.numinlets
    this.numOutlets = this.box.numoutlets
    this.inlets = new Array(this.numInlets).fill(0).map(() => [])
    this.outlets = new Array(this.numOutlets).fill(0).map(() => [])
  }

  inlet(nth: number) {
    return {
      x: this.x + PORT_MARGIN + PORT_RADIUS + nth * (this.width - PORT_RADIUS * 2 - PORT_MARGIN * 2 - 1) / Math.max(1, this.numInlets - 1),
      y: this.y
    }
  }

  outlet(nth: number) {
    return {
      x: this.x + PORT_MARGIN + PORT_RADIUS + nth * (this.width - PORT_RADIUS * 2 - PORT_MARGIN * 2 - 1) / Math.max(1, this.numOutlets - 1),
      y: this.y + this.height
    }
  }

  svg(patcher: MaxPat) {
    const g = document.createElementNS(SVG_NS, "g")
    const rect = document.createElementNS(SVG_NS, "rect")
    g.appendChild(rect);
    rect.setAttribute("x", this.x.toString())
    rect.setAttribute("y", this.y.toString())
    rect.setAttribute("width", this.width.toString())
    rect.setAttribute("height", this.height.toString())
    g.setAttribute("id", patcher.id + '/' + this.id)
    g.dataset.parentPath = patcher.fullPath()
    g.dataset.patcherId = patcher.id
    g.dataset.boxId = this.id
    rect.classList.add(this.class, 'box-rect')
    g.classList.add('box')

    // TODO: move to CSS

    const decorator = BoxDecorator[(this.box.maxclass || '').toLowerCase()]
    const decorated = decorator ? (decorator(this, g, rect) || {}) : {}

    const textElem = document.createElementNS(SVG_NS, "foreignObject")
    const innerRect = decorated.rect || this
    textElem.setAttribute("x", innerRect.x.toString())
    textElem.setAttribute("y", innerRect.y.toString())
    textElem.setAttribute("width", innerRect.width.toString())
    textElem.setAttribute("height", innerRect.height.toString())
    const html = document.createElementNS("http://www.w3.org/1999/xhtml", 'html')
    const div = document.createElement('div')
    if (
      (this.box.fontname && patcher.patcher?.default_fontname !== this.box.fontname)
      || (this.box.fontsize && patcher.patcher?.default_fontsize !== this.box.fontsize)
    ) {
      div.setAttribute('style', `font-size: ${this.box.fontsize || patcher.patcher?.default_fontsize}px; font-family: '${this.box.fontname || patcher.patcher?.default_fontname};`)
    }
    div.setAttribute('width', '100%')
    div.setAttribute('height', '100%')
    const text = decorated.text || this.box.text
    if (text) {
      div.innerText = text
    }
    else if (!decorator) {
      div.classList.add('alt-text')
      div.innerText = this.box.maxclass
    }
    html.appendChild(div)
    textElem.appendChild(html)
    g.appendChild(textElem)
    const connections = []

    for (let i = 0; i < this.numInlets; i++) {
      const portPos = this.inlet(i)
      const arc = document.createElementNS(SVG_NS, "path")
      arc.setAttribute('d', `M ${portPos.x - PORT_RADIUS} ${portPos.y} A ${PORT_RADIUS} ${PORT_RADIUS} 0 0 0 ${portPos.x + PORT_RADIUS} ${portPos.y}`)
      arc.classList.add('inlet')
      g.appendChild(arc)

      if (this.inlets[i].length) {
        arc.classList.add('connected')
      }

      for (let sig of this.inlets[i]) {
        g.classList.add(sig)
        connections.push(sig)
      }
    }
    for (let i = 0; i < this.numOutlets; i++) {
      const portPos = this.outlet(i)
      const arc = document.createElementNS(SVG_NS, "path")
      arc.setAttribute('d', `M ${portPos.x - PORT_RADIUS} ${portPos.y} A ${PORT_RADIUS} ${PORT_RADIUS} 0 0 1 ${portPos.x + PORT_RADIUS} ${portPos.y}`)
      arc.classList.add('outlet')
      g.appendChild(arc)

      if (this.outlets[i].length) {
        arc.classList.add('connected')
      }

      for (let sig of this.outlets[i]) {
        g.classList.add(sig)
        connections.push(sig)
      }
    }

    g.dataset.connections = connections.map(c => '.' + c).join(',')
    g.dataset.box = JSON.stringify(this.box)
    return g
  }
}

class MaxPat {
  id: string
  path: string[]
  name: string
  boxes: { [id: string]: Box }
  lines: PatchLineNode[]
  x: number
  y: number
  width: number
  height: number
  patcher?: PatcherData // Place to keep original JSON content
  children: MaxPat[]
  default_fontsize: number
  default_fontname: string

  constructor(patcher: unknown, parent: MaxPat | null = null, name: string = '/', id: string = '/') {
    this.id = id
    this.path = parent ? [...parent.path, id] : [id]
    this.name = name
    this.boxes = {}
    this.children = []
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.lines = []
    this.default_fontsize = 12
    this.default_fontname = 'Arial'

    if (!isPatcherNode(patcher)) {
      return this
    }
    if (!patcher.patcher) {
      return this
    }
    if ( !patcher.patcher.lines ) return
    if ( !patcher.patcher.boxes ) return
    const boxList = patcher.patcher.boxes
    if (boxList.length === 0) {
      return this
    }

    let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
    for (const boxData of boxList) {
      const box = new Box(boxData)
      if (box.x < minX) minX = box.x
      if (box.y < minY) minY = box.y
      if (box.x + box.width > maxX) maxX = box.x + box.width
      if (box.y + box.height > maxY) maxY = box.y + box.height
      if (boxData.box?.patcher) {
        const child = new MaxPat(boxData.box, this, `${box.text || box.id}`, `${box.id}`)
        // cspell:ignore atcher
        this.children.push(child)
      }
      this.boxes[box.id] = box
    }
    this.x = minX - 20
    this.y = minY - 20
    this.width = maxX - minX + 40
    this.height = maxY - minY + 40

    this.lines = patcher.patcher.lines as PatchLineNode[]
    for (const line of this.lines) {
      const src = line.patchline.source
      const dst = line.patchline.destination
      const lineSignature = [src.join('_'), dst.join('_')].join('__')
      const srcObj = this.boxes[src[0]]
      const dstObj = this.boxes[dst[0]]
      if (srcObj && dstObj) {
        srcObj.outlets[src[1]].push(lineSignature)
        dstObj.inlets[dst[1]].push(lineSignature)
      }
      else {
        console.warn('Found patchline connecting to non existing box.', line)
      }
    }
    this.patcher = Object.assign({}, patcher.patcher)
    this.patcher.lines && delete this.patcher.lines
    delete this.patcher.boxes
    delete this.patcher.lines
  }

  subPatchers(parentName: string = '', parentId: string = ''): MaxPat[] {
    return [
      ...this.children,
      ...this.children.reduce((acc: MaxPat[], cur: MaxPat) => [...acc, ...cur.subPatchers(parentName + '/' + cur.name, parentId + '/' + cur.id)], [])
    ]
  }

  fullPath (separator: string = '/') {
    return this.path.join(separator)
  }

  gatherViewBoxWith(anotherPatcher: MaxPat) {
    const right = Math.max(this.x + this.width, anotherPatcher.x + anotherPatcher.width)
    const bottom = Math.max(this.y + this.height, anotherPatcher.y + anotherPatcher.height)
    this.x = anotherPatcher.x = Math.min(this.x, anotherPatcher.x)
    this.y = anotherPatcher.y = Math.min(this.y, anotherPatcher.y)
    this.width = anotherPatcher.width = right - this.x
    this.height = anotherPatcher.height = bottom - this.y
  }

  diffSummaryWith(left: MaxPat | undefined, reverse: boolean = false): PatcherDiffInfo {
    if ( !left ) {
      return {
        hasDifference: true,
        status: reverse ? 'removed' : 'added'
      }
    }
    const right = this
    const boxes = compareDictionary(
      Object.fromEntries( Object.entries(left.boxes).map( e => [e[0], e[1].box])),
      Object.fromEntries( Object.entries(right.boxes).map( e => [e[0], e[1].box]))
    )
    const attributes = compareDictionary(
      left.patcher || {},
      right.patcher || {}
    )
    const hasDifference = boxes.hasDifference || attributes.hasDifference
    if ( !hasDifference ) {
      return {
        status: 'same',
        hasDifference: false
      }
    }
    return {
      status: 'modified',
      hasDifference,
      boxes,
      attributes
    }
  }

  isEqualTo(anotherPatcher: MaxPat) {
    if (this.lines.length !== anotherPatcher.lines.length) return false
    if (Object.keys(this.boxes).length !== Object.keys(anotherPatcher.boxes).length) return false
    if (!deepEqual(this.lines, anotherPatcher.lines)) return false
    return deepEqual(
      Object.fromEntries(Object.entries(this.boxes).map(e => [e[0], e[1].box])),
      Object.fromEntries(Object.entries(anotherPatcher.boxes).map(e => [e[0], e[1].box]))
    )
  }

  svg() {
    const svg = document.createElementNS(SVG_NS, "svg");
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
      font-size: ${this.default_fontsize}px;
      font-family: '${this.default_fontname}';
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

    for (const line of this.lines) {
      const sourceBox = this.boxes[line.patchline.source[0]];
      const destBox = this.boxes[line.patchline.destination[0]];
      if (!sourceBox || !destBox) {
        console.warn('Found patchline connecting to non existing box.', line)
        continue
      }
      const start = sourceBox.outlet(line.patchline.source[1])
      const end = destBox.inlet(line.patchline.destination[1])

      const path = document.createElementNS(SVG_NS, "path");
      const lineSignature = [
        line.patchline.source.join('_'),
        line.patchline.destination.join('_')
      ].join('__')

      path.classList.add('patchline', lineSignature)
      let d = `M ${start.x} ${start.y}`;
      let prevX = start.x
      let prevY = start.y
      let points: number[] = []
      if (line.patchline.midpoints && line.patchline.midpoints.length) {
        points = [...line.patchline.midpoints, end.x, end.y]
        for (let i = 0; i + 2 < points.length; i += 2) {
          const midX = points[i], midY = points[i + 1], nextX = points[i + 2], nextY = points[i + 3]
          let l1X = midX - (prevX < midX ? Math.min(midX - prevX, LINE_R) : -1 * Math.min(prevX - midX, LINE_R))
          let l1Y = midY - (prevY < midY ? Math.min(midY - prevY, LINE_R) : -1 * Math.min(prevY - midY, LINE_R))
          let l2X = midX + (midX < nextX ? Math.min(nextX - midX, LINE_R) : -1 * Math.min(midX - nextX, LINE_R))
          let l2Y = midY + (midY < nextY ? Math.min(nextY - midY, LINE_R) : -1 * Math.min(midY - nextY, LINE_R))
          d += ` L ${l1X} ${l1Y} Q ${midX} ${midY}, ${l2X} ${l2Y}`
          prevX = l2X
          prevY = l2Y
        }
        d += ` L ${end.x} ${end.y}`;
      }
      else if (Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2) > LINE_R * LINE_R) {
        /*
        const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
        const mx = start.x + (end.x - start.x)/2
        */
        const my = start.y + (end.y - start.y) / 2

        d += ` C ${start.x} ${Math.max(my, start.y + 15)}, ${end.x} ${Math.min(my, end.y - 15)}, ${end.x} ${end.y}`

      }
      else {
        d += ` L ${end.x} ${end.y}`;
      }
      path.setAttribute("d", d);
      svg.appendChild(path);
    }

    for (const box of Object.values(this.boxes)) {
      svg.appendChild(box.svg(this))
    }
    return svg
  }
}

export { Box as Box }
export { MaxPat as MaxPat }
export { MaxPat as default }

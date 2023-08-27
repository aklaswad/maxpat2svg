const PORT_RADIUS = 4
const PORT_MARGIN = 5
const LINE_R = 10

class Box {
  constructor (data) {
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
  }

  inlet (nth) {
    return {
      x: this.x + PORT_MARGIN + PORT_RADIUS + nth * (this.width - PORT_RADIUS * 2 - PORT_MARGIN * 2) / Math.max(1, this.numInlets - 1),
      y: this.y
    }
  }

  outlet (nth) {
    return {
      x: this.x + PORT_MARGIN + PORT_RADIUS + nth * (this.width - PORT_RADIUS * 2 - PORT_MARGIN * 2) / Math.max(1, this.numOutlets - 1),
      y: this.y + this.height
    }
  }

  svg (patcher) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    g.appendChild(rect);
    rect.setAttribute("x", this.x)
    rect.setAttribute("y", this.y)
    rect.setAttribute("width", this.width)
    rect.setAttribute("height", this.height)
    rect.classList.add(this.class, 'box-rect')
    g.classList.add('box')
    // TODO: move to CSS

    if (this.box.maxclass === "comment") {
        rect.setAttribute("stroke-dasharray", "2,2")
    } else if (this.box.maxclass === "message") {
        rect.setAttribute("rx", "5")
        rect.setAttribute("ry", "5")
    } else if ( this.box.maxclass === 'newobj' ) {
        const lineTop = document.createElementNS("http://www.w3.org/2000/svg", "line")
        lineTop.setAttribute("x1", this.x)
        lineTop.setAttribute("y1", this.y + 3)
        lineTop.setAttribute("x2", this.x + this.width)
        lineTop.setAttribute("y2", this.y + 3)
        g.appendChild(lineTop)
        const lineBottom = document.createElementNS("http://www.w3.org/2000/svg", "line")
        lineBottom.setAttribute("x1", this.x)
        lineBottom.setAttribute("y1", this.y + this.height - 3)
        lineBottom.setAttribute("x2", this.x + this.width)
        lineBottom.setAttribute("y2", this.y + this.height - 3)
        g.appendChild(lineBottom)
    }
    const textElem = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")
    textElem.setAttribute("x", this.x)
    textElem.setAttribute("y", this.y)
    textElem.setAttribute("width", this.width)
    textElem.setAttribute("height", this.height)
    const html = document.createElementNS("http://www.w3.org/1999/xhtml", 'html')
    const div = document.createElement('div')
    if ( patcher.patcher.default_fontname !== this.box.fontname
      || patcher.patcher.default_fontsize !== this.box.fontsize
    ) {
      div.setAttribute('style', `font-size: ${this.box.fontsize}px; font-family: '${this.box.fontname};`)
    }
    div.setAttribute('width', '100%')
    div.setAttribute('height', '100%')
    div.innerText = this.box.text || ''
    html.appendChild(div)
    textElem.appendChild(html)
    g.appendChild(textElem)

    for (let i = 0; i < this.numInlets; i++) {
      const portPos = this.inlet(i)
      const arc = document.createElementNS("http://www.w3.org/2000/svg", "path")
      arc.setAttribute('d', `M ${portPos.x - PORT_RADIUS} ${portPos.y} A ${PORT_RADIUS} ${PORT_RADIUS} 0 0 0 ${portPos.x + PORT_RADIUS} ${portPos.y}`)
      arc.classList.add('inlet')
      arc.setAttribute('stroke-width', 2)
      g.appendChild(arc)
    }
    for (let i = 0; i < this.numOutlets; i++) {
      const portPos = this.outlet(i)
      const arc = document.createElementNS("http://www.w3.org/2000/svg", "path")
      arc.setAttribute('d', `M ${portPos.x - PORT_RADIUS} ${portPos.y} A ${PORT_RADIUS} ${PORT_RADIUS} 0 0 1 ${portPos.x + PORT_RADIUS} ${portPos.y}`)
      arc.classList.add('outlet')
      arc.setAttribute('stroke-width', 2)
      g.appendChild(arc)
    }

    return g
  }
}

class MaxPat {
  constructor (patcher) {
    this.boxes = {}
    this.children = []
    if ( !patcher.patcher ) {
      this.empty = true
      this.rect = [0,0,100,100]
      this.width = 140
      this.height = 140
      this.patcher = {}
      this.lines = []
      return
    }
    this.patcher = patcher.patcher
    const boxList = patcher.patcher.boxes
    let minX = 1000000, minY = 1000000, maxX = -1000000, maxY = -1000000;
    for ( const boxData of boxList ) {
      const box = new Box(boxData)
      if ( box.x < minX ) minX = box.x
      if ( box.y < minY ) minY = box.y
      if ( box.x + box.width > maxX ) maxX = box.x + box.width
      if ( box.y + box.height > maxY ) maxY = box.y + box.height
      if ( boxData.box?.patcher ) {
        const child = new MaxPat(boxData.box)
        const childName = boxData.box.text.replace(/^p(atcher)?\s+/i, '')
        this.children.push({ name: childName || boxData.box.id, patcher: child })
      }
      this.boxes[box.id] = box
    }
    this.rect = [ minX - 20, minY - 20, maxX + 20, maxY + 20 ]
    this.width = maxX - minX + 40
    this.height = maxY - minY + 40
    this.lines = patcher.patcher.lines
  }

  subPatchers (parentName = '') {
    return [
      ...this.children.map( child => ({ name: parentName + '/' + child.name, patcher: child.patcher }) ),
      ...this.children.reduce( (acc, cur) => [ ...acc, ...cur.patcher.subPatchers(parentName + '/' + cur.name)], [])
    ]
  }

  gatherViewBoxWith(anotherPatcher) {
    const newRect = [
      Math.min(this.rect[0], anotherPatcher.rect[0]),
      Math.min(this.rect[1], anotherPatcher.rect[1]),
      Math.max(this.rect[2], anotherPatcher.rect[2]),
      Math.max(this.rect[3], anotherPatcher.rect[3])
    ]
    this.rect = anotherPatcher.rect = newRect
    this.width = anotherPatcher.width = newRect[2] - newRect[0] + 40
    this.height = anotherPatcher.height = newRect[3] - newRect[1] + 40
  }

  svg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', this.width)
    svg.setAttribute('height', this.height)
    svg.setAttribute('viewBox', [this.rect[0], this.rect[1], this.width, this.height].join(' '))
    const uuid = crypto.randomUUID()
    svg.setAttribute('data-' + uuid, true)
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
    for ( const box of Object.values(this.boxes) ) {
      svg.appendChild(box.svg(this))
    }
    for ( const line of this.lines ) {
      const sourceBox = this.boxes[line.patchline.source[0]];
      const destBox = this.boxes[line.patchline.destination[0]];

      const start = sourceBox.outlet(line.patchline.source[1])
      const end = destBox.inlet(line.patchline.destination[1])

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add('patchline')
      let d = `M ${start.x} ${start.y}`;
      let prevX = start.x
      let prevY = start.y
      let points = []
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
    return svg
  }
}


async function loadFromGitHub(owner: string, repo: string, type: GitHubURLType, params: string[] ) {
  const files = await fetchFromGitHub(owner, repo, type, params)
  if (!files) {
    showZeroState()
    return
  }
  const list = document.getElementById('files')
  listItems = []
  for (const file of files.sort((a, b) => a.name < b.name ? -1 : 1)) {
    const li = document.createElement('li')
    li.dataset.left = file.left
    li.dataset.right = file.right
    li.dataset.name = file.name
    list.appendChild(li)
    listItems.push(li)
  }
  renderDiffItems(listItems)
}

function renderDiffItems(items) {
  const wrapper = document.querySelector('#wrapper')
  wrapper.textContent = ''
  for (const item of items) {
    const link = document.createElement('a')
    const name = item.dataset.name
    const id = name.replace(/\W/, '-')
    link.textContent = name
    link.setAttribute('href', '#' + id)
    item.appendChild(link)
    if (/\.max(:?pat|help)$/.test(name)) {
      try {
        const leftPatcher = new MaxPat(JSON.parse(item.dataset.left))
        const rightPatcher = new MaxPat(JSON.parse(item.dataset.right))
        const block = createDiffBlock(name, id, leftPatcher, rightPatcher)
        wrapper.appendChild(block)

        const leftChildren = leftPatcher.subPatchers()
        const leftChildrenMap = Object.fromEntries(leftChildren.map( c => [c.name, c]))
        const rightChildren = rightPatcher.subPatchers()
        const rightChildrenMap = Object.fromEntries(rightChildren.map( c => [c.name, c]))
        const childrenNames = Object.keys(Object.fromEntries(
          [...leftChildren.map(c => c.name), ...rightChildren.map(c => c.name)].map(n => [n, 1])
        )).sort((a, b) => a < b ? -1 : 1)
        for (const childName of childrenNames) {
          const block = createDiffBlock(
            name + '#' + childName,
            (name + '--' + childName).replace(/\W/, '-'),
            leftChildrenMap[childName] || new MaxPat({}),
            rightChildrenMap[childName] || new MaxPat({})
          )
          wrapper.appendChild(block)
        }

      }
      catch (e) {
        console.log(e)
      }
    }
    else {
      wrapper.appendChild(createEmptyBlock(name, id, 'Not supported'))
    }
  }
  setTimeout(postRender, 100)
}

function postRender() {
  document.querySelectorAll('svg.patcher-view').forEach(svg => {
    svg.addEventListener('click', handleSVGClick)
  })

  if (document.location.hash) {
    const id = document.location.hash.replace(/^#/, '')
    const to = document.getElementById(id)
    if (to) {
      to.scrollIntoView()
    }
  }

  document.querySelectorAll('.toggle-patcher-diff').forEach(toggle => {
    toggle.addEventListener('click', (evt) => {
      if (toggle.innerText === 'close') {
        toggle.innerText = 'open'
        const wrapper = document.getElementById(toggle.dataset.target)
        wrapper.querySelectorAll('.svg-wrapper').forEach(svg => {
          svg.setAttribute('style', 'display: none;')
        })
        wrapper.setAttribute('style', 'height: 30px;')
        wrapper.classList.add('closed')
        wrapper.classList.remove('opened')
      }
      else {
        toggle.innerText = 'close'
        const wrapper = document.getElementById(toggle.dataset.target)
        wrapper.querySelectorAll('.svg-wrapper').forEach(svg => {
          svg.setAttribute('style', 'display: block;')
        })
        wrapper.setAttribute('style', 'height: ' + (parseInt(wrapper.dataset.height) + 100) + 'px;')
        wrapper.classList.add('opened')
        wrapper.classList.remove('closed')
      }
    })
  })
}

function createEmptyBlock(name, id, message) {
  const block = document.createElement('div')
  block.classList.add('invalid-diff')
  block.setAttribute('id', id)
  block.setAttribute('style', 'height: 100px;')

  const header = document.createElement('h2')
  header.textContent = name
  block.appendChild(header)
  const messageBlock = document.createElement('div')
  messageBlock.textContent = message
  block.appendChild(messageBlock)
  return block
}

function createDiffBlock(name, id, leftPatcher, rightPatcher) {
  console.log(leftPatcher,rightPatcher)
  leftPatcher.gatherViewBoxWith(rightPatcher)
  const same = leftPatcher.isEqualTo(rightPatcher)
  const patcherDiff = document.createElement('div')
  patcherDiff.classList.add('patcher-diff')
  patcherDiff.setAttribute('id', id)
  patcherDiff.dataset.height = leftPatcher.height
  patcherDiff.setAttribute('style', 'height: ' + ((same ? 30 : 100 + parseInt(patcherDiff.dataset.height))) + 'px;')
  patcherDiff.classList.add(same ? 'closed' : 'opened')
  const header = document.createElement('h2')
  const toggle = document.createElement('button')
  toggle.classList.add('toggle-patcher-diff')
  toggle.dataset.target = id
  toggle.innerText = same ? 'open' : 'close'
  header.appendChild(toggle)
  header.appendChild(document.createTextNode(name))
  patcherDiff.appendChild(header)

  const leftWrapper = document.createElement('div')
  leftWrapper.classList.add('svg-wrapper-left')
  leftWrapper.setAttribute('style', 'opacity: 0.8;')
  leftWrapper.classList.add('svg-wrapper')
  leftWrapper.appendChild(leftPatcher.svg())
  patcherDiff.appendChild(leftWrapper)

  const rightWrapper = document.createElement('div')
  rightWrapper.classList.add('svg-wrapper-right')
  rightWrapper.setAttribute('style', 'opacity: 0.8;')
  rightWrapper.classList.add('svg-wrapper')
  rightWrapper.appendChild(rightPatcher.svg())
  patcherDiff.appendChild(rightWrapper)

  if (same) {
    leftWrapper.setAttribute('style', 'display: none')
    rightWrapper.setAttribute('style', 'display: none')
  }
  return patcherDiff
}

function showZeroState() {
  const wrapper = document.getElementById('wrapper')
  wrapper.textContent = 'No contents to show'
}



function selectBox(target) {
  document.getElementById('object-viewer-wrapper').setAttribute('style', 'display: none;')
  const parent = target.parentElement
  document.body.classList.add('selection-on')
  target.classList.add('selected')
  parent.removeChild(target)
  parent.appendChild(target)
  const selector = target.dataset.connections
  if (!selector) return
  const connectedElements = parent.querySelectorAll(target.dataset.connections)
  connectedElements.forEach(e => {
    if (e === target) return
    parent.removeChild(e)
    parent.appendChild(e)
    e.classList.add('selected-connected')
  })
}

const tArray = Symbol('array')
const tObject = Symbol('object')
const tPrimitive = Symbol('primitive')

function getTypeOf(value) {
  // Too cheap for JS values but it might be ok for values coming from JSON I think... :thinking:
  return Array.isArray(value) ? tArray
    : value instanceof Object ? tObject
      : tPrimitive
    ;
}

function deepEqual(left, right) {
  const type = getTypeOf(left)
  if (type != getTypeOf(right)) return false
  if (type === tPrimitive) return left === right
  if (type === tArray) {
    return left.length === right.length && left.every((e, i) => deepEqual(e, right[i]))
  }
  return deepEqual(Object.entries(left).sort(), Object.entries(right).sort())
}

function createObjectInfoColumn(value) {
  const type = getTypeOf(value)
  if (type === tPrimitive) {
    const span = document.createElement('span')
    span.textContent = value
    return span
  }
  else if (type === tArray) {
    const list = document.createElement('ul')
    for (const listItem of value) {
      const li = document.createElement('li')
      li.appendChild(createObjectInfoColumn(listItem))
      list.appendChild(li)
    }
    return list
  }
  const table = document.createElement('table')
  for (const k of Object.keys(value).sort()) {
    const keyRow = document.createElement('tr')
    table.appendChild(keyRow)
    const th = document.createElement('th')
    th.innerText = k
    keyRow.appendChild(th)
    const valueRow = document.createElement('tr')
    table.appendChild(valueRow)
    const td = document.createElement('td')
    td.appendChild(createObjectInfoColumn(value[k]))
    valueRow.appendChild(td)
  }
  return table
}

function showObjectInfo(left, right) {
  document.getElementById('object-viewer-wrapper').setAttribute('style', 'display: block;')
  const allKeys = Object.keys(Object.fromEntries([...Object.keys(left), ...Object.keys(right)].map(k => [k, 1]))).sort()
  const table = document.getElementById('object-viewer')
  table.innerHTML = ''
  const boxes = { left, right }
  const lists = {
    left: document.getElementById('object-viewer-left'),
    right: document.getElementById('object-viewer-right')
  }
  for (const k of allKeys) {
    const same = deepEqual(boxes.left[k], boxes.right[k])
    const header = document.createElement('tr')
    const body = document.createElement('tr')
    table.appendChild(header)
    table.appendChild(body)
    for (const pane of ['left', 'right']) {
      const th = document.createElement('th')
      const td = document.createElement('td')
      if (!same) {
        th.classList.add('different')
        td.classList.add('different')
      }
      if (boxes[pane].hasOwnProperty(k)) {
        th.innerText = k
        const v = boxes[pane][k]
        if (k === 'patcher') {
          td.textContent = '(omitted)'
        }
        else {
          td.appendChild(createObjectInfoColumn(boxes[pane][k]))
        }
      }
      header.appendChild(th)
      body.appendChild(td)
    }
  }
}

function handleSVGClick(evt) {
  const possibles = document.elementsFromPoint(evt.clientX, evt.clientY)
  if (possibles.filter(e => e.matches('#viewer-control')).length) return
  document.body.classList.remove('selection-on')
  document.querySelectorAll('.selected').forEach(e => e.classList.remove('selected'))
  document.querySelectorAll('.selected-connected').forEach(e => e.classList.remove('selected-connected'))
  const leftCandidates = possibles.filter(e => e.parentElement && e.parentElement.matches('.svg-wrapper-left g.box'))
  const left = leftCandidates.length ? leftCandidates[0].parentElement : null
  const rightCandidates = possibles.filter(e => e.parentElement && e.parentElement.matches('.svg-wrapper-right g.box'))
  const right = rightCandidates.length ? rightCandidates[0].parentElement : null
  if (left) selectBox(left)
  if (right) selectBox(right)

  showObjectInfo(
    JSON.parse(left ? left.dataset.box : '{}'),
    JSON.parse(right ? right.dataset.box : '{}')
  )
}


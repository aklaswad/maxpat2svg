//const maxApi = require("max-api")
const fs = require('node:fs/promises')
const http = require('node:http')
const URL = require('node:url')
const path = require('node:path')
const QueryString = require('node:querystring')

const port = 8444
const memCache = {}

async function readdirRecursively (dir, files = []) {
  const paths = await fs.readdir(dir).catch(() => [])
  for (const item of paths) {
    const itemPath = path.resolve(dir, item)
    const stats = await fs.stat(itemPath).catch(() => null)
    if (stats && stats.isDirectory()) {
      files.push(...(await readdirRecursively(itemPath)))
    } else if ( stats ) {
      files.push(itemPath)
    }
  }
  return files
}

function contentTypeOf (path) {
  const suffix = path.match(/\.(\w+)$/) || [,'']
  switch (suffix[1]) {
    case 'html': return 'text/html'
    case 'js':   return 'text/javascript'
    case 'css':  return 'text/css'
  }
}

async function handleGitHubRequest(args) {
}

async function getFileContentForDiff(left, right) {
  // XXX: too nervous?
  // Deny if the app seems to be reading files out of git diff context
  if ( ! (/git-difftool/.test(left)  && /left/.test(left))   ) throw 'Not allowed'
  if ( ! (/git-difftool/.test(right) && /right/.test(right)) ) throw 'Not allowed'

  const contents = await Promise.all([
    left  ? fs.readFile(left,  'utf-8') : '{}',
    right ? fs.readFile(right, 'utf-8') : '{}'
  ])
  return { left:  contents[0], right: contents[1] }
}

async function handleLocalDiff(args) {
  const query = QueryString.parse(args.url.search.replace(/^\?/, ''))
  const leftRoot = query.left
  const rightRoot = query.right
  const leftFiles = Object.fromEntries(
    (await readdirRecursively(path.resolve(query.left))).map(fn => [path.relative(leftRoot,fn), fn])
  )
  const rightFiles = Object.fromEntries(
    (await readdirRecursively(path.resolve(query.right))).map(fn => [path.relative(rightRoot,fn), fn])
  )
  const files = {}
  for ( const fn of [...Object.keys(leftFiles), ...Object.keys(rightFiles)] ) {
    files[fn].name = fn
  }
  const promises = []
  for ( const fn of Object.keys(files) ) {
    promises.push(
      ( async (fn) => {
        files[fn] = await getFileContentForDiff(leftFiles[fn], rightFiles[fn])
      })(fn)
    )
  }
  await Promise.all(promises)

  args.res.writeHead(200, { "Content-Type": 'application/json' })
  args.res.end(JSON.stringify(Object.values(files)), "utf-8")
}

async function handleStaticFiles (args) {
  const url = args.url
  if ( memCache[url.pathname] ) {
    content = memCache[url.pathname]
  }
  const pathname = url.pathname === '/' ? 'index.html' : url.pathname
  const page = await fs.readFile(
    path.resolve(__dirname, '..', 'dist', `./${pathname}`),
    'utf-8'
  ).catch(() => null)
  if ( !page ) {
    args.res.writeHead(400)
    args.res.end('Not found')
    return
  }
  memCache[url.pathname] = page
  args.res.writeHead(200, { "Content-Type": contentTypeOf(pathname) })
  args.res.end(page, "utf-8")
}

http
  .createServer(async function (req, res) {
    const url = URL.parse(req.url)
    const paths = url.pathname.split('/')
    switch (paths[1]) {
      case 'diff': return handleLocalDiff({url, req, res})
      case 'github': return handleGitHubRequest({url, req, res})
      default: return handleStaticFiles({url, req, res})
    }
  })
  .listen(port)


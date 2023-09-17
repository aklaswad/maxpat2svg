//const maxApi = require("max-api")
const fs = require('node:fs/promises')
const http = require('node:http')
const URL = require('node:url')
const path = require('node:path')

const memCache = {}

function contentTypeOf (path) {
  const suffix = path.match(/\.(\w+)$/) || [,'']
  switch (suffix[1]) {
    case 'html': return 'text/html'
    case 'js':   return 'text/javascript'
    case 'css':  return 'text/css'
  }
}

http
  .createServer(async function (req, res) {
    const url = URL.parse(req.url)
    if ( memCache[url.pathname] ) {
      content = memCache[url.pathname]
    }
    const pathname = url.pathname === '/' ? 'index.html' : url.pathname
    const paths = pathname.split('/')
    switch (paths[0]) {
      case 'diff': return handleLocalDiff(req, res)
      case 'github': return handleGitHubRequest(req, res)
    }

    // serve static content from dist
    const page = await fs.readFile(
      path.resolve(__dirname, '..', 'dist', `./${pathname}`),
      'utf-8'
    ).catch(() => null)
    if ( !page ) {
      res.writeHead(400)
      res.end('Not found')
      return
    }
    memCache[url.pathname] = page
    res.writeHead(200, { "Content-Type": contentTypeOf(pathname) })
    res.end(page, "utf-8")
  })
  .listen(8444)


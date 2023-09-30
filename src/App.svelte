<script lang="ts">
  import './style.css'
  import TheMainView from './components/TheMainView.svelte'
  import { diffItems, opacityBalance, diffItemIndex } from './store'
  import { fetchFromGitHub, type GitHubURLType, SidesOfDiff } from "./github"
  import { type DiffItem, type DiffSource, type SideOfDiff } from './types'
  import { combineArray, deepEqual, makeTree } from './util'
  import { MaxPat, patcherDiffSummary } from './maxpat2svg';

  function setUpFileList (sources: DiffSource[]) {
    const flatDict: {[id: string]: DiffItem} = {}
    const diffs: DiffItem[] = []
    for ( const idx in sources ) {
      const src = sources[idx]
      const isFile = true
      const id = `file-${idx}`
      const patchers: { [side in SideOfDiff]: MaxPat | null } = { left: null, right: null }
      for ( const side of SidesOfDiff ) {
        const raw = src.rawContent[side]
        if ( !raw || raw == null ) continue
        const json = JSON.parse(raw)
        patchers[side] = new MaxPat(json, null, src.name, `file-${idx}`)
      }
      const fullPath = patchers.left  ? patchers.left.fullPath()
                     : patchers.right ? patchers.right.fullPath()
                     :                  null
      const path = patchers.left  ? patchers.left.path
                 : patchers.right ? patchers.right.path
                 :                  []
      const filePath = (src.name || 'unnamed file???').split(/\/|\\/)
      const baseName = filePath[filePath.length - 1]

      // Extract sub patchers
      const leftSubs  = patchers.left ? patchers.left.subPatchers() : []
      const rightSubs = patchers.right ? patchers.right.subPatchers() : []
      const subs: DiffItem[] = combineArray<MaxPat, DiffItem>(
        p => p.id,
        (l,r) => {
          const diff = patcherDiffSummary(l,r)
          const res: DiffItem = {
            id: l ? l.id : r ? r.id : 'unknown',
            sub: true,
            name: l ? l.name : r ? r.name : 'unknown',
            path: l ? l.path : r ? r.path : [],
            fullPath: l ? l.fullPath() : r ? r.fullPath() : null,
            patchers: { left: l || null, right: r || null },
            diff: diff,
            isFile: false,
            status: diff.status,

          }
          return res
        },
        leftSubs, rightSubs
      )
      subs.forEach( file => {
        diffs.push(file)
        flatDict[file.fullPath || ''] = file
      })
      const subPatchers = subs
      const subtree = makeTree( subs.map( s => ({ path: s.path || [], item: s }) ) )
      const subPatcherTree = subtree.length ? subtree[0].nodes : []

      const diff = patcherDiffSummary(patchers.left, patchers.right)
      patchers.left && patchers.right && patchers.right.gatherViewBoxWith(patchers.left )
      const diffItem = {
        isFile, id, patchers, fullPath, path, filePath, baseName,
        subPatchers, subPatcherTree, diff,
        name: src.name,
        status: src.status,
        rawContent: src.rawContent,
        sub: false,
      }
      flatDict[fullPath || ''] = diffItem
      diffs.push(diffItem)
    }

    $diffItems = diffs
    $diffItemIndex = flatDict
  }

  async function loadFromGitHub(owner: string, repo: string, type: GitHubURLType, params: string[] ): Promise<void> {
    const files = await fetchFromGitHub(owner, repo, type, params)
    if (!files) {
      return
    }
    setUpFileList(files)
  }

  async function loadFromLocal(left: string, right: string, reqid: string | null = '') {
    const res = await fetch(`/diff?left=${left}&right=${right}&reqid=${reqid}`)
    const json = await res.json()
    setUpFileList(json)
  }

  let loadError: string
  let loader: Promise<void> = new Promise( (_resolve, reject) => {
    loadError = 'No items to show'
    reject()
  })

  async function init(event: Event) {
    const search = document.location.search
    if (search) {
      const params = new URLSearchParams(search)
      const url = params.get("url")
      const left = params.get('left')
      const right = params.get('right')
      const reqid = params.get('reqid')
      if (url) {
        const regex = new RegExp(
          "^https://github.com/([^/]+)/([^/]+)/([^/]+)/?(.*)$"
        )
        const match = url.match(regex)
        if (match) {
          const owner = match[1]
          const repo = match[2]
          const type: GitHubURLType = match[3] as GitHubURLType // TODO: Type guard
          const params = (match[4] || '').split("/")
          loader = loadFromGitHub(owner, repo, type, params);
        }
      }
      else if (left && right) {
        loader = loadFromLocal(left, right, reqid)
      }
      else {
        loader = new Promise( (_r, e) => {
          loadError = 'Required parameters (left and right, or url) are missing'; e()
        } )
      }
    }
  }

  let keyStateZ = false
  let keyStateX = false

  function updateOpacity () {
    $opacityBalance = keyStateZ ? 0
                    : keyStateX ? 1000
                    :             500
  }

  function keyDown(evt: KeyboardEvent) {
    if ( !evt.target ) return
    if ( !(evt.target instanceof Element )) return
    if ( !evt.target.nodeName ) return
    if ( !(
      evt.target.nodeName.toLowerCase() === 'body'
      || (
        evt.target.nodeName.toLowerCase() === 'input' && evt.target.id === 'left-right-ratio'
      )
    )) return
    if ( evt.key === 'z' ) {
      keyStateZ = true
      $opacityBalance = 0
    }
    if ( evt.key === 'x' ) {
      keyStateX = true
      $opacityBalance = 1000
    }
  }

  function keyUp(evt: KeyboardEvent) {
    if ( !evt.target ) return
    if ( !(evt.target instanceof Element )) return
    if ( !evt.target.nodeName ) return
    if ( !(
      evt.target.nodeName.toLowerCase() === 'body'
      || (
        evt.target.nodeName.toLowerCase() === 'input' && evt.target.id === 'left-right-ratio'
      )
    )) return
    if ( evt.key === 'z' ) {
      keyStateZ = false
    }
    if ( evt.key === 'x' ) {
      keyStateX = false
    }
    updateOpacity()
  }
</script>

<style>
  .load-error, .load-progress {
    display: block;
    text-align: center;
    font-weight: bold;
    font-size: 1.4rem;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
  }

  .load-error {
    color: #833;
  }
</style>

<svelte:window
  on:load="{init}"
  on:keydown="{keyDown}"
  on:keyup="{keyUp}"
/>

{#await loader}
  <div class="load-progress">
    ...loading
  </div>
{:then}
  <TheMainView />
{:catch error}
  <div class="load-error">
    Loading error: {loadError}
  </div>
{/await}


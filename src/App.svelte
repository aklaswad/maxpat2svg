<script lang="ts">
  import './style.css'
  import TheMainView from './components/TheMainView.svelte'
  import { diffItems, opacityBalance, diffItemIndex } from './store'
  import { fetchFromGitHub, type GitHubURLType, type DiffItem, SidesOfDiff } from "./github"
  import { combineArray, deepEqual, makeTree } from './util'
  import MaxPat from './maxpat2svg';

  function setUpFileList (files: DiffItem[]) {
    const flatDict: {[id: string]: DiffItem} = {}

    for ( const idx in files ) {
      const file = files[idx]
      file.isFile = true
      file.id = `file-${idx}`
      file.rawContent ??= {}
      file.patchers ??= {}
      for ( const side of SidesOfDiff ) {
        const raw = file.rawContent[side]
        if ( !raw || raw == null ) continue
        const json = JSON.parse(raw)
        file.patchers[side] = new MaxPat(json, null, file.name, `file-${idx}`)
      }
      file.fullPath = file.patchers.left  ? file.patchers.left.fullPath()
                    : file.patchers.right ? file.patchers.right.fullPath()
                    :                       null
      file.path = file.patchers.left  ? file.patchers.left.path
                : file.patchers.right ? file.patchers.right.path
                :                       []
      const filePath = (file.name || 'unnamed file???').split(/\/|\\/)
      file.filePath = filePath
      file.baseName = filePath[filePath.length - 1]
      flatDict[file.fullPath || ''] = file

      // Extract sub patchers
      const leftSubs  = file.patchers.left ? file.patchers.left.subPatchers() : []
      const rightSubs = file.patchers.right ? file.patchers.right.subPatchers() : []
      const subs: DiffItem[] = combineArray<MaxPat, DiffItem>(
        p => p.id,
        (l,r) => {
          const res: DiffItem = {
            id: l ? l.id : r ? r.id : 'unknown',
            sub: true,
            name: l ? l.name : r ? r.name : 'unknown',
            path: l ? l.path : r ? r.path : [],
            fullPath: l ? l.fullPath() : r ? r.fullPath() : null,
            patchers: { left: l, right: r },
            same: deepEqual(l,r),
            diff: undefined
          }
          res.diff = r?.diffSummaryWith(l)
          return res
        },
        leftSubs, rightSubs
      )
      subs.forEach( file => flatDict[file.fullPath || ''] = file)
      file.subPatchers = subs
      const subtree = makeTree( subs.map( s => ({ path: s.path || [], item: s }) ) )
      file.subPatcherTree = subtree.length ? subtree[0].nodes : []

      file.diff = file.patchers.left && file.patchers.right ? file.patchers.right.diffSummaryWith(file.patchers.left)
                : file.patchers.right                       ? file.patchers.right.diffSummaryWith(undefined)
                : file.patchers.left                        ? file.patchers.left.diffSummaryWith(undefined, true)
                :                                             { hasDifference: false, status: 'same' }
      file.same = !file.diff.hasDifference
      file.patchers.left && file.patchers.right && file.patchers.right.gatherViewBoxWith(file.patchers.left )
    }

    $diffItems = files
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


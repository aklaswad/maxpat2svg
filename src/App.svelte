<script lang="ts">
  import './style.css'
  import DiffView from './components/DiffView.svelte'
  import { diffItems, opacityBalance } from './store'
  import { fetchFromGitHub, type GitHubURLType, type DiffItem } from "./github"
  import { combineArray, deepEqual } from './util'
  import MaxPat from './maxpat2svg';

  function setUpFileList (files: DiffItem[]) {
    // Extract sub patchers
    files.forEach( (f, idx) => {
      f.id = `file-${idx}`
      f.leftPatcher = new MaxPat(JSON.parse(f.left || '{}'), f.name, `file-${idx}`)
      f.rightPatcher = new MaxPat(JSON.parse(f.right || '{}'), f.name, `file-${idx}`)
    })
    files.forEach( file => {
      const leftSubs = file.leftPatcher ? file.leftPatcher.subPatchers() : []
      const rightSubs = file.rightPatcher ? file.rightPatcher.subPatchers() : []
      const subs = combineArray(
        p => p.id,
        (l,r) => ({
          id: l ? l.id : r ? r.id : 'unknown',
          sub: true,
          name: l ? l.name : r ? r.name : 'unknown',
          leftPatcher: l,
          rightPatcher: r,
          same: deepEqual(l,r)
        }),
        leftSubs, rightSubs
      )
      file.subPatchers = subs
    })
    files.forEach( (o) => {
      o.same = deepEqual(o.leftPatcher?.patcher, o.rightPatcher?.patcher)
      o.leftPatcher && o.rightPatcher && o.leftPatcher.gatherViewBoxWith(o.rightPatcher )
    })

    $diffItems = Object.fromEntries( files.map( f => [f.id, f]) )
  }

  async function loadFromGitHub(owner: string, repo: string, type: GitHubURLType, params: string[] ): Promise<void> {
    const files = await fetchFromGitHub(owner, repo, type, params)
    if (!files) {
      showZeroState()
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
  <DiffView />
{:catch error}
  <div class="load-error">
    Loading error: {loadError}
  </div>
{/await}


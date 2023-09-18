<script lang="ts">
  import './style.css'
  import DiffView from './components/DiffView.svelte'
  import { diffFiles, diffItems } from './store'
  import { fetchFromGitHub, type GitHubURLType, type DiffItem } from "./github"
  import MaxPat from './maxpat2svg';

  async function loadFromGitHub(owner: string, repo: string, type: GitHubURLType, params: string[] ): Promise<void> {
    const files = await fetchFromGitHub(owner, repo, type, params)
    if (!files) {
      showZeroState()
      return
    }
    console.error(files)
    files.forEach( f => {
      f.leftPatcher = new MaxPat(JSON.parse(f.left || '{}'), f.name)
      f.rightPatcher = new MaxPat(JSON.parse(f.right || '{}'), f.name)
      f.leftPatcher.gatherViewBoxWith(f.rightPatcher)
    })
    $diffItems = files
    $diffFiles = files.map( f => f.name )
  }

  async function loadFromLocal(left: string, right: string) {
    const res = await fetch(`/diff?left=${left}&right=${right}`)
    const json = await res.json()
    json.forEach( f => {
      f.leftPatcher = new MaxPat(JSON.parse(f.left || '{}'), f.name)
      f.rightPatcher = new MaxPat(JSON.parse(f.right || '{}'), f.name)
      f.leftPatcher.gatherViewBoxWith(f.rightPatcher)
    })
    $diffItems = json
    $diffFiles = json.map(f => f.name)
  }

  let loader: Promise<void>
  let loadError: string
  async function init(event: Event) {
    const search = document.location.search
    if (search) {
      const params = new URLSearchParams(search)
      const url = params.get("url")
      const left = params.get('left')
      const right = params.get('right')
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
        loader = loadFromLocal(left, right)
      }
      else {
        loader = new Promise( (_r, e) => {
          loadError = 'Unsupported format in ?url= param'; e()
        } )
      }
    }
    else {
      loader = new Promise( (_r, e) => {
        loadError = 'No items to show'; e()
      } )
    }

    /*else if (items.length) {
      renderDiffItems(items);
    } else {
      showZeroState();
    }
    */

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

<svelte:window on:load="{init}" />

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


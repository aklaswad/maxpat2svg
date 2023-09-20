import MaxPat from './maxpat2svg'

// GitHub support
const fetchOptionJSON: RequestInit = {
  redirect: 'follow',
  headers: {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
}

type GHResponseFileNode = { filename: string, status: string }
export type DiffItem = {
  id?: string
  sub?: boolean
  name?: string
  same?: boolean
  left?: string
  right?: string
  leftPatcher?: MaxPat
  rightPatcher?: MaxPat
  select?: () => void
}

async function fetchContent(owner: string, repo: string, path: string, ref: string) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref ? ref + '/' : ''}${path}`
  const res = await fetch(url)
  const content = await res.text()
  return content
}

// TODO: Throttle
async function resolveFiles(owner: string, repo: string, leftRef: string, rightRef: string, fileList: GHResponseFileNode[] ) {
  const files = fileList.map(f => ({} as DiffItem))
  const workers = []
  for (const idx in fileList) {
    const file = fileList[idx]
    if (! /\.max(pat|help)/.test(file.filename)) {
      files[idx]['left'] = '{}'
      files[idx]['right'] = '{}'
    }
    else if (file.status === 'added') {
      files[idx]['left'] = '{}'
      workers.push((async () => files[idx]['right'] = await fetchContent(owner, repo, file.filename, rightRef))())
    }
    else if (file.status === 'removed') {
      workers.push((async () => files[idx]['left'] = await fetchContent(owner, repo, file.filename, leftRef))())
      files[idx]['right'] = '{}'
    }
    else {
      workers.push((async () => files[idx]['left'] = await fetchContent(owner, repo, file.filename, leftRef))())
      workers.push((async () => files[idx]['right'] = await fetchContent(owner, repo, file.filename, rightRef))())
    }
    files[idx]['name'] = file.filename
  }
  await Promise.all(workers)
  return files
}

async function fetchFromCommit(owner: string, repo: string, ref: string) {
  let url = `https://api.github.com/repos/${owner}/${repo}/commits/${ref}`
  const res = await fetch(url, fetchOptionJSON)
  const content = await res.json()
  return resolveFiles(
    owner,
    repo,
    content.parents[0].sha,
    content.sha,
    content.files
  )
}

async function fetchFromCompare(owner: string, repo: string, compareSpec: string) {
  let url = `https://api.github.com/repos/${owner}/${repo}/compare/${compareSpec}`
  const res = await fetch(url, fetchOptionJSON)
  const json = await res.json()
  const [left, right] = compareSpec.split(/\.\.+/)
  return resolveFiles(
    owner,
    repo,
    left,
    right,
    json.files
  )
}

async function fetchFromPull(owner: string, repo: string, pullNumber: string) {
  let url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`
  const res = await fetch(url, fetchOptionJSON)
  const json = await res.json()
  return fetchFromCompare(owner, repo, json.base.sha + '...' + json.head.sha)
}

export type GitHubURLType = 'commit' | 'pull' | 'compare'

export async function fetchFromGitHub(owner: string, repo: string, type: GitHubURLType, params: string[]) {
  switch (type) {
    case 'commit':
      return await fetchFromCommit(owner, repo, params[0])
    case 'pull':
      return await fetchFromPull(owner, repo, params[0])
    case 'compare':
      return await fetchFromCompare(owner, repo, params[0])
  }
}

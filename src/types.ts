import {MaxPat, Box, type PatcherDiffInfo} from './maxpat2svg'

export type DiffSourceAdded = {
  name: string
  status: 'added'
  rawContent: { left: null, right: string }
}

export type DiffSourceRemoved = {
  name: string
  status: 'removed'
  rawContent: { left: string, right: null }
}

export type DiffSourceModified = {
  name: string
  status: 'modified'
  rawContent: { left: string, right: string }
}

export type DiffSourceInvalid = {
  name: string
  status: 'invalid'
  rawContent: { left: null, right: null }
}

export type DiffSource
  = DiffSourceAdded
  | DiffSourceRemoved
  | DiffSourceModified
  | DiffSourceInvalid


export type DiffItem = {
  id?: string
  isFile?: boolean
  path?: string[]
  fullPath?: string | null
  baseName?: string
  filePath?: string[]
  sub?: boolean
  name?: string
  same?: boolean
  diff?: PatcherDiffInfo
  rawContent?: { [side in SideOfDiff]?: string | null }
  patchers: { [side in SideOfDiff]?: MaxPat | null }
  subPatchers?: DiffItem[]
  subPatcherTree?: any
  select?: (boxes?: {left?: Box, right?: Box}) => void
}
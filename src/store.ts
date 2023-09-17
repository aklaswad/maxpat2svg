import { writable, type Writable } from 'svelte/store';
import { MaxPat } from './maxpat2svg'
import { type DiffItem } from './github'

export type MaxPatFile = {
  filename: string
  left?: MaxPat
  right?: MaxPat
}

export const diffFiles: Writable<string[]> = writable([''])
export const diffItems: Writable<DiffItem[]> = writable([])

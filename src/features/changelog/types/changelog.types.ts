export type ChangeType = 'major' | 'minor' | 'patch' | 'initial'

export interface ChangelogEntry {
  version: string
  date: string
  type: ChangeType
  summary: string
  route: string
  changes: string[]
}

export interface ChangelogData {
  version: string
  entries: ChangelogEntry[]
}

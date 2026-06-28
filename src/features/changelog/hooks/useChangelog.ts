import changelogData from '../../../config/changelog.json'
import type { ChangelogData } from '../types/changelog.types'

export function useChangelog() {
  const data = changelogData as ChangelogData

  const entries = [...data.entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return {
    version: data.version,
    entries,
  }
}

export const jiraConfig = {
  baseUrl: import.meta.env.VITE_JIRA_BASE_URL as string,
  email: import.meta.env.VITE_JIRA_EMAIL as string,
  apiToken: import.meta.env.VITE_JIRA_API_TOKEN as string,
  projectKey: import.meta.env.VITE_JIRA_PROJECT_KEY as string,
} as const

import type { JiraTicket } from '../types/jira.types';
import mockData from '../../../../app/Mocks/Cargajira.json';

export const getJiraTickets = (): JiraTicket[] => {
  return mockData as JiraTicket[];
};

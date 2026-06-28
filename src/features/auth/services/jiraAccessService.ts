import type { SolicitudAcceso, JiraTicketCreado } from '../types/solicitarAcceso.types'
import { jiraConfig } from '../../../config/jira.config'

/**
 * Crea un ticket en Jira solicitando acceso al sistema para un nuevo usuario.
 *
 * TODO: Cuando las credenciales de Jira estén disponibles, reemplazar el mock
 * por la llamada real:
 *   POST ${jiraConfig.baseUrl}/rest/api/3/issue
 *   Headers: Authorization: Basic btoa(`${jiraConfig.email}:${jiraConfig.apiToken}`)
 *            Content-Type: application/json
 */
export const solicitarAccesoJira = async (
  solicitud: SolicitudAcceso,
): Promise<JiraTicketCreado> => {
  // Datos que se enviarían al body de la API de Jira
  const _payload = {
    fields: {
      project: { key: jiraConfig.projectKey },
      summary: `Solicitud de acceso — ${solicitud.nombreCompleto}`,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `El usuario ${solicitud.nombreCompleto} (${solicitud.correo}) solicita credenciales de acceso al sistema Makers Soporte.`,
              },
            ],
          },
        ],
      },
      issuetype: { name: 'Task' },
      priority: { name: 'Medium' },
    },
  }

  // Simula el delay de red (reemplazar con axios cuando las credenciales estén listas)
  await new Promise(r => setTimeout(r, 1_500))

  const mockTicketNumber = Math.floor(Math.random() * 900) + 150
  return {
    id: String(10000 + mockTicketNumber),
    key: `${jiraConfig.projectKey || 'MKRS'}-${mockTicketNumber}`,
    self: `${jiraConfig.baseUrl}/rest/api/3/issue/${10000 + mockTicketNumber}`,
  }
}

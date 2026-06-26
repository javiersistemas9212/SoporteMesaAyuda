import { Box, CircularProgress, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface JiraProgressStepperProps {
  completedSteps: number;
  isLoading: boolean;
}

const STEPS = ['Consultando Jira', 'Guardando', 'Cargando validaciones'];

export function JiraProgressStepper({ completedSteps, isLoading }: JiraProgressStepperProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        py: 5,
        px: 4,
      }}
    >
      {STEPS.map((label, index) => {
        const isDone = index < completedSteps;
        const isActive = index === completedSteps && isLoading;

        return (
          <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Circle + label */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, minWidth: 110 }}>
              <Box sx={{ position: 'relative', width: 72, height: 72 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    border: '3px solid',
                    borderColor: isDone
                      ? 'success.main'
                      : isActive
                      ? 'primary.main'
                      : 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isDone
                      ? 'rgba(46, 125, 50, 0.08)'
                      : isActive
                      ? 'rgba(10, 104, 226, 0.06)'
                      : 'background.paper',
                    transition: 'all 0.6s ease',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {isDone ? (
                    <CheckCircleRoundedIcon sx={{ color: 'success.main', fontSize: 36 }} />
                  ) : (
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: isActive ? 'primary.main' : 'grey.400',
                        transition: 'color 0.4s ease',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  )}
                </Box>

                {isActive && (
                  <CircularProgress
                    size={86}
                    thickness={2.5}
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      color: 'primary.main',
                      zIndex: 0,
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  textAlign: 'center',
                  fontWeight: isDone ? 600 : isActive ? 700 : 400,
                  color: isDone
                    ? 'success.main'
                    : isActive
                    ? 'primary.main'
                    : 'text.disabled',
                  fontSize: '0.78rem',
                  maxWidth: 100,
                  lineHeight: 1.3,
                  transition: 'color 0.4s ease',
                }}
              >
                {label}
              </Typography>
            </Box>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <Box
                sx={{
                  width: 80,
                  height: 4,
                  mt: '34px',
                  borderRadius: 2,
                  bgcolor: completedSteps > index ? 'success.main' : 'grey.200',
                  transition: 'background-color 0.6s ease',
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

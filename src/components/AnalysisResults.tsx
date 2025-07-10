import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore,
  BugReport,
  Security,
  Speed,
  Visibility,
  Build,
  Info,
  Warning,
  Error as ErrorIcon,
  School,
} from '@mui/icons-material';
import { CodeReviewResponse } from '../types';

interface AnalysisResultsProps {
  result: CodeReviewResponse;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'default';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <ErrorIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <Warning />;
    case 'info':
      return <Info />;
    default:
      return <Info />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'security':
      return <Security />;
    case 'performance':
      return <Speed />;
    case 'bug_fix':
      return <BugReport />;
    case 'readability':
      return <Visibility />;
    case 'best_practices':
    case 'maintainability':
      return <Build />;
    default:
      return <Info />;
  }
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const { suggestions, metrics, overall_score, summary, learning_points, next_steps } = result;

  return (
    <Box>
      {/* Overall Score */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overall Code Quality Score
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Box width="100%" mr={1}>
              <LinearProgress
                variant="determinate"
                value={overall_score * 10}
                sx={{ height: 10, borderRadius: 5 }}
                color={overall_score >= 8 ? 'success' : overall_score >= 6 ? 'warning' : 'error'}
              />
            </Box>
            <Typography variant="h6" color="text.secondary">
              {overall_score.toFixed(1)}/10
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {summary}
          </Typography>
        </CardContent>
      </Card>

      {/* Code Metrics */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Code Metrics
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flexBasis="48%">
              <Typography variant="body2" color="text.secondary">
                Lines of Code
              </Typography>
              <Typography variant="h6">{metrics.lines_of_code}</Typography>
            </Box>
            <Box flexBasis="48%">
              <Typography variant="body2" color="text.secondary">
                Complexity Score
              </Typography>
              <Typography variant="h6">{metrics.complexity_score.toFixed(1)}</Typography>
            </Box>
            <Box flexBasis="48%">
              <Typography variant="body2" color="text.secondary">
                Maintainability Index
              </Typography>
              <Typography variant="h6">{metrics.maintainability_index.toFixed(1)}</Typography>
            </Box>
            <Box flexBasis="48%">
              <Typography variant="body2" color="text.secondary">
                Duplicate Lines
              </Typography>
              <Typography variant="h6">{metrics.duplicate_lines}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Code Suggestions ({suggestions.length})
            </Typography>
            {suggestions.map((suggestion, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Box display="flex" alignItems="center" mr={2}>
                      {getSeverityIcon(suggestion.severity)}
                      {getTypeIcon(suggestion.type)}
                    </Box>
                    <Box flexGrow={1}>
                      <Typography variant="subtitle2">{suggestion.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Line {suggestion.line_number}
                      </Typography>
                    </Box>
                    <Chip
                      label={suggestion.severity}
                      color={getSeverityColor(suggestion.severity) as any}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="body2" paragraph>
                      <strong>Description:</strong> {suggestion.description}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Why this matters:</strong> {suggestion.explanation}
                    </Typography>
                    {suggestion.suggested_fix && (
                      <Typography variant="body2" paragraph>
                        <strong>Suggested fix:</strong> {suggestion.suggested_fix}
                      </Typography>
                    )}
                    {suggestion.code_example && (
                      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Example:
                        </Typography>
                        <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>
                          {suggestion.code_example}
                        </pre>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Learning Points */}
      {learning_points.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <School sx={{ mr: 1 }} />
              <Typography variant="h6">Key Learning Points</Typography>
            </Box>
            <List dense>
              {learning_points.map((point, index) => (
                <ListItem key={index}>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {next_steps.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Next Steps
            </Typography>
            <List dense>
              {next_steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${index + 1}. ${step}`}
                    sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AnalysisResults;

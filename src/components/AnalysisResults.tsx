import {
  ExpandMore,
  School,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { CodeReviewResponse } from '../types';

interface AnalysisResultsProps {
  result: CodeReviewResponse;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const { suggestions, metrics, overall_score, summary, learning_points, next_steps } = result;

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🏆';
    if (score >= 8) return '😊';
    if (score >= 6) return '😐';
    if (score >= 4) return '😟';
    return '💥';
  };

  const criticalIssues = suggestions.filter(s => s.severity === 'critical' || s.severity === 'error');
  const warnings = suggestions.filter(s => s.severity === 'warning');
  const improvements = suggestions.filter(s => s.severity === 'info');

  return (
    <Box>
      {/* Overall Score - More Prominent */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {getScoreEmoji(overall_score)} {overall_score.toFixed(1)}/10
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
            Code Quality Score
          </Typography>
          <LinearProgress
            variant="determinate"
            value={overall_score * 10}
            sx={{ 
              height: 12, 
              borderRadius: 6,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: overall_score >= 8 ? '#4caf50' : overall_score >= 6 ? '#ff9800' : '#f44336'
              }
            }}
          />
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
            {summary}
          </Typography>
        </CardContent>
      </Card>

      {/* Issues Summary */}
      <Box display="flex" gap={2} mb={3}>
        {criticalIssues.length > 0 && (
          <Card sx={{ flex: 1, border: '2px solid #f44336' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="error">🚨 {criticalIssues.length}</Typography>
              <Typography variant="body2" color="error">Critical Issues</Typography>
            </CardContent>
          </Card>
        )}
        {warnings.length > 0 && (
          <Card sx={{ flex: 1, border: '2px solid #ff9800' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="warning.main">⚠️ {warnings.length}</Typography>
              <Typography variant="body2" color="warning.main">Warnings</Typography>
            </CardContent>
          </Card>
        )}
        {improvements.length > 0 && (
          <Card sx={{ flex: 1, border: '2px solid #2196f3' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="info.main">💡 {improvements.length}</Typography>
              <Typography variant="body2" color="info.main">Improvements</Typography>
            </CardContent>
          </Card>
        )}
      </Box>

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

      {/* Issues by Priority */}
      {suggestions.length > 0 ? (
        <Box>
          {criticalIssues.length > 0 && (
            <Card sx={{ mb: 2, border: '2px solid #f44336' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error">
                  🚨 Critical Issues - Fix These First!
                </Typography>
                {criticalIssues.map((suggestion, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      Line {suggestion.line_number}: {suggestion.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {suggestion.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                      💡 Why this matters: {suggestion.explanation}
                    </Typography>
                    {suggestion.suggested_fix && (
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        ✅ Fix: {suggestion.suggested_fix}
                      </Typography>
                    )}
                    {suggestion.code_example && (
                      <Box sx={{ bgcolor: '#1e1e1e', color: '#fff', p: 2, borderRadius: 1, mt: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {suggestion.code_example}
                      </Box>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {warnings.length > 0 && (
            <Card sx={{ mb: 2, border: '2px solid #ff9800' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="warning.main">
                  ⚠️ Warnings - Important to Address
                </Typography>
                {warnings.map((suggestion, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box display="flex" alignItems="center" width="100%">
                        <Box flexGrow={1}>
                          <Typography variant="subtitle2">
                            Line {suggestion.line_number}: {suggestion.title}
                          </Typography>
                        </Box>
                        <Chip label={suggestion.type} color="warning" size="small" />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {suggestion.description}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                        💡 {suggestion.explanation}
                      </Typography>
                      {suggestion.suggested_fix && (
                        <Typography variant="body2" sx={{ color: 'success.main' }}>
                          ✅ {suggestion.suggested_fix}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          )}

          {improvements.length > 0 && (
            <Card sx={{ mb: 2, border: '2px solid #2196f3' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="info.main">
                  💡 Improvement Suggestions
                </Typography>
                {improvements.map((suggestion, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box display="flex" alignItems="center" width="100%">
                        <Box flexGrow={1}>
                          <Typography variant="subtitle2">
                            Line {suggestion.line_number}: {suggestion.title}
                          </Typography>
                        </Box>
                        <Chip label={suggestion.type} color="info" size="small" />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {suggestion.description}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                        💡 {suggestion.explanation}
                      </Typography>
                      {suggestion.suggested_fix && (
                        <Typography variant="body2" sx={{ color: 'success.main' }}>
                          ✅ {suggestion.suggested_fix}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          )}
        </Box>
      ) : (
        <Card sx={{ mb: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5">🎉 Great Job!</Typography>
            <Typography variant="body1">No major issues found in your code!</Typography>
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

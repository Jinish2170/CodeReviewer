import {
  Assessment,
  BugReport,
  CheckCircle,
  Download,
  ExpandMore,
  Security,
  Speed,
  Warning,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { CodeReviewResponse } from '../types';

interface AnalysisResultsProps {
  result: CodeReviewResponse;
  onExportReport?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onExportReport }) => {
  const { suggestions, metrics, overall_score, summary, learning_points, next_steps } = result;
  const [activeTab, setActiveTab] = useState(0);

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

  const issuesByType = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) acc[suggestion.type] = [];
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, typeof suggestions>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Security />;
      case 'performance': return <Speed />;
      case 'bug_fix': return <BugReport />;
      default: return <Assessment />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <BugReport color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
      default:
        return <Assessment color="info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const calculateQualityGrade = (score: number): string => {
    if (score >= 9) return 'A+';
    if (score >= 8) return 'A';
    if (score >= 7) return 'B+';
    if (score >= 6) return 'B';
    if (score >= 5) return 'C';
    return 'D';
  };

  return (
    <Box>
      {/* Header with Score */}
      <Card sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'translate(50px, -50px)',
          }}
        />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h2" sx={{ mr: 2 }}>
                {getScoreEmoji(overall_score)}
              </Typography>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {overall_score.toFixed(1)}/10
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Grade: {calculateQualityGrade(overall_score)}
                </Typography>
              </Box>
            </Box>
            <Box>
              {onExportReport && (
                <Button
                  id="export-button"
                  variant="outlined"
                  onClick={onExportReport}
                  startIcon={<Download />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Export Report
                </Button>
              )}
            </Box>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={overall_score * 10}
            sx={{ 
              height: 12, 
              borderRadius: 6,
              mb: 2,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: overall_score >= 8 ? '#4caf50' : overall_score >= 6 ? '#ff9800' : '#f44336'
              }
            }}
          />
          
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            {summary}
          </Typography>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Box display="flex" gap={2} mb={3} sx={{ flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, textAlign: 'center', flex: 1, minWidth: '120px' }}>
          <Typography variant="h4" color="primary">
            {suggestions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Issues
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center', flex: 1, minWidth: '120px' }}>
          <Typography variant="h4" color="error.main">
            {criticalIssues.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Critical
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center', flex: 1, minWidth: '120px' }}>
          <Typography variant="h4" color="warning.main">
            {warnings.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Warnings
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center', flex: 1, minWidth: '120px' }}>
          <Typography variant="h4" color="info.main">
            {improvements.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Improvements
          </Typography>
        </Paper>
      </Box>

      {/* Code Metrics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Assessment sx={{ mr: 1, color: 'primary.main' }} />
            Code Metrics
          </Typography>
          <Box display="flex" gap={3} sx={{ flexWrap: 'wrap', justifyContent: 'space-around' }}>
            <Box textAlign="center" sx={{ flex: 1, minWidth: '120px' }}>
              <Typography variant="h4" color="primary">
                {metrics.lines_of_code}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lines of Code
              </Typography>
            </Box>
            <Box textAlign="center" sx={{ flex: 1, minWidth: '120px' }}>
              <Typography variant="h4" color="secondary">
                {metrics.complexity_score.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complexity Score
              </Typography>
            </Box>
            <Box textAlign="center" sx={{ flex: 1, minWidth: '120px' }}>
              <Typography variant="h4" color="success.main">
                {metrics.maintainability_index.toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maintainability
              </Typography>
            </Box>
            <Box textAlign="center" sx={{ flex: 1, minWidth: '120px' }}>
              <Typography variant="h4" color="warning.main">
                {metrics.duplicate_lines || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duplicate Lines
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All Issues (${suggestions.length})`} />
            <Tab label={`By Type`} />
            <Tab label={`Learning Points (${learning_points.length})`} />
            <Tab label={`Next Steps (${next_steps.length})`} />
          </Tabs>
        </Box>

        {/* All Issues Tab */}
        <TabPanel value={activeTab} index={0}>
          {suggestions.length > 0 ? (
            <Box>
              {suggestions.map((suggestion, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <Box display="flex" alignItems="center" mr={2}>
                        {getSeverityIcon(suggestion.severity)}
                      </Box>
                      <Box flexGrow={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {suggestion.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Line {suggestion.line_number} • {suggestion.type.replace(/_/g, ' ')}
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
                      <Alert severity={getSeverityColor(suggestion.severity) as any} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Issue:</strong> {suggestion.description}
                        </Typography>
                      </Alert>
                      
                      <Typography variant="body2" paragraph>
                        <strong>📚 Why this matters:</strong> {suggestion.explanation}
                      </Typography>
                      
                      {suggestion.suggested_fix && (
                        <Typography variant="body2" paragraph>
                          <strong>🔧 How to fix:</strong> {suggestion.suggested_fix}
                        </Typography>
                      )}
                      
                      {suggestion.code_example && (
                        <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 2 }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            💡 Better approach:
                          </Typography>
                          <pre style={{ 
                            margin: '8px 0 0 0', 
                            fontSize: '12px', 
                            overflow: 'auto',
                            fontFamily: 'Monaco, monospace'
                          }}>
                            {suggestion.code_example}
                          </pre>
                        </Paper>
                      )}
                      
                      {suggestion.learning_resources && suggestion.learning_resources.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            📖 Learn More:
                          </Typography>
                          {suggestion.learning_resources.map((resource, idx) => (
                            <Chip
                              key={idx}
                              label={resource}
                              variant="outlined"
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6">No Issues Found!</Typography>
              <Typography variant="body2" color="text.secondary">
                Your code looks great! Keep up the good work.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* By Type Tab */}
        <TabPanel value={activeTab} index={1}>
          {Object.keys(issuesByType).length > 0 ? (
            Object.entries(issuesByType).map(([type, typeIssues]) => (
              <Card key={type} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getTypeIcon(type)}
                    <Typography variant="h6" sx={{ ml: 1, textTransform: 'capitalize' }}>
                      {type.replace(/_/g, ' ')} ({typeIssues.length})
                    </Typography>
                  </Box>
                  <List dense>
                    {typeIssues.map((issue, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <ListItemText
                          primary={issue.title}
                          secondary={`Line ${issue.line_number} • ${issue.severity}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No issues categorized by type.</Typography>
          )}
        </TabPanel>

        {/* Learning Points Tab */}
        <TabPanel value={activeTab} index={2}>
          {learning_points.length > 0 ? (
            <List>
              {learning_points.map((point, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    minWidth: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </Box>
                  <ListItemText 
                    primary={point}
                    sx={{ mt: 0.5 }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No learning points available.</Typography>
          )}
        </TabPanel>

        {/* Next Steps Tab */}
        <TabPanel value={activeTab} index={3}>
          {next_steps.length > 0 ? (
            <List>
              {next_steps.map((step, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    minWidth: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: 'success.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </Box>
                  <ListItemText 
                    primary={step}
                    sx={{ mt: 0.5 }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No next steps available.</Typography>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
};

export default AnalysisResults;

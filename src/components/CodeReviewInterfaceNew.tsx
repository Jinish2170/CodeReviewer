import {
    Assessment,
    AutoFixHigh,
    BugReport,
    CheckCircle,
    Code,
    Error as ErrorIcon,
    ExpandMore,
    Info,
    Lightbulb,
    PlayArrow,
    Refresh,
    School,
    Security,
    Speed,
    Warning
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
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import CodeReviewService from '../services/api';
import { AnalysisState, CodeReviewRequest } from '../types';
import CodeEditor from './CodeEditor';

const SAMPLE_CODES = {
  python: {
    title: "🐍 Buggy Python Function",
    description: "A function with security issues, performance problems, and style violations",
    code: `def process_user_data(user_input, filename):
    # This function has multiple issues - can you spot them?
    import os
    
    # Security issue: SQL injection vulnerability
    query = "SELECT * FROM users WHERE name = '" + user_input + "'"
    
    # Performance issue: inefficient file reading
    file = open(filename, 'r')
    data = ""
    for line in file:
        data = data + line
    file.close()
    
    # Logic issues
    try:
        result = eval(user_input)  # Dangerous!
        return result
    except:
        return None`
  },
  javascript: {
    title: "🚀 React Component Issues",
    description: "A React component with performance and best practice violations",
    code: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Performance issue: runs on every render
  const fetchUserData = () => {
    fetch('/api/users/' + userId)
      .then(response => response.json())
      .then(data => setUser(data));
      
    fetch('/api/posts?user=' + userId)
      .then(response => response.json())  
      .then(data => setPosts(data));
  };
  
  // This runs every render - bad!
  fetchUserData();
  
  // Using var instead of const/let
  var userAge = user && user.age;
  
  return (
    <div>
      {user ? (
        <div>
          <h1>{user.name}</h1>
          <p>Age: {userAge}</p>
          {posts.map((post, index) => (
            <div key={index}>
              <h3>{post.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}`
  },
  typescript: {
    title: "🔧 TypeScript Class Problems", 
    description: "A class with type safety issues and design problems",
    code: `class DataProcessor {
  private data: any;
  
  constructor(input: any) {
    this.data = input;
  }
  
  // Method with poor error handling
  processData() {
    try {
      return this.data.map(item => {
        return {
          id: item.id,
          name: item.name.toLowerCase(),
          processed: true
        };
      });
    } catch (e) {
      return [];
    }
  }
  
  // Method with side effects
  getData() {
    this.data = this.data.filter(item => item.active);
    return this.data;
  }
}`
  }
};

const LANGUAGE_OPTIONS = [
  { value: 'python', label: '🐍 Python', color: '#3776ab' },
  { value: 'javascript', label: '🚀 JavaScript', color: '#f7df1e' },
  { value: 'typescript', label: '🔷 TypeScript', color: '#3178c6' },
  { value: 'java', label: '☕ Java', color: '#ed8b00' },
  { value: 'cpp', label: '⚡ C++', color: '#00599c' },
  { value: 'go', label: '🏃 Go', color: '#00add8' },
];

const CodeReviewInterface: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [context, setContext] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Choose Code', 'AI Analysis', 'Learn & Improve'];

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: 'Please enter some code to analyze, or try one of our examples!',
      });
      return;
    }

    setAnalysisState({ isLoading: true, result: null, error: null });
    setActiveStep(1);

    try {
      const request: CodeReviewRequest = {
        code: code.trim(),
        language,
        context: context.trim() || undefined,
      };

      const result = await CodeReviewService.analyzeCode(request);
      setAnalysisState({ isLoading: false, result, error: null });
      setActiveStep(2);
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : 'Analysis failed. Please try again!',
      });
      setActiveStep(0);
    }
  };

  const loadSampleCode = (lang: string) => {
    const sample = SAMPLE_CODES[lang as keyof typeof SAMPLE_CODES];
    if (sample) {
      setCode(sample.code);
      setLanguage(lang);
      setContext(sample.description);
      setActiveStep(0);
      setAnalysisState({ isLoading: false, result: null, error: null });
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
      default:
        return <Info color="info" />;
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

  const renderStep0 = () => (
    <Box>
      {/* Hero Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            🤖 AI Code Review Assistant
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            Get instant, intelligent feedback on your code. Learn best practices, fix bugs, and improve performance.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Paste your code below or try one of our examples to see AI-powered suggestions in action!
          </Typography>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Lightbulb sx={{ mr: 1, color: 'orange' }} />
            Try These Problematic Code Examples
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click any example to see how our AI finds and explains code issues:
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {Object.entries(SAMPLE_CODES).map(([lang, sample]) => (
              <Button
                key={lang}
                variant="outlined"
                onClick={() => loadSampleCode(lang)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                {sample.title}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Code Input */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Code sx={{ mr: 1 }} />
            <Typography variant="h6">Your Code</Typography>
          </Box>

          <Box mb={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Programming Language</InputLabel>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Programming Language"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        width={12} 
                        height={12} 
                        bgcolor={lang.color} 
                        borderRadius="50%" 
                        mr={1} 
                      />
                      {lang.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box mb={2}>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              placeholder={`Enter your ${LANGUAGE_OPTIONS.find(l => l.value === language)?.label} code here...`}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              label="What should I focus on? (Optional)"
              placeholder="e.g., 'Check for security issues' or 'Optimize for performance'"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAnalyzeCode}
            disabled={analysisState.isLoading}
            startIcon={analysisState.isLoading ? <CircularProgress size={20} /> : <PlayArrow />}
            fullWidth
            sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            {analysisState.isLoading ? 'AI is analyzing your code...' : '🚀 Analyze My Code!'}
          </Button>

          {analysisState.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {analysisState.error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderStep1 = () => (
    <Card>
      <CardContent sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          🤖 AI is Analyzing Your Code
        </Typography>
        <Typography color="text.secondary" paragraph>
          Our AI is examining your code for bugs, performance issues, security vulnerabilities, and best practices...
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} mt={3} flexWrap="wrap">
          <Chip icon={<BugReport />} label="Finding Bugs" />
          <Chip icon={<Security />} label="Security Check" />
          <Chip icon={<Speed />} label="Performance" />
          <Chip icon={<AutoFixHigh />} label="Best Practices" />
        </Box>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => {
    if (!analysisState.result) return null;

    const { suggestions, metrics, overall_score, summary, learning_points, next_steps } = analysisState.result;

    return (
      <Box>
        {/* Overall Score */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ mr: 1 }} />
              Code Quality Report
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Box width="100%" mr={2}>
                <LinearProgress
                  variant="determinate"
                  value={overall_score * 10}
                  sx={{ height: 10, borderRadius: 5 }}
                  color={overall_score >= 8 ? 'success' : overall_score >= 6 ? 'warning' : 'error'}
                />
              </Box>
              <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {overall_score.toFixed(1)}/10
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {summary}
            </Typography>
            
            {/* Metrics */}
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Lines of Code</Typography>
                <Typography variant="h6">{metrics.lines_of_code}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Complexity</Typography>
                <Typography variant="h6">{metrics.complexity_score.toFixed(1)}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Maintainability</Typography>
                <Typography variant="h6">{metrics.maintainability_index.toFixed(1)}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Issues Found</Typography>
                <Typography variant="h6">{suggestions.length}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Issues and Suggestions */}
        {suggestions.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BugReport sx={{ mr: 1, color: 'error.main' }} />
                Issues Found ({suggestions.length})
              </Typography>
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
                          Line {suggestion.line_number} • {suggestion.type.replace('_', ' ')}
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
                        <strong>🔍 What's wrong:</strong> {suggestion.description}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>📚 Why this matters:</strong> {suggestion.explanation}
                      </Typography>
                      {suggestion.suggested_fix && (
                        <Typography variant="body2" paragraph>
                          <strong>🔧 How to fix:</strong> {suggestion.suggested_fix}
                        </Typography>
                      )}
                      {suggestion.code_example && (
                        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            💡 Better approach:
                          </Typography>
                          <pre style={{ margin: '8px 0 0 0', fontSize: '12px', overflow: 'auto' }}>
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
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1, color: 'info.main' }} />
                Key Learning Points
              </Typography>
              <List>
                {learning_points.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Lightbulb color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {next_steps.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                Recommended Next Steps
              </Typography>
              <List>
                {next_steps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {index + 1}.
                      </Typography>
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Start Over Button */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setActiveStep(0);
                setAnalysisState({ isLoading: false, result: null, error: null });
              }}
              startIcon={<Refresh />}
              sx={{ mr: 2 }}
            >
              Analyze Different Code
            </Button>
            <Button
              variant="contained"
              onClick={() => loadSampleCode(language)}
              startIcon={<Lightbulb />}
            >
              Try Another Example
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box>
      {/* Progress Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Main Content */}
      {activeStep === 0 && renderStep0()}
      {activeStep === 1 && renderStep1()}
      {activeStep === 2 && renderStep2()}
    </Box>
  );
};

export default CodeReviewInterface;

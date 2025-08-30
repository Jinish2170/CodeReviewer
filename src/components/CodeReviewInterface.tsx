import {
  AutoFixHigh,
  BugReport,
  CloudUpload,
  Code,
  Lightbulb,
  PlayArrow,
  Refresh,
  Security,
  Speed,
  Tab as TabIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import AnalysisResults from './AnalysisResults';
import CodeEditor from './CodeEditor';
import FileUpload from './FileUpload';
import CodeReviewService from '../services/api';
import { ReportExporter } from '../services/reportExporter';
import { AnalysisState, CodeReviewRequest } from '../types';

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
  const [inputMode, setInputMode] = useState<'editor' | 'files'>('editor');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const steps = ['Choose Code', 'AI Analysis', 'Learn & Improve'];

  const handleAnalyzeCode = async () => {
    const codeToAnalyze = uploadedFiles.length > 0 
      ? uploadedFiles[selectedFileIndex]?.content || code 
      : code;
      
    if (!codeToAnalyze.trim()) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: 'Please enter some code to analyze, or upload files!',
      });
      return;
    }

    setAnalysisState({ isLoading: true, result: null, error: null });
    setActiveStep(1);

    try {
      const request: CodeReviewRequest = {
        code: codeToAnalyze.trim(),
        language: uploadedFiles.length > 0 ? uploadedFiles[selectedFileIndex]?.language || language : language,
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

  const handleExportReport = async (format: 'html' | 'json' | 'markdown') => {
    if (!analysisState.result) return;
    
    try {
      switch (format) {
        case 'html':
          await ReportExporter.exportToPDF(analysisState.result);
          break;
        case 'json':
          await ReportExporter.exportToJSON(analysisState.result);
          break;
        case 'markdown':
          await ReportExporter.exportToMarkdown(analysisState.result);
          break;
      }
      setExportMenuAnchor(null);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFilesChange = (files: any[]) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      setInputMode('files');
      setSelectedFileIndex(0);
    } else {
      setInputMode('editor');
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
      setInputMode('editor');
      setUploadedFiles([]);
    }
  };

  const renderStep0 = () => (
    <Box>
      {/* Hero Section */}
      <Card sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }
      }}>
        <CardContent sx={{ textAlign: 'center', py: 5, position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
            🤖 AI Code Review Assistant
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, mb: 3, fontWeight: 500 }}>
            Get instant, intelligent feedback on your code. Learn best practices, fix bugs, and improve performance.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 600, mx: 'auto' }}>
            Paste your code below or try one of our examples to see AI-powered suggestions in action!
          </Typography>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card sx={{ 
        mb: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
            <Lightbulb sx={{ mr: 1, color: 'orange' }} />
            Try These Problematic Code Examples
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Click any example to see how our AI finds and explains code issues:
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {Object.entries(SAMPLE_CODES).map(([lang, sample]) => (
              <Button
                key={lang}
                variant="outlined"
                onClick={() => loadSampleCode(lang)}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }
                }}
              >
                {sample.title}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Code Input */}
      <Card sx={{ 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Code sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Your Code</Typography>
          </Box>

          {/* Input Mode Tabs */}
          <Tabs 
            value={inputMode} 
            onChange={(_, newValue) => setInputMode(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab 
              icon={<Code />} 
              label="Code Editor" 
              value="editor"
              sx={{ minHeight: 48 }}
            />
            <Tab 
              icon={<CloudUpload />} 
              label="Upload Files" 
              value="files"
              sx={{ minHeight: 48 }}
            />
          </Tabs>

          {inputMode === 'editor' ? (
            <Box>
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
                  height="400px"
                />
              </Box>
            </Box>
          ) : (
            <Box>
              <FileUpload onFilesChange={handleFilesChange} />
              
              {uploadedFiles.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select file to analyze:
                  </Typography>
                  <Tabs
                    value={selectedFileIndex}
                    onChange={(_, newValue) => setSelectedFileIndex(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    {uploadedFiles.map((file, index) => (
                      <Tab 
                        key={index}
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <TabIcon fontSize="small" />
                            {file.file.name}
                          </Box>
                        }
                      />
                    ))}
                  </Tabs>
                  
                  {uploadedFiles[selectedFileIndex] && (
                    <Box mt={2}>
                      <CodeEditor
                        value={uploadedFiles[selectedFileIndex].content}
                        onChange={() => {}} // Read-only for uploaded files
                        language={uploadedFiles[selectedFileIndex].language}
                        height="300px"
                        readOnly
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

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
            sx={{ 
              py: 2, 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                opacity: 0.7,
              }
            }}
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

    return (
      <Box>
        <AnalysisResults 
          result={analysisState.result} 
          onExportReport={() => setExportMenuAnchor(document.getElementById('export-button'))}
        />
        
        {/* Export Menu */}
        <Menu
          anchorEl={exportMenuAnchor}
          open={Boolean(exportMenuAnchor)}
          onClose={() => setExportMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleExportReport('html')}>
            Export as HTML
          </MenuItem>
          <MenuItem onClick={() => handleExportReport('markdown')}>
            Export as Markdown
          </MenuItem>
          <MenuItem onClick={() => handleExportReport('json')}>
            Export as JSON
          </MenuItem>
        </Menu>

        {/* Start Over Section */}
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              🎉 Great job analyzing your code!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ready to review more code or try different examples?
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={() => {
                  setActiveStep(0);
                  setAnalysisState({ isLoading: false, result: null, error: null });
                }}
                startIcon={<Refresh />}
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
            </Box>
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

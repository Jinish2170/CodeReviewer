import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Code, Send, Assessment } from '@mui/icons-material';
import CodeEditor from './CodeEditor';
import AnalysisResults from './AnalysisResults';
import { CodeReviewRequest, AnalysisState } from '../types';
import CodeReviewService from '../services/api';

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const CodeReviewInterface: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [context, setContext] = useState<string>('');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  // Real-world use cases with actual problematic code examples
  const useCases = {
    'security-vulnerability': {
      title: '🔒 Security Vulnerability Check',
      description: 'Find SQL injection, XSS, and other security issues',
      code: `# Vulnerable login function
def login_user(username, password):
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)  # SQL Injection vulnerability!
    user = cursor.fetchone()
    if user:
        session['user_id'] = user[0]
        return True
    return False`,
      language: 'python'
    },
    'performance-issues': {
      title: '⚡ Performance Optimization',
      description: 'Identify slow code patterns and memory leaks',
      code: `# Inefficient data processing
def process_large_dataset(data):
    result = []
    for i in range(len(data)):  # Should use enumerate
        for j in range(len(data)):  # O(n²) - very slow!
            if data[i] == data[j] and i != j:
                result.append(data[i])
    return list(set(result))  # Converting to set at the end is wasteful`,
      language: 'python'
    },
    'code-smells': {
      title: '👃 Code Smell Detection',
      description: 'Find long functions, duplicated code, and bad practices',
      code: `function calculateUserScore(user) {
    var score = 0;
    if (user.posts != null) {
        if (user.posts.length > 0) {
            if (user.posts.length > 10) {
                score = score + 50;
            } else {
                score = score + 20;
            }
        }
    }
    if (user.comments != null) {
        if (user.comments.length > 0) {
            if (user.comments.length > 50) {
                score = score + 30;
            } else {
                score = score + 10;
            }
        }
    }
    return score;
}`,
      language: 'javascript'
    },
    'bug-finder': {
      title: '🐛 Bug Detection',
      description: 'Catch null pointer exceptions, logic errors, and edge cases',
      code: `def divide_numbers(a, b):
    result = a / b  # Division by zero error!
    return result

def get_user_data(user_id):
    user = database.get_user(user_id)
    return user.name.upper()  # What if user is None?

def process_list(items):
    for i in range(len(items) + 1):  # Index out of bounds!
        print(items[i])`,
      language: 'python'
    },
    'best-practices': {
      title: '✨ Code Quality Improvement',
      description: 'Learn modern coding standards and clean code principles',
      code: `class DataProcessor:
    def __init__(self):
        pass
    
    def processData(self, data, flag):  # Bad naming convention
        if flag == 1:
            return self.method1(data)
        elif flag == 2:
            return self.method2(data)
        else:
            return None  # Magic numbers and unclear logic
    
    def method1(self, data):
        # TODO: implement this
        pass
    
    def method2(self, data):
        # TODO: implement this  
        pass`,
      language: 'python'
    },
    'custom': {
      title: '📝 Custom Code Review',
      description: 'Analyze your own code',
      code: '',
      language: 'python'
    }
  };

  const handleUseCaseSelect = (useCaseKey: string) => {
    setSelectedUseCase(useCaseKey);
    const useCase = useCases[useCaseKey as keyof typeof useCases];
    if (useCase.code) {
      setCode(useCase.code);
      setLanguage(useCase.language);
      setContext(`Analyzing: ${useCase.title} - ${useCase.description}`);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: 'Please select a use case or enter some code to analyze',
      });
      return;
    }

    setAnalysisState({ isLoading: true, result: null, error: null });

    try {
      const request: CodeReviewRequest = {
        code: code.trim(),
        language,
        context: context.trim() || undefined,
      };

      const result = await CodeReviewService.analyzeCode(request);
      setAnalysisState({ isLoading: false, result, error: null });
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        🔍 AI Code Detective
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Find bugs, security issues, and performance problems in your code. 
        Choose a scenario below or paste your own code!
      </Typography>

      {/* Use Case Selection */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          🎯 What do you want to check?
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {Object.entries(useCases).map(([key, useCase]) => (
            <Button
              key={key}
              variant={selectedUseCase === key ? "contained" : "outlined"}
              onClick={() => handleUseCaseSelect(key)}
              sx={{ 
                flexBasis: { xs: '100%', sm: '45%', md: '30%' },
                p: 2,
                textAlign: 'left',
                justifyContent: 'flex-start',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {useCase.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {useCase.description}
              </Typography>
            </Button>
          ))}
        </Box>
      </Paper>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        {/* Code Input Section */}
        <Box flex={1}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Code sx={{ mr: 1 }} />
              <Typography variant="h6">Code to Review</Typography>
              {selectedUseCase && selectedUseCase !== 'custom' && (
                <Chip 
                  label={`Example: ${useCases[selectedUseCase as keyof typeof useCases].title}`}
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>

            <Box mb={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Programming Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Programming Language"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
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
                placeholder={`${code ? '' : 'Select a use case above or paste your code here...'}`}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                label="Additional Context (Optional)"
                placeholder="Tell us what this code is supposed to do..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </Box>

            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalyzeCode}
                disabled={analysisState.isLoading}
                startIcon={analysisState.isLoading ? <CircularProgress size={20} /> : <Send />}
                size="large"
                sx={{ minWidth: 200 }}
              >
                {analysisState.isLoading ? 'Analyzing...' : '🔍 Find Issues'}
              </Button>
              {selectedUseCase && selectedUseCase !== 'custom' && (
                <Button
                  variant="outlined"
                  onClick={() => handleUseCaseSelect('custom')}
                  disabled={analysisState.isLoading}
                >
                  Clear & Use My Code
                </Button>
              )}
            </Box>

            {analysisState.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {analysisState.error}
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Results Section */}
        <Box flex={1}>
          <Paper elevation={3} sx={{ p: 3, minHeight: '600px' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Assessment sx={{ mr: 1 }} />
              <Typography variant="h6">Analysis Results</Typography>
            </Box>

            {analysisState.result ? (
              <AnalysisResults result={analysisState.result} />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="500px"
                color="text.secondary"
                textAlign="center"
              >
                {!selectedUseCase ? (
                  <>
                    <Assessment sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Choose Your Mission! 🎯
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, maxWidth: 400 }}>
                      Select a use case above to see real examples of:
                    </Typography>
                    <Box sx={{ textAlign: 'left', mb: 3 }}>
                      <Typography variant="body2">🔒 Security vulnerabilities</Typography>
                      <Typography variant="body2">⚡ Performance bottlenecks</Typography>
                      <Typography variant="body2">🐛 Hidden bugs and errors</Typography>
                      <Typography variant="body2">👃 Code smells and bad practices</Typography>
                      <Typography variant="body2">✨ Quality improvements</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Or choose "Custom Code Review" to analyze your own code
                    </Typography>
                  </>
                ) : (
                  <>
                    <Assessment sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" gutterBottom>
                      Ready to Analyze! 🚀
                    </Typography>
                    <Typography variant="body2" textAlign="center">
                      Click "🔍 Find Issues" to discover problems in the code and learn how to fix them.
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Quick Tips Section */}
      {!analysisState.result && (
        <Paper elevation={1} sx={{ p: 3, mt: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            💡 Pro Tips
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <Typography variant="body2">
              • Start with the example scenarios to see what the AI can catch
            </Typography>
            <Typography variant="body2">
              • Each analysis explains WHY the code is problematic, not just WHAT is wrong
            </Typography>
            <Typography variant="body2">
              • Try different programming languages to see language-specific suggestions
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CodeReviewInterface;

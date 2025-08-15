import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

// Global image loader for preloading images
import GlobalImageLoader from './components/common/GlobalImageLoader';

// Task components
import Home from './components/Home';
import ParticipantInfo from './components/ParticipantInfo';
import DigitSpanTask from './components/DigitSpan/DigitSpanTask';
import ForwardDigitSpan from './components/DigitSpan/ForwardDigitSpan';
import BackwardDigitSpan from './components/DigitSpan/BackwardDigitSpan';
import DigitSpanPractice from './components/DigitSpan/DigitSpanPractice';
import DigitSpanMainTask from './components/DigitSpan/DigitSpanMainTask';
import ShapeCountingTask from './components/ShapeCounting/ShapeCountingTask';
import ShapeCountingInstructions from './components/ShapeCounting/ShapeCountingInstructions';
import ShapeCountingPractice from './components/ShapeCounting/ShapeCountingPractice';
import ShapeCountingMainTask from './components/ShapeCounting/ShapeCountingMainTask';
import SpatialMemoryTask from './components/SpatialMemory/SpatialMemoryTask';
import SpatialMemoryPractice from './components/SpatialMemory/SpatialMemoryPractice';
import SpatialMemoryMainTask from './components/SpatialMemory/SpatialMemoryMainTask';
// Questionnaire component
import CombinedQuestionnaire from './components/Questionnaires/Combined/CombinedQuestionnaire';

// Fullscreen components
import { FullscreenProvider } from './components/FullscreenProvider';
import FullscreenPrompt from './components/FullscreenPrompt';
import FullscreenWarning from './components/FullscreenWarning';

// Protected Route component to ensure participant info is entered
function RequireParticipantInfo({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  
  const checkAuthorization = useCallback(() => {
    const studentId = localStorage.getItem('studentId');
    const counterBalance = localStorage.getItem('counterBalance');
    
    if (studentId && counterBalance) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    
    setIsChecking(false);
  }, []);
  
  useEffect(() => {
    // Initial check
    checkAuthorization();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'studentId' || e.key === 'counterBalance') {
        checkAuthorization();
      }
    };
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab changes
    const handleLocalStorageChange = () => {
      checkAuthorization();
    };
    
    window.addEventListener('localStorageChange', handleLocalStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange);
    };
  }, [checkAuthorization]);
  
  // Show nothing while checking
  if (isChecking) {
    return null;
  }
  
  // Only redirect if we're not already on the participant-info page
  if (!isAuthorized && location.pathname !== '/participant-info') {
    return <Navigate to="/participant-info" replace />;
  }
  
  return children;
}

function TaskWrapper({ children }) {
  return (
    <>
      <FullscreenPrompt />
      <FullscreenWarning />
      {children}
    </>
  );
}

function App() {
  // Use a relative path instead of absolute path for basename
  // This works with the homepage: "." setting in package.json
  const basename = '';
  
  return (
    <FullscreenProvider>
      <Router 
        basename={basename}
        future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <RequireParticipantInfo>
            <GlobalImageLoader />
          </RequireParticipantInfo>
          <Routes>
            {/* Participant Info Route */}
            <Route path="/participant-info" element={<ParticipantInfo />} />
            
            {/* Home Route with Protection */}
            <Route path="/" element={
              <RequireParticipantInfo>
                <Home />
              </RequireParticipantInfo>
            } />
            
            {/* Digit Span Task Routes - All Protected */}
            <Route path="/digit-span" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DigitSpanTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Forward Digit Span */}
            <Route path="/digit-span/forward" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ForwardDigitSpan />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Backward Digit Span */}
            <Route path="/digit-span/backward" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <BackwardDigitSpan />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Digit Span Practice */}
            <Route path="/digit-span/:direction/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DigitSpanPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Digit Span Main Task */}
            <Route path="/digit-span/:direction/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DigitSpanMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Shape Counting Routes */}
            <Route path="/shape-counting" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/shape-counting/instructions" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingInstructions />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/shape-counting/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/shape-counting/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Spatial Memory Task Routes */}
            <Route path="/spatial-memory" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <SpatialMemoryTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/spatial-memory/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <SpatialMemoryPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/spatial-memory/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <SpatialMemoryMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Questionnaire Route */}
            <Route path="/combined-questionnaire" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <CombinedQuestionnaire />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Fallback route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </FullscreenProvider>
  );
}

export default App;

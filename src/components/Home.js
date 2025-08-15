import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [participantId, setParticipantId] = useState('');

  // Get participant ID from localStorage on component mount
  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    if (storedId) {
      setParticipantId(storedId);
    } else {
      // Redirect to participant info if no ID is found
      navigate('/participant-info', { replace: true });
    }
  }, [navigate]);

  // Start the assessment with the first task - Forward Digit Span
  const startAssessment = () => {
    navigate('/digit-span/forward');
  };

  // Toggle the dev menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleCardKey = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Cognitive Assessment Tasks</h1>
        <p className="subtitle">Battery of tasks measuring working memory and reasoning skills</p>
        {participantId && <p className="participant-info">ID: {participantId}</p>}
      </header>

      <div className="main-content">
        <div className="start-assessment-section">
          <h2 className="welcome-heading">Assessment Overview</h2>
          <div className="assessment-description">
            <p>
              This 30-40 minute assessment measures different cognitive abilities through a series of tasks. 
              Each task includes instructions and practice trials.
            </p>
          </div>
          
          <div className="task-flow">
            <div className="task-flow-item">
              <div className="task-flow-icon memory-icon">1</div>
              <div className="task-flow-label">
                <h3>Working Memory</h3>
                <p>Digit Span</p>
              </div>
            </div>
            <div className="task-flow-arrow">→</div>
            <div className="task-flow-item">
              <div className="task-flow-icon visual-icon">2</div>
              <div className="task-flow-label">
                <h3>Visual Processing</h3>
                <p>Shape Counting</p>
              </div>
            </div>
            <div className="task-flow-arrow">→</div>
            <div className="task-flow-item">
              <div className="task-flow-icon spatial-icon">3</div>
              <div className="task-flow-label">
                <h3>Spatial Memory</h3>
                <p>Position Tasks</p>
              </div>
            </div>
            <div className="task-flow-arrow">→</div>
            <div className="task-flow-item">
              <div className="task-flow-icon questionnaire-icon">4</div>
              <div className="task-flow-label">
                <h3>Questionnaires</h3>
                <p>Daily Function</p>
              </div>
            </div>
          </div>
          
          <button 
            className="start-assessment-button" 
            onClick={startAssessment}
            aria-label="Start the cognitive assessment"
          >
            Start Assessment
          </button>
          <p className="start-description">
            Results save automatically and can be exported at the end
          </p>
        </div>

        {/* Developer Menu Toggle */}
        <div className="dev-menu-section">
          <button 
            className={`toggle-menu-button ${showMenu ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-expanded={showMenu}
            aria-controls="task-menu"
          >
            <span className="dev-badge">DEV</span>
            <span className="toggle-label">Individual Tasks</span>
            <span className="caret" aria-hidden>▾</span>
          </button>
          <p className="dev-note">Quickly jump to a specific task for testing or demos.</p>
        
          {showMenu && (
            <div id="task-menu" className="task-grid">
              <div className="task-category">
                <h3 className="task-category-title">Working Memory Tasks</h3>
                <div className="task-cards-row">
                  <div 
                    className="task-card" 
                    onClick={() => navigate('/digit-span/forward')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleCardKey(e, '/digit-span/forward')}
                    aria-label="Forward Digit Span"
                  >
                    <div className="task-card-header">
                      <div className="task-card-icon memory">🧠</div>
                      <div>
                        <h3>Forward Digit Span</h3>
                        <p>Remember digits</p>
                      </div>
                    </div>
                    <div className="task-card-footer">Start →</div>
                  </div>
                  <div 
                    className="task-card" 
                    onClick={() => navigate('/digit-span/backward')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleCardKey(e, '/digit-span/backward')}
                    aria-label="Backward Digit Span"
                  >
                    <div className="task-card-header">
                      <div className="task-card-icon memory">🔁</div>
                      <div>
                        <h3>Backward Digit Span</h3>
                        <p>Reverse digits</p>
                      </div>
                    </div>
                    <div className="task-card-footer">Start →</div>
                  </div>
                </div>
              </div>

              <div className="task-category">
                <h3 className="task-category-title">Visual & Spatial Tasks</h3>
                <div className="task-cards-row">
                  <div 
                    className="task-card" 
                    onClick={() => navigate('/shape-counting')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleCardKey(e, '/shape-counting')}
                    aria-label="Shape Counting"
                  >
                    <div className="task-card-header">
                      <div className="task-card-icon visual">🔺</div>
                      <div>
                        <h3>Shape Counting</h3>
                        <p>Count shapes</p>
                      </div>
                    </div>
                    <div className="task-card-footer">Start →</div>
                  </div>
                  <div 
                    className="task-card" 
                    onClick={() => navigate('/spatial-memory')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleCardKey(e, '/spatial-memory')}
                    aria-label="Spatial Memory"
                  >
                    <div className="task-card-header">
                      <div className="task-card-icon spatial">🗺️</div>
                      <div>
                        <h3>Spatial Memory</h3>
                        <p>Remember positions</p>
                      </div>
                    </div>
                    <div className="task-card-footer">Start →</div>
                  </div>
                </div>
              </div>

              <div className="task-category">
                <h3 className="task-category-title">Questionnaires</h3>
                <div className="task-cards-row">
                  <div 
                    className="task-card" 
                    onClick={() => navigate('/combined-questionnaire')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleCardKey(e, '/combined-questionnaire')}
                    aria-label="Questionnaires"
                  >
                    <div className="task-card-header">
                      <div className="task-card-icon questionnaire">📝</div>
                      <div>
                        <h3>Questionnaires</h3>
                        <p>Daily functioning</p>
                      </div>
                    </div>
                    <div className="task-card-footer">Open →</div>
                  </div>
                </div>
              </div>
          </div>
        )}
        </div>
      </div>
      
      <footer className="home-footer">
        {/* Footer content removed as requested */}
      </footer>
    </div>
  );
};

export default Home; 
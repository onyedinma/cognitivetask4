import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SpatialMemory.css';

/**
 * SpatialMemoryTask component
 * Entry point for the Spatial Working Memory task
 */
const SpatialMemoryTask = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true);
  const [currentSwap, setCurrentSwap] = useState(0);

  // Example shapes for animation
  const originalShapes = [
    { id: 1, type: 'circle', color: 'blue', position: 0 },
    { id: 2, type: 'square', color: 'red', position: 1 },
    { id: 3, type: 'triangle', color: 'green', position: 2 }
  ];

  // Different swap configurations
  const swaps = [
    // Swap 1: circle and square
    [
      { id: 1, type: 'circle', color: 'blue', position: 1 },
      { id: 2, type: 'square', color: 'red', position: 0 },
      { id: 3, type: 'triangle', color: 'green', position: 2 }
    ],
    // Swap 2: circle and triangle
    [
      { id: 1, type: 'circle', color: 'blue', position: 2 },
      { id: 2, type: 'square', color: 'red', position: 1 },
      { id: 3, type: 'triangle', color: 'green', position: 0 }
    ],
    // Swap 3: square and triangle
    [
      { id: 1, type: 'circle', color: 'blue', position: 0 },
      { id: 2, type: 'square', color: 'red', position: 2 },
      { id: 3, type: 'triangle', color: 'green', position: 1 }
    ]
  ];

  // Get current moved shapes based on current swap
  const getMovedShapes = () => {
    return swaps[currentSwap];
  };

  // Autoplay the animation
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Step 1: Show original grid
      setShowOriginal(true);
      
      // Step 2: After 2.5 seconds, show moved shapes
      setTimeout(() => {
        setShowOriginal(false);
      }, 2500);
      
      // Step 3: After another 2.5 seconds, highlight the moved shapes
      setTimeout(() => {
        setAnimationStep(3);
        
        // Step 4: Reset after 2.5 more seconds and change to next swap
        setTimeout(() => {
          setAnimationStep(0);
          setShowOriginal(true);
          setCurrentSwap((currentSwap + 1) % swaps.length);
        }, 2500);
      }, 5000);
      
    }, 8000); // Full animation cycle takes 8 seconds
    
    return () => clearInterval(intervalId);
  }, [currentSwap]);

  useEffect(() => {
    // Automatically advance the animation after delay
    if (animationStep < 3) {
      const timer = setTimeout(() => {
        setAnimationStep(animationStep + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [animationStep, swaps.length]);

  const startPractice = () => {
    navigate('/spatial-memory/practice');
  };

  // Render a shape based on type and color
  const renderShape = (shape) => {
    return (
      <div 
        key={shape.id}
        className={`grid-shape shape-${shape.type} shape-${shape.color}`}
      />
    );
  };

  // Determine if a shape has moved
  const hasMoved = (shape) => {
    const original = originalShapes.find(s => s.id === shape.id);
    return original.position !== shape.position;
  };

  // Get description of the current swap
  const getSwapDescription = () => {
    switch(currentSwap) {
      case 0:
        return "In this example, the blue circle and red square have swapped positions.";
      case 1:
        return "In this example, the blue circle and green triangle have swapped positions.";
      case 2:
        return "In this example, the red square and green triangle have swapped positions.";
      default:
        return "Watch carefully as positions change...";
    }
  };

  return (
    <div className="spatial-screen">
      <h1>Spatial Working Memory Game</h1>
      
      <div className="task-description">
        <p>This game tests how well you can remember where shapes are placed.</p>
        
        <h2>How to play:</h2>
        <ol className="instruction-list">
          <li>You will see a picture with different colored shapes</li>
          <li>Look carefully at where each shape is placed</li>
          <li>After a moment, a second picture will appear where some shapes have moved to new spots</li>
          <li>Your job is to find which shapes changed places by clicking on them</li>
        </ol>
        
        <div className="animated-example">
          <h3>Example:</h3>
          <p className="example-label">
            {showOriginal ? 
              "Look at where the shapes are:" : 
              animationStep === 3 ? 
                "The shapes that moved are highlighted:" : 
                "Now some shapes have moved:"}
          </p>
          
          <div className="example-grid-container">
            <div className="example-grid">
              {(showOriginal ? originalShapes : getMovedShapes()).map((shape) => (
                <div 
                  key={shape.id} 
                  className={`example-cell ${!showOriginal && animationStep === 3 && hasMoved(shape) ? 'selected' : ''}`}
                  style={{ order: shape.position }}
                >
                  {renderShape(shape)}
                </div>
              ))}
            </div>
          </div>
          
          <p className="example-caption">
            {animationStep === 3 ? 
              getSwapDescription() : 
              "Watch carefully as positions change..."}
          </p>
        </div>
        
        <div className="swap-example">
          <h3>What Happens When Shapes Move:</h3>
          <p>When shapes trade places with each other, you need to click on all the shapes that moved.</p>
          
          <div className="swap-example-visual">
            <div className="before-swap">
              <h4>Before:</h4>
              <div className="example-grid small">
                <div className="example-cell">
                  <div className="grid-shape shape-circle shape-blue"></div>
                </div>
                <div className="example-cell">
                  <div className="grid-shape shape-square shape-red"></div>
                </div>
              </div>
            </div>
            
            <div className="swap-arrow">⟷</div>
            
            <div className="after-swap">
              <h4>After:</h4>
              <div className="example-grid small">
                <div className="example-cell">
                  <div className="grid-shape shape-square shape-red"></div>
                </div>
                <div className="example-cell">
                  <div className="grid-shape shape-circle shape-blue"></div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="swap-caption">
            The blue circle and red square switched places. You would need to click on both shapes.
          </p>
        </div>
        
        <div className="task-note">
          <p><strong>Important:</strong></p>
          <ul className="instruction-list">
            <li>The same shapes appear in both pictures - only their positions change</li>
            <li>When shapes trade places, you need to find BOTH shapes that moved</li>
            <li>You get one point for each shape you correctly identify as having moved</li>
            <li>You lose one point if you click on a shape that didn't move</li>
            <li>Your score can go below zero if you make too many mistakes</li>
            <li>Example: If 4 shapes moved and you find all 4 correctly with no mistakes: score = 4</li>
            <li>Example: If 4 shapes moved and you find 3 correctly but also 2 that didn't move: score = 3 - 2 = 1</li>
            <li>Example: If 4 shapes moved and you find 2 correctly but also 3 that didn't move: score = 2 - 3 = -1</li>
          </ul>
        </div>
        
        <p>We'll start with a practice round using a small board before moving to the main game.</p>
      </div>
      
      <div className="navigation-buttons">
        <Link to="/" className="spatial-button">Back to Tasks</Link>
        <button onClick={startPractice} className="spatial-button ready-button">Start Practice</button>
      </div>
    </div>
  );
};

export default SpatialMemoryTask; 
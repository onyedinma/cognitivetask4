import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EcologicalSpatial.css';

// Define constant for image path
const IMAGE_PATH = '/ecoimages/';

/**
 * EcologicalSpatialTask component
 * Entry point for the Ecological Spatial Working Memory task
 */
const EcologicalSpatialTask = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true);
  const [currentSwap, setCurrentSwap] = useState(0);

  // Example images for animation
  const originalImages = [
    { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 0 },
    { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 1 },
    { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 2 }
  ];

  // Different swap configurations
  const swaps = [
    // Swap 1: dog and car
    [
      { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 1 },
      { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 0 },
      { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 2 }
    ],
    // Swap 2: dog and chair
    [
      { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 2 },
      { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 1 },
      { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 0 }
    ],
    // Swap 3: car and chair
    [
      { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 0 },
      { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 2 },
      { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 1 }
    ]
  ];

  // Get current moved images based on current swap
  const getMovedImages = () => {
    return swaps[currentSwap];
  };

  // Autoplay the animation
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Step 1: Show original grid
      setShowOriginal(true);
      
      // Step 2: After 2.5 seconds, show moved images
      setTimeout(() => {
        setShowOriginal(false);
      }, 2500);
      
      // Step 3: After another 2.5 seconds, highlight the moved images
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
    navigate('/ecological-spatial/practice');
  };

  // Determine if an image has moved
  const hasMoved = (image) => {
    const original = originalImages.find(i => i.id === image.id);
    return original.position !== image.position;
  };

  // Get description of the current swap
  const getSwapDescription = () => {
    switch(currentSwap) {
      case 0:
        return "In this example, the dog and car have swapped positions.";
      case 1:
        return "In this example, the dog and chair have swapped positions.";
      case 2:
        return "In this example, the car and chair have swapped positions.";
      default:
        return "Watch carefully as positions change...";
    }
  };

  return (
    <div className="spatial-screen">
      <h1>Picture Memory Game</h1>
      
      <div className="task-description">
        <p>This fun game tests how well you can remember where different pictures are placed.</p>
        
        <h2>How to play:</h2>
        <ol className="instruction-list">
          <li>You will see a board with different pictures</li>
          <li>Look carefully at where each picture is placed</li>
          <li>After a moment, a second board will appear where some pictures have moved to new spots</li>
          <li>Your job is to find which pictures changed places by clicking on them</li>
        </ol>
        
        <div className="animated-example">
          <h3>Example:</h3>
          <p className="example-label">
            {showOriginal ? 
              "Look at where each picture is:" : 
              animationStep === 3 ? 
                "The pictures that moved are highlighted:" : 
                "Now some pictures have moved:"}
          </p>
          
          <div className="example-grid-container">
            <div className="example-grid">
              {(showOriginal ? originalImages : getMovedImages()).map((image) => (
                <div 
                  key={image.id} 
                  className={`example-cell ${!showOriginal && animationStep === 3 && hasMoved(image) ? 'selected' : ''}`}
                  style={{ order: image.position }}
                >
                  <div className="eco-image-container">
                    <img 
                      src={image.src} 
                      alt={`Object ${image.id}`} 
                      className="eco-image"
                    />
                  </div>
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
          <h3>What happens when pictures move:</h3>
          <p>When pictures trade places, you need to click on all the pictures that moved.</p>
          
          <div className="swap-example-visual">
            <div className="before-swap">
              <h4>Before:</h4>
              <div className="example-grid small">
                <div className="example-cell">
                  <div className="eco-image-container small">
                    <img src={`${IMAGE_PATH}dog.jpg`} alt="Dog" className="eco-image" />
                  </div>
                </div>
                <div className="example-cell">
                  <div className="eco-image-container small">
                    <img src={`${IMAGE_PATH}car.jpg`} alt="Car" className="eco-image" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="swap-arrow">⟷</div>
            
            <div className="after-swap">
              <h4>After:</h4>
              <div className="example-grid small">
                <div className="example-cell">
                  <div className="eco-image-container small">
                    <img src={`${IMAGE_PATH}car.jpg`} alt="Car" className="eco-image" />
                  </div>
                </div>
                <div className="example-cell">
                  <div className="eco-image-container small">
                    <img src={`${IMAGE_PATH}dog.jpg`} alt="Dog" className="eco-image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="swap-caption">
            The dog and car switched places. You would need to click on both pictures.
          </p>
        </div>
        
        <div className="task-note">
          <p><strong>Important things to remember:</strong></p>
          <ul className="instruction-list">
            <li>The same pictures appear in both boards - only their positions change</li>
            <li>When pictures trade places, you need to find ALL pictures that moved</li>
            <li>You get one point for each picture you correctly identify as having moved</li>
            <li>You lose one point if you click on a picture that didn't move</li>
            <li>Your score can go below zero if you make too many mistakes</li>
            <li>Example: If 4 pictures moved and you find all 4 correctly with no mistakes: score = 4</li>
            <li>Example: If 4 pictures moved and you find 3 correctly but also 2 that didn't move: score = 3 - 2 = 1</li>
            <li>Example: If 4 pictures moved and you find 2 correctly but also 3 that didn't move: score = 2 - 3 = -1</li>
          </ul>
        </div>
        
        <p>We'll start with a practice round using just a few pictures before moving to the main game.</p>
      </div>
      
      <div className="navigation-buttons">
        <Link to="/" className="spatial-button">Back to Tasks</Link>
        <button onClick={startPractice} className="spatial-button ready-button">Start Practice</button>
      </div>
    </div>
  );
};

export default EcologicalSpatialTask; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TASK_CONFIG } from '../../config';
import './ObjectSpan.css';

const BackwardObjectSpan = () => {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload the images used in the examples and all object images
  useEffect(() => {
    const allImages = [
      '/images/Bread.png',
      '/images/Car.png', 
      '/images/Books.png',
      '/images/Bag.png',
      '/images/Chair.png',
      '/images/Computer.png',
      '/images/Money.png',
      '/images/Pot.png',
      '/images/Shoes.png'
    ];
    
    let loadedCount = 0;
    const totalImages = allImages.length;
    
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve(); // Resolve anyway to not block other images
        };
      });
    };

    const loadAllImages = async () => {
      try {
        await Promise.all(allImages.map(src => preloadImage(src)));
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    loadAllImages();
  }, []);

  const startPractice = () => {
    navigate('/object-span/backward/practice');
  };

  // Show loading screen if images are not loaded
  if (!imagesLoaded) {
    return (
      <div className="task-screen">
        <div className="loading-container">
          <h2>Loading Images...</h2>
          <div className="loading-bar">
            <div 
              className="loading-progress" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p>{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-screen">
      <h1>Backward Object Span Task</h1>
      
      <div className="task-instructions">
        <p>In this task, you will be shown a series of objects one at a time.</p>
        <p>Your task is to remember and recall the objects in <strong>REVERSE ORDER</strong> from how they appeared.</p>
        <p>For example, if you see these objects in order:</p>
      </div>

      <div className="example-container">
        <div className="example-objects">
          <div className="example-object-wrapper">
            <img src="/images/Bread.png" alt="Bread" className="example-object" />
            <span className="example-object-label">bread</span>
          </div>
          <div className="arrow">→</div>
          <div className="example-object-wrapper">
            <img src="/images/Car.png" alt="Car" className="example-object" />
            <span className="example-object-label">car</span>
          </div>
          <div className="arrow">→</div>
          <div className="example-object-wrapper">
            <img src="/images/Books.png" alt="Books" className="example-object" />
            <span className="example-object-label">books</span>
          </div>
        </div>
        
        <p className="example-answer">You should type or click on the objects in <strong>REVERSE ORDER</strong>: <span className="important">"books car bread"</span></p>
      </div>
      
      <div className="task-instructions">
        <p>You will start with practice trials to help you understand the task.</p>
        <p>Click on the objects or type their names to give your answer.</p>
      </div>

      <button onClick={startPractice} className="start-button">
        Start Practice
      </button>
    </div>
  );
};

export default BackwardObjectSpan; 
import React, { useState, useRef, useEffect } from 'react';

function CameraCapture({ onCapture, onClose }) {
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCamera(false);
        setCameraError('Unable to access camera. Please check permissions.');
      }
    };

    startCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-receipt.jpg', { type: 'image/jpeg' });
        onCapture(file);
        
        // Stop the camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }, 'image/jpeg', 0.95);
    }
  };

  if (!hasCamera) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">Camera Error</h2>
          <p className="mb-4">{cameraError}</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="relative w-full h-full md:max-w-2xl md:h-auto">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover md:rounded-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera overlay guide */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-white border-opacity-50 flex items-center justify-center">
            <div className="w-4/5 h-3/5 border-2 border-white border-dashed rounded-lg"></div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute top-safe top-4 left-0 right-0 text-center safe-area-inset-top">
          <p className="text-white text-lg font-medium bg-black bg-opacity-50 inline-block px-4 py-2 rounded-lg">
            Position receipt within the frame
          </p>
        </div>
        
        {/* Capture buttons */}
        <div className="absolute bottom-safe bottom-8 left-0 right-0 flex justify-center items-center gap-6 px-4 safe-area-inset-bottom">
          <button
            onClick={onClose}
            className="bg-red-500 text-white w-14 h-14 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition-transform flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={capturePhoto}
            className="bg-white w-20 h-20 rounded-full border-4 border-green-500 hover:border-green-600 shadow-lg transform hover:scale-105 transition-transform flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"></div>
          </button>
          
          <div className="w-14 h-14 invisible">
            {/* Spacer for alignment */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;
import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import Meyda from 'meyda';

const Diagnosis = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [faceEmotions, setFaceEmotions] = useState({});
  const [voiceEmotions, setVoiceEmotions] = useState({});
  const [fusedScore, setFusedScore] = useState({});
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const voiceModel = useRef(null);
  const fusionModel = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      // Load face-api.js models (assume models in public/models)
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      // Dummy voice emotion MLP (needs training in production)
      voiceModel.current = tf.sequential();
      voiceModel.current.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [13] })); // 13 MFCCs
      voiceModel.current.add(tf.layers.dense({ units: 5, activation: 'softmax' })); // 5 emotions
      voiceModel.current.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });

      // Dummy fusion MLP (needs training in production)
      fusionModel.current = tf.sequential();
      fusionModel.current.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [10] })); // 5 face + 5 voice
      fusionModel.current.add(tf.layers.dense({ units: 5, activation: 'softmax' }));
      fusionModel.current.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });
    };
    loadModels();
  }, []);

  const handleFileChange = (e) => {
    setVideoFile(URL.createObjectURL(e.target.files[0]));
  };

  const analyzeVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.play();

    // Setup audio context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContextRef.current.createMediaElementSource(video);
    analyserRef.current = audioContextRef.current.createAnalyser();
    audioSource.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
    analyserRef.current.fftSize = 1024;
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Float32Array(bufferLength);

    // Real-time analysis
    const interval = setInterval(async () => {
      // Face analysis
      const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceExpressions();
      if (detections) {
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resized = faceapi.resizeResults(detections, displaySize);
        canvasRef.current.getContext('2d').clearRect(0, 0, video.width, video.height);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
        setFaceEmotions(resized.expressions); // Soft probabilities: { happy: 0.8, sad: 0.1, ... }
      }

      // Voice analysis
      analyserRef.current.getFloatTimeDomainData(dataArray);
      const features = Meyda.extract(['mfcc'], dataArray);
      if (features && features.mfcc) {
        const mfccTensor = tf.tensor2d([features.mfcc]);
        const prediction = voiceModel.current.predict(mfccTensor);
        const probs = await prediction.array();
        tf.dispose([mfccTensor, prediction]);
        setVoiceEmotions({
          happy: probs[0][0],
          sad: probs[0][1],
          angry: probs[0][2],
          neutral: probs[0][3],
          confused: probs[0][4],
        });
      }
    }, 100);

    video.onended = async () => {
      clearInterval(interval);
      if (audioContextRef.current) audioContextRef.current.close();

      // Multimodal fusion
      const categories = ['happy', 'sad', 'angry', 'neutral', 'confused'];
      const faceProbs = categories.map(cat => faceEmotions[cat] || 0);
      const voiceProbs = categories.map(cat => voiceEmotions[cat] || 0);
      const combined = [...faceProbs, ...voiceProbs];
      const inputTensor = tf.tensor2d([combined]);
      const fusedPrediction = fusionModel.current.predict(inputTensor);
      const fusedProbs = await fusedPrediction.array();
      tf.dispose([inputTensor, fusedPrediction]);
      setFusedScore({
        happy: fusedProbs[0][0],
        sad: fusedProbs[0][1],
        angry: fusedProbs[0][2],
        neutral: fusedProbs[0][3],
        confused: fusedProbs[0][4],
      });
    };
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Diagnosis</h1>
      <p className="mt-4 text-gray-600">Upload a video to analyze facial expressions and voice tone for emotion detection.</p>
      
      <div className="mt-6">
        <input 
          type="file" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {videoFile && (
        <div className="mt-6">
          <div className="relative">
            <video 
              ref={videoRef} 
              src={videoFile} 
              width="640" 
              height="480" 
              controls 
              className="rounded-md shadow-md"
            />
            <canvas 
              ref={canvasRef} 
              width="640" 
              height="480" 
              className="absolute top-0 left-0"
            />
          </div>
          <button 
            onClick={analyzeVideo} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Start Analysis
          </button>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-800">Face Emotions</h2>
          <pre className="mt-2 text-sm text-gray-700">
            {JSON.stringify(faceEmotions, null, 2)}
          </pre>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-800">Voice Emotions</h2>
          <pre className="mt-2 text-sm text-gray-700">
            {JSON.stringify(voiceEmotions, null, 2)}
          </pre>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-800">Fused Score</h2>
          <pre className="mt-2 text-sm text-gray-700">
            {JSON.stringify(fusedScore, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Zap, Image as ImageIcon, ScanLine, AlertTriangle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../App';

const ScannerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      // Check for MediaDevices API support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("MediaDevices API not available");
        setHasPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || isProcessing) return;

    try {
      playSound('click');
      setIsProcessing(true);
      setIsScanning(false);

      // Capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not create canvas context");
      
      ctx.drawImage(videoRef.current, 0, 0);
      const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      // Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: "Analyze this image of a receipt or number. Extract the total amount or the largest visible number. Return ONLY the number (e.g. 25.50). Do not include currency symbols, text, or explanations. If no clear number is found, return 0." }
          ]
        }
      });

      const text = response.text || "";
      // Extract first valid float from text
      const match = text.match(/[\d,]+\.?\d*/);
      let amount = 0;
      
      if (match) {
        // Remove commas and parse
        amount = parseFloat(match[0].replace(/,/g, ''));
      }

      if (amount > 0) {
        playSound('success');
        navigate('/', { state: { scannedAmount: amount } });
      } else {
        playSound('error');
        alert("No clear amount found. Please align the receipt and try again.");
        setIsProcessing(false);
        setIsScanning(true);
      }

    } catch (error) {
      console.error("Scanning failed", error);
      playSound('error');
      alert("Scanning failed. Please check your connection and try again.");
      setIsProcessing(false);
      setIsScanning(true);
    }
  };

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
        <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle size={40} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold">Camera Access Denied</h2>
        <p className="text-slate-400">We need camera access to scan receipts. Please enable it in your browser settings or try a different device.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold mt-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Camera View */}
      <div className="relative flex-1 bg-black overflow-hidden">
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isProcessing ? 'opacity-40' : 'opacity-80'}`}
        />
        
        {/* Scanning Overlay - pointer-events-none ensures touches pass through to interactive elements below if needed */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
            <div className="w-full max-w-xs aspect-[3/4] border-2 border-white/30 rounded-3xl relative overflow-hidden">
                {/* Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-xl" />
                
                {/* Scan Line Animation */}
                {isScanning && !isProcessing && (
                  <div className="absolute left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-[scan_2.5s_ease-in-out_infinite]" />
                )}

                {/* Processing Spinner */}
                {isProcessing && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
                      <Loader2 size={48} className="text-purple-400 animate-spin mb-4" />
                      <p className="text-white font-bold animate-pulse">Analyzing Receipt...</p>
                   </div>
                )}
            </div>
            {!isProcessing && (
                <p className="mt-6 text-white/80 font-medium text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                    Align receipt amount within frame
                </p>
            )}
        </div>
        
        {/* Header Actions - explicit z-index to ensure clickability */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center safe-top z-20">
            <button onClick={() => navigate('/')} className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                <X size={24} />
            </button>
            <button className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                <Zap size={24} className={isScanning ? "text-yellow-400" : "text-white"} />
            </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/90 pb-8 pt-6 px-8 rounded-t-[32px] -mt-6 relative z-30 flex items-center justify-around border-t border-white/10">
        <button className="p-4 rounded-2xl text-slate-400 hover:text-white transition-colors">
            <ImageIcon size={28} />
        </button>
        
        <button 
            onClick={handleCapture}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group active:scale-95 transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-all" />
        </button>
        
        <button className="p-4 rounded-2xl text-slate-400 hover:text-white transition-colors">
            <ScanLine size={28} />
        </button>
      </div>

      <style>{`
        @keyframes scan {
            0% { top: 5%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScannerScreen;

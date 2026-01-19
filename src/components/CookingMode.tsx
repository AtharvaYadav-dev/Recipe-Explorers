import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Clock, ChefHat, 
  Volume2, VolumeX, CheckCircle 
} from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = recipe.analyzedInstructions?.[0]?.steps || [];

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            handleNextStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const handlePlayPause = () => {
    if (timeRemaining === 0 && currentStep < steps.length - 1) {
      // Start next step
      handleNextStep();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      const nextStep = steps[currentStep + 1];
      const stepTime = nextStep.length?.number || 0;
      setTimeRemaining(stepTime * 60); // Convert minutes to seconds
      setTotalTime(stepTime * 60);
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevStep = steps[currentStep - 1];
      const stepTime = prevStep.length?.number || 0;
      setTimeRemaining(stepTime * 60);
      setTotalTime(stepTime * 60);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTimeRemaining(0);
    setTotalTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const speakStep = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <ChefHat className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Cooking Mode</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 rounded-lg hover:bg-accent"
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Exit Cooking Mode
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Steps Panel */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {/* Step Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {currentStepData.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Step {currentStepData.number}</h3>
                  {currentStepData.length && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{currentStepData.length.number} minutes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-lg leading-relaxed">{currentStepData.step}</p>
              </div>

              {/* Ingredients */}
              {currentStepData.ingredients && currentStepData.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Ingredients for this step:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStepData.ingredients.map(ingredient => (
                      <span
                        key={ingredient.id}
                        className="px-3 py-1 bg-secondary rounded-full text-sm"
                      >
                        {ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {currentStepData.equipment && currentStepData.equipment.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Equipment needed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStepData.equipment.map(equipment => (
                      <span
                        key={equipment.id}
                        className="px-3 py-1 bg-accent rounded-full text-sm"
                      >
                        {equipment.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Control */}
              <button
                onClick={() => speakStep(currentStepData.step)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Volume2 className="h-4 w-4" />
                Read Step Aloud
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timer & Controls Panel */}
        <div className="lg:w-80 p-6 border-l bg-card">
          <div className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-primary mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round((timeRemaining / totalTime) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePlayPause}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isPlaying ? 'Pause' : timeRemaining === 0 ? 'Start' : 'Resume'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Step
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Done
                    </>
                  ) : (
                    'Next Step'
                  )}
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Timer
              </button>
            </div>

            {/* Step List */}
            <div className="space-y-2">
              <h4 className="font-semibold">All Steps</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    onClick={() => {
                      setCurrentStep(index);
                      setTimeRemaining((step.length?.number || 0) * 60);
                      setTotalTime((step.length?.number || 0) * 60);
                      setIsPlaying(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                      index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    Step {step.number}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CookingMode;

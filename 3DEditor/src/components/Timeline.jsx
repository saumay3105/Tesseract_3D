import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, FastForward, Rewind } from "lucide-react";

const AnimationTimeline = ({
  currentFrame,
  setCurrentFrame,
  initialDuration = 100,
  keyframes,
  onTimeUpdate = (frame) => {
    return;
  },
  playAnimation,
  stopAnimation,
}) => {
  const [duration, setDuration] = useState(initialDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef(null);
  const animationRef = useRef(null);
  const previousTimeRef = useRef(0);

  const calculateIntervals = () => {
    let step;
    if (duration <= 100) step = 10;
    else if (duration <= 200) step = 20;
    else if (duration <= 500) step = 50;
    else step = 100;

    const intervals = [];
    for (let i = 0; i <= duration; i += step) {
      intervals.push(i);
    }
    if (intervals[intervals.length - 1] !== duration) {
      intervals.push(duration);
    }
    return intervals;
  };

  useEffect(() => {
    const updateAnimation = (timestamp) => {
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      const deltaTime = timestamp - previousTimeRef.current;

      // Target 60 FPS (approximately 16.67ms per frame)
      if (deltaTime >= 16.67) {
        setCurrentFrame((prev) => {
          const nextFrame = prev + 1;
          if (nextFrame >= duration) {
            setIsPlaying(false);
            return duration;
          }
          onTimeUpdate(nextFrame);
          return nextFrame;
        });
        previousTimeRef.current = timestamp;
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    if (isPlaying) {
      previousTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(updateAnimation);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration, onTimeUpdate]);

  const togglePlayPause = () => {
    if (currentFrame >= duration) {
      setCurrentFrame(0);
    }
    if (isPlaying) {
      stopAnimation();
    } else {
      playAnimation(0, 100);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const frame = Math.round(percentage * duration);
    setCurrentFrame(Math.min(Math.max(frame, 0), duration));
    onTimeUpdate(frame);
  };

  const handleKeyframe = (frame) => {
    setCurrentFrame(frame);
    onTimeUpdate(frame);
  };

  const handleDurationChange = (e) => {
    const newDuration = Math.max(1, parseInt(e.target.value) || 0);
    setDuration(newDuration);
    if (currentFrame > newDuration) {
      setCurrentFrame(newDuration);
      onTimeUpdate(newDuration);
    }
  };

  const intervals = calculateIntervals();

  return (
    <div className="bg-gray-900 p-4">
      <div className="mx-auto space-y-2">
        {/* Frame intervals */}
        <div className="relative h-6">
          {intervals.map((frame) => (
            <div
              key={frame}
              className="absolute text-xs text-gray-400"
              style={{
                left: `${(frame / duration) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {frame}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div
          ref={timelineRef}
          className="relative h-8 bg-gray-700 rounded-lg cursor-pointer"
          onClick={handleTimelineClick}
        >
          {/* Interval markers */}
          {intervals.map((frame) => (
            <div
              key={frame}
              className="absolute top-0 w-px h-2 bg-gray-500"
              style={{ left: `${(frame / duration) * 100}%` }}
            />
          ))}

          {/* Keyframe markers */}

          {keyframes &&
            Object.keys(keyframes).map((frame, index) => (
              <div
                key={index}
                className="absolute top-0 w-1 h-full bg-yellow-500 cursor-pointer hover:bg-blue-400 transition-colors"
                style={{
                  left: `${(parseInt(frame) / duration) * 100}%`,
                  zIndex: 100,
                }}
                onClick={() => handleKeyframe(parseInt(frame))}
              />
            ))}

          {/* Progress bar - Removed transition */}
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-l-lg z-1"
            style={{ width: `${(currentFrame / duration) * 100}%` }}
          />

          {/* Playhead */}
          <div
            className="absolute top-0 w-2 h-full bg-white"
            style={{ left: `${(currentFrame / duration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentFrame(0)}
            className="p-2 text-white hover:text-blue-400 transition-colors"
          >
            <Rewind size={20} />
          </button>

          <button
            onClick={togglePlayPause}
            className="p-2 text-white hover:text-blue-400 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={() => setCurrentFrame(duration)}
            className="p-2 text-white hover:text-blue-400 transition-colors"
          >
            <FastForward size={20} />
          </button>

          <div className="flex items-center space-x-2 text-white">
            <span>Frame: {currentFrame} /</span>
            <input
              type="number"
              value={duration}
              onChange={handleDurationChange}
              className="w-20 px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationTimeline;

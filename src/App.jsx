import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Pass the beat</h1>
      <PassTheBeat />
    </>
  );
}

export default App;

import React, { useEffect, useRef } from "react";
import * as Tone from "tone";

const PassTheBeat = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDrum, setCurrentDrum] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [doubleHitChance, setDoubleHitChance] = useState(10); // Editable variable for 10% chance
  const [speed, setSpeed] = useState(200); // Speed of beat passing

  const drums = Array.from({ length: 12 }, (_, i) => `🪘 ${i + 1}`);

  // Set up a synth or drum kit from Tone.js
  const drumSynth = useRef(null);
  // Array of notes corresponding to each drum index
  const drumNotes = [
    "C4",
    "G3",
    "E4",
    "F5",
    "B4",
    "A6",
    "G2",
    "C5",
    "F5",
    "E4",
    "D6",
    "G5",
  ];

  useEffect(() => {
    // Initialize Tone.js synth or sampler when component mounts
    drumSynth.current = new Tone.MembraneSynth().toDestination();
  }, []);

  // Start / Pause toggle
  const togglePlay = () => {
    if (!isPlaying) {
      Tone.start(); // Ensures audio context is started
    }
    setIsPlaying(!isPlaying);
  };

  // Function to move to the next drum
  const moveToNextDrum = () => {
    let nextDrum = reverse ? currentDrum - 1 : currentDrum + 1;

    if (nextDrum >= drums.length) nextDrum = 0;
    if (nextDrum < 0) nextDrum = drums.length - 1;
    const currentNote = drumNotes[nextDrum];

    // Check for double hit with 10% chance
    if (Math.random() * 100 < doubleHitChance) {
      setReverse(!reverse); // Reverse the direction
      // Play double hit sound: trigger drum twice
      playDrum(currentNote);
      setTimeout(() => {
        playDrum(currentNote);
      }, 100); // Plays the second hit after a short delay (100ms)
    } else {
      // Normal hit
      playDrum(currentNote);
    }

    setCurrentDrum(nextDrum);
  };

  // Function to trigger the drum sound
  const playDrum = (note) => {
    drumSynth.current.triggerAttackRelease(note, "8n"); // Adjust note or pitch for drum sound
  };

  // Use effect to handle the beat passing logic
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        moveToNextDrum();
      }, speed);
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount or pause
  }, [isPlaying, currentDrum, reverse, doubleHitChance, speed]);

  return (
    <div className="drum-circle">
      <div className="controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Start"}</button>
        <div className="control-group">
          <label>
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              step={100}
            />{" "}
            ms between drums
          </label>
        </div>
        <div className="control-group">
          <label>
            <input
              type="number"
              value={doubleHitChance}
              onChange={(e) => setDoubleHitChance(Number(e.target.value))}
              step={5}
            />{" "}
            double hit %
          </label>
        </div>
      </div>
      <div className="drums">
        {drums.map((drum, index) => (
          <div
            key={index}
            className={`drum ${index === currentDrum ? "active" : ""}`}
          >
            {drum}
          </div>
        ))}
      </div>
    </div>
  );
};

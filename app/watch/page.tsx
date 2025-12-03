"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clipboard, 
  Mic, 
  Siren, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  ArrowLeft,
  Activity,
} from 'lucide-react';

// --- Types ---

type TaskType = 'standard' | 'voice' | 'system' | 'critical';
type Urgency = 'normal' | 'high' | 'critical';

interface Task {
  id: string;
  time: string;
  title: string;
  description: string;
  type: TaskType;
  urgency: Urgency;
  status: 'active' | 'done';
}

// --- Mock Data ---

const INITIAL_TASKS: Task[] = [
  {
    id: 't5',
    time: '09:15',
    title: 'Trauma Alert',
    description: 'Incoming MVA, ETA 5m. Prepare Bay 1.',
    type: 'critical',
    urgency: 'critical',
    status: 'active',
  },
  {
    id: 't2',
    time: '08:15',
    title: 'Verbal Order',
    description: 'Dr. Patel: Norepi increase if MAP < 65.',
    type: 'voice',
    urgency: 'high',
    status: 'active',
  },
  {
    id: 't1',
    time: '08:00',
    title: 'Morning Vitals',
    description: 'Full assessment Bed 4.',
    type: 'standard',
    urgency: 'normal',
    status: 'active',
  },
  {
    id: 't3',
    time: '08:30',
    title: 'Crit Lab: K+',
    description: 'Potassium 2.8. Replace per protocol.',
    type: 'system',
    urgency: 'high',
    status: 'active',
  },
];

export default function WatchPage() {
  const [transcription, setTranscription] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-8">
      {/* 
         Scaled down by ~40%. 
         Original Frame: ~430x500. New: ~260x300.
      */}
      <AppleWatchFrame>
        <WatchApp onTranscription={setTranscription} />
      </AppleWatchFrame>
      
      <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
        <AnimatePresence>
          {transcription && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200"
            >
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                "{transcription}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="text-slate-500 text-sm font-medium">
          Pulse WatchOS Prototype (v2)
        </div>
      </div>
    </div>
  );
}

// --- Watch Frame Component ---

function AppleWatchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Watch Body - Reduced size, Rounder corners */}
      <div className="w-[260px] h-[320px] bg-slate-900 rounded-[60px] shadow-2xl border-[6px] border-slate-800 relative flex items-center justify-center overflow-hidden ring-4 ring-slate-200/50">
        
        {/* Screen Area */}
        <div className="w-[240px] h-[300px] bg-black rounded-[42px] overflow-hidden relative text-white">
           {children}
        </div>

        {/* Glare/Reflection */}
        <div className="absolute inset-0 rounded-[65px] pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-40" />
      </div>

      {/* Digital Crown */}
      <div className="absolute -right-[10px] top-[80px] w-3 h-14 bg-slate-700 rounded-r-md shadow-lg border-l border-slate-900 flex flex-col justify-center items-center gap-0.5">
         <div className="w-full h-[1px] bg-slate-600" />
         <div className="w-full h-[1px] bg-slate-600" />
         <div className="w-full h-[1px] bg-slate-600" />
         <div className="w-full h-[1px] bg-slate-600" />
         <div className="w-full h-[1px] bg-slate-600" />
         <div className="w-full h-[1px] bg-slate-600" />
         <div className="w-full h-[1px] bg-slate-600" />
      </div>

      {/* Side Button */}
      <div className="absolute -right-[4px] top-[180px] w-1 h-18 bg-slate-700 rounded-r-md shadow-lg" />
      
      {/* Band */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-300 rounded-t-2xl -z-10" />
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-300 rounded-b-2xl -z-10" />
    </div>
  );
}

// --- Watch App Implementation ---

function WatchApp({ onTranscription }: { onTranscription: (text: string | null) => void }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Filter active tasks
  const activeTasks = tasks.filter(t => t.status === 'active');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setView('detail');
  };

  const handleComplete = () => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'done' } : t));
      setNotification('Completed');
      setTimeout(() => {
        setNotification(null);
        setView('list');
        setSelectedTask(null);
      }, 1500);
    }
  };

  const handleSnooze = () => {
     if (selectedTask) {
      setTasks(prev => prev.filter(t => t.id !== selectedTask.id)); 
      setNotification('Snoozed');
      setTimeout(() => {
        setNotification(null);
        setView('list');
        setSelectedTask(null);
      }, 1500);
    }
  };

  const handleMicClick = () => {
    setIsRecording(true);
    onTranscription(null);
    
    // Simulate recording delay
    setTimeout(() => {
      const newText = "Need to check on patient 307, and report to doctor Stephanie in 20 mins";
      onTranscription(newText);
      setIsRecording(false);
      
      // Add new task
      const newTask: Task = {
        id: `t-${Date.now()}`,
        time: '10:11',
        title: 'Check Patient 307',
        description: 'Report to doctor Stephanie in 20 mins',
        type: 'voice',
        urgency: 'normal',
        status: 'active'
      };
      
      setTasks(prev => [newTask, ...prev]);
      setNotification('Task Created');
      setTimeout(() => setNotification(null), 2000);
    }, 3000);
  };

  return (
    <div className="w-full h-full bg-black text-white font-sans select-none overflow-hidden relative">
      
      {/* Header (Time) */}
      <div className="absolute top-0 left-0 right-0 py-3 flex justify-between items-center px-5 z-20 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <span className="text-orange-500 font-medium text-xs">09:41</span>
        <Activity className="w-3 h-3 text-green-500" />
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full pt-12 pb-2 overflow-y-auto no-scrollbar snap-mandatory scroll-smooth">
        
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-2 space-y-2 min-h-full pb-12"
            >
              {/* Notification/Chats Card - Top of list */}
              <div className="snap-start bg-slate-800/80 rounded-2xl p-3 border border-slate-700 mb-2 flex items-center space-x-3">
                 <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                       <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-bold">2</div>
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold truncate">Team Chat</h3>
                    <p className="text-xs text-slate-400 truncate">Sarah: Can you help...</p>
                 </div>
              </div>

              {/* Render tasks from state (including new ones) */}
              {activeTasks.map(task => (
                <WatchTaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
              ))}

              {activeTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                  <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs">All Clear</span>
                </div>
              )}
            </motion.div>
          )}

          {view === 'detail' && selectedTask && (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="px-3 h-full flex flex-col pt-0 relative"
            >
              {/* Fixed Back Button */}
              <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black via-black/90 to-transparent pt-3 pb-4 px-3">
                <button 
                  onClick={() => setView('list')}
                  className="flex items-center text-slate-400 text-xs hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>
              </div>

              <div className="mt-10 overflow-y-auto no-scrollbar pb-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-2
                  ${selectedTask.urgency === 'critical' ? 'bg-red-500/20 text-red-500' : 
                    selectedTask.type === 'voice' ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-700 text-slate-300'}
                `}>
                  {selectedTask.urgency === 'critical' ? <Siren className="w-4 h-4" /> :
                   selectedTask.type === 'voice' ? <Mic className="w-4 h-4" /> :
                   <Clipboard className="w-4 h-4" />}
                </div>

                <h2 className="text-sm font-bold leading-tight mb-1">{selectedTask.title}</h2>
                <p className="text-xs text-slate-400 mb-4 font-mono">{selectedTask.time}</p>
                <p className="text-xs text-slate-300 mb-4 leading-snug">{selectedTask.description}</p>

                <div className="space-y-2">
                  <button 
                    onClick={handleComplete}
                    className="w-full bg-green-600 active:bg-green-700 text-white font-bold py-3 rounded-full flex items-center justify-center space-x-2 transition-colors text-xs"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Done</span>
                  </button>
                  <button 
                    onClick={handleSnooze}
                    className="w-full bg-slate-800 active:bg-slate-700 text-slate-300 font-bold py-3 rounded-full flex items-center justify-center space-x-2 transition-colors text-xs"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Snooze</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Mic Button (Bottom Right) */}
      {view === 'list' && !isRecording && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleMicClick}
          className="absolute bottom-3 right-3 w-12 h-12 bg-blue-600 rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center z-30"
        >
          <Mic className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Audio Visualizer Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <div className="absolute top-8 text-slate-400 text-xs font-medium">
              Tap to stop recording
            </div>
            
            {/* Visualizer Blobs */}
            <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-center overflow-hidden pb-4 space-x-[-20px]">
               <motion.div 
                 animate={{ height: [40, 120, 60, 100, 40] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                 className="w-20 h-32 bg-red-500 rounded-full blur-2xl opacity-80"
               />
               <motion.div 
                 animate={{ height: [60, 140, 80, 120, 60] }}
                 transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                 className="w-20 h-40 bg-yellow-400 rounded-full blur-2xl opacity-80"
               />
               <motion.div 
                 animate={{ height: [50, 100, 50, 90, 50] }}
                 transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.1 }}
                 className="w-20 h-28 bg-blue-500 rounded-full blur-2xl opacity-80"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Overlay */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <span className="font-bold text-sm">{notification}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcription Display (Outside Watch Frame via Portal or just absolute in container? 
          User said "below the mockup". 
          But this component is INSIDE the watch frame. 
          We need to lift the transcription state up or render it here if we want it inside.
          Wait, user said "below the mockup". 
          I need to pass the transcription up to the parent `WatchPage` or use a portal.
          For simplicity in this single file, I'll render it here but use fixed positioning relative to the viewport 
          if I can escape the overflow:hidden of the watch frame. 
          Actually, the watch frame has overflow-hidden. 
          I should probably move the transcription display to the `WatchPage` component.
          Let's do that. I'll expose the transcription via a context or just lift the state up.
          Refactoring to lift state is cleaner.
      */}
    </div>
  );
}

function WatchTaskCard({ task, onClick }: { task: Task, onClick: () => void }) {
  const isCritical = task.urgency === 'critical';
  
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        w-full min-h-[150px] p-4 rounded-3xl relative overflow-hidden snap-start flex flex-col justify-between
        ${isCritical ? 'bg-red-900/40 border border-red-500/50' : 'bg-slate-800/90 border border-slate-700'}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-xs font-mono ${isCritical ? 'text-red-300' : 'text-slate-400'}`}>
          {task.time}
        </span>
        {isCritical && <Siren className="w-3 h-3 text-red-500 animate-pulse" />}
      </div>
      
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="text-sm font-bold leading-tight text-white">{task.title}</h3>
        <p className="text-xs text-slate-300 leading-snug line-clamp-3">
          {task.description}
        </p>
      </div>

      {task.type === 'voice' && (
        <div className="flex items-center space-x-1 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="text-xs text-blue-400">Voice Note</span>
        </div>
      )}
    </motion.div>
  );
}

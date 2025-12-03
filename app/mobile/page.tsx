"use client";

import React, { useState } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform, 
  Reorder, 
  PanInfo 
} from 'framer-motion';
import { 
  Clipboard, 
  Mic, 
  AlertTriangle, 
  Siren, 
  Clock, 
  CheckCircle, 
  Menu, 
  MessageSquare, 
  X, 
  ChevronDown, 
  GripVertical, 
  User, 
  Send, 
  ArrowLeft, 
  MoreVertical,
  Phone,
  Video,
  Search,
  Battery,
  Wifi,
  Signal
} from 'lucide-react';

// --- Types ---

type Urgency = 'normal' | 'high' | 'critical';
type TaskStatus = 'active' | 'done' | 'snoozed' | 'delegated';
type TaskType = 'standard' | 'voice' | 'system' | 'critical';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  type: TaskType;
  urgency: Urgency;
  status: TaskStatus;
  delegatedTo?: string;
  audioDuration?: string; // For voice notes
}

interface Staff {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  avatarColor: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

// --- Mock Data ---

const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Marco', role: 'RN', status: 'online', avatarColor: 'bg-blue-200' },
  { id: '2', name: 'Jeremy', role: 'RN', status: 'offline', avatarColor: 'bg-green-200' },
  { id: '3', name: 'Samantha', role: 'Charge', status: 'online', avatarColor: 'bg-purple-200' },
  { id: '4', name: 'Daisy', role: 'Tech', status: 'busy', avatarColor: 'bg-yellow-200' },
  { id: '5', name: 'Dr. Patel', role: 'Intensivist', status: 'online', avatarColor: 'bg-slate-200' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    time: '08:00',
    title: 'Morning Vitals & Assessment',
    description: 'Complete full head-to-toe assessment for Bed 4.',
    type: 'standard',
    urgency: 'normal',
    status: 'active',
  },
  {
    id: 't2',
    time: '08:15',
    title: 'Dr. Patel Verbal Order',
    description: 'Increase Norepinephrine to 10mcg/min if MAP < 65.',
    type: 'voice',
    urgency: 'high',
    status: 'active',
    audioDuration: '0:45',
  },
  {
    id: 't3',
    time: '08:30',
    title: 'Lab Results: Critical K+',
    description: 'Potassium 2.8 mmol/L. Protocol replacement required.',
    type: 'system',
    urgency: 'high',
    status: 'active',
  },
  {
    id: 't4',
    time: '09:00',
    title: 'Code Blue Drill',
    description: 'ICU team simulation in Room 10.',
    type: 'standard',
    urgency: 'normal',
    status: 'snoozed',
  },
  {
    id: 't5',
    time: '09:15',
    title: 'Trauma Alert: Incoming',
    description: 'ETA 5 mins. MVA, multiple fractures, hypotensive.',
    type: 'critical',
    urgency: 'critical',
    status: 'active',
  },
  {
    id: 't6',
    time: '10:00',
    title: 'Wound Care',
    description: 'Change dressing on sacral ulcer.',
    type: 'standard',
    urgency: 'normal',
    status: 'delegated',
    delegatedTo: 'Daisy',
  },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', text: 'Hey, can you help with a turn in Bed 4?', sender: 'other', timestamp: '08:45' },
  { id: 'm2', text: 'Sure, give me 5 mins.', sender: 'me', timestamp: '08:46' },
];

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-8 space-y-8">
      <PhoneFrame>
        <MobileApp />
      </PhoneFrame>
      
      <div className="text-slate-500 text-sm font-medium">
        Pulse Mobile Prototype (v2)
      </div>
    </div>
  );
}

// --- iPhone Frame Component ---

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* iPhone Body */}
      <div className="w-[375px] h-[812px] bg-slate-900 rounded-[55px] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden ring-4 ring-slate-200/50">
        
        {/* Screen Area */}
        <div className="w-full h-full bg-slate-50 relative overflow-hidden rounded-[46px]">
           {children}
        </div>

        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-3xl z-50 flex items-center justify-center">
            {/* Camera/Sensor placeholders */}
            <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-800/50" />
                <div className="w-2 h-2 rounded-full bg-slate-800/50" />
            </div>
        </div>
        
        {/* Status Bar Mockup (Top corners) */}
        <div className="absolute top-4 left-8 z-40 text-sm font-bold">9:41</div>
        <div className="absolute top-4 right-8 z-40 flex items-center space-x-1 ">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
        </div>

        {/* Home Indicator
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/80 rounded-full z-50 pointer-events-none" /> */}
      </div>

      {/* Side Buttons */}
      <div className="absolute -left-[3px] top-[100px] w-[3px] h-[40px] bg-slate-700 rounded-l-md" /> {/* Mute */}
      <div className="absolute -left-[3px] top-[160px] w-[3px] h-[80px] bg-slate-700 rounded-l-md" /> {/* Vol Up */}
      <div className="absolute -left-[3px] top-[244px] w-[3px] h-[80px] bg-slate-700 rounded-l-md" /> {/* Vol Down */}
      <div className="absolute -right-[3px] top-[200px] w-[3px] h-[100px] bg-slate-700 rounded-r-md" /> {/* Power */}
    </div>
  );
}

// --- Mobile App Implementation ---

function MobileApp() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<TaskStatus>('active');
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatView, setChatView] = useState<'contacts' | 'chat'>('contacts');
  const [selectedChatStaff, setSelectedChatStaff] = useState<Staff | null>(null);
  
  // Derived state
  const filteredTasks = tasks.filter(t => t.status === activeTab);
  
  // Handlers
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleSwipeComplete = (taskId: string, action: 'done' | 'snoozed') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: action };
      }
      return t;
    }));
  };

  const handleReorder = (newOrder: Task[]) => {
    const otherTasks = tasks.filter(t => t.status !== activeTab);
    setTasks([...newOrder, ...otherTasks]);
  };

  return (
    <div className="h-full w-full bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col relative overflow-hidden pt-2">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 pt-12 pb-3 flex items-center justify-between shadow-sm">
          <button onClick={() => setIsProfileOpen(true)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold text-slate-900">Sarah Chen, RN</h1>
            <span className="text-xs text-slate-500">ICU • Day Shift</span>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
            On Duty
          </div>
        </header>

        {/* Status Filter Tabs */}
        <div className="sticky top-[89px] z-20 bg-slate-50 pt-2 pb-2 px-4 border-b border-slate-200 flex space-x-2 overflow-x-auto no-scrollbar">
          {(['active', 'done', 'delegated', 'snoozed'] as TaskStatus[]).map((tab) => {
            const count = tasks.filter(t => t.status === tab).length;
            const isActive = activeTab === tab;
            
            let activeColor = 'bg-blue-600 text-white shadow-md shadow-blue-200';
            if (tab === 'done') activeColor = 'bg-green-600 text-white shadow-md shadow-green-200';
            if (tab === 'delegated') activeColor = 'bg-purple-600 text-white shadow-md shadow-purple-200';
            if (tab === 'snoozed') activeColor = 'bg-yellow-500 text-white shadow-md shadow-yellow-200';

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive ? activeColor : 'bg-white text-slate-600 border border-slate-200 shadow-sm'}
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} <span className="ml-1 opacity-80 text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Reorder Toggle (Only for Active tab) */}
        {activeTab === 'active' && (
          <div className="px-4 py-2 flex justify-between">
            <button 
              onClick={() => setIsReorderMode(!isReorderMode)}
              className={`text-xs font-medium flex items-center space-x-1 ${isReorderMode ? 'text-blue-600' : 'text-slate-500'}`}
            >
              <GripVertical className="w-3 h-3" />
              <span>{isReorderMode ? 'Done Reordering' : 'Reorder Tasks'}</span>
            </button>
            <span className="text-xs font-medium text-muted-foreground">Swipe right to complete</span>
          </div>
        )}

        {/* Timeline View */}
        <main className="flex-1 px-4 py-4 relative overflow-y-auto no-scrollbar pb-24">
          {/* Timeline Line */}
          <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-slate-200 z-0" />

          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4"
              >
                {activeTab === 'active' && <Clipboard className="w-16 h-16 opacity-20" />}
                {activeTab === 'done' && <CheckCircle className="w-16 h-16 opacity-20" />}
                {activeTab === 'snoozed' && <Clock className="w-16 h-16 opacity-20" />}
                {activeTab === 'delegated' && <User className="w-16 h-16 opacity-20" />}
                <p>No {activeTab} tasks</p>
              </motion.div>
            ) : (
              isReorderMode && activeTab === 'active' ? (
                <Reorder.Group axis="y" values={filteredTasks} onReorder={handleReorder} className="space-y-6">
                  {filteredTasks.map((task) => (
                    <Reorder.Item key={task.id} value={task}>
                      <TaskCard 
                        task={task} 
                        onUpdate={handleTaskUpdate} 
                        onSwipe={handleSwipeComplete}
                        isReorderMode={true}
                      />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-6">
                  {filteredTasks.map((task) => (
                    <motion.div 
                      key={task.id} 
                      layout 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    >
                      <TaskCard 
                        task={task} 
                        onUpdate={handleTaskUpdate} 
                        onSwipe={handleSwipeComplete}
                        isReorderMode={false}
                      />
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </AnimatePresence>
          
          
        </main>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col items-center space-y-4 z-40">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(true)}
            className="w-12 h-12 bg-slate-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-300 flex items-center justify-center hover:bg-blue-500 transition-colors"
          >
            <Mic className="w-7 h-7" />
          </motion.button>
        </div>

        {/* Profile Side Drawer */}
        <AnimatePresence>
          {isProfileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsProfileOpen(false)}
                className="absolute inset-0 bg-slate-900/60 z-50 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white z-50 shadow-2xl overflow-y-auto"
              >
                <div className="p-6 space-y-6 pt-16">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">SC</div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Sarah Chen</h2>
                      <p className="text-slate-500">RN • ICU</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Info</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-700 font-medium">Today</span>
                        <span className="text-slate-900 font-bold">07:00 - 19:00</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 w-2/3 h-full" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2 text-right">8 hours remaining</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Notes</h3>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                      <strong>Charge:</strong> Samantha is covering break 12-1.
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                      <strong>Alert:</strong> X-Ray machine 2 is down.
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <button className="w-full py-3 text-slate-500 font-medium hover:text-slate-900 transition-colors flex items-center space-x-2">
                       <ArrowLeft className="w-5 h-5" />
                       <span onClick={() => setIsProfileOpen(false)}>Close Menu</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Chat Interface */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-0 bg-slate-50 z-50 flex flex-col pt-12"
            >
              {chatView === 'contacts' ? (
                <>
                  <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between sticky top-0">
                    <h2 className="text-lg font-bold text-slate-900">Team Chat</h2>
                    <button onClick={() => setIsChatOpen(false)} className="p-2 bg-slate-100 rounded-full">
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                  <div className="p-4 space-y-2 overflow-y-auto flex-1">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input type="text" placeholder="Search staff..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {INITIAL_STAFF.map(staff => (
                      <div 
                        key={staff.id} 
                        onClick={() => { setSelectedChatStaff(staff); setChatView('chat'); }}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 active:scale-95 transition-transform"
                      >
                        <div className={`w-12 h-12 ${staff.avatarColor} rounded-full flex items-center justify-center font-bold text-slate-700 relative`}>
                          {staff.name.charAt(0)}
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                            ${staff.status === 'online' ? 'bg-green-500' : staff.status === 'busy' ? 'bg-red-500' : 'bg-slate-400'}`} 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-slate-900">{staff.name}</h3>
                            <span className="text-xs text-slate-400">12:30</span>
                          </div>
                          <p className="text-sm text-slate-500">{staff.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white p-4 border-b border-slate-200 flex items-center space-x-3 sticky top-0 shadow-sm z-10">
                    <button onClick={() => setChatView('contacts')} className="p-1 -ml-1">
                      <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <div className={`w-10 h-10 ${selectedChatStaff?.avatarColor} rounded-full flex items-center justify-center font-bold text-sm`}>
                      {selectedChatStaff?.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-slate-900">{selectedChatStaff?.name}</h2>
                      <p className="text-xs text-green-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                        Online
                      </p>
                    </div>
                    <Phone className="w-5 h-5 text-blue-600" />
                    <Video className="w-5 h-5 text-blue-600 ml-3" />
                  </div>
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
                    {INITIAL_MESSAGES.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender === 'me' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                        }`}>
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
                    <button className="p-2 text-slate-400"><MoreVertical className="w-5 h-5" /></button>
                    <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <button className="p-2 bg-blue-600 text-white rounded-full"><Send className="w-5 h-5" /></button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function TaskCard({ 
  task, 
  onUpdate, 
  onSwipe,
  isReorderMode 
}: { 
  task: Task; 
  onUpdate: (t: Task) => void; 
  onSwipe: (id: string, action: 'done' | 'snoozed') => void;
  isReorderMode: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  
  // Edit State
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editUrgency, setEditUrgency] = useState(task.urgency);

  // Swipe Logic
  const x = useMotionValue(0);
  const background = useTransform(x, [-150, 0, 150], ["#eab308", "#ffffff", "#22c55e"]);
  const checkOpacity = useTransform(x, [50, 100], [0, 1]);
  const clockOpacity = useTransform(x, [-50, -100], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe(task.id, 'done');
    } else if (info.offset.x < -100) {
      onSwipe(task.id, 'snoozed');
    }
  };

  const saveEdit = () => {
    onUpdate({ ...task, title: editTitle, description: editDesc, urgency: editUrgency });
    setIsEditing(false);
  };

  const handleDelegate = (staffName: string) => {
    onUpdate({ ...task, status: 'delegated', delegatedTo: staffName });
    setIsDelegating(false);
  };

  // Styles based on type/urgency
  const isCritical = task.type === 'critical';
  const isVoice = task.type === 'voice';
  const isSystem = task.type === 'system';
  
  let borderClass = 'border-l-4 border-l-slate-300';
  if (isVoice) borderClass = 'border-l-4 border-l-blue-500';
  if (isSystem || task.urgency === 'high') borderClass = 'border-l-4 border-l-orange-500';
  if (isCritical) borderClass = 'border-l-4 border-l-red-500';

  let bgClass = 'bg-white';
  if (isVoice) bgClass = 'bg-slate-50';
  if (isCritical) bgClass = 'bg-red-50';

  // Icon
  const getIcon = () => {
    if (isCritical) return <Siren className="w-5 h-5 text-red-600 animate-pulse" />;
    if (isVoice) return <Mic className="w-5 h-5 text-blue-600" />;
    if (isSystem) return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <Clipboard className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="relative flex items-start group">
      {/* Timeline Time */}
      <div className="absolute left-0 w-16 text-xs font-mono text-slate-500 pt-4 text-right pr-4">
        {task.time}
      </div>
      
      {/* Connector Dot */}
      <div className="absolute left-[4.25rem] top-5 w-2.5 h-2.5 rounded-full bg-slate-300 z-10 border-2 border-slate-50" />

      {/* Card Container */}
      <div className="ml-20 w-full relative">
        {/* Swipe Background Layers */}
        {!isReorderMode && task.status === 'active' && (
          <motion.div 
            style={{ background }}
            className="absolute inset-0 rounded-xl flex items-center justify-between px-6 z-0"
          >
            <motion.div style={{ opacity: checkOpacity }} className="flex items-center text-white font-bold">
              <CheckCircle className="w-8 h-8 mr-2" /> Complete
            </motion.div>
            <motion.div style={{ opacity: clockOpacity }} className="flex items-center text-white font-bold">
              Snooze <Clock className="w-8 h-8 ml-2" />
            </motion.div>
          </motion.div>
        )}

        {/* The Card Itself */}
        <motion.div
          drag={isReorderMode || task.status !== 'active' ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          style={{ x: isReorderMode ? 0 : x }}
          className={`
            relative z-10 rounded-xl shadow-sm border border-slate-200 overflow-hidden
            ${bgClass} ${borderClass}
            ${isReorderMode ? 'cursor-move' : 'cursor-pointer'}
          `}
        >
          {/* Main Content */}
          <div 
            className="p-4"
            onClick={() => !isReorderMode && !isVoice && setIsExpanded(!isExpanded)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getIcon()}
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isCritical ? 'text-red-700' : 
                    task.urgency === 'high' ? 'text-orange-700' : 'text-slate-500'
                  }`}>
                    {task.urgency} Priority
                  </span>
                  {task.delegatedTo && (
                    <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Delegated to {task.delegatedTo}
                    </span>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3 mt-2" onClick={(e) => e.stopPropagation()}>
                    <input 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-sm font-bold" 
                    />
                    <textarea 
                      value={editDesc} 
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-sm" 
                      rows={2}
                    />
                    <select 
                      value={editUrgency}
                      onChange={(e) => setEditUrgency(e.target.value as Urgency)}
                      className="w-full p-2 border border-slate-300 rounded text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <div className="flex space-x-2 pt-2">
                      <button onClick={saveEdit} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold">Save</button>
                      <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-slate-900 leading-tight">{task.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{task.description}</p>
                    {isVoice && (
                      <div className="mt-3 flex items-center space-x-2 bg-blue-100/50 p-2 rounded-lg w-fit">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5" />
                        </div>
                        <div className="h-1 w-24 bg-blue-200 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-blue-500" />
                        </div>
                        <span className="text-xs font-mono text-blue-700">{task.audioDuration}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {!isVoice && !isEditing && (
                <motion.div 
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="text-slate-400 ml-2"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Expanded Actions */}
          <AnimatePresence>
            {isExpanded && !isEditing && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-100 bg-slate-50/50 overflow-hidden"
              >
                <div className="p-4 flex space-x-2">
                  <button 
                    onClick={() => onSwipe(task.id, 'done')}
                    className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-1 hover:bg-green-200"
                  >
                    <CheckCircle className="w-4 h-4" /> <span>Done</span>
                  </button>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setIsDelegating(true)}
                    className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-1 hover:bg-purple-200"
                  >
                    <User className="w-4 h-4" /> <span>Delegate</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Delegation Modal (Inline for simplicity in this component) */}
          {isDelegating && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col p-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Delegate to:</h4>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {INITIAL_STAFF.filter(s => s.id !== '5').map(staff => (
                  <button 
                    key={staff.id}
                    onClick={() => handleDelegate(staff.name)}
                    disabled={staff.status === 'busy'}
                    className={`w-full flex items-center p-2 rounded-lg border ${
                      staff.status === 'busy' ? 'opacity-50 bg-slate-50 border-slate-100' : 'hover:bg-blue-50 border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 ${staff.avatarColor} rounded-full flex items-center justify-center text-xs font-bold mr-3`}>
                      {staff.name.charAt(0)}
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-bold text-slate-900">{staff.name}</div>
                      <div className="text-xs text-slate-500">{staff.role} • {staff.status}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsDelegating(false)}
                className="mt-2 w-full py-2 text-slate-500 text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

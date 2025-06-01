import React, { useState, useEffect, useRef } from "react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import {
  RotateCcw,
  SkipForward,
  Pause,
  Play,
  CircleCheckBig,
  Clock,
  SlidersHorizontal,
  CheckCircle,
} from "lucide-react";
import { tasks as mockTasks } from "@/data/mock/taskData";
import PomodoroSetting from "@/components/PomodoroSetting";
import { format } from "date-fns";

// Timer modes
const TIMER_MODE = {
  POMODORO: "Pomodoro",
  BREAK: "Break",
};

// Default timer settings (seconds)
const DEFAULT_TIMER_SETTINGS = {
  Pomodoro: 25 * 60,
  Break: 5 * 60,
};

const PomodoroPage = () => {
  // Timer and session states
  const [timerMode, setTimerMode] = useState(TIMER_MODE.POMODORO);
  const [timer, setTimer] = useState(
    DEFAULT_TIMER_SETTINGS[TIMER_MODE.POMODORO]
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [tasks, setTasks] = useState(mockTasks);
  const [showSetting, setShowSetting] = useState(false);
  const [timerSettings, setTimerSettings] = useState({
    ...DEFAULT_TIMER_SETTINGS,
  });
  const [totalTime, setTotalTime] = useState(120); // Total study time (minutes)
  const [totalSessions, setTotalSessions] = useState(4); // Total sessions
  const [accumulatedTime, setAccumulatedTime] = useState(0); // Studied time (minutes)
  const [isTimeSet, setIsTimeSet] = useState(false); // Has time been set?
  const intervalRef = useRef(null);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Color for each mode
  const modeColors = {
    Pomodoro: "#1f53f3",
    Break: "#ffba49",
  };
  const currentColor = modeColors[timerMode];

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timer]);

  // Handle mode/session switching and accumulatedTime update
  useEffect(() => {
    if (timer === 0 && isRunning) {
      if (timerMode === TIMER_MODE.POMODORO) {
        setAccumulatedTime((prev) => prev + timerSettings["Pomodoro"] / 60);
        if (currentSession >= totalSessions) {
          setIsRunning(false);
          return;
        }
        setCurrentSession((prev) => prev + 1);
        setTimerMode(TIMER_MODE.BREAK);
        setTimer(timerSettings["Break"]);
      } else {
        setTimerMode(TIMER_MODE.POMODORO);
        setTimer(timerSettings["Pomodoro"]);
      }
    }
  }, [timer, isRunning]);

  // Calculate total sessions based on total time and pomodoro duration
  useEffect(() => {
    const pomodoroMinutes = timerSettings["Pomodoro"] / 60;
    const calculatedSessions = Math.floor(totalTime / pomodoroMinutes);
    setTotalSessions(calculatedSessions);
  }, [totalTime, timerSettings]);

  // Reset timer when mode changes and not running
  useEffect(() => {
    if (!isRunning && timer === 0) {
      setTimer(timerSettings[timerMode]);
    }
  }, [timerMode, timerSettings, isRunning, timer]);

  // Start or pause timer
  const handleStartPause = () => {
    if (!isTimeSet) {
      setIsTimeSet(true);
    }
    setIsRunning((prev) => !prev);
  };

  // Reset timer and all progress
  const handleReset = () => {
    setTimer(timerSettings[timerMode]);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAccumulatedTime(0);
    setIsTimeSet(false);
    setCurrentSession(1);
    setTimerMode(TIMER_MODE.POMODORO);
  };

  // Open/close settings modal
  const handleOpenSettings = () => setShowSetting(true);
  const handleCloseSettings = () => setShowSetting(false);

  // Handle timer settings change
  const handleSettingChange = (type, value) => {
    setTimerSettings((prev) => ({
      ...prev,
      [type === "pomodoro" ? "Pomodoro" : "Break"]:
        Math.max(1, Number(value)) * 60,
    }));
  };

  // Save settings
  const handleSaveSettings = () => {
    setTimer(timerSettings[timerMode]);
    setIsRunning(false);
    setShowSetting(false);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get progress for SVG circle
  const getProgress = () => {
    const total = timerSettings[timerMode];
    return 1 - timer / total;
  };

  // Format studied time
  const formatAccumulatedTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  // Get today's date (yyyy-mm-dd)
  const todayStr = new Date().toISOString().split("T")[0];

  // Filter tasks for today
  const todayTasks = tasks.filter((task) => {
    const date =
      task.date || (task.startTime ? task.startTime.split("T")[0] : null);
    return date === todayStr;
  });

  // Complete a task
  const handleCompleteTask = (task) => {
    setCompletedTasks((prev) => [
      ...prev,
      { ...task, completedAt: new Date().toISOString() },
    ]);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setCurrentTaskId(null);
  };

  // Add this function inside PomodoroPage
  const handleSkipForward = () => {
    if (timerMode === TIMER_MODE.POMODORO) {
      if (currentSession >= totalSessions) {
        setIsRunning(false);
        setTimer(0);
        return;
      }
      setCurrentSession((prev) => prev + 1);
      setTimerMode(TIMER_MODE.BREAK);
      setTimer(timerSettings["Break"]);
    } else {
      setTimerMode(TIMER_MODE.POMODORO);
      setTimer(timerSettings["Pomodoro"]);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />
            <div className="flex gap-8 mt-8">
              {/* Pomodoro Timer Section */}
              <div className="flex-1 flex flex-col items-center relative">
                {/* Settings button */}
                <button
                  className="absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow"
                  onClick={handleOpenSettings}
                  title="Pomodoro settings"
                >
                  <SlidersHorizontal size={22} />
                </button>
                {/* Mode Switcher */}
                <div className="flex gap-4 mb-8 mt-2">
                  {Object.values(TIMER_MODE).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTimerMode(mode)}
                      className={`px-6 py-2 rounded-full text-base font-semibold transition-all border border-gray-200`}
                      style={
                        timerMode === mode
                          ? {
                              backgroundColor: modeColors[mode],
                              color: "#fff",
                              borderColor: modeColors[mode],
                            }
                          : {}
                      }
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                {/* Timer Circle */}
                <div className="relative w-72 h-72 flex items-center justify-center mb-8">
                  <svg
                    className="absolute top-0 left-0"
                    width="288"
                    height="288"
                  >
                    <circle
                      cx="144"
                      cy="144"
                      r="130"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="144"
                      cy="144"
                      r="130"
                      stroke={currentColor}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 130}
                      strokeDashoffset={2 * Math.PI * 130 * (1 - getProgress())}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.5s" }}
                    />
                  </svg>
                  <div className="flex flex-col items-center z-10">
                    {!isTimeSet ? (
                      <>
                        <div className="text-sm text-gray-500 mb-2">
                          Total study time
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="number"
                            min={1}
                            max={480}
                            value={totalTime}
                            onChange={(e) =>
                              setTotalTime(
                                Math.max(
                                  1,
                                  Math.min(480, Number(e.target.value))
                                )
                              )
                            }
                            className="w-20 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-2xl font-bold"
                          />
                          <span className="text-gray-500">minutes</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {totalSessions} sessions
                        </div>
                      </>
                    ) : (
                      <>
                        <span
                          className="text-5xl font-bold"
                          style={{ color: currentColor }}
                        >
                          {formatTime(timer)}
                        </span>
                        <div className="flex flex-col items-center mt-2">
                          <span className="text-sm text-gray-500">Session</span>
                          <span className="text-lg font-semibold text-gray-700">
                            {currentSession}/{totalSessions}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Studied Time Display */}
                <div className="flex items-center gap-3 bg-white rounded-lg shadow px-4 py-3 mb-8 w-fit mx-auto">
                  <Clock size={28} className="text-[#1f53f3]" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800 mt-1">
                      {formatAccumulatedTime(accumulatedTime)}
                    </div>
                    <div className="text-xs text-gray-500">Completed Time</div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex gap-8 items-center mb-8">
                  <button
                    onClick={handleReset}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-blue-200"
                    style={{ color: currentColor }}
                  >
                    <RotateCcw size={24} />
                  </button>
                  <button
                    onClick={handleStartPause}
                    className="w-16 h-16 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: currentColor, color: "#fff" }}
                  >
                    {isRunning ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                  <button
                    onClick={handleSkipForward}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-blue-200"
                    style={{ color: currentColor }}
                  >
                    <SkipForward size={24} />
                  </button>
                </div>
              </div>
              {/* Task List Section */}
              <div className="w-[400px] flex flex-col gap-6">
                {/* Tabs */}
                <div className="flex gap-4 mb-4">
                  <button className="px-4 py-2 rounded-full bg-[#1f53f3] text-white font-semibold">
                    Today's tasks
                  </button>
                </div>
                {/* Today's tasks list */}
                <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col gap-4 overflow-y-auto max-h-96">
                  <div className="font-bold text-blue-600 mb-2">
                    {format(new Date(todayStr), "dd/MM/yyyy")}
                  </div>
                  {todayTasks.length === 0 && (
                    <div className="text-gray-400 text-sm">
                      No tasks for today
                    </div>
                  )}
                  {todayTasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-150 shadow-sm
                        ${
                          currentTaskId === task.id
                            ? "bg-green-50 border-green-400 ring-2 ring-green-200"
                            : "bg-white border-gray-200 hover:bg-blue-100"
                        }
                      `}
                    >
                      {/* Icon indicator */}
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer
                          ${
                            currentTaskId === task.id
                              ? "bg-green-100"
                              : "bg-blue-100"
                          }
                          hover:scale-110 transition`}
                        onClick={() => handleCompleteTask(task)}
                        title="Mark as completed"
                      >
                        {currentTaskId === task.id ? (
                          <CheckCircle size={28} className="text-green-500" />
                        ) : (
                          <CircleCheckBig size={24} className="text-blue-500" />
                        )}
                      </div>
                      {/* Task content */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          setCurrentTaskId(
                            currentTaskId === task.id ? null : task.id
                          )
                        }
                      >
                        <div className="font-semibold text-gray-800 truncate">
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {task.description || ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Completed tasks */}
                <div className="mt-4 bg-white rounded-xl shadow p-4">
                  <div className="font-bold text-gray-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    Completed Tasks
                  </div>
                  {completedTasks.length === 0 ? (
                    <div className="flex flex-col items-center text-gray-400 text-sm py-6">
                      <CheckCircle className="mb-2" size={32} />
                      No completed tasks
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {completedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-4 py-2 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-500" size={18} />
                            <span className="font-medium text-gray-800">
                              {task.title}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {format(
                              new Date(task.completedAt),
                              "HH:mm:ss dd/MM/yyyy"
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Pomodoro Settings Modal */}
            {showSetting && (
              <PomodoroSetting
                pomodoro={timerSettings["Pomodoro"] / 60}
                breakTime={timerSettings["Break"] / 60}
                onChange={handleSettingChange}
                onSave={handleSaveSettings}
                onClose={handleCloseSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;

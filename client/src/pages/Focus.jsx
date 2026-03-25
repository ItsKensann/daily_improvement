import { useEffect, useState, useRef } from "react";
import { Pause, Play, SkipForward, CheckCircle2, Settings } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import alarmSound1 from "/sounds/alarm_sound_1.wav";
import alarmSound2 from "/sounds/alarm_sound_2.wav";
import alarmSound3 from "/sounds/alarm_sound_3.wav";
import api from "../api/axios";

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const DEFAULT_ALARM_SOUND = alarmSound1;

const alarmSoundMappings = [
  { id: "bell", name: "Bell", link: alarmSound1 },
  { id: "flute", name: "Flute", link: alarmSound2 },
  { id: "chimes", name: "Chimes", link: alarmSound3 },
];

export default function FocusModePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // read the taskId and taskName from the URL
  const queryClient = useQueryClient();

  const taskId = searchParams.get("taskId");
  const taskName = searchParams.get("task") || "Select a task...";

  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
  const [alarmSound, setAlarmSound] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("alarmSound"));
      return saved?.alarmSound ?? DEFAULT_ALARM_SOUND;
    } catch {
      return DEFAULT_ALARM_SOUND;
    }
  });

  const WORK_TIME = workMinutes * 60;
  const BREAK_TIME = breakMinutes * 60;

  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("timerSettings"));
    return saved ? saved.workMinutes * 60 : DEFAULT_WORK_MINUTES * 60;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showTaskSelection, setShowTaskSelection] = useState(!taskId);
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  // Temp state for settings inputs before confirming
  const [draftWork, setDraftWork] = useState(DEFAULT_WORK_MINUTES);
  const [draftBreak, setDraftBreak] = useState(DEFAULT_BREAK_MINUTES);

  const timerIntervalRef = useRef(null);

  // fetches tasks to populate task selection modal
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/api/tasks");
      return res.data;
    },
  });

  // sends POST request when user completes a focus block
  const logSessionMutation = useMutation({
    mutationFn: async ({ linkedTask, durationMinutes }) => {
      await api.post("/api/focus", { linkedTask, durationMinutes });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // mark task as complete
  const completeTaskMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/api/tasks/${id}`, { status: "completed" });
    },
    onSuccess: () => {
      // refetch, update tasks cache
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  // Restore timer from localStorage on mount
  useEffect(() => {
    // At the top of your mount useEffect
    const savedSettings = JSON.parse(localStorage.getItem("timerSettings"));
    if (savedSettings) {
      setWorkMinutes(savedSettings.workMinutes);
      setBreakMinutes(savedSettings.breakMinutes);
      setDraftWork(savedSettings.workMinutes);
      setDraftBreak(savedSettings.breakMinutes);
    }

    const savedTimer = JSON.parse(localStorage.getItem("focusTimer"));
    if (savedTimer && savedTimer.isRunning) {
      const elapsedSeconds = Math.floor(
        (Date.now() - savedTimer.startTime) / 1000,
      );
      const expectedTotal =
        savedTimer.mode === "work"
          ? savedTimer.workMinutes * 60
          : savedTimer.breakMinutes * 60;
      const remaining = expectedTotal - elapsedSeconds;

      if (remaining > 0) {
        setMode(savedTimer.mode);
        setTimeLeft(remaining);
        setWorkMinutes(savedTimer.workMinutes);
        setBreakMinutes(savedTimer.breakMinutes);
        setDraftWork(savedTimer.workMinutes);
        setDraftBreak(savedTimer.breakMinutes);
        setIsRunning(true);
        if (savedTimer.taskId) {
          setSearchParams({
            taskId: savedTimer.taskId,
            task: savedTimer.taskName,
          });
        }
      } else {
        handleTimerComplete(savedTimer.taskId, savedTimer.mode);
      }
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      if (!localStorage.getItem("focusTimer")) {
        localStorage.setItem(
          "focusTimer",
          JSON.stringify({
            startTime: Date.now(),
            taskId,
            taskName,
            mode,
            isRunning: true,
            workMinutes,
            breakMinutes,
          }),
        );
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete(taskId, mode);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
      localStorage.removeItem("focusTimer");
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning, mode, taskId]);

  useEffect(() => {
    localStorage.setItem("alarmSound", JSON.stringify({ alarmSound }));
  }, [alarmSound]);

  const playAlarm = () => {
    const audio = new Audio(alarmSound);
    audio.volume = 0.15;
    audio.play();
  };

  const handleTimerComplete = (activeTaskId, currentMode) => {
    playAlarm();
    setIsRunning(false);
    clearInterval(timerIntervalRef.current);
    localStorage.removeItem("focusTimer");

    if (currentMode === "work" && activeTaskId) {
      logSessionMutation.mutate({
        linkedTask: activeTaskId,
        durationMinutes: workMinutes,
      });
    }

    setMode(currentMode === "work" ? "break" : "work");
    setTimeLeft(currentMode === "work" ? BREAK_TIME : WORK_TIME);
    // Auto-start break, but let user manually start next work session
    if (currentMode === "work") {
      setIsRunning(true);
    }
  };

  const handleSelectTask = (task) => {
    if (isRunning && mode === "work" && taskId) {
      const savedTimer = JSON.parse(localStorage.getItem("focusTimer"));
      const elapsedMinutes = Math.floor(
        (Date.now() - savedTimer.startTime) / 60000,
      );
      if (elapsedMinutes >= 1) {
        logSessionMutation.mutate({
          linkedTask: taskId,
          durationMinutes: elapsedMinutes,
        });
      }
    }

    setSearchParams({ task: task.title, taskId: task._id });
    setShowTaskSelection(false);
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
    setMode("work");
    localStorage.removeItem("focusTimer");
  };

  const handleMarkComplete = () => {
    if (taskId) {
      if (isRunning) {
        const savedTimer = JSON.parse(localStorage.getItem("focusTimer"));
        const elapsedMinutes = Math.floor(
          (Date.now() - savedTimer.startTime) / 60000,
        );
        if (elapsedMinutes >= 1) {
          logSessionMutation.mutate({
            linkedTask: taskId,
            durationMinutes: elapsedMinutes,
          });
        }
      }
      completeTaskMutation.mutate(taskId);
      setIsRunning(false);
      setShowTaskSelection(true);
    }
  };

  const handleSkip = () => {
    playAlarm();
    setIsRunning(false);
    setMode((m) => (m === "work" ? "break" : "work"));
    setTimeLeft(mode === "work" ? BREAK_TIME : WORK_TIME);
    localStorage.removeItem("focusTimer");
  };

  // Open settings: populate drafts with current values
  const handleOpenSettings = () => {
    setDraftWork(workMinutes);
    setDraftBreak(breakMinutes);
    setShowTimerSettings(true);
  };

  const handleSelectAlarmSound = (e) => {
    setAlarmSound(e.target.value);
  };

  // Apply new timer lengths — resets the current timer
  const handleApplySettings = () => {
    const newWork = Math.max(1, Math.min(90, Number(draftWork)));
    const newBreak = Math.max(1, Math.min(30, Number(draftBreak)));
    setWorkMinutes(newWork);
    setBreakMinutes(newBreak);
    setIsRunning(false);
    setMode("work");
    setTimeLeft(newWork * 60);
    localStorage.setItem(
      "timerSettings",
      JSON.stringify({ workMinutes: newWork, breakMinutes: newBreak }),
    );
    localStorage.removeItem("focusTimer");
    setShowTimerSettings(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") navigate("/dashboard");
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate]);

  const isWorkMode = mode === "work";
  const bgColor = isWorkMode ? "bg-[#2b2d2e]" : "bg-[#32363a]";
  const textColor = isWorkMode ? "text-[#d4d4d4]" : "text-[#c8d4a3]";
  const subtleColor = isWorkMode ? "text-[#a0a0a0]" : "text-[#a8b89a]";

  // update tab title to reflect time ticking down
  useEffect(() => {
    const modeLabel = isWorkMode ? "Focus" : "Break";
    document.title = `${formatTime(timeLeft)} - ${modeLabel}`;

    return () => {
      document.title = "Focus - Daily Improvement";
    };
  }, [timeLeft, isWorkMode]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center ${bgColor} transition-colors duration-300`}
    >
      {/* TASK SELECTION MODAL */}
      {showTaskSelection && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#2b2d2e] rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl border border-[#444]">
            <h2 className="font-serif text-lg text-[#d4d4d4] mb-4">
              Select next task
            </h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {tasks.filter((t) => t.status !== "completed").length === 0 ? (
                <p className="text-[#a0a0a0] font-serif">
                  No active tasks found. Go to Dashboard to add some!
                </p>
              ) : (
                tasks
                  .filter((t) => t.status !== "completed")
                  .map((task) => (
                    <button
                      key={task._id}
                      onClick={() => handleSelectTask(task)}
                      className="w-full text-left py-3 px-4 rounded hover:bg-[#3a3d40] transition-colors border border-[#444]"
                    >
                      <p className="font-serif text-[#d4d4d4]">{task.title}</p>
                      <p className="font-serif text-xs text-[#a0a0a0] mt-1">
                        {task.category}
                      </p>
                    </button>
                  ))
              )}
            </div>
            <button
              onClick={() => setShowTaskSelection(false)}
              className="mt-6 text-[#a0a0a0] text-sm font-serif hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TIMER SETTINGS MODAL */}
      {showTimerSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#2b2d2e] rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl border border-[#444]">
            <h2 className="font-serif text-lg text-[#d4d4d4] mb-6">
              Focus Settings
            </h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label className="font-serif text-sm text-[#a0a0a0]">
                  Work (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={draftWork}
                  onChange={(e) => setDraftWork(e.target.value)}
                  className="w-20 bg-[#3a3d40] border border-[#555] rounded px-3 py-1 font-serif text-sm text-[#d4d4d4] text-center focus:outline-none focus:border-[#888]"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-serif text-sm text-[#a0a0a0]">
                  Break (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={draftBreak}
                  onChange={(e) => setDraftBreak(e.target.value)}
                  className="w-20 bg-[#3a3d40] border border-[#555] rounded px-3 py-1 font-serif text-sm text-[#d4d4d4] text-center focus:outline-none focus:border-[#888]"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-serif text-sm text-[#a0a0a0]">
                  Alarm Sound
                </label>
                <select
                  value={alarmSound}
                  onChange={handleSelectAlarmSound}
                  className="w-20 bg-[#3a3d40] border border-[#555] rounded px-3 py-1 font-serif text-sm text-[#d4d4d4] focus:outline-none focus:border-[#888]"
                >
                  {alarmSoundMappings.map((alarm) => (
                    <option key={alarm.id} value={alarm.link}>
                      {alarm.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                {/* <label className="font-serif text-sm text-[#a0a0a0]">
                  Volume
                </label> */}
              </div>
            </div>
            <p className="mt-4 text-xs font-serif text-[#666]">
              Applying will reset the current timer.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowTimerSettings(false)}
                className="text-[#a0a0a0] text-sm font-serif hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplySettings}
                className="px-4 py-2 border border-[#a0a0a0] text-[#a0a0a0] text-sm font-serif rounded hover:border-[#d4d4d4] hover:text-[#d4d4d4] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CENTER CONTENT */}
      <div className="flex flex-col items-center">
        <div
          className={`mb-12 font-serif text-2xl tracking-widest uppercase ${isWorkMode ? "text-[#a0a0a0]" : "text-[#a8b89a]"}`}
        >
          {isWorkMode ? "Focus" : "Break Time"}
        </div>
        <div
          className={`mb-6 font-serif text-[120px] font-thin leading-none tracking-tight ${textColor}`}
        >
          {formatTime(timeLeft)}
        </div>
        <p
          onClick={() => setShowTaskSelection(true)}
          className={`font-serif text-lg ${subtleColor} cursor-pointer hover:opacity-70 transition-opacity`}
        >
          {isWorkMode ? `Working on: ${taskName}` : "Take a breather"}
        </p>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="fixed bottom-32 flex items-center gap-12">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="transition-colors hover:opacity-80"
        >
          {isRunning ? (
            <Pause className={`h-6 w-6 ${subtleColor}`} />
          ) : (
            <Play className={`h-6 w-6 ${subtleColor}`} />
          )}
        </button>

        <button
          onClick={handleOpenSettings}
          className="transition-colors hover:opacity-80"
        >
          <Settings className={`h-6 w-6 ${subtleColor}`} />
        </button>

        <button
          onClick={handleSkip}
          className="transition-colors hover:opacity-80"
        >
          <SkipForward className={`h-6 w-6 ${subtleColor}`} />
        </button>
      </div>

      {/* MARK COMPLETE */}
      {isWorkMode && taskId && (
        <div className="fixed bottom-16 flex items-center gap-6">
          <button
            onClick={handleMarkComplete}
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#a0a0a0] text-[#a0a0a0] hover:border-[#d4d4d4] hover:text-[#d4d4d4] transition-colors"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-serif text-sm">Mark Complete</span>
          </button>
        </div>
      )}

      <div className="fixed bottom-4 font-serif text-xs text-[#666]">
        Press ESC to exit
      </div>
    </div>
  );
}

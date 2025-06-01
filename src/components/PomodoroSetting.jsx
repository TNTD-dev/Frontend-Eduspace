import React from "react";
import { SlidersHorizontal, Timer, Coffee, Save, X } from "lucide-react";

const PomodoroSetting = ({
  pomodoro = 25,
  breakTime = 5,
  onChange,
  onSave,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[320px]">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <SlidersHorizontal size={20} /> Settings Pomodoro
        </h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            <span className="flex items-center gap-2">
              <Timer className="text-blue-500" size={18} />
              Pomodoro (minutes)
            </span>
            <input
              type="number"
              min={1}
              max={60}
              value={pomodoro}
              onChange={(e) => onChange && onChange("pomodoro", e.target.value)}
              onWheel={(e) => {
                e.preventDefault();
                const currentValue = Number(pomodoro);
                const newValue = Math.min(
                  60,
                  Math.max(1, currentValue + (e.deltaY < 0 ? 1 : -1))
                );
                onChange && onChange("pomodoro", newValue);
              }}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-700">
            <span className="flex items-center gap-2">
              <Coffee className="text-yellow-500" size={18} />
              Break (minutes)
            </span>
            <input
              type="number"
              min={1}
              max={30}
              value={breakTime}
              onChange={(e) => onChange && onChange("break", e.target.value)}
              onWheel={(e) => {
                e.preventDefault();
                const currentValue = Number(breakTime);
                const newValue = Math.min(
                  30,
                  Math.max(1, currentValue + (e.deltaY < 0 ? 1 : -1))
                );
                onChange && onChange("break", newValue);
              }}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-2"
            onClick={onClose}
          >
            <X size={16} /> Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center gap-2"
            onClick={onSave}
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroSetting;

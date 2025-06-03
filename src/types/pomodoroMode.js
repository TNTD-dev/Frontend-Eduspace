/**
 * @typedef {'Pomodoro' | 'Short break' | 'Long break'} TimerMode
 * Các chế độ của Pomodoro timer
 */

/**
 * @typedef {Object} PomodoroModeProps
 * @property {TimerMode} mode - The current mode of the pomodoro timer
 * @property {number} time - The current time of the pomodoro timer
 * @property {number} progress - The progress of the pomodoro timer
 * @property {boolean} isRunning - Whether the pomodoro timer is running
 * @property {boolean} isPaused - Whether the pomodoro timer is paused
 * @property {boolean} isStopped - Whether the pomodoro timer is stopped
 */
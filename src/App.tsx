import React, { useState, useEffect, useRef } from 'react';
import { Sun } from 'lucide-react';
import prayerTimes from './prayerTimes';

function App() {
  // State definitions (times, offsets, edit mode, etc.)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOffsets, setTimeOffsets] = useState({
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
    sunrise: 0,
  });
  const [fajrTime, setFajrTime] = useState('');
  const [DhuhrTime, setDhuhrTime] = useState('');
  const [asrTime, setAsrTime] = useState('');
  const [maghribTime, setMaghribTime] = useState('');
  const [ishaTime, setIshaTime] = useState('');
  const [sunriseTime, setSunriseTime] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');
  const [timeToNextPrayer, setTimeToNextPrayer] = useState('');
  const [editMode, setEditMode] = useState(false);

  // States for auto-hiding control buttons
  const [showEditButton, setShowEditButton] = useState(true);
  const [showFullscreenButton, setShowFullscreenButton] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Refs to hold timeout IDs
  const editButtonTimerRef = useRef(null);
  const fullscreenButtonTimerRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load today's prayer times
  useEffect(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    const times = prayerTimes[dateKey];
    if (times) {
      setFajrTime(times.fajr);
      setDhuhrTime(times.dhuhr);
      setAsrTime(times.asr);
      setMaghribTime(times.maghrib);
      setIshaTime(times.isha);
      setSunriseTime(times.sunrise);
    } else {
      setFajrTime('Loading...');
      setDhuhrTime('Loading...');
      setAsrTime('Loading...');
      setMaghribTime('Loading...');
      setIshaTime('Loading...');
      setSunriseTime('Loading...');
    }
  }, [currentTime]);

  // Parse "HH:mm" string with an offset (in minutes) into a Date object
  function parseTimeWithOffset(timeString, offsetMinutes) {
    if (!timeString || timeString === 'Loading...') return null;
    const [hourStr, minuteStr] = timeString.split(':');
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const dateObj = new Date(`${dateStr}T00:00:00`);
    dateObj.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10), 0, 0);
    dateObj.setMinutes(dateObj.getMinutes() + offsetMinutes);
    return dateObj;
  }

  // Format a Date object to a time string
  function formatTime(dateObj) {
    if (!dateObj) return '...';
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Calculate the next prayer every minute
  useEffect(() => {
    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [fajrTime, DhuhrTime, asrTime, maghribTime, ishaTime, timeOffsets]);

  function calculateNextPrayer() {
    if (
      !fajrTime ||
      !DhuhrTime ||
      !asrTime ||
      !maghribTime ||
      !ishaTime ||
      fajrTime === 'Loading...'
    ) {
      return;
    }
    const now = new Date();
    const prayers = [
      { name: 'Fajr', date: parseTimeWithOffset(fajrTime, timeOffsets.fajr) },
      { name: 'Dhuhr', date: parseTimeWithOffset(DhuhrTime, timeOffsets.dhuhr) },
      { name: 'Asr', date: parseTimeWithOffset(asrTime, timeOffsets.asr) },
      { name: 'Maghrib', date: parseTimeWithOffset(maghribTime, timeOffsets.maghrib) },
      { name: 'Isha', date: parseTimeWithOffset(ishaTime, timeOffsets.isha) },
    ];
    const upcoming = prayers.find(prayer => prayer.date > now) || prayers[0];
    setNextPrayer(upcoming.name);
    setTimeToNextPrayer(formatTime(upcoming.date));
  }

  // Returns adjusted and formatted time for a prayer
  function getAdjustedTime(prayerName, rawTime) {
    return formatTime(parseTimeWithOffset(rawTime, timeOffsets[prayerName]));
  }

  // Update offset for a prayer by a given delta (in minutes)
  function handleOffsetChange(prayerName, delta) {
    setTimeOffsets(prev => ({
      ...prev,
      [prayerName]: prev[prayerName] + delta,
    }));
  }

  // Toggle full screen mode using the Fullscreen API
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch((err) => {
        console.error(err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  // Reset timer for auto-hiding the edit button
  const resetEditButtonTimer = () => {
    setShowEditButton(true);
    if (editButtonTimerRef.current) clearTimeout(editButtonTimerRef.current);
    editButtonTimerRef.current = setTimeout(() => {
      setShowEditButton(false);
    }, 3000);
  };

  // Reset timer for auto-hiding the full screen toggle button
  const resetFullscreenButtonTimer = () => {
    setShowFullscreenButton(true);
    if (fullscreenButtonTimerRef.current) clearTimeout(fullscreenButtonTimerRef.current);
    fullscreenButtonTimerRef.current = setTimeout(() => {
      setShowFullscreenButton(false);
    }, 3000);
  };

  // Initialize timers on mount and clean up on unmount
  useEffect(() => {
    resetEditButtonTimer();
    resetFullscreenButtonTimer();
    return () => {
      if (editButtonTimerRef.current) clearTimeout(editButtonTimerRef.current);
      if (fullscreenButtonTimerRef.current) clearTimeout(fullscreenButtonTimerRef.current);
    };
  }, []);

  const prayerTimesDisplay = {
    Fajr: {
      key: 'fajr',
      time: fajrTime,
      arabic: 'فجر',
      icon: <Sun className="w-8 h-8 text-islamic-secondary animate-pulse-slow" />,
    },
    Dhuhr: {
      key: 'dhuhr',
      time: DhuhrTime,
      arabic: 'ظہر',
      icon: <Sun className="w-8 h-8 text-islamic-secondary animate-pulse-slow" />,
    },
    Asr: {
      key: 'asr',
      time: asrTime,
      arabic: 'عصر',
      icon: <Sun className="w-8 h-8 text-islamic-secondary animate-pulse-slow" />,
    },
    Maghrib: {
      key: 'maghrib',
      time: maghribTime,
      arabic: 'مغرب',
      icon: <Sun className="w-8 h-8 text-islamic-secondary animate-pulse-slow" />,
    },
    Isha: {
      key: 'isha',
      time: ishaTime,
      arabic: 'عشاء',
      icon: <Sun className="w-8 h-8 text-islamic-secondary animate-pulse-slow" />,
    },
  };

  const urduNextPrayerName = (() => {
    switch (nextPrayer) {
      case 'Fajr':
        return 'فجر';
      case 'Dhuhr':
        return 'ظہر';
      case 'Asr':
        return 'عصر';
      case 'Maghrib':
        return 'مغرب';
      case 'Isha':
        return 'عشاء';
      default:
        return '';
    }
  })();

  return (
    // Outer fixed-size container (1440px x 900px)
    <div
      style={{ width: '1800px', height: '900px', margin: '0 auto', position: 'relative' }}
      className="bg-islamic-primary bg-pattern p-6 border-8 border-islamic-secondary"
      onMouseMove={() => {
        resetEditButtonTimer();
        resetFullscreenButtonTimer();
      }}
    >
      {/* Full Screen Toggle Button */}
      {showFullscreenButton && (
        <button
          onClick={toggleFullScreen}
          className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md z-50"
        >
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      )}

      {/* Main Content Container using fixed widths for left and right columns */}
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* Left Column (fixed 960px width) */}
        <div style={{ width: '960px' }} className="space-y-8">
          {/* Header */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="gradient-border bg-white rounded-3xl h-64 flex items-center justify-center">
              <div className="flex flex-col space-y-4 text-center">
                <div>
                  <p style={{ color: 'green' }} className="text-2xl font-bold text-islamic-light font-arabic">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p style={{ color: 'black', fontFamily: 'Verdana, sans-serif' }} className="text-lg text-islamic-dark">
                    {currentTime.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'green' }} className="text-2xl font-bold text-islamic-light font-arabic">
                    15 رمضان
                  </p>
                  <p style={{ fontFamily: 'Verdana, sans-serif' }}>1445</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-3xl h-64 flex items-center justify-center">
              <p
                style={{ color: 'green' }}
                className="text-8xl font-bold text-islamic-secondary font-arabic"
              >
                {currentTime
                  .toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                  })
                  .replace(/( AM| PM)$/, '')}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Top Row: Iftiyaar, Next Prayer, and Sehri */}
            <div className="flex items-center justify-between gap-8">
              {/* Iftiyaar (Maghrib time) */}
              <div className="circular-card transform hover:scale-105 transition-all duration-500">
                <div className="circular-card-inner p-4">
                  <p style={{ marginBottom: '15px' }} className="text-3xl font-bold text-islamic-dark font-arabic">
                    <span style={{ color: 'green' }}>افطار</span>
                  </p>
                  <p className="text-3xl font-bold text-islamic-secondary font-arabic">
                    {getAdjustedTime('maghrib', maghribTime)}
                  </p>
                </div>
              </div>

              {/* Next Prayer */}
              <div className="gradient-border" style={{ flex: 1 }}>
                <div className="glass-effect prayer-card-glow rounded-2xl p-8 bg-gradient-radial from-islamic-tertiary/40 to-transparent">
                  <h2 style={{ color: 'green' }} className="text-2xl font-bold text-center text-islamic-light font-arabic mb-6">
                    Next Prayer
                  </h2>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-4">
                      <p className="text-4xl font-black text-islamic-light">
                        {nextPrayer || '...'}
                      </p>
                      <p className="text-5xl font-black text-islamic-light">
                        <span style={{ fontFamily: '"Courier New", monospace', color: 'green' }}>
                          {urduNextPrayerName || '...'}
                        </span>
                      </p>
                    </div>
                    <p className="text-6xl font-black text-islamic-secondary font-arabic animate-pulse-slow">
                      {timeToNextPrayer || 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sehri (Fajr time) */}
              <div className="circular-card transform hover:scale-105 transition-all duration-500">
                <div className="circular-card-inner p-4">
                  <p style={{ marginBottom: '15px' }} className="text-3xl font-bold text-islamic-dark font-arabic">
                    <span style={{ color: 'green' }}>ختم سحری</span>
                  </p>
                  <p className="text-3xl font-bold text-islamic-secondary font-arabic">
                    {getAdjustedTime('fajr', fajrTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Hadith & Verse */}
            <div className="grid grid-cols-2 gap-8">
              <div className="gradient-border">
                <div className="glass-effect card-glow rounded-2xl p-8">
                  <h3 style={{ color: 'green' }} className="text-2xl font-bold text-islamic-light font-arabic mb-4 text-center">
                    Hadith of the Day
                  </h3>
                  <p style={{ color: 'black' }} className="text-xl text-islamic-secondary mb-4 font-arabic text-center">
                    عن أبي هريرة رضي الله عنه
                  </p>
                  <p className="text-lg text-islamic-dark font-arabic">
                    The best charity is that which is given when one is in need and struggling.
                  </p>
                </div>
              </div>
              <div className="gradient-border">
                <div className="glass-effect card-glow rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-islamic-light font-arabic mb-4 text-center">
                    Verse of the Day
                  </h3>
                  <p style={{ color: 'green' }} className="text-xl text-islamic-secondary mb-4 font-arabic text-center">
                    وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ
                  </p>
                  <p className="text-lg text-islamic-dark font-arabic">
                    "And when My servants ask you concerning Me, indeed I am near." (2:186)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (fixed 480px width) */}
        <div style={{ width: '480px' }} className="pl-8">
          <div className="gradient-border">
            <div className="glass-effect card-glow rounded-2xl p-8 relative">
              {showEditButton && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="absolute right-4 top-4 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  {editMode ? 'Close Edit' : 'Edit Times'}
                </button>
              )}
              <h2 style={{ color: 'green' }} className="text-3xl text-center font-bold text-islamic-light font-arabic mb-8">
                Prayer Times
              </h2>
              {Object.entries(prayerTimesDisplay).map(([prayer, data]) => {
                const { key, time, arabic } = data;
                return (
                  <div key={prayer} className="gradient-border mb-6 prayer-card-glow">
                    <div className="grid grid-cols-3 items-center p-6 rounded-xl bg-gradient-to-r from-islamic-tertiary/40 to-transparent">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-xl font-arabic text-islamic-light">
                          {prayer}
                        </span>
                      </div>
                      <span style={{ color: 'green' }} className="font-bold text-2xl text-center font-arabic text-islamic-secondary">
                        {getAdjustedTime(key, time)}
                      </span>
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-2xl font-arabic">{arabic}</span>
                        {editMode && (
                          <div className="ml-4 flex space-x-2">
                            <button
                              onClick={() => handleOffsetChange(key, 1)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleOffsetChange(key, -1)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              -1
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sunrise Time Card */}
          <div className="mt-4 gradient-border mb-6 prayer-card-glow">
            <div className="grid grid-cols-3 items-center p-6 rounded-xl bg-gradient-to-r from-islamic-tertiary/40 to-transparent">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-xl font-arabic text-islamic-light">
                  Sunrise
                </span>
              </div>
              <span style={{ color: 'coral' }} className="font-bold text-2xl text-center font-arabic text-islamic-secondary">
                {getAdjustedTime('sunrise', sunriseTime)}
              </span>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-2xl font-arabic">طلوع آفتاب</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Name Plate Card */}
      <div className="mt-8">
        <div className="gradient-border">
          <div className="glass-effect card-glow rounded-2xl p-4 text-center">
            <h1 style={{ color: 'green' }} className="text-4xl font-bold text-islamic-light font-arabic">
              مسجد شریف توحید پورہ کلارووس کشمیر
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

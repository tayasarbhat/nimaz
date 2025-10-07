import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Palette, Settings, Maximize, X } from 'lucide-react';
import prayerTimes from './prayerTimes';
import { themes, getThemeById, Theme } from './themes';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
  const [showEditButton, setShowEditButton] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [prevSeconds, setPrevSeconds] = useState<number>(new Date().getSeconds());
  const [secondsKey, setSecondsKey] = useState(0);

  const editButtonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const themeSelectorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const menuTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      const newSeconds = newTime.getSeconds();
      if (newSeconds !== prevSeconds) {
        setPrevSeconds(newSeconds);
        setSecondsKey(prev => prev + 1);
      }
      setCurrentTime(newTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [prevSeconds]);

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
    }
  }, [currentTime]);

  function parseTimeWithOffset(timeString: string, offsetMinutes: number) {
    if (!timeString || timeString === 'Loading...') return null;
    const [hourStr, minuteStr] = timeString.split(':');
    const dateStr = new Date().toISOString().split('T')[0];
    const dateObj = new Date(`${dateStr}T00:00:00`);
    dateObj.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10), 0, 0);
    dateObj.setMinutes(dateObj.getMinutes() + offsetMinutes);
    return dateObj;
  }

  function formatTime(dateObj: Date | null) {
    if (!dateObj) return '...';
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).replace(/\s?(AM|PM)$/i, '');
  }

  function getIslamicDate() {
    const gregorianDate = new Date();
    
    // Islamic calendar epoch (July 16, 622 CE)
    const islamicEpoch = new Date(622, 6, 16); // Month is 0-indexed, so 6 = July
    
    // Calculate days since Islamic epoch
    const daysSinceEpoch = Math.floor((gregorianDate.getTime() - islamicEpoch.getTime()) / (1000 * 60 * 60 * 24));
    
    // Islamic year length (average)
    const islamicYearLength = 354.37;
    
    // Calculate Islamic year and remaining days
    const islamicYear = Math.floor(daysSinceEpoch / islamicYearLength) + 1;
    const remainingDays = daysSinceEpoch % islamicYearLength;
    
    // Islamic months (in order)
    const islamicMonths = [
      'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی القعدہ', 'ذی الحجہ'
    ];
    
    // Calculate which month we're in (simplified)
    const daysPerMonth = 29.5; // Average days per Islamic month
    const monthIndex = Math.floor(remainingDays / daysPerMonth);
    const day = Math.floor(remainingDays % daysPerMonth) + 1;
    
    const monthName = islamicMonths[monthIndex] || islamicMonths[0];
    
    return `${Math.floor(day)} ${monthName} ${islamicYear}`;
  }

  useEffect(() => {
    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 1000);
    return () => clearInterval(interval);
  }, [fajrTime, DhuhrTime, asrTime, maghribTime, ishaTime, timeOffsets]);

  function calculateNextPrayer() {
    if (!fajrTime || !DhuhrTime || !asrTime || !maghribTime || !ishaTime || fajrTime === 'Loading...') {
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
    
    // Find the next prayer
    let upcoming = prayers.find(prayer => prayer.date && prayer.date > now);
    
    // If no prayer found for today, get tomorrow's Fajr
    if (!upcoming) {
      upcoming = prayers[0];
      // Add 24 hours to tomorrow's Fajr time
      if (upcoming.date) {
        upcoming.date = new Date(upcoming.date.getTime() + 24 * 60 * 60 * 1000);
      }
    }
    
    setNextPrayer(upcoming.name);
    
    // Calculate time remaining in HH:MM:SS format
    if (upcoming.date) {
      const timeDiffMs = upcoming.date.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeToNextPrayer(formattedTime);
    }
  }

  function getAdjustedTime(prayerName: keyof typeof timeOffsets, rawTime: string) {
    return formatTime(parseTimeWithOffset(rawTime, timeOffsets[prayerName]));
  }

  function handleOffsetChange(prayerName: keyof typeof timeOffsets, delta: number) {
    setTimeOffsets(prev => ({
      ...prev,
      [prayerName]: prev[prayerName] + delta,
    }));
  }

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

  const resetEditButtonTimer = () => {
    setShowEditButton(true);
    if (editButtonTimerRef.current) clearTimeout(editButtonTimerRef.current);
    editButtonTimerRef.current = setTimeout(() => {
      setShowEditButton(false);
    }, 3000);
  };

  const resetThemeSelectorTimer = () => {
    setShowThemeSelector(true);
    if (themeSelectorTimerRef.current) clearTimeout(themeSelectorTimerRef.current);
    themeSelectorTimerRef.current = setTimeout(() => {
      setShowThemeSelector(false);
    }, 5000);
  };

  const resetMenuTimer = () => {
    setShowMenu(true);
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 3000);
  };

  useEffect(() => {
    resetEditButtonTimer();
    resetThemeSelectorTimer();
    resetMenuTimer();
    return () => {
      if (editButtonTimerRef.current) clearTimeout(editButtonTimerRef.current);
      if (themeSelectorTimerRef.current) clearTimeout(themeSelectorTimerRef.current);
      if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    };
  }, []);

  const prayerTimesDisplay = [
    { name: 'Fajr', key: 'fajr' as const, time: fajrTime, arabic: 'فجر', icon: <Moon className="w-6 h-6" /> },
    { name: 'Dhuhr', key: 'dhuhr' as const, time: DhuhrTime, arabic: 'ظہر', icon: <Sun className="w-6 h-6" /> },
    { name: 'Asr', key: 'asr' as const, time: asrTime, arabic: 'عصر', icon: <Sun className="w-6 h-6" /> },
    { name: 'Maghrib', key: 'maghrib' as const, time: maghribTime, arabic: 'مغرب', icon: <Moon className="w-6 h-6" /> },
    { name: 'Isha', key: 'isha' as const, time: ishaTime, arabic: 'عشاء', icon: <Moon className="w-6 h-6" /> },
  ];

  const urduNextPrayerName = {
    'Fajr': 'فجر',
    'Dhuhr': 'ظہر',
    'Asr': 'عصر',
    'Maghrib': 'مغرب',
    'Isha': 'عشاء',
  }[nextPrayer] || '';

  const themeAnimations: { [key: string]: string } = {
    'alhambra': 'animate-desert-pulse',
    'bluemosque': 'animate-ocean-bounce',
    'mecca': 'animate-midnight-glow',
    'moroccan': 'animate-forest-slide',
    'desert': 'animate-desert-pulse',
    'andalusia': 'animate-lavender-float',
    'ottoman': 'animate-rose-flip',
    'persian': 'animate-ocean-bounce',
    'cairo': 'animate-sunset-fade',
    'madinah': 'animate-emerald-spin',
  };

  const containerStyle = {
    background: `linear-gradient(135deg, ${currentTheme.colors.gradient1}, ${currentTheme.colors.gradient2})`,
    backgroundImage: currentTheme.pattern,
    backgroundBlendMode: 'overlay',
  };

  const cardStyle = {
    background: currentTheme.colors.cardBg,
    borderColor: currentTheme.colors.cardBorder,
    borderWidth: '2px',
  };

  return (
    <div
      className="min-h-screen w-full pt-8 pb-4 px-4 md:pt-10 md:pb-6 md:px-6 lg:pt-12 lg:pb-8 lg:px-8 transition-all duration-500"
      style={containerStyle}
      onMouseMove={() => {
        resetEditButtonTimer();
        resetThemeSelectorTimer();
      }}
    >
      {/* Menu Trigger Area - Top Right Corner */}
      <div 
        className="fixed top-0 right-0 w-20 h-20 z-40"
        onMouseEnter={() => resetMenuTimer()}
        onMouseLeave={() => {
          if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
          menuTimerRef.current = setTimeout(() => {
            setShowMenu(false);
          }, 3000);
        }}
      />

      {showMenu && (
        <div 
          className="fixed top-4 right-4 z-50 animate-fade-in"
          onMouseEnter={() => resetMenuTimer()}
          onMouseLeave={() => resetMenuTimer()}
        >
          <div className="glass-effect rounded-2xl p-4 shadow-xl backdrop-blur-md"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.95)',
                 border: `2px solid ${currentTheme.colors.cardBorder}`
               }}>
            
            {/* Main Menu Button */}
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all mb-3 w-full"
              style={{
                background: currentTheme.colors.secondary,
                color: currentTheme.colors.text
              }}
            >
              <Palette className="w-5 h-5" />
              <span>Themes</span>
            </button>

            {/* Edit Times Button */}
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all mb-3 w-full"
              style={{
                background: editMode ? '#EF4444' : currentTheme.colors.accent,
                color: editMode ? '#FFFFFF' : '#000000'
              }}
            >
              <Settings className="w-5 h-5" />
              <span>{editMode ? 'Close Edit' : 'Edit Times'}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullScreen}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all w-full"
              style={{
                background: isFullScreen ? '#EF4444' : currentTheme.colors.secondary,
                color: isFullScreen ? '#FFFFFF' : currentTheme.colors.text
              }}
            >
              <Maximize className="w-5 h-5" />
              <span>{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            {/* Theme Selector Dropdown */}
            {showThemeSelector && (
              <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-lg shadow-lg"
                   style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme);
                      setShowThemeSelector(false);
                    }}
                    className="theme-button p-2 rounded-lg text-left transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.gradient1}, ${theme.colors.gradient2})`,
                      border: currentTheme.id === theme.id ? '2px solid' : '1px solid transparent',
                      borderColor: currentTheme.id === theme.id ? theme.colors.secondary : 'transparent',
                    }}
                  >
                    <div className="text-xs font-bold text-white mb-1">{theme.name}</div>
                    <div className="text-xs font-arabic text-white opacity-90">{theme.nameArabic}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-[95vw] 2xl:max-w-[90vw] mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-effect rounded-3xl p-4 sm:p-6 shadow-xl transition-all hover:scale-105" style={cardStyle}>
                <div className="text-center space-y-2 sm:space-y-4">
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold font-arabic" style={{ color: currentTheme.colors.secondary }}>
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold font-arabic" style={{ color: currentTheme.colors.secondary }}>
                    {getIslamicDate()}
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl" style={{ color: '#000000' }}>
                    {currentTime.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="glass-effect rounded-3xl p-4 sm:p-6 shadow-xl flex items-center justify-center transition-all hover:scale-105" style={cardStyle}>
                <div className="flex items-baseline gap-2 md:gap-3">
                  <p className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold font-arabic" style={{ color: currentTheme.colors.secondary }}>
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    }).replace(/\s?(AM|PM)$/i, '')}
                  </p>
                  <div className="flex flex-col items-start gap-1">
                    <span
                      key={secondsKey}
                      className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold font-arabic ${themeAnimations[currentTheme.id] || 'animate-pulse'}`}
                      style={{ color: currentTheme.colors.accent }}
                    >
                      {currentTime.getSeconds().toString().padStart(2, '0')}
                    </span>
                    <span className="text-sm md:text-lg font-bold" style={{ color: currentTheme.colors.secondary }}>
                      {currentTime.toLocaleTimeString('en-US', {
                        hour12: true,
                      }).match(/\s?(AM|PM)$/i)?.[0].trim()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="glass-effect rounded-full w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 shadow-lg transition-all hover:scale-105 group flex flex-col items-center justify-center" style={cardStyle}>
                <div className="mx-auto mb-2 sm:mb-3">
                  <Sun className="w-5 h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 animate-pulse-slow" style={{ color: currentTheme.colors.accent }} />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold" style={{ color: currentTheme.colors.secondary }}>
                      Sunrise
                    </h3>
                    <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-arabic" style={{ color: '#000000' }}>
                      طلوع
                    </span>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-black font-arabic" style={{ color: currentTheme.colors.accent }}>
                    {getAdjustedTime('sunrise', sunriseTime)}
                  </p>
                </div>
              </div>

              <div className="glass-effect rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl transition-all flex-1 max-w-md xl:max-w-2xl" style={cardStyle}>
                <h2 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center font-arabic mb-3 sm:mb-5 whitespace-nowrap" style={{ color: currentTheme.colors.secondary }}>
                  Next Prayer - الصلاة القادمة
                </h2>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-4">
                    <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black" style={{ color: '#000000' }}>
                      {nextPrayer || '...'}
                    </p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black font-arabic" style={{ color: currentTheme.colors.secondary }}>
                      {urduNextPrayerName || '...'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black font-arabic mb-2" style={{ color: currentTheme.colors.accent }}>
                      {getAdjustedTime(nextPrayer.toLowerCase() as keyof typeof timeOffsets, 
                        nextPrayer === 'Fajr' ? fajrTime :
                        nextPrayer === 'Dhuhr' ? DhuhrTime :
                        nextPrayer === 'Asr' ? asrTime :
                        nextPrayer === 'Maghrib' ? maghribTime :
                        nextPrayer === 'Isha' ? ishaTime : '')}
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-black font-arabic animate-pulse-slow" style={{ color: currentTheme.colors.secondary }}>
                      {timeToNextPrayer || 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-full w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 shadow-lg transition-all hover:scale-105 group flex flex-col items-center justify-center" style={cardStyle}>
                <div className="mx-auto mb-2 sm:mb-3">
                  <Moon className="w-5 h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 animate-pulse-slow" style={{ color: currentTheme.colors.secondary }} />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-1">
                    <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold" style={{ color: currentTheme.colors.secondary }}>
                      Sunset
                    </h3>
                    <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-arabic" style={{ color: '#000000' }}>
                      غروب
                    </span>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-black font-arabic" style={{ color: currentTheme.colors.secondary }}>
                    {getAdjustedTime('maghrib', maghribTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="glass-effect rounded-3xl p-4 sm:p-6 shadow-xl transition-all hover:scale-105" style={cardStyle}>
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center font-arabic mb-3 sm:mb-4" style={{ color: currentTheme.colors.secondary }}>
                  Hadith of the Day
                </h3>
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-arabic text-center mb-2 sm:mb-3" style={{ color: '#000000' }}>
                  عن أبي هريرة رضي الله عنه
                </p>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-center" style={{ color: '#000000' }}>
                  The best charity is that which is given when one is in need and struggling.
                </p>
              </div>
              <div className="glass-effect rounded-3xl p-4 sm:p-6 shadow-xl transition-all hover:scale-105" style={cardStyle}>
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center font-arabic mb-3 sm:mb-4" style={{ color: currentTheme.colors.secondary }}>
                  Verse of the Day
                </h3>
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-arabic text-center mb-2 sm:mb-3" style={{ color: currentTheme.colors.secondary }}>
                  وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ
                </p>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-center" style={{ color: '#000000' }}>
                  And when My servants ask you concerning Me, indeed I am near. (2:186)
                </p>
              </div>
            </div>

           
             
           
          </div>

          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="dome-arch-container glass-effect rounded-3xl p-3 sm:p-4 lg:p-6 shadow-xl transition-all floral-pattern" style={{
              ...cardStyle,
              border: `4px solid ${currentTheme.colors.cardBorder}`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.3)`,
            }}>
              <div className="dome-arch-border" style={{ color: currentTheme.colors.secondary }}></div>
              <div className="decorative-corner decorative-corner-tl" style={{ color: currentTheme.colors.accent }}></div>
              <div className="decorative-corner decorative-corner-tr" style={{ color: currentTheme.colors.accent }}></div>
              <div className="decorative-corner decorative-corner-bl" style={{ color: currentTheme.colors.accent }}></div>
              <div className="decorative-corner decorative-corner-br" style={{ color: currentTheme.colors.accent }}></div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-center font-bold font-arabic mb-3 sm:mb-4 relative z-10" style={{ color: currentTheme.colors.secondary }}>
                Prayer Times - أوقات الصلاة
              </h2>
              <div className="flex flex-col items-center space-y-2 max-w-2xl mx-auto">
                {prayerTimesDisplay.map(({ name, key, time, arabic, icon }) => (
                  <div
                    key={name}
                    className="glass-effect rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg transition-all hover:scale-105 w-full relative"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: `3px solid ${currentTheme.colors.cardBorder}`,
                      borderLeft: `6px solid ${currentTheme.colors.accent}`,
                    }}
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-[100px] sm:min-w-[140px]">
                        <span className="text-base sm:text-lg lg:text-xl xl:text-2xl" style={{ color: currentTheme.colors.secondary }}>{icon}</span>
                        <span className="font-bold text-sm sm:text-base lg:text-lg xl:text-xl" style={{ color: '#000000' }}>
                          {name}
                        </span>
                      </div>
                      <span className="font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-arabic text-center flex-1" style={{ color: currentTheme.colors.secondary }}>
                        {getAdjustedTime(key, time)}
                      </span>
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-arabic min-w-[70px] sm:min-w-[100px] text-right" style={{ color: '#000000' }}>
                        {arabic}
                      </span>
                    </div>
                    {editMode && (
                      <div className="flex gap-2 mt-3 justify-center">
                        <button
                          onClick={() => handleOffsetChange(key, 1)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleOffsetChange(key, -1)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                        >
                          -1
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        <div className="mt-4 sm:mt-6 glass-effect rounded-3xl p-3 sm:p-4 lg:p-6 shadow-xl text-center transition-all" style={cardStyle}>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold font-arabic" style={{ color: currentTheme.colors.secondary }}>
            مسجد شریف توحید پورہ کلارووس کشمیر
          </h1>

        </div>
      </div>
    </div>
  );
}

export default App;

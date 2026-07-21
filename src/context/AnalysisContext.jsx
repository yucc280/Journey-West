import { createContext, useContext, useMemo, useState } from 'react';

const AnalysisContext = createContext(null);

const initialState = {
  chapterRange: [1, 100],
  selectedCharacter: null,
  selectedLocation: null,
  selectedEvent: null,
};

export function AnalysisProvider({ children }) {
  const [chapterRange, setChapterRange] = useState(initialState.chapterRange);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const resetFilters = () => {
    setChapterRange(initialState.chapterRange);
    setSelectedCharacter(null);
    setSelectedLocation(null);
    setSelectedEvent(null);
  };

  const value = useMemo(
    () => ({
      chapterRange,
      setChapterRange,
      selectedCharacter,
      setSelectedCharacter,
      selectedLocation,
      setSelectedLocation,
      selectedEvent,
      setSelectedEvent,
      resetFilters,
    }),
    [chapterRange, selectedCharacter, selectedLocation, selectedEvent],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error('useAnalysis must be used inside AnalysisProvider');
  return context;
}

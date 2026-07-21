import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import OverviewPage from './pages/OverviewPage';
import MapPage from './pages/MapPage';
import EventsPage from './pages/EventsPage';
import CharactersPage from './pages/CharactersPage';
import TextAnalysisPage from './pages/TextAnalysisPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/text" element={<TextAnalysisPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

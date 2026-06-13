import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PyodideProvider } from './lib/pyodide-context';
import { AppProvider } from './lib/app-context';
import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { LessonPage } from './pages/LessonPage';
import { EditorPage } from './pages/EditorPage';
import { WrongBookPage } from './pages/WrongBookPage';
import { ExamPage } from './pages/ExamPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <PyodideProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/wrongbook" element={<WrongBookPage />} />
              <Route path="/exam" element={<ExamPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </HashRouter>
      </PyodideProvider>
    </AppProvider>
  );
}

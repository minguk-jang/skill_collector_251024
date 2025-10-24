import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FormPage from './pages/FormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="skill/:id" element={<DetailPage />} />
          <Route path="new" element={<FormPage />} />
          <Route path="edit/:id" element={<FormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ModeratorDashboard from './components/ModeratorDashboard';
import PostDetail from './components/PostDetail';
import PostList from './components/PostList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-600">
              Smart Alec 💬
            </h1>
            <p className="text-sm text-gray-600">
              AI-Powered Comment Moderation
            </p>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/moderator" element={<ModeratorDashboard />} />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
            Built by Hank McGill for Civitos!
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
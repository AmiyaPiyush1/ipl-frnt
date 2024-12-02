import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import Dashboard from './dashboard';
import Team_choose from './team_choose';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/team_choose" element={<Team_choose />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";

function App() {
  return <>
  <Router>
    <Routes>
      <Route path="/sales" element={<Sales/>}/>
      <Route path="/purchases" element={<Purchases/>}/>
      <Route path="*" element={<Navigate to="/sales" />} />
    </Routes>
  </Router>
  </>;
}

export default App;

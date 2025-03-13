import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StaffPortal from './pages/StaffPortal';
import About from './pages/About';
import Gallery from './pages/Gallery';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        <Route element={<PrivateRoute allowedRoles={['staff', 'admin']} />}>
                            <Route path="/staff-portal" element={<StaffPortal />} />
                        </Route>
                    </Routes>
                </main>
                <footer className="bg-dark text-light text-center py-3">
                    <Container>
                        <p className="mb-0">&copy; 2024 Catering Service. All rights reserved.</p>
                    </Container>
                </footer>
            </div>
        </Router>
    );
}

export default App;

import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/authSlice';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-logo">
                    <i className="fas fa-utensils me-2"></i>
                    Catering Service
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="nav-link-custom">About</Nav.Link>
                        <Nav.Link as={Link} to="/gallery" className="nav-link-custom">Gallery</Nav.Link>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard" className="nav-link-custom">Dashboard</Nav.Link>
                                {(user.role === 'staff' || user.role === 'admin') && (
                                    <Nav.Link as={Link} to="/staff" className="nav-link-custom">Staff Portal</Nav.Link>
                                )}
                                <Button variant="outline-light" className="logout-btn ms-2" onClick={onLogout}>
                                    <i className="fas fa-sign-out-alt me-1"></i>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button as={Link} to="/login" variant="outline-light" className="auth-btn ms-2">
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Login
                                </Button>
                                <Button as={Link} to="/register" variant="light" className="auth-btn ms-2">
                                    <i className="fas fa-user-plus me-1"></i>
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header; 
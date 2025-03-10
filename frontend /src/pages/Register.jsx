import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { register, reset } from '../features/authSlice';
import Spinner from '../components/Spinner';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password2: ''
    });

    const { name, email, phone, password, password2 } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isSuccess, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== password2) {
            dispatch({
                type: 'auth/registerFailed',
                payload: 'Passwords do not match'
            });
        } else {
            const userData = {
                name,
                email,
                phone,
                password,
            };

            dispatch(register(userData));
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body className="p-5">
                            <h2 className="text-center mb-4">Create Account</h2>
                            
                            {isError && (
                                <Alert variant="danger">{message}</Alert>
                            )}

                            <Form onSubmit={onSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={name}
                                        placeholder="Enter your name"
                                        onChange={onChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={email}
                                        placeholder="Enter your email"
                                        onChange={onChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={phone}
                                        placeholder="Enter your phone number"
                                        onChange={onChange}
                                        required
                                        pattern="[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}"
                                    />
                                    <Form.Text className="text-muted">
                                        Valid formats:<br />
                                        • International: +355 69 123 4567<br />
                                        • With country code: +1-234-567-8900<br />
                                        • Local: (069) 123-4567<br />
                                        • Simple: 0691234567
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={password}
                                        placeholder="Enter password"
                                        onChange={onChange}
                                        required
                                        minLength="6"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password2"
                                        value={password2}
                                        placeholder="Confirm password"
                                        onChange={onChange}
                                        required
                                        minLength="6"
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" type="submit">
                                        Register
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Register; 
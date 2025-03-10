import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Spinner from '../components/Spinner';
import EventDetails from '../components/EventDetails';

function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { user } = useSelector((state) => state.auth);

    const [eventForm, setEventForm] = useState({
        eventType: '',
        eventDate: '',
        guestCount: '',
        menuPackage: '',
        venue: {
            address: '',
            city: '',
            state: '',
            zipCode: ''
        },
        specialRequirements: ''
    });

    const menuPackages = [
        {
            name: 'Basic',
            description: 'Appetizer, Main Course, Dessert',
            pricePerPerson: 25
        },
        {
            name: 'Premium',
            description: 'Premium Appetizers, Choice of Main Course, Premium Desserts',
            pricePerPerson: 40
        },
        {
            name: 'Deluxe',
            description: 'Luxury Appetizers, Multiple Main Courses, Premium Desserts, Open Bar',
            pricePerPerson: 75
        }
    ];

    const calculateTotal = () => {
        const pkg = menuPackages.find(p => p.name === eventForm.menuPackage);
        return pkg && eventForm.guestCount 
            ? pkg.pricePerPerson * parseInt(eventForm.guestCount)
            : 0;
    };

    const getMinDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validate date is not in the past
        const selectedDate = new Date(eventForm.eventDate);
        selectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError('Event date cannot be in the past');
            setLoading(false);
            return;
        }

        try {
            const totalAmount = calculateTotal();
            const response = await axios.post(
                'http://localhost:5051/api/events',
                { ...eventForm, totalAmount },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            setEvents([response.data, ...events]);
            setShowModal(false);
            setEventForm({
                eventType: '',
                eventDate: '',
                guestCount: '',
                menuPackage: '',
                venue: {
                    address: '',
                    city: '',
                    state: '',
                    zipCode: ''
                },
                specialRequirements: ''
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('venue.')) {
            const venueField = name.split('.')[1];
            setEventForm(prev => ({
                ...prev,
                venue: {
                    ...prev.venue,
                    [venueField]: value
                }
            }));
        } else {
            setEventForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5051/api/events/myevents', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setEvents(response.data);
        } catch (error) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [user]);

    if (loading) return <Spinner />;

    return (
        <Container className="py-5 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Events</h1>
                <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)}
                    className="btn-accent shadow-hover"
                >
                    <i className="fas fa-plus me-2"></i>
                    Create New Event
                </Button>
            </div>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Row>
                {events.map(event => (
                    <Col key={event._id} lg={4} md={6} className="mb-4">
                        <Card className="h-100 shadow-hover">
                            <Card.Body>
                                <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                                    <span>{event.eventType}</span>
                                    <Badge 
                                        bg={
                                            event.status === 'Pending' ? 'warning' :
                                            event.status === 'Confirmed' ? 'success' :
                                            event.status === 'Completed' ? 'info' : 'danger'
                                        }
                                    >
                                        {event.status}
                                    </Badge>
                                </Card.Title>
                                <Card.Text>
                                    <i className="far fa-calendar me-2"></i>
                                    {new Date(event.eventDate).toLocaleDateString()}
                                </Card.Text>
                                <Card.Text>
                                    <i className="fas fa-users me-2"></i>
                                    {event.guestCount} Guests
                                </Card.Text>
                                <Card.Text>
                                    <i className="fas fa-utensils me-2"></i>
                                    {event.menuPackage} Package
                                </Card.Text>
                                <Button 
                                    variant="outline-primary" 
                                    className="w-100 mt-3"
                                    onClick={() => {
                                        setSelectedEvent(event);
                                        setShowEventDetails(true);
                                    }}
                                >
                                    <i className="fas fa-info-circle me-2"></i>
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Type</Form.Label>
                            <Form.Select
                                name="eventType"
                                value={eventForm.eventType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Event Type</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Anniversary">Anniversary</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="eventDate"
                                value={eventForm.eventDate}
                                onChange={handleChange}
                                min={getMinDate()}
                                required
                            />
                            <Form.Text className="text-muted">
                                Event date must be today or a future date
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Number of Guests</Form.Label>
                            <Form.Control
                                type="number"
                                name="guestCount"
                                value={eventForm.guestCount}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Menu Package</Form.Label>
                            <Form.Select
                                name="menuPackage"
                                value={eventForm.menuPackage}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Menu Package</option>
                                {menuPackages.map(pkg => (
                                    <option key={pkg.name} value={pkg.name}>
                                        {pkg.name} - ${pkg.pricePerPerson}/person
                                    </option>
                                ))}
                            </Form.Select>
                            {eventForm.menuPackage && (
                                <Form.Text className="text-muted">
                                    {menuPackages.find(p => p.name === eventForm.menuPackage)?.description}
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Venue Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="venue.address"
                                value={eventForm.venue.address}
                                onChange={handleChange}
                                required
                                placeholder="Street Address"
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="venue.city"
                                        value={eventForm.venue.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="venue.state"
                                        value={eventForm.venue.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ZIP Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="venue.zipCode"
                                        value={eventForm.venue.zipCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Special Requirements</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="specialRequirements"
                                value={eventForm.specialRequirements}
                                onChange={handleChange}
                                placeholder="Any special requests or dietary requirements?"
                            />
                        </Form.Group>

                        {eventForm.guestCount && eventForm.menuPackage && (
                            <Alert variant="info" className="mb-3">
                                <strong>Total Cost: </strong>
                                ${calculateTotal().toFixed(2)}
                            </Alert>
                        )}

                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating Event...
                                    </>
                                ) : (
                                    'Create Event'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <EventDetails 
                show={showEventDetails}
                onHide={() => setShowEventDetails(false)}
                event={selectedEvent}
            />
        </Container>
    );
}

export default Dashboard; 
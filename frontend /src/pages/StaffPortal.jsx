import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Spinner from '../components/Spinner';
import EventDetails from '../components/EventDetails';
import { useNavigate } from 'react-router-dom';

function StaffPortal() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetchEvents = async () => {
            if (!user) {
                console.log('No user found, redirecting to login');
                navigate('/login');
                return;
            }

            if (!user.token) {
                console.log('No token found');
                setError('No authentication token found');
                return;
            }

            if (user.role !== 'admin' && user.role !== 'staff') {
                console.log('User is not admin or staff');
                setError('Unauthorized access');
                return;
            }

            console.log('User authenticated, fetching events...');
            await fetchEvents();
        };

        checkAuthAndFetchEvents();
    }, [user, navigate]);

    const fetchEvents = async () => {
        try {
            console.log('Making API request with token:', user.token.substring(0, 20) + '...');
            
            const response = await axios.get('http://localhost:5051/api/events', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Detailed logging of the first event
            if (response.data && response.data.length > 0) {
                const firstEvent = response.data[0];
                console.log('First event full data:', {
                    id: firstEvent._id,
                    user: firstEvent.user,
                    userPhone: firstEvent.user?.phone,
                });
            }
            
            if (Array.isArray(response.data)) {
                // Log all events' phone numbers
                response.data.forEach((event, index) => {
                    console.log(`Event ${index + 1} phone:`, event.user?.phone);
                });
                
                setEvents(response.data);
                setError(null);
                console.log(`Loaded ${response.data.length} events`);
            } else {
                console.log('Invalid response format:', response.data);
                setEvents([]);
                setError('Invalid data format received from server');
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                navigate('/login');
            } else if (error.response?.status === 403) {
                setError('You do not have permission to access this page');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch events. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateEventStatus = async (eventId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:5051/api/events/${eventId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            setEvents(events.map(event => 
                event._id === eventId ? response.data : event
            ));
        } catch (error) {
            setError('Failed to update event status');
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'Confirmed':
                return 'success';
            case 'Completed':
                return 'info';
            case 'Cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const formatPhoneNumber = (phone) => {
        console.log('Formatting phone number:', phone); // Add logging
        
        // Return early if phone is undefined or null
        if (!phone) {
            console.log('Phone is null or undefined');
            return 'N/A';
        }
        
        // Remove any non-digit characters except plus sign
        const cleaned = phone.replace(/[^\d+]/g, '');
        console.log('Cleaned phone:', cleaned);
        
        // For Albanian numbers (starting with 06 or +355)
        if (cleaned.startsWith('06') || cleaned.startsWith('+355')) {
            const formatted = cleaned.startsWith('+355') 
                ? cleaned // Keep international format as is
                : cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
            console.log('Formatted Albanian number:', formatted);
            return formatted;
        }
        
        // If it starts with a plus sign (other international format)
        if (cleaned.startsWith('+')) {
            console.log('International format kept as is');
            return phone;
        }
        
        console.log('Returning original format');
        return phone;
    };

    const filteredEvents = events
        .filter(event => filterStatus === 'all' || event.status === filterStatus)
        .filter(event => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                event.eventType?.toLowerCase().includes(searchLower) ||
                event.user?.name?.toLowerCase().includes(searchLower) ||
                event.venue?.city?.toLowerCase().includes(searchLower)
            );
        });

    if (loading) return <Spinner />;

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h1>Staff Portal</h1>
                    <div className="d-flex gap-3 mb-3">
                        <Form.Select 
                            className="w-auto"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.value)}
                        >
                            <option value="all">All Events</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </Form.Select>

                        <InputGroup className="w-auto">
                            <InputGroup.Text>Search</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                {filteredEvents.map((event) => (
                    <Col md={6} lg={4} key={event._id} className="mb-4">
                        <Card className="h-100 shadow-hover">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{event.eventType || 'Untitled Event'}</h5>
                                <Badge bg={getStatusBadgeVariant(event.status)}>
                                    {event.status || 'Unknown'}
                                </Badge>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <h6 className="mb-2">Client Information</h6>
                                    <p className="mb-1">
                                        <i className="fas fa-user me-2"></i>
                                        <strong>Name:</strong> {event.user?.name || 'Unknown'}
                                    </p>
                                    <p className="mb-1">
                                        <i className="fas fa-envelope me-2"></i>
                                        <strong>Email:</strong> {event.user?.email || 'N/A'}
                                    </p>
                                    <p className="mb-1">
                                        <i className="fas fa-phone me-2"></i>
                                        <strong>Phone:</strong>{' '}
                                        {(() => {
                                            console.log('Current event user:', event.user);
                                            console.log('Current event phone:', event.user?.phone);
                                            const formattedPhone = event.user?.phone ? formatPhoneNumber(event.user.phone) : 'N/A';
                                            console.log('Final formatted phone:', formattedPhone);
                                            return formattedPhone;
                                        })()}
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <h6 className="mb-2">Event Details</h6>
                                    <p className="mb-1">
                                        <i className="far fa-calendar me-2"></i>
                                        <strong>Date:</strong> {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Not set'}
                                    </p>
                                    <p className="mb-1">
                                        <i className="fas fa-users me-2"></i>
                                        <strong>Guests:</strong> {event.guestCount || 0}
                                    </p>
                                    <p className="mb-1">
                                        <i className="fas fa-utensils me-2"></i>
                                        <strong>Package:</strong> {event.menuPackage || 'Not selected'}
                                    </p>
                                    <p className="mb-1">
                                        <i className="fas fa-dollar-sign me-2"></i>
                                        <strong>Total:</strong> ${(event.totalAmount || 0).toFixed(2)}
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <h6 className="mb-2">Venue</h6>
                                    <p className="mb-1">
                                        <i className="fas fa-map-marker-alt me-2"></i>
                                        {event.venue?.address}, {event.venue?.city}, {event.venue?.state} {event.venue?.zipCode}
                                    </p>
                                </div>

                                {event.specialRequirements && (
                                    <div className="mb-3">
                                        <h6 className="mb-2">Special Requirements</h6>
                                        <p className="mb-1">
                                            <i className="fas fa-clipboard-list me-2"></i>
                                            {event.specialRequirements}
                                        </p>
                                    </div>
                                )}

                                <div className="d-flex gap-2 mt-3">
                                    {event.status === 'Pending' && (
                                        <>
                                            <Button 
                                                variant="success" 
                                                size="sm"
                                                onClick={() => updateEventStatus(event._id, 'Confirmed')}
                                            >
                                                <i className="fas fa-check me-1"></i>
                                                Confirm
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => updateEventStatus(event._id, 'Cancelled')}
                                            >
                                                <i className="fas fa-times me-1"></i>
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                    {event.status === 'Confirmed' && (
                                        <Button 
                                            variant="info" 
                                            size="sm"
                                            onClick={() => updateEventStatus(event._id, 'Completed')}
                                        >
                                            <i className="fas fa-check-double me-1"></i>
                                            Mark as Completed
                                        </Button>
                                    )}
                                    <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setShowDetailsModal(true);
                                        }}
                                    >
                                        <i className="fas fa-info-circle me-1"></i>
                                        View Details
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <EventDetails 
                event={selectedEvent}
                show={showDetailsModal}
                onHide={() => {
                    setShowDetailsModal(false);
                    setSelectedEvent(null);
                }}
            />
        </Container>
    );
}

export default StaffPortal; 
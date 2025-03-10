import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';

function EventDetails({ event, show, onHide }) {
    if (!event) return null;

    const getPackageDescription = (packageName) => {
        switch (packageName) {
            case 'Basic':
                return 'Appetizer, Main Course, Dessert';
            case 'Premium':
                return 'Premium Appetizers, Choice of Main Course, Premium Desserts';
            case 'Deluxe':
                return 'Luxury Appetizers, Multiple Main Courses, Premium Desserts, Open Bar';
            default:
                return '';
        }
    };

    const getPackagePrice = (packageName) => {
        switch (packageName) {
            case 'Basic':
                return 25;
            case 'Premium':
                return 40;
            case 'Deluxe':
                return 75;
            default:
                return 0;
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{event.eventType} Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h5>Event Information</h5>
                        <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                        <p><strong>Number of Guests:</strong> {event.guestCount}</p>
                        <p>
                            <strong>Status: </strong>
                            <Badge bg={
                                event.status === 'Pending' ? 'warning' :
                                event.status === 'Confirmed' ? 'success' :
                                event.status === 'Completed' ? 'info' : 'danger'
                            }>
                                {event.status}
                            </Badge>
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h5>Menu Package</h5>
                        <p><strong>{event.menuPackage} Package</strong></p>
                        <p>{getPackageDescription(event.menuPackage)}</p>
                        <div className="mt-3">
                            <strong>Price Breakdown:</strong>
                            <p className="mb-0">
                                ${getPackagePrice(event.menuPackage)}/person × {event.guestCount} guests = 
                                ${event.totalAmount.toFixed(2)}
                            </p>
                        </div>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h5>Venue Details</h5>
                        <p>{event.venue.address}</p>
                        <p>{event.venue.city}, {event.venue.state} {event.venue.zipCode}</p>
                    </ListGroup.Item>

                    {event.specialRequirements && (
                        <ListGroup.Item>
                            <h5>Special Requirements</h5>
                            <p>{event.specialRequirements}</p>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EventDetails; 
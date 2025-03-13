import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
    const { user } = useSelector((state) => state.auth);

    const services = [
        {
            title: 'Wedding Catering',
            description: 'Make your special day even more memorable with our exquisite wedding catering services.',
            image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            title: 'Corporate Events',
            description: 'Impress your clients and colleagues with our professional corporate catering solutions.',
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            title: 'Private Parties',
            description: 'From birthdays to anniversaries, we make every celebration special.',
            image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
    ];

    return (
        <Container>
            <Row className="py-5">
                <Col md={12} className="text-center mb-5">
                    <h1 className="display-4 mb-4">Welcome to Our Catering Service</h1>
                    <p className="lead">
                        Experience exceptional cuisine and service for your special events
                    </p>
                    {!user && (
                        <div className="mt-4">
                            <Button as={Link} to="/register" variant="primary" className="me-3">
                                Get Started
                            </Button>
                            <Button as={Link} to="/login" variant="outline-primary">
                                Login
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>

            <Row className="mb-5">
                {services.map((service, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Img 
                                variant="top" 
                                src={service.image} 
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{service.title}</Card.Title>
                                <Card.Text>{service.description}</Card.Text>
                                {user ? (
                                    <Button 
                                        as={Link} 
                                        to="/dashboard" 
                                        variant="outline-primary"
                                    >
                                        Book Now
                                    </Button>
                                ) : (
                                    <Button 
                                        as={Link} 
                                        to="/register" 
                                        variant="outline-primary"
                                    >
                                        Register to Book
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="py-5 bg-light rounded">
                <Col md={12} className="text-center">
                    <h2 className="mb-4">Why Choose Us?</h2>
                    <Row>
                        <Col md={4}>
                            <h4>Quality Cuisine</h4>
                            <p>Fresh ingredients and expert chefs</p>
                        </Col>
                        <Col md={4}>
                            <h4>Professional Service</h4>
                            <p>Experienced and courteous staff</p>
                        </Col>
                        <Col md={4}>
                            <h4>Custom Menus</h4>
                            <p>Tailored to your preferences</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Home; 
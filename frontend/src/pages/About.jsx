import { Container, Row, Col, Card } from 'react-bootstrap';

function About() {
    const teamMembers = [
        {
            name: 'John Smith',
            role: 'Executive Chef',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            description: '20+ years of culinary experience specializing in international cuisine.'
        },
        {
            name: 'Sarah Johnson',
            role: 'Event Coordinator',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            description: 'Expert in planning and executing flawless events of all sizes.'
        },
        {
            name: 'Michael Chen',
            role: 'Pastry Chef',
            image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            description: 'Specializes in creating unique and delicious dessert experiences.'
        }
    ];

    return (
        <Container className="py-5">
            <Row className="mb-5">
                <Col md={6}>
                    <h1 className="mb-4">About Us</h1>
                    <p className="lead">
                        Welcome to our premier catering service, where culinary excellence meets exceptional event experiences.
                    </p>
                    <p>
                        With over 15 years of experience in the catering industry, we've built our reputation on creating 
                        memorable events through outstanding food, impeccable service, and attention to detail.
                    </p>
                    <p>
                        Our team of experienced chefs and event coordinators work tirelessly to ensure that every event, 
                        from intimate gatherings to grand celebrations, exceeds expectations and creates lasting memories.
                    </p>
                </Col>
                <Col md={6}>
                    <img 
                        src="https://images.unsplash.com/photo-1514537099923-4c0fc7c73161?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                        alt="Catering Team"
                        className="img-fluid rounded shadow"
                        style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    />
                </Col>
            </Row>

            <h2 className="text-center mb-5">Our Team</h2>
            <Row>
                {teamMembers.map((member, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card className="h-100 shadow-sm text-center">
                            <Card.Img 
                                variant="top" 
                                src={member.image} 
                                style={{ height: '250px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{member.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                                <Card.Text>{member.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mt-5">
                <Col md={12} className="text-center">
                    <h2 className="mb-4">Our Values</h2>
                    <Row>
                        <Col md={4}>
                            <h4>Quality</h4>
                            <p>We use only the finest ingredients and maintain the highest standards in food preparation.</p>
                        </Col>
                        <Col md={4}>
                            <h4>Service</h4>
                            <p>Our dedicated team ensures every event is executed with professionalism and care.</p>
                        </Col>
                        <Col md={4}>
                            <h4>Innovation</h4>
                            <p>We continuously evolve our menus and services to provide unique experiences.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default About; 
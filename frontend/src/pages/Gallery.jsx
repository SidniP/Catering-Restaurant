import { Container, Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';

function Gallery() {
    const [imageError, setImageError] = useState({});

    const galleryItems = [
        {
            id: 1,
            title: 'Wedding Reception',
            image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
            category: 'Wedding'
        },
        {
            id: 2,
            title: 'Corporate Lunch',
            image: 'https://images.pexels.com/photos/5779787/pexels-photo-5779787.jpeg',
            category: 'Corporate'
        },
        {
            id: 3,
            title: 'Gourmet Appetizers',
            image: 'https://images.pexels.com/photos/2122294/pexels-photo-2122294.jpeg',
            category: 'Food'
        },
        {
            id: 4,
            title: 'Birthday Celebration',
            image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg',
            category: 'Birthday'
        },
        {
            id: 5,
            title: 'Elegant Table Setting',
            image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg',
            category: 'Decoration'
        },
        {
            id: 6,
            title: 'Dessert Selection',
            image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
            category: 'Food'
        }
    ];

    const handleImageError = (id) => {
        setImageError(prev => ({
            ...prev,
            [id]: true
        }));
    };

    return (
        <Container className="py-5 fade-in">
            <h1 className="text-center mb-5">Our Gallery</h1>
            <Row>
                {galleryItems.map((item) => (
                    <Col key={item.id} md={4} className="mb-4">
                        <Card className="h-100 shadow-sm hover-zoom">
                            <div className="card-img-wrapper" style={{ height: '250px', overflow: 'hidden' }}>
                                {imageError[item.id] ? (
                                    <div className="text-center d-flex align-items-center justify-content-center h-100 bg-light">
                                        <i className="fas fa-image fa-3x text-secondary"></i>
                                    </div>
                                ) : (
                                    <Card.Img 
                                        variant="top" 
                                        src={item.image} 
                                        onError={() => handleImageError(item.id)}
                                        style={{ 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                )}
                            </div>
                            <Card.Body>
                                <Card.Title className="mb-2">{item.title}</Card.Title>
                                <Card.Text className="text-muted">
                                    <i className={`fas ${
                                        item.category === 'Wedding' ? 'fa-rings' :
                                        item.category === 'Corporate' ? 'fa-briefcase' :
                                        item.category === 'Food' ? 'fa-utensils' :
                                        item.category === 'Birthday' ? 'fa-cake-candles' :
                                        'fa-star'
                                    } me-2`}></i>
                                    {item.category}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <style>{`
                .hover-zoom:hover .card-img-wrapper img {
                    transform: scale(1.1);
                }
                .card-img-wrapper {
                    position: relative;
                    overflow: hidden;
                }
                .card-img-wrapper img {
                    transition: transform 0.5s ease;
                }
            `}</style>
        </Container>
    );
}

export default Gallery; 
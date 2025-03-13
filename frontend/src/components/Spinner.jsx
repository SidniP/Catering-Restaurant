import { Spinner as BootstrapSpinner } from 'react-bootstrap';

function Spinner() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <BootstrapSpinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </BootstrapSpinner>
        </div>
    );
}

export default Spinner; 
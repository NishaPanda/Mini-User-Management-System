import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="loading-screen">
                <div className={`spinner spinner-${size}`}>
                    <div className="spinner-circle"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`spinner spinner-${size}`}>
            <div className="spinner-circle"></div>
        </div>
    );
};

export default LoadingSpinner;

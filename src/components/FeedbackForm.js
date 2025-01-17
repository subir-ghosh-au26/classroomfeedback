import React, { useState, useRef } from 'react';
import axios from 'axios';
import './FeedbackForm.css'; // Import the CSS file

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        batch: '',
        mobile: '',
        feedback: '',
        comments: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Access camera stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Take photo after camera access
            const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
            const photoBlob = await imageCapture.takePhoto();
            stream.getVideoTracks().forEach(track => track.stop()); // stop camera after taking photo

            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            formDataToSend.append('photo', photoBlob);


            const response = await axios.post('https://class-server-2t3f.onrender.com/api/feedback', formDataToSend);
            if (response.data.message) {
                alert(response.data.message);
                setFormData({
                  name: '',
                  batch: '',
                  mobile: '',
                  feedback: '',
                  comments: '',
                });
            } else {
                alert('Failed to submit feedback.');
            }

        } catch (error) {
            console.error('Error submitting feedback:', error);
             alert('Failed to submit feedback. Make sure you allow camera access.');
        } finally {
            setIsLoading(false);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject = null;
            }
        }
    };



    return (
        <div className="feedback-form-container">
           <h1>Feedback Form</h1>
            <video ref={videoRef} style={{display:'none'}}></video>
            <form onSubmit={handleSubmit} className="feedback-form">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              <label htmlFor="batch">Batch:</label>
                <select id="batch" name="batch" value={formData.batch} onChange={handleInputChange} required>
                    <option value="">Select Batch</option>
                    <option value="Batch A">Batch A</option>
                    <option value="Batch B">Batch B</option>
                    <option value="Batch C">Batch C</option>
                    <option value="Batch D">Batch D</option>
                </select>
              <label htmlFor="mobile">Mobile No:</label>
                <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} />
                <label htmlFor="feedback">Feedback:</label>
                <select id="feedback" name="feedback" value={formData.feedback} onChange={handleInputChange} required>
                    <option value="">Select Feedback</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Bad">Bad</option>
                </select>
              <label htmlFor="comments">Comments:</label>
              <textarea id="comments" name="comments" rows="4" value={formData.comments} onChange={handleInputChange}></textarea>
             <button type="submit" disabled={isLoading} className="submit-button">
                 {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FeedbackChart from './FeedbackChart';
import './AdminPanel.css';
import * as XLSX from 'xlsx';


const AdminPanel = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [filter, setFilter] = useState({
        batch: '',
        startDate: '',
        endDate: '',
        feedback: '',
    });
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterSectionRef = useRef(null);
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        loadFeedbackData();
    }, [filter]);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handleApplyFilter = () => {
        loadFeedbackData();
    };
    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };
    const loadFeedbackData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://class-server-2t3f.onrender.com/api/feedback', {
                params: filter,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFeedbackData(response.data);
        } catch (error) {
            console.error('Error fetching feedback data:', error);
            alert('Failed to load data');
        } finally {
            setLoading(false);
        }
    };
      const downloadExcel = () => {
        axios.get('https://class-server-2t3f.onrender.com/api/feedback', {
          params: filter,
          headers: {
             Authorization: `Bearer ${token}`,
            },
           })
            .then(response => {
               const excelData = response.data.map((item) => {
                 return {
                    Id:item._id,
                      Name:item.name,
                      Batch:item.batch,
                      Mobile:item.mobile,
                      Feedback:item.feedback,
                      Comments:item.comments,
                      Photo: item.photo ? 'Yes' : 'No',
                     'Created At':item.createdAt
                 }
              });
              const ws = XLSX.utils.json_to_sheet(excelData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Feedback Data");
               XLSX.writeFile(wb, "feedback_data.xlsx");
            })
          .catch((error) => {
            console.error('Error downloading Excel', error);
               alert('Failed to download Excel');
            });
     }

    return (
        <div className="admin-panel-container">
            <div className="admin-panel-header">
              <h1>Admin Panel - Feedback Data</h1>
                 <button onClick={toggleFilter} className="filter-toggle-button" aria-expanded={isFilterOpen} aria-controls="filter-section">
                    {isFilterOpen ? 'Hide Filter' : 'Show Filter'}
                  </button>
            </div>
            <div
                ref={filterSectionRef}
               className={`filter-section ${isFilterOpen ? 'filter-section-open' : ''}`}
                 id="filter-section"
                >
                 <h2>Filter Options</h2>
                 <label htmlFor="batch-filter">Batch Filter:</label>
                <select id="batch-filter" name="batch" onChange={handleFilterChange} value={filter.batch}>
                     <option value="">All</option>
                    <option value="Batch A">Batch A</option>
                    <option value="Batch B">Batch B</option>
                   <option value="Batch C">Batch C</option>
                 </select>
                 <br />
                <label htmlFor="start-date-filter">Start Date:</label>
                <input type="date" id="start-date-filter" name="startDate" onChange={handleFilterChange} value={filter.startDate} />
                <br />
                 <label htmlFor="end-date-filter">End Date:</label>
                <input type="date" id="end-date-filter" name="endDate" onChange={handleFilterChange} value={filter.endDate} />
                 <br />
                <label htmlFor="feedback-filter">Feedback Filter:</label>
                <select id="feedback-filter" name="feedback" onChange={handleFilterChange} value={filter.feedback}>
                    <option value="">All</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                    <option value="Neutral">Neutral</option>
                 </select>
                <br />
                <button onClick={handleApplyFilter} disabled={loading}>
                     {loading ? 'Loading...' : 'Apply Filter'}
                 </button>
                <button onClick={downloadExcel} disabled={loading}>
                    {loading ? 'Download Excel' : 'Download Excel'}
                 </button>
              </div>
           <div className="admin-panel-body">
               <div className="feedback-chart">
                  <FeedbackChart feedbackData={feedbackData} />
               </div>
             <div className="feedback-table-container">
                <table className="feedback-table">
                    <thead>
                       <tr>
                          {/* <th>Id</th> */}
                           <th>Name</th>
                           <th>Batch</th>
                            <th>Mobile</th>
                            <th>Feedback</th>
                           <th>Comments</th>
                           <th>Photo</th>
                           <th>Created At</th>
                       </tr>
                    </thead>
                    <tbody>
                      {feedbackData.map((feedback) => (
                       <tr key={feedback._id}>
                             {/* <td>{feedback._id}</td> */}
                              <td>{feedback.name}</td>
                             <td>{feedback.batch}</td>
                               <td>{feedback.mobile}</td>
                             <td>{feedback.feedback}</td>
                             <td>{feedback.comments}</td>
                            <td>{feedback.photo ? 'yes' : 'no'}</td>
                           <td>{feedback.createdAt}</td>
                          </tr>
                         ))}
                   </tbody>
                 </table>
               </div>
            </div>
        </div>
    );
};

export default AdminPanel;
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const FeedbackChart = ({ feedbackData }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }


        const feedbackCounts = {
          Positive: 0,
          Negative: 0,
          Neutral: 0
        }


        feedbackData.forEach((item) => {
          feedbackCounts[item.feedback] =  (feedbackCounts[item.feedback] || 0) + 1
         })



         const labels = Object.keys(feedbackCounts)
        const data = Object.values(feedbackCounts)

        const chartCtx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(chartCtx, {
            type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
                backgroundColor: [
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(255, 99, 132, 0.8)',
                   'rgba(255, 205, 86, 0.8)',

              ],
                borderWidth: 0,
            }],
          },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                      position: 'bottom', // Show legend at bottom
                      labels: {
                           usePointStyle: true, // Set custom styles to legend point
                          font: {
                             size: 14 // Set legend font size
                           },
                        },
                   },
                    title: {
                        display: true,
                        text: 'Feedback Distribution', // Set title for the graph
                        font: {
                            size: 18, // set title font size
                        },
                   },
                },
            },
        });

       return () => {
            if (chartInstanceRef.current) {
               chartInstanceRef.current.destroy();
            }
       }
    }, [feedbackData]);

    return <canvas ref={chartRef} style={{ width: '400px', height: '400px' }} />;
};

export default FeedbackChart;
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [xDataPlot, yDataPlot] = await Promise.all([
          fetch('https://retoolapi.dev/gDa8uC/data'),
          fetch('https://retoolapi.dev/o5zMs5/data')
        ]);

        const [xJsonData, yJsonData] = await Promise.all([
          xDataPlot.json(),
          yDataPlot.json()
        ]);

        const xRawData = xJsonData.slice(0, 50);
        const yRawData = yJsonData.slice(0, 50);

        const xFinalData = xRawData.map((item) => parseFloat(item.RandomNumber));
        const yFinalData = yRawData.map((item) => parseFloat(item.RandomNumber));

        const xLabels = xRawData.map((item) => item.Label.slice(1, 4));

        const ctx = chartRef.current;

        if (ctx) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          chartInstance.current = new Chart(ctx, {
            data: {
              labels: xLabels,
              datasets: [
                {
                  label: 'X Plotting',
                  type: 'line',
                  data: xFinalData,
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderWidth: 1,
                  yAxisID: 'y',
                },
                {
                  label: 'Y Plotting',
                  type: 'line',
                  data: yFinalData,
                  backgroundColor: '#172554d', // fixed typo here
                  borderColor: '#1d4ed8',
                  borderWidth: 1,
                  yAxisID: 'y',
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} width="400" height="400"></canvas>;
}

export default App;

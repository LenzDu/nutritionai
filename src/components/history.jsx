import React, { useState, useEffect } from 'react';
import { Table, Card, Container, Form, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

import { ReactComponent as EditIcon } from '../icons/edit.svg';
import EditDataModal from './edit-data';
import { dailyValue } from '../reference-data';
import { calculatePercentage } from '../utils/calculate';
import { subDays, format, parseISO } from 'date-fns';

ChartJS.register(...registerables);

const NutrientChart = ({ nutrientData, selectedNutrient }) => {
  const datesSorted = Object.keys(nutrientData).sort();

  const chartData = {
    labels: datesSorted,
    datasets: [
      {
        label: selectedNutrient,
        data: datesSorted.map(date => nutrientData[date][selectedNutrient]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const maxValue = Math.max(
    ...Object.values(nutrientData).map(data => data[selectedNutrient]),
    dailyValue[selectedNutrient]
  );

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: maxValue * 1.1,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: dailyValue[selectedNutrient],
            yMax: dailyValue[selectedNutrient],
            // borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1.5,
            borderDash: [10, 10],
            label: {
              content: 'Daily Recommended',
              enabled: true,
              position: 'start',
            },
          },
        }
      },
      legend: {
        display: false,
      },
    }
  };

  ChartJS.register(annotationPlugin);

  return <Bar data={chartData} options={options} />;
};


const NutrientTable = ({ nutrientData, selectedNutrient, openEditDataModal }) => {
  const datesSorted = Object.keys(nutrientData).sort();

  return (
    <Table striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>Date</th>
          <th>{selectedNutrient.charAt(0).toUpperCase() + selectedNutrient.slice(1)}</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {datesSorted.map(date => {
          const amount = nutrientData[date][selectedNutrient];
          return (
            <tr key={date}>
              <td><span style={{ cursor: 'pointer' }} onClick={() => openEditDataModal(date)}><EditIcon /></span> {date} </td>
              <td>{amount}</td>
              <td>{calculatePercentage(amount, selectedNutrient).toFixed(2)}%</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};


const StatCards = ({ nutrientData, selectedNutrient }) => {
  // Assuming that the sortedDates has already been created in the parent component, pass it via props.
  // For simplicity, otherwise you should sort the dates again here.

  // Get the dates for the last 7 days and the 7 days before that
  const sortedDates = Object.keys(nutrientData).sort();
  const current7Days = sortedDates.slice(-7); // Last 7 days
  const previous7Days = sortedDates.slice(-14, -7); // 7 days before the last 7 days

  const sum = (values) => values.reduce((a, b) => a + b, 0);

  const getAverage = (dates) => {
    const sumOfNutrient = sum(dates.map(date => nutrientData[date][selectedNutrient]));
    return sumOfNutrient / dates.length;
  };

  const averageCurrent = getAverage(current7Days);
  const averagePrevious = getAverage(previous7Days);

  const percentageIncrease =
    averagePrevious === 0 ? 0 : (((averageCurrent - averagePrevious) / averagePrevious) * 100).toFixed(2);

  return (
    <div className="stat-cards">
      <Card bsPrefix="metric-card">
        <Card.Body>
          <Card.Title>Average for Current 7 Days</Card.Title>
          <Card.Text>
            {averageCurrent.toFixed(2)} ( {calculatePercentage(averageCurrent, selectedNutrient).toFixed(1)}% of daily value)
          </Card.Text>
        </Card.Body>
      </Card>
      <Card bsPrefix="metric-card">
        <Card.Body>
          <Card.Title>% Increase/Decrease</Card.Title>
          <Card.Text>
            {percentageIncrease}%
          </Card.Text>
        </Card.Body>
      </Card>
      {/* More cards for other stats can be added here */}
    </div>
  );
};

const CalendarView = ({ nutrientData, selectedNutrient, openEditDataModal }) => {
  const startDate = subDays(new Date(), 27); // 28 days including today
  const calendarDays = Array.from({ length: 28 }).map((_, i) => {
    return format(subDays(startDate, -i), 'yyyy-MM-dd');
  });

  return (
    <div className="calendar-grid">
      {calendarDays.map(date => {
        const percentage = nutrientData[date] ?
          `${calculatePercentage(nutrientData[date][selectedNutrient], selectedNutrient).toFixed(1)}%` :
          '';

        const cellClass = nutrientData[date] ? 'filled' : 'empty';

        return (
          <div key={date} className={`calendar-cell ${cellClass}`} onClick={() => openEditDataModal(date)}>
            <span className="cell-date">{format(parseISO(date), 'MM-dd')}</span>
            <span className="cell-data">{percentage}</span>
          </div>
        );
      })}
    </div>
  );
};


const History = () => {
  const [nutrientData, setNutrientData] = useState({});
  const [selectedNutrient, setSelectedNutrient] = useState('calories');
  const [editDataModalOpen, setEditDataModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState(null);

  useEffect(() => {
    // Assuming the new structure matches with the Nutrient components
    const storedData = JSON.parse(localStorage.getItem('history'));
    if (storedData && storedData.data && storedData.data.nutrients) {
      const sortedNutrientData = {};
      Object.keys(storedData.data.nutrients)
        .sort()
        .forEach((key) => {
          sortedNutrientData[key] = storedData.data.nutrients[key];
        });
      setNutrientData(sortedNutrientData);
    }
  }, []);

  const handleNutrientChange = (event) => {
    setSelectedNutrient(event.target.value);
  };

  const openEditDataModal = (date) => {
    setEditingDate(date);
    setEditDataModalOpen(true);
  };

  return (
    <Container>
      <Card className="my-4">
        <Card.Header>
          <h4>Nutrition Consumption History</h4>
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="nutrientSelect">
            <Form.Label>Select Nutrient</Form.Label>
            <Form.Select aria-label="Select nutrient" onChange={handleNutrientChange} value={selectedNutrient}>
              <option value="calories">Calories</option>
              <option value="protein">Protein</option>
              <option value="saturated_fat">Saturated Fat</option>
              <option value="total_fat">Total Fat</option>
              <option value="carbohydrate">Carbohydrate</option>
              <option value="dietary_fiber">Dietary Fiber</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      <hr></hr>
      <NutrientChart nutrientData={nutrientData} selectedNutrient={selectedNutrient}/>
      <hr></hr>
      <CalendarView nutrientData={nutrientData} selectedNutrient={selectedNutrient} openEditDataModal={openEditDataModal}/>
      <hr></hr>
      <NutrientTable nutrientData={nutrientData} selectedNutrient={selectedNutrient} openEditDataModal={openEditDataModal}/>
      <hr></hr>
      {/* <StatCards nutrientData={nutrientData} selectedNutrient={selectedNutrient} /> */}
      {/* <hr></hr> */}
      <EditDataModal
        show={editDataModalOpen}
        setShow={setEditDataModalOpen}
        editingDate={editingDate}
        setEditingDate={setEditingDate}
        nutrientData={nutrientData}
        setNutrientData={setNutrientData}
      />
    </Container>
  );
};

export default History;



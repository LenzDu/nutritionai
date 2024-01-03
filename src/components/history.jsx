import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const History = () => {
  const [nutrientData, setNutrientData] = useState({});
  const [selectedNutrient, setSelectedNutrient] = useState('calories');

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('history'));
    setNutrientData(storedData ? storedData.data.nutrients : {});
  }, []);

  // Prepare data for chart
  const chartData = {
    labels: Object.keys(nutrientData),
    datasets: [
      {
        label: selectedNutrient,
        data: Object.values(nutrientData).map(data => data[selectedNutrient]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Handle changes to the nutrient select dropdown
  const handleNutrientChange = (event) => {
    setSelectedNutrient(event.target.value);
  };

  // Render the component
  return (
    <Container>
      <Card>
        <Card.Header>
          <h4>Nutrition Consumption History</h4>
          <Form.Select aria-label="Select nutrient" onChange={handleNutrientChange}>
            <option value="calories">Calories</option>
            <option value="protein">Protein</option>
            <option value="saturated_fat">Saturated Fat</option>
            <option value="total_fat">Total Fat</option>
            <option value="carbohydrate">Carbohydrate</option>
            <option value="dietary_fiber">Dietary Fiber</option>
          </Form.Select>
        </Card.Header>
        <Card.Body>
          <Bar data={chartData} />
        </Card.Body>
      </Card>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Saturated Fat</th>
            <th>Total Fat</th>
            <th>Carbohydrates</th>
            <th>Dietary Fiber</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(nutrientData).map(([date, nutrients]) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{nutrients.calories}</td>
              <td>{nutrients.protein}</td>
              <td>{nutrients.saturated_fat}</td>
              <td>{nutrients.total_fat}</td>
              <td>{nutrients.carbohydrate}</td>
              <td>{nutrients.dietary_fiber}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default History;

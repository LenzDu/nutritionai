import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registering the components used for Bar chart in chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fetchNutritionData = async ({ apiKey, description }) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      messages: [
        { role: "system", content: `
          You are a helpful assistant to help calculate and estimate nutrition consumptions.
          Users will tell you in natural language what they eat, and then you need to break down each kind of food and how much each kind of common nutritions 
          (calories, carbohydrate, protein, dietary fiber) is consumed. You should also add up to the total amount of each nutritions, as well as the percentages compared to
          the daily recommended amount for an average adult.
          Return a dictionary where keys are each kind of food, as well as the total, and the values are sub-dictionary of amounts and percentages of each kind of nutrition.
          You must return in JSON format.
        `},
        { role: "user", content: `${description}` },
      ],
      model: "gpt-4-1106-preview",
      response_format: { "type": "json_object" },
      max_tokens: 2000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    }
  );
  return response.data.choices[0].message.content;
};



const NutritionTable = ({ data }) => {
  console.log(data)

  data = JSON.parse(data)

  // Function to render table headers
  const renderTableHeader = () => {
    const headers = Object.keys(data).filter(key => key !== 'total');
    if (headers.length === 0) {
      return null;
    }

    const nutritionTypes = Object.keys(data[headers[0]]);

    return (
      <thead>
        <tr>
          <th>Food/Nutrient</th>
          {nutritionTypes.map((type, index) => (
            <th key={index}>{type.replace(/_/g, ' ')}</th>
          ))}
        </tr>
      </thead>
    );
  };

  // Function to render one row of food data
  const renderTableRow = (foodName, nutrients) => {
    return (
      <tr key={foodName}>
        <td>{foodName}</td>
        {Object.entries(nutrients).map(([type, value], index) => (
          <td key={index}>
            {value.amount} ({value.percentage}%)
          </td>
        ))}
      </tr>
    );
  };

  // Function to render table body
  const renderTableBody = () => {
    const foodNames = Object.keys(data).filter(key => key !== 'total');

    return (
      <tbody>
        {foodNames.map(foodName => renderTableRow(foodName, data[foodName]))}
        {data.total && renderTableRow('Total', data.total)}
      </tbody>
    );
  };

  return (
    <Table striped bordered hover>
      {renderTableHeader()}
      {renderTableBody()}
    </Table>
  );
};



const NutritionBarPlot = ({ data }) => {
  data = JSON.parse(data)

  // Exclude 'total' when we're plotting
  const foodItems = Object.keys(data).filter(key => key !== 'total');

  // Generate datasets for each type of nutrient
  const datasets = [];

  // Assume all food items have same nutrient types
  const nutrientTypes = Object.keys(data[foodItems[0]]);

  nutrientTypes.forEach(nutrient => {
    const dataset = {
      label: nutrient.replace(/_/g, ' '),
      data: [],
      backgroundColor: [], // Add unique color for each nutrient type if desired
      borderColor: [],     // Add border color for each nutrient type if desired
    };

    foodItems.forEach(item => {
      dataset.data.push(data[item][nutrient].amount);
      // You could attach a dynamic color here if desired
      dataset.backgroundColor.push('rgba(255, 99, 132, 0.5)');
      dataset.borderColor.push('rgba(255, 99, 132, 1)');
    });

    datasets.push(dataset);
  });

  const chartData = {
    labels: foodItems,
    datasets: datasets,
  };

  const chartOptions = {
    // scales: {
    //   yAxes: [{
    //     ticks: {
    //       beginAtZero: true
    //     }
    //   }]
    // }
  };

  return <Bar data={chartData} options={chartOptions} />;
};


const NutritionDataAndError = ({ nutritionData, error }) => {
  return (
    <>
      {nutritionData && (
        <Card.Text className="mt-3">
          <NutritionTable data={nutritionData} />
          <NutritionBarPlot data={nutritionData} />
        </Card.Text>
      )}
      {error && (
        <Card.Text className="text-danger">
          Error: {error}
        </Card.Text>
      )}
    </>
  );
};


const NutritionFetcher = () => {
  const [apiKey, setApiKey] = useState('');
  const [description, setDescription] = useState('');
  const [nutritionData, setNutritionData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!apiKey || !description) {
      setError('API Key and Description are required');
      return;
    }

    setError(null);
    setLoading(true);
    setNutritionData('');

    try {
      const response = await fetchNutritionData({ apiKey, description });
      setLoading(false);
      setNutritionData(response);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || 'An error occurred while fetching data');
    }
  };
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>OpenAI API Key</Form.Label>
                  <Form.Control
                    // type="password"
                    placeholder="Enter API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description of Meal</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="What did you eat?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <NutritionDataAndError nutritionData={nutritionData} error={error} />
        </Col>
      </Row>
    </Container>
  );
};

const App = () => (
  <NutritionFetcher />
);

export default App;

import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

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


const NutritionTable = ({ data }) => {
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
  data = JSON.parse(data);

  // Exclude 'total' when we're plotting
  const foodItems = Object.keys(data).filter(key => key !== 'total');

  // Generate datasets for each food item
  const datasets = foodItems.map((item, index) => {
    // Getting a unique color for each food item 
    const color = `hsl(${index * 360 / foodItems.length}, 70%, 60%)`; // Generating a HSL color based on the index

    // Create a dataset for this food item including each nutrient type as an object
    const dataset = {
      label: item,
      data: [], // This will include the percentage for each nutrient type
      backgroundColor: color, // Assign the unique color for this food item
    };

    // Loop through each nutrient type and add the percentage data
    for (let nutrient in data[item]) {
      dataset.data.push(data[item][nutrient].percentage);
    }

    return dataset;
  });

  // Get nutrient types for labels assuming the first food item has all possible nutrients
  const nutrientTypes = Object.keys(data[foodItems[0]]);

  const chartData = {
    labels: nutrientTypes,  // Use the nutrient types as the labels for the chart
    datasets: datasets,      // The datasets we prepared representing each food item
  };

  const chartOptions = {
    indexAxis: 'y', // Set to 'y' to make bars horizontal
    scales: {
      x: {
        stacked: true, // Enable stacked bars for each nutrient type across food items
      },
      y: {
        stacked: true, // Stacking is needed on the y-axis as well to show total percentage
        ticks: {
          beginAtZero: true,
          suggestedMax: 100, // Cap the percentage at 100
        }
      }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export const NutritionDataAndError = ({ nutritionData, error }) => {
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
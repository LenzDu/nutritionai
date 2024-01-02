import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import { dailyValue } from '../reference-data';

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

// Define a function to calculate the percentage
const calculatePercentage = (amount, nutrient) => {
  const recommendedAmount = dailyValue[nutrient];
  return (amount / recommendedAmount) * 100;
};

const calculateTotalNutrients = (data, nutrientTypes) => {
  // Initialize an object to store total amounts for each nutrient
  let totals = nutrientTypes.reduce((acc, nutrient) => {
    acc[nutrient] = 0;
    return acc;
  }, {});

  // Sum up all the amounts for each nutrient
  Object.values(data).filter(foodData => foodData !== data.total).forEach(foodData => {
    nutrientTypes.forEach(nutrient => {
      totals[nutrient] += foodData[nutrient] || 0;
    });
  });

  return totals;
};

const NutritionTable = ({ data }) => {
  const firstFoodItemKey = Object.keys(data).find(key => key !== 'total');
  const nutritionTypes = firstFoodItemKey ? Object.keys(data[firstFoodItemKey]) : [];

  const tableHeader = (
    <thead>
      <tr>
        <th>Food</th>
        {nutritionTypes.map((type) => (
          <th key={type}>
            {type.replace(/_/g, ' ')} {type !== 'calories' ? '(g)' : ''}
          </th>
        ))}
      </tr>
    </thead>
  );

  // Render one row of food data with percentage calculations
  const renderTableRow = (foodName, nutrients) => {
    return (
      <tr key={foodName}>
        <td>{foodName}</td>
        {nutritionTypes.map((type) => {
          const amount = nutrients[type] || 0;
          const percentage = calculatePercentage(amount, type);
          return (
            <td key={type}>
              {amount} ({percentage.toFixed(0)}%)
            </td>
          );
        })}
      </tr>
    );
  };

  // Function to calculate the total nutrients and render the total row
  const renderTotalRow = () => {
    const totals = calculateTotalNutrients(data, nutritionTypes);
    return renderTableRow('Total', totals);
  };

  const foodNames = Object.keys(data).filter(key => key !== 'total');
  const tableBody = (
    <tbody>
      {foodNames.map((foodName) => renderTableRow(foodName, data[foodName]))}
      {renderTotalRow()}
    </tbody>
  );

  // Style definitions for the compact table and smaller fonts
  const tableStyle = {
    fontSize: '0.85rem', // Adjust font size as needed for smaller text
  };

  return (
    <Table striped bordered hover size="sm" style={tableStyle}>
      {tableHeader}
      {tableBody}
    </Table>
  );
};

const NutritionBarPlot = ({ data }) => {
  const foodItems = Object.keys(data).filter(key => key !== 'total');

  const datasets = foodItems.map((item, index) => {
    const color = `hsl(${index * 360 / foodItems.length}, 70%, 60%)`;
    const dataset = {
      label: item,
      data: [],
      backgroundColor: color,
    };

    for (let nutrient in data[item]) {
      const amount = data[item][nutrient];
      const percentage = calculatePercentage(amount, nutrient);
      dataset.data.push(percentage);
    }

    return dataset;
  });

  const nutrientTypes = Object.keys(data[foodItems[0]]);

  const chartData = {
    labels: nutrientTypes,
    datasets: datasets,
  };

  const chartOptions = {
    indexAxis: 'y',
    // plugins: {
    //   title: {
    //     display: true,
    //     text: 'Nutrition Data',
    //   },
    // },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: '% Daily Intake',
        },
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: true,
          // suggestedMax: 100,
        }
      }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};

const FoodSummary = ({ data }) => {
  return (
    <>
      <strong>Food Breakdown</strong>
      <div className="compact-list">
        <ul>
          {Object.entries(data).map(([foodItem, description], index) => (
            <li key={index}>
              <strong>{foodItem}:</strong> {description}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export const DataDisplay = ({ nutritionData }) => {
  if (!nutritionData) return null;

  const data = JSON.parse(nutritionData)

  return (
    // <Card.Text className="mt-3">
    <>
      <FoodSummary data={data.food_summary} />
      <NutritionTable data={data.nutrition_breakdown} />
      <NutritionBarPlot data={data.nutrition_breakdown} />
    </>
    // </Card.Text>
  );
};

export const ErrorDisplay = ({ error }) => {
  return (
    <>
      {error && (
        <Card.Text className="text-danger">
          Error: {error}
        </Card.Text>
      )}
    </>
  );
};
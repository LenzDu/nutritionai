import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import { calculatePercentage, calculateTotalNutrients } from '../utils/calculate';
import NutrientCardsContainer from './nutrient-cards';
import SaveData from './save-data'

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
        <td><strong>{foodName}</strong></td>
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
    const totals = calculateTotalNutrients(data);
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
    <Table responsive striped bordered hover size="sm" style={tableStyle}>
      {tableHeader}
      {tableBody}
    </Table>
  );
};

const NutritionBarPlot = ({ data }) => {
  const foodItems = Object.keys(data);

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
    plugins: {
      title: {
        display: true,
        text: 'Nutrients Breakdown (% Daily Intake)',
      },
    },
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
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return <div style={{ height: '40vh', minHeight: '200px' }}>
    <Bar data={chartData} options={chartOptions} />
  </div>
};

const FoodSummary = ({ data }) => {
  return (
    <>
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

  const data = JSON.parse(nutritionData);
  const totals = calculateTotalNutrients(data.nutrition_breakdown);

  return (
    <>
      <hr></hr>
      <strong>Food Breakdown</strong>
      <FoodSummary data={data.food_summary} />
      <hr></hr>
      <strong>Nutrients Breakdown</strong>
      <NutrientCardsContainer data={data.nutrition_breakdown} />
      <hr></hr>
      {/* <NutritionTable data={data.nutrition_breakdown} /> */}
      <NutritionBarPlot data={data.nutrition_breakdown} />

      <SaveData data={totals} />
    </>
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
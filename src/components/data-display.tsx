import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import { calculatePercentage, calculateTotalNutrients } from '../utils/calculate';
import NutrientCardsContainer from './nutrient-cards';
import SaveData from './save-data'
import { useDailyValueStore } from '../stores';

import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
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

interface NutritionData {
  [item: string]: {
    [nutrient: string]: number;
  };
}

const NutritionBarPlot = ({ data }) => {
  const foodItems = Object.keys(data);
  const dailyValue = useDailyValueStore((state) => state.value);

  const datasets = foodItems.map((item, index) => {
    const color = `hsl(${index * 360 / foodItems.length}, 70%, 60%)`;
    const dataset = {
      label: item,
      data: [] as number[],
      backgroundColor: color,
    };

    for (let nutrient in data[item]) {
      const amount = data[item][nutrient];
      const percentage = calculatePercentage(dailyValue, amount, nutrient);
      dataset.data.push(percentage);
    }

    return dataset;
  });

  const nutrientTypes = Object.keys(data[foodItems[0]]);

  const chartData: ChartData<'bar', number[], string> = {
    labels: nutrientTypes,
    datasets: datasets,
  };

  const chartOptions: ChartOptions<'bar'> = {
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
        min: 0,
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '40vh', minHeight: '200px' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

interface FoodSummaryProps {
  // Assuming `data` is an object with string keys and string values
  data: Record<string, string>;
};

const FoodSummary: React.FC<FoodSummaryProps> = ({ data }) => {
  return (
    <div className="compact-list">
      <ul>
        {Object.entries(data).map(([foodItem, description], index) => (
          <li key={index}>
            <strong>{foodItem}:</strong> {description}
          </li>
        ))}
      </ul>
    </div>
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
      <br></br>
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
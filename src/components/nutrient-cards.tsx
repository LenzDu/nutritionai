import React, { useState } from 'react';
import { Card, Accordion, useAccordionButton, AccordionButton, Row, Col, ListGroup } from 'react-bootstrap';

import { calculatePercentage, calculateTotalNutrients, calculateMaxContributor } from '../utils/calculate';
import { useDailyValueStore } from '../stores';


const NutrientDetails = ({ data, nutrient }) => {
  const dailyValue = useDailyValueStore((state) => state.value);

  return (
    <ListGroup>
      {Object.entries(data).sort((a, b) => b[1][nutrient] - a[1][nutrient])
        .map(([foodName, nutrients]) => {
          const amount = nutrients[nutrient];
          const percentage = calculatePercentage(dailyValue, amount, nutrient);
          return (
            <div key={foodName} style={{ fontSize: '0.9rem' }}>
              <ListGroup.Item>{`${foodName}: ${amount}${nutrient !== 'calories' ? 'g' : ''} (${percentage.toFixed(2)}%)`}</ListGroup.Item>
              {/* {`${foodName}: ${amount}g (${percentage.toFixed(2)}%)`} */}
            </div>
          );
        })}
    </ListGroup>
  )
};

const NutrientCard = ({ data, nutrient, title }) => {
  const [expanded, setExpanded] = useState(false);
  const dailyValue = useDailyValueStore((state) => state.value);
  const total = calculateTotalNutrients(data);
  const amount = total[nutrient];
  const percentage = calculatePercentage(dailyValue, amount, nutrient);
  const maxContributor = calculateMaxContributor(data, nutrient);
  const maxContributorPercentage = calculatePercentage(dailyValue, maxContributor.amount, nutrient);

  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => setExpanded(!expanded));
    return (
      <Card.Header onClick={decoratedOnClick}>
        {children}
      </Card.Header>
    );
  };

  return (
    <Card className='my-2'>
      <CustomToggle eventKey={nutrient}>
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ fontSize: '0.9rem' }}>
            <strong>{title}</strong>: {amount.toFixed(0)}{nutrient !== 'calories' ? 'g' : ''} ({percentage.toFixed(0)}%)
          </div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
            <strong>{maxContributor.name}</strong> contributes {maxContributorPercentage.toFixed(0)}%
          </div>
        </div>
      </CustomToggle>
      <Accordion.Collapse eventKey={nutrient}>
        <NutrientDetails data={data} nutrient={nutrient} />
      </Accordion.Collapse>
    </Card>
  );
};


const NutrientCardsContainer = ({ data }) => {

  const nutrientTitles = {
    calories: "Cal",
    protein: "Protein",
    saturated_fat: "Sat Fat",
    total_fat: "Tot Fat",
    carbohydrate: "Carb",
    dietary_fiber: "Fiber"
  };

  const columnsForNutrients = Object.keys(nutrientTitles).map(nutrient => (
    // <Col xs={12} sm={6} lg={4} key={nutrient}>
    <NutrientCard
      data={data}
      nutrient={nutrient}
      title={nutrientTitles[nutrient]}
    />
    // </Col>
  ));

  return (
    <Accordion defaultActiveKey="">
      {columnsForNutrients}
      {/* <Row>{columnsForNutrients}</Row> */}
    </Accordion>
  );
};

export default NutrientCardsContainer;

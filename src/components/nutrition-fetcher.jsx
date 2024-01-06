import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';

import { fetchNutritionData, getInitialPrompt, getFollowUpPrompt, calcualteCost } from '../api';
import { DataDisplay, ErrorDisplay } from './data-display';

const setSessionState = (key, value, setter) => {
  setter(value)
  sessionStorage.setItem(key, JSON.stringify(value))
};

const getSessionState = (key) => {
  const data = sessionStorage.getItem(key)
  return JSON.parse(data)
};

const NutritionFetcher = ( { apiKey } ) => {
  const [description, setDescription] = useState(getSessionState('description') || '');
  const [cost, setCost] = useState(getSessionState('cost') || 0);

  const [conversation, setConversation] = useState(getSessionState('conversation') || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!apiKey || !description) {
      setError('API Key and Description are required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const messages = conversation.length === 0 ? getInitialPrompt(description) : getFollowUpPrompt(conversation, description);
      const { message, usage } = await fetchNutritionData({ apiKey, messages });
      setLoading(false);

      setSessionState('conversation', [
        ...messages,
        { role: "assistant", content: message }
      ], setConversation)
      setSessionState('description', '', setDescription);
      setSessionState('cost', cost + calcualteCost(usage), setCost)

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || `An error occurred while fetching data: ${err}`);
    }
  };

  const handleStartOver = () => {
    setError(null);
    setSessionState('description', '', setDescription);
    setSessionState('conversation', [], setConversation);
    setSessionState('cost', 0, setCost)
  };

  const renderConversation = () => {
    return conversation.filter((item) => item?.role === 'user').map((entry, index) => (
      <Card key={index} className="mb-2">
        <Card.Body>
          <Card.Text>{entry.content}</Card.Text>
        </Card.Body>
      </Card>
    ));
  };


  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col md={6}>

            <Card>
              <Card.Body>
                <Form>
                  <Form.Label>Describe Your Meal</Form.Label>

                  {renderConversation()}

                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder={
                        conversation.length === 0
                          ? "What did you eat?"
                          : "Provide more details..."
                      }
                      value={description}
                      onChange={(e) => setSessionState('description', e.target.value, setDescription)}
                    />
                  </Form.Group>

                  <Button
                    className='me-2'
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {
                      loading
                        ? 'Loading...'
                        : conversation.length === 0 ? "Get Results" : "Update Results"
                    }
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleStartOver}
                    disabled={loading}
                    hidden={conversation.length === 0}
                  >
                    Start Over
                  </Button>

                  <div style={{ fontSize: '0.75rem', fontStyle: 'italic', paddingTop: '5px' }}>
                    Conversation Cost: ${cost.toFixed(3)}
                  </div>

                </Form>
              </Card.Body>
            </Card>

            <DataDisplay nutritionData={conversation[conversation.length - 1]?.content} />
            <ErrorDisplay error={error} />
          </Col>
        </Row>
      </Container >
    </>
  );
};

export default NutritionFetcher
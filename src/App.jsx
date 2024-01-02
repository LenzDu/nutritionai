import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';

import { fetchNutritionData, getInitialPrompt, getFollowUpPrompt, calcualteCost } from './api';
import { DataDisplay, ErrorDisplay } from './components/data-display';
import ApiPopupModal from './components/api-modal'
import NavbarComponent from './components/nav-bar'

const NutritionFetcher = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [showModal, setShowModal] = useState(!localStorage.getItem('apiKey'));
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(0)

  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Save the API key whenever it changes
  //   if (apiKey) {
  //     localStorage.setItem('apiKey', apiKey);
  //   }
  // }, [apiKey]);


  const handleSubmit = async () => {
    if (!apiKey || !description) {
      setError('API Key and Description are required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const messages = conversation.length == 0 ? getInitialPrompt(description) : getFollowUpPrompt(conversation, description);
      const { message, usage } = await fetchNutritionData({ apiKey, messages });
      setLoading(false);

      setConversation([
        ...messages,
        { role: "assistant", content: message }
      ])
      setDescription('')
      setCost(cost + calcualteCost(usage))

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || `An error occurred while fetching data: ${err}`);
    }
  };
  
  const handleStartOver = () => {
    setError(null);
    setDescription('');
    setConversation([]);
    setCost(0);
  };

  const renderConversation = () => {
    return conversation.filter((item) => item?.role == 'user').map((entry, index) => (
      <Card key={index} className="mb-2">
        <Card.Body>
          <Card.Text>{entry.content}</Card.Text>
        </Card.Body>
      </Card>
    ));
  };


  return (
    <>
      <NavbarComponent setShowModal={setShowModal} />

      <Container fluid>
        <Row className="justify-content-md-center">
          <Col md={6}>
            {/* <Button variant="primary" onClick={() => setShowModal(true)}>
              Set API Key
            </Button> */}

            <ApiPopupModal
              apiKey={apiKey}
              setApiKey={setApiKey}
              showModal={showModal}
              setShowModal={setShowModal}
            />

            <Card>
              <Card.Body>
                <Form>

                  {renderConversation()}

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
                    className='me-2'
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Submit'}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleStartOver}
                    disabled={loading}
                  >
                    Start Over
                  </Button>

                  <div style={{ fontSize: '0.75rem', fontStyle: 'italic', paddingTop: '5px' }}>
                    Conversation Cost: ${cost.toFixed(3)}
                  </div>

                </Form>
              </Card.Body>
            </Card>

            <hr></hr>

            <DataDisplay nutritionData={conversation[conversation.length - 1]?.content} />
            <ErrorDisplay error={error} />
          </Col>
        </Row>
      </Container >
    </>
  );
};

const App = () => (
  <NutritionFetcher />
);

export default App;

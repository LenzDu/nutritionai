import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';

import { fetchNutritionData, getInitialPrompt, getFollowUpPrompt } from './fetch';
import { NutritionDataAndError } from './data-display';

const NutritionFetcher = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [description, setDescription] = useState('');
  
  // const [followUpInput, setFollowUpInput] = useState('');
  const [conversation, setConversation] = useState([]);
  // const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Save the API key whenever it changes
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
    }
  }, [apiKey]);


  const handleSubmit = async () => {
    if (!apiKey || !description) {
      setError('API Key and Description are required');
      return;
    }

    setError(null);
    setLoading(true);
    // setNutritionData('');
    
    try {
      const messages = conversation.length == 0 ? getInitialPrompt(description) : getFollowUpPrompt(conversation, description);
      console.log(messages)
      const response = await fetchNutritionData({ apiKey, messages });
      setLoading(false);

      setConversation([
        ...messages,
        { role: "assistant", content: response }
      ])
      setDescription('')
      // const newConversation = [prompt, response];
      // newConversation[index].output = textOutput;

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || `An error occurred while fetching data: ${err}`);
    }
  };

  // const handleChange = (value, index) => {
  //   const newConversation = [...conversation];
  //   newConversation[index].input = value;
  //   setConversation(newConversation);
  // }

  const renderConversation = () => {
    return conversation.filter((item) => item?.role == 'user').map((entry, index) => (
      <Card key={index} className="mb-2">
        <Card.Body>
          <Card.Text>{entry.content}</Card.Text>
            
          {/* <Card.Text>Output:</Card.Text>
          <pre>{entry.output}</pre> */}
        </Card.Body>
      </Card>
    ));
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
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <NutritionDataAndError nutritionData={conversation[conversation.length - 1]?.content} error={error} />
        </Col>
      </Row>
    </Container>
  );
};

const App = () => (
  <NutritionFetcher />
);

export default App;

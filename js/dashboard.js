import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  color: #333;
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const CreateButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1.25rem;
  color: white;
  background: #4a90e2;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #357ABD;
  }
`;

const Dashboard = () => {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    
    try {
      const response = await fetch('/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: '', projectId: '' }) // Include the code parameter
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const responseData = await response.json();
      console.log('Success:', responseData);
      
      window.location.href = `/editorPage?projectId=${responseData.projectId}`;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      <form onSubmit={handleSubmit}>
        <CreateButton type="submit">Create Project</CreateButton>
      </form>
    </DashboardContainer>
  );
};

export default Dashboard;

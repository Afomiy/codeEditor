import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateUniqueId } from './utils';
const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [projectLink, setProjectLink] = useState('');
    const navigate = useNavigate();

    const handleCreateProject = async () => {
        const projectId = generateUniqueId();
        if (username) {
            const response = await fetch('http://localhost:3001/create-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId, username })
            });

            if (response.ok) {
                navigate(`/editorPage?projectId=${projectId}&username=${username}&isCreator=true`);
            } else {
                alert('Failed to create project');
            }
        } else {
            alert('Username is required');
        }
    };

    const handleJoinProject = (event) => {
        event.preventDefault();
        try {
            const url = new URL(projectLink);
            const projectId = url.searchParams.get('projectId');
            const username = 'undefined'; // Set username to a default value or retrieve it from the dashboard input field
    
            if (projectId && username) {
                navigate(`/editorPage?projectId=${projectId}&username=${username}&isCreator=false`);
            } else {
                alert('Invalid project link or username');
            }
        } catch (error) {
            console.error('Error parsing project link:', error);
            alert('Invalid project link format');
        }
    };
    

    const createProject = async (username) => {
        try {
            const response = await fetch('http://localhost:3001/create-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                const data = await response.json();
                return data.projectId;
            } else {
                console.error('Failed to create project');
                return null;
            }
        } catch (error) {
            console.error('Error creating project:', error);
            return null;
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button onClick={handleCreateProject}>Create Project</button>
            </div>
            <form onSubmit={handleJoinProject}>
                <input
                    type="text"
                    placeholder="Enter project link"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    required
                />
                <button type="submit">Join Project</button>
            </form>
        </div>
    );
};

export default Dashboard;

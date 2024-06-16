import React, { useEffect, useState, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditorPage.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Establish the WebSocket connection

const EditorPage = () => {
    const [code, setCode] = useState('');
    const [projectId, setProjectId] = useState('');
    const [isCreator, setIsCreator] = useState(false);
    const [username, setUsername] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const editorRef = useRef(null);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const projectId = urlParams.get('projectId');
        const username = urlParams.get('username');
        const isCreator = urlParams.get('isCreator') === 'true';

        if (!projectId || !username) {
            console.error('Project ID or username is missing from URL parameters.');
            return;
        }

        setProjectId(projectId);
        setUsername(username);
        setIsCreator(isCreator);

        socket.emit('join', { projectId, username });

        fetch(`/get-project?projectId=${projectId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.code) {
                    setCode(data.code);
                }
            })
            .catch(error => console.error('Error loading project:', error));

        socket.on('editorUpdate', function(data) {
            if (data.projectId === projectId) {
                setCode(data.content);
            }
        });

        socket.on('userJoined', (userList) => {
            setConnectedUsers(userList);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleEditorChange = (newCode) => {
        setCode(newCode);
        socket.emit('editorChange', { content: newCode, projectId });
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleInviteSubmit = async (event) => {
        event.preventDefault();
        const recipientEmail = document.getElementById('recipientEmail').value;

        try {
            const response = await fetch('http://localhost:3001/send-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: recipientEmail, projectId })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Invitation sent successfully! Link: ' + data.invitationLink);
            } else {
                alert('Failed to send invitation.');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Failed to send invitation.');
        }
    };

    const handleUndo = () => {
        if (editorRef.current) {
            editorRef.current.trigger('editor', 'undo');
        }
    };

    const handleRedo = () => {
        if (editorRef.current) {
            editorRef.current.trigger('editor', 'redo');
        }
    };

    const handleSave = () => {
        socket.emit('saveCode', { projectId, code });
    };

    const handleRevert = async () => {
        try {
            const response = await fetch(`/get-previous-version?projectId=${projectId}`);
            if (response.ok) {
                const data = await response.json();
                setCode(data.previousVersion);
                alert('Reverted to previous version');
            } else {
                console.error('Failed to get previous version');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteProject = () => {
        socket.emit('deleteProject', { projectId });
    };

    const handleDeleteUser = () => {
        const userToDelete = prompt('Enter the username to delete:');
        if (userToDelete) {
            socket.emit('deleteUser', { projectId, username: userToDelete });
        }
    };

    return (
        <div className="editor-page">
            <div className="controls">
                <button onClick={handleUndo}>Undo</button>
                <button onClick={handleRedo}>Redo</button>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleRevert}>Revert</button>
                {isCreator && (
                    <>
                        <button onClick={handleDeleteProject}>Delete Project</button>
                        <button onClick={handleDeleteUser}>Delete User</button>
                    </>
                )}
            </div>
            <form onSubmit={handleInviteSubmit}>
                <input type="email" id="recipientEmail" required />
                <button type="submit">Send Invite</button>
            </form>
            <MonacoEditor
                width="800"
                height="600"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                editorDidMount={handleEditorDidMount}
            />
            <div className="connected-users">
                <h4>Connected Users:</h4>
                <ul>
                    {connectedUsers.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EditorPage;

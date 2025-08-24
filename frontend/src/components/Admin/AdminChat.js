import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../services/auth';
import { getConversations, getMessages, sendMessage } from '../../services/api';
import socketService from '../../services/socket';
import '../../styles/Admin.css';

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.is_admin) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const convos = await getConversations();
      setConversations(convos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      const chatMessages = await getMessages(conversation.room_id);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await sendMessage({
        message: newMessage,
        room_id: selectedConversation.room_id
      });
      setNewMessage('');
      // Recharger les messages
      const chatMessages = await getMessages(selectedConversation.room_id);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Accès réservé aux administrateurs
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="admin-header">
        <h1>Messagerie Admin</h1>
        <p>Gestion des conversations clients</p>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Conversations</h5>
            </div>
            <div className="card-body p-0">
              {conversations.map(conv => (
                <div
                  key={conv.room_id}
                  className={`conversation-item ${selectedConversation?.room_id === conv.room_id ? 'active' : ''}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conversation-user">
                    <strong>{conv.user_name || 'Utilisateur'}</strong>
                    <small className="text-muted">{conv.email}</small>
                  </div>
                  <div className="conversation-preview">
                    {conv.last_message?.substring(0, 50)}...
                  </div>
                  <small className="text-muted">
                    {new Date(conv.last_message_time).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {selectedConversation ? (
            <div className="card">
              <div className="card-header">
                <h5>Conversation avec {selectedConversation.user_name}</h5>
              </div>
              <div className="card-body chat-messages">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.user_id === user.id ? 'own' : 'other'}`}>
                    <div className="message-content">
                      {message.message}
                    </div>
                    <div className="message-meta">
                      <span className="message-sender">{message.user_name}</span>
                      <span className="message-time">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <form onSubmit={handleSendMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Envoi...' : 'Envoyer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-comments fa-3x text-muted mb-3"></i>
              <h4>Sélectionnez une conversation</h4>
              <p className="text-muted">Choisissez une conversation dans la liste pour commencer à discuter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
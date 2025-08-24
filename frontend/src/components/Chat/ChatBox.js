import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../services/auth';
import { getMessages, sendMessage, getConversations } from '../../services/api';
import '../../styles/Chat.css';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  // Vérifier si l'utilisateur est connecté et est admin
  const isAdmin = user?.is_admin || false;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      if (isAdmin) {
        loadConversations();
      } else {
        loadMessages();
      }
    }
  }, [isOpen, isAuthenticated, isAdmin]);

  const loadConversations = async () => {
    try {
      const convos = await getConversations();
      setConversations(convos);
      if (convos.length > 0 && !selectedRoom) {
        setSelectedRoom(convos[0].room_id);
        loadMessages(convos[0].room_id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (roomId = null) => {
    try {
      const targetRoomId = roomId || (isAdmin ? selectedRoom : `user_${user.id}`);
      if (!targetRoomId) return;
      
      const chatMessages = await getMessages(targetRoomId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (isAdmin && !selectedRoom) {
      alert('Veuillez d\'abord sélectionner une conversation');
      return;
    }

    setLoading(true);
    try {
      const messageData = {
        message: newMessage.trim(),
        ...(isAdmin && selectedRoom && { room_id: selectedRoom })
      };
      
      await sendMessage(messageData);
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = (conversation) => {
    setSelectedRoom(conversation.room_id);
    loadMessages(conversation.room_id);
  };

  // Si l'utilisateur n'est pas connecté, ne pas afficher le chat
  if (!isAuthenticated) {
    return null;
  }

  if (!isOpen) {
    return (
      <button 
        className="chat-toggle-btn"
        onClick={() => setIsOpen(true)}
        title="Ouvrir le chat"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: '1001',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#F7B500',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        <i className="fas fa-comments"></i>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      width: isAdmin ? '400px' : '350px',
      height: '500px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 5px 25px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        background: '#F7B500',
        color: 'white',
        padding: '15px',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h6 className="mb-0">
          {isAdmin ? 'Support Client' : 'Support Technique'}
        </h6>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer' 
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {isAdmin && conversations.length > 0 && (
        <div style={{
          borderBottom: '1px solid #eee',
          padding: '10px',
          maxHeight: '120px',
          overflowY: 'auto'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Conversations</div>
          {conversations.map(conv => (
            <div
              key={conv.room_id}
              onClick={() => selectConversation(conv)}
              style={{
                padding: '8px',
                margin: '2px 0',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: selectedRoom === conv.room_id ? '#e3f2fd' : 'transparent',
                border: selectedRoom === conv.room_id ? '1px solid #2196f3' : '1px solid transparent'
              }}
            >
              <div style={{ fontWeight: '500' }}>{conv.user_name || 'Utilisateur'}</div>
              <small style={{ color: '#666' }}>{conv.email}</small>
            </div>
          ))}
        </div>
      )}

      <div style={{
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        maxHeight: '300px'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            <i className="fas fa-comments" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
            <p>{isAdmin ? 'Sélectionnez une conversation' : 'Aucun message'}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              style={{
                marginBottom: '15px',
                padding: '10px 15px',
                borderRadius: '18px',
                maxWidth: '80%',
                marginLeft: message.user_id === user.id ? 'auto' : '0',
                marginRight: message.user_id === user.id ? '0' : 'auto',
                background: message.user_id === user.id ? '#e6f7ff' : '#f1f1f1',
                borderBottomRightRadius: message.user_id === user.id ? '5px' : '18px',
                borderBottomLeftRadius: message.user_id === user.id ? '18px' : '5px'
              }}
            >
              <div>{message.message}</div>
              <div style={{
                fontSize: '0.8em',
                color: '#666',
                marginTop: '5px',
                textAlign: message.user_id === user.id ? 'right' : 'left'
              }}>
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} style={{
        padding: '15px',
        borderTop: '1px solid #e8e8e8'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder={isAdmin && !selectedRoom ? "Sélectionnez une conversation" : "Tapez votre message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading || (isAdmin && !selectedRoom)}
            style={{
              flex: 1,
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '20px',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            disabled={loading || (isAdmin && !selectedRoom)}
            style={{
              padding: '10px 15px',
              background: '#F7B500',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              opacity: (loading || (isAdmin && !selectedRoom)) ? 0.5 : 1
            }}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
const db = require('../config/database');

const getMessages = async (req, res) => {
  try {
    const { room_id } = req.query;
    
    let query, values;
    
    if (req.user.is_admin && room_id) {
      // Admin regarde une conversation spécifique
      query = `
        SELECT m.*, u.name as user_name 
        FROM messages m 
        LEFT JOIN users u ON m.user_id = u.id 
        WHERE m.room_id = $1 
        ORDER BY m.created_at ASC
      `;
      values = [room_id];
    } else if (req.user.is_admin) {
      // Admin veut toutes les conversations (pour la liste)
      query = `
        SELECT DISTINCT ON (m.room_id) 
          m.room_id,
          u.id as user_id,
          u.name as user_name,
          u.email,
          m.message as last_message,
          m.created_at as last_message_time
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        ORDER BY m.room_id, m.created_at DESC
      `;
      values = [];
    } else {
      // Utilisateur normal voit ses messages
      query = `
        SELECT m.*, COALESCE(u.name, 'Utilisateur') as user_name 
        FROM messages m 
        LEFT JOIN users u ON m.user_id = u.id 
        WHERE m.room_id = $1 
        ORDER BY m.created_at ASC
      `;
      values = [`user_${req.user.id}`];
    }

    const messages = await db.query(query, values);
    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { message, room_id } = req.body;

  try {
    // Déterminer la room_id
    let targetRoomId;
    
    if (req.user.is_admin) {
      // Admin envoie à une room spécifique
      if (!room_id) {
        return res.status(400).json({ message: 'Room ID required for admin' });
      }
      targetRoomId = room_id;
    } else {
      // Utilisateur normal envoie à sa room
      targetRoomId = `user_${req.user.id}`;
    }

    const newMessage = await db.query(
      `INSERT INTO messages (room_id, user_id, message) 
       VALUES ($1, $2, $3) RETURNING *`,
      [targetRoomId, req.user.id, message]
    );
    
    // Récupérer le nom de l'utilisateur
    const userResult = await db.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]
    );
    
    const user_name = userResult.rows[0]?.name || 'Utilisateur';
    
    const responseMessage = {
      ...newMessage.rows[0],
      user_name: user_name
    };
    
    res.status(201).json(responseMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await db.query(`
      SELECT 
        m.room_id,
        u.id as user_id,
        u.name as user_name,
        u.email,
        COUNT(m.id) as message_count,
        MAX(m.created_at) as last_message_time
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.room_id LIKE 'user_%'
      GROUP BY m.room_id, u.id, u.name, u.email
      ORDER BY last_message_time DESC
    `);
    
    res.json(conversations.rows);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  getConversations
};
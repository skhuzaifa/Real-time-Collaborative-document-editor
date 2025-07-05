const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage for documents and users
const documents = new Map();
const users = new Map();
const documentUsers = new Map();

// Data persistence
const DATA_FILE = path.join(__dirname, 'documents.json');

// Load documents from file
async function loadDocuments() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const savedData = JSON.parse(data);
    savedData.forEach(doc => {
      documents.set(doc.id, doc);
    });
    console.log('Documents loaded from file');
  } catch (error) {
    console.log('No existing documents file found, starting fresh');
  }
}

// Save documents to file
async function saveDocuments() {
  try {
    const docsArray = Array.from(documents.values());
    await fs.writeFile(DATA_FILE, JSON.stringify(docsArray, null, 2));
  } catch (error) {
    console.error('Error saving documents:', error);
  }
}

// Default document
const defaultDocument = {
  id: 'default',
  title: 'Welcome to Collaborative Editor',
  content: 'Start typing to begin collaborating in real-time!\n\nFeatures:\n• Real-time collaboration\n• Multiple users support\n• Auto-save functionality\n• User presence indicators',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Initialize with default document
documents.set('default', defaultDocument);

// API Routes
app.get('/api/documents', (req, res) => {
  const docsList = Array.from(documents.values()).map(doc => ({
    id: doc.id,
    title: doc.title,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }));
  res.json(docsList);
});

app.get('/api/documents/:id', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(doc);
});

app.post('/api/documents', (req, res) => {
  const { title } = req.body;
  const newDoc = {
    id: uuidv4(),
    title: title || 'Untitled Document',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  documents.set(newDoc.id, newDoc);
  saveDocuments();
  res.json(newDoc);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-document', (data) => {
    const { documentId, user } = data;
    
    // Store user information
    users.set(socket.id, { ...user, socketId: socket.id });
    
    // Join document room
    socket.join(documentId);
    
    // Track users in document
    if (!documentUsers.has(documentId)) {
      documentUsers.set(documentId, new Set());
    }
    documentUsers.get(documentId).add(socket.id);
    
    // Get document
    const document = documents.get(documentId);
    if (document) {
      socket.emit('document-loaded', document);
    }
    
    // Send current users in document
    const currentUsers = Array.from(documentUsers.get(documentId) || [])
      .map(id => users.get(id))
      .filter(Boolean);
    
    io.to(documentId).emit('users-update', currentUsers);
  });

  socket.on('document-change', (data) => {
    const { documentId, content, user } = data;
    
    // Update document
    const document = documents.get(documentId);
    if (document) {
      document.content = content;
      document.updatedAt = new Date().toISOString();
      documents.set(documentId, document);
      
      // Broadcast to other users in the document
      socket.to(documentId).emit('document-update', {
        content,
        user
      });
      
      // Auto-save every 5 seconds
      clearTimeout(document.saveTimeout);
      document.saveTimeout = setTimeout(() => {
        saveDocuments();
      }, 5000);
    }
  });

  socket.on('cursor-position', (data) => {
    const { documentId, position, user } = data;
    socket.to(documentId).emit('cursor-update', {
      position,
      user
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all documents
    for (const [documentId, userSet] of documentUsers.entries()) {
      if (userSet.has(socket.id)) {
        userSet.delete(socket.id);
        
        // Update users list for this document
        const currentUsers = Array.from(userSet)
          .map(id => users.get(id))
          .filter(Boolean);
        
        io.to(documentId).emit('users-update', currentUsers);
      }
    }
    
    // Remove user
    users.delete(socket.id);
  });
});

// Load documents on startup
loadDocuments();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Saving documents before shutdown...');
  await saveDocuments();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
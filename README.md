# Real-Time Collaborative Document Editor

#company : Codetech IT Solutions

Name: Shaik Mohammed Huzaifa

Intern id:CT04DF410

Domain: Full Stack Web Development

Duration: 4 Weeks

Mentor: NEELA SANTOSH

A full-featured collaborative document editor built with React.js, Node.js, and WebSocket technology. This application enables multiple users to edit documents simultaneously in real-time, with live cursor tracking and user presence indicators.

## Features

### Core Functionality
- **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- **Live User Presence**: See who's currently editing the document
- **Cursor Tracking**: View other users' cursor positions in real-time
- **Auto-save**: Documents are automatically saved as you type
- **Document Management**: Create, view, and organize documents
- **User Authentication**: Simple login system with user profiles

### Technical Features
- **WebSocket Communication**: Real-time bidirectional communication
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: Documents are saved to the server
- **Modern UI**: Clean, professional interface with smooth animations
- **Error Handling**: Robust error handling and reconnection logic

## Technology Stack

### Frontend
- **React.js 18** - Modern UI library
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time communication server
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Vite** - Fast build tool and development server
- **Concurrently** - Run multiple commands simultaneously
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-document-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the frontend (port 3000) and backend (port 3001) servers.

4. **Open your browser**
   Navigate to `http://localhost:3000` to access the application.

## Usage

1. **Login**: Enter your name and email to start using the editor
2. **Create Documents**: Click "New Document" to create a new collaborative document
3. **Edit Documents**: Click on any document to start editing
4. **Collaborate**: Share the document with others - they can join by selecting the same document
5. **Real-time Editing**: See changes from other users instantly
6. **User Presence**: View who else is currently editing the document

## Project Structure

```
collaborative-document-editor/
├── public/                 # Static files
├── src/                   # Frontend source code
│   ├── components/        # React components
│   │   ├── DocumentEditor.tsx
│   │   ├── DocumentList.tsx
│   │   └── UserLogin.tsx
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── server.js             # Backend server
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## API Endpoints

### REST API
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get a specific document
- `POST /api/documents` - Create a new document

### WebSocket Events
- `join-document` - Join a document room
- `document-change` - Send document changes
- `cursor-position` - Send cursor position updates
- `users-update` - Receive connected users list
- `document-update` - Receive document updates

## Building for Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run server
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built as part of CodeTech Internship Task-3
- Uses modern web technologies for real-time collaboration
- Inspired by popular collaborative editors like Google Docs

## Support

For support, please open an issue in the GitHub repository or contact the development team.

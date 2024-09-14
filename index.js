require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const app = express();

const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const classScheduleRoutes = require('./routes/classScheduleRoutes');

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://classadrig.vercel.app'
];

const corsOptions = {
    origin: function(origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // Allow the request if the origin is in the allowed list or if it's a request without origin (e.g., from Postman)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', classScheduleRoutes);

const users = {};
const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('screen sharing', payload => {
        io.to(payload.roomId).emit('screen sharing update', {
            peerID: socket.id,
            screenStreamID: payload.streamID
        });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        // Notify the room that the user has left
        io.to(roomID).emit('user left', socket.id);
    });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

server.listen(process.env.PORT || 8000, () => console.log('Server is running on port 8000'));

const io = require("socket.io")(8000, {
    cors: {
        origin: "http://localhost:5173"
    },
});

let activeUsers = [];

io.on("connection", (socket) => {

    // add new user
    socket.on("add-user", (newUserId) => {
        if(!activeUsers.some(user => user.userId === newUserId)){
            activeUsers.push({userId: newUserId, socketId: socket.id})
        }
        console.log("new user add",activeUsers)
        // console.log(activeUsers)
        io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
        activeUsers.filter(user => user.socketId !== socket.id);
        console.log("User went offline", activeUsers);

        io.emit("get-users", activeUsers);
    })

    socket.on("send-message", (data) => {
        const {receiverId} = data;
        const user =  activeUsers.find(user => user.userId === receiverId);
        console.log("sending from socket to :",receiverId) 
        console.log("user:",user) 
        // console.log(data)
        // console.log("sending from socket to :",receiverId) 
        // console.log("data: ",data)

        if (user){
            io.to(user.socketId).emit("receive-message", data);
        }
    });
});
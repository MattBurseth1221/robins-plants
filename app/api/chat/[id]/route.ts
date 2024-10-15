import { WebSocketServer } from 'ws';

let chatrooms: any = {}; // Store chatroom connections
console.log("luck");

export async function GET(request: any, { params }: any) {
  console.log('Incoming GET request:', request.method, request.url);

  console.log("oneone");
  const { id: chatroomId } = params; // Extract chatroomId from URL
  
  if (!chatrooms[chatroomId]) {
    chatrooms[chatroomId] = []; // Initialize chatroom connections array
  }

  console.log("one");

  const { socket } = request;
  const server = socket.server;

  console.log("two");

  if (!server.wss) {
    console.log("three");
    server.wss = new WebSocketServer({ noServer: true });

    console.log("four");

    server.on('upgrade', (req: any, sock: any, head: any) => {
      console.log("five");
      const roomId = req.url.split('/').pop(); // Get chatroomId from URL

      console.log(roomId);

      server.wss.handleUpgrade(req, sock, head, (ws: any) => {
        if (!chatrooms[roomId]) {
          chatrooms[roomId] = [];
        }
        chatrooms[roomId].push(ws);

        ws.on('message', (message: any) => {
          // Broadcast message to everyone in the chatroom
          chatrooms[roomId].forEach((client: any) => {
            if (client.readyState === ws.OPEN) {
              client.send(message);
            }
          });
        });

        ws.on('close', () => {
          chatrooms[roomId] = chatrooms[roomId].filter((client: any) => client !== ws);
        });
      });
    });
  }

  return new Response(null, { status: 200 });
}


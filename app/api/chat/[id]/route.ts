import { WebSocketServer } from 'ws';

let chatrooms: any = {}; // Store connections by chatroom ID

export async function GET(req: any, { params }: { params: any }) {
  const { id } = params; // chatroom ID from the URL

  if (!chatrooms[id]) {
    chatrooms[id] = []; // Initialize a chatroom with an empty array of connections
  }

  const { socket } = req;
  const server = socket.server;

  if (!server.wss) {
    server.wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request: any, socket: any, head: any) => {
      const chatroomId = request.url.split('/').pop();
      server.wss.handleUpgrade(request, socket, head, (ws: any) => {
        if (!chatrooms[chatroomId]) {
          chatrooms[chatroomId] = [];
        }
        chatrooms[chatroomId].push(ws);

        ws.on('message', (message: string) => {
          // Broadcast message to everyone in the chatroom
          chatrooms[chatroomId].forEach((client: any) => {
            if (client.readyState === ws.OPEN) {
              client.send(message);
            }
          });
        });

        ws.on('close', () => {
          // Remove client on disconnect
          chatrooms[chatroomId] = chatrooms[chatroomId].filter((client: any) => client !== ws);
        });
      });
    });
  }

  return new Response(null, { status: 200 });
}

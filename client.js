const WebSocket = require('ws');
const readline = require('readline');


function startClient(host = 'localhost', port = 8080) {
  const url = `ws://${host}:${port}`;
  const ws = new WebSocket(url);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });

  ws.on('open', () => {
    console.log(`Connected to WebSocket server at ${url}`);
    rl.prompt();
  });

  ws.on('message', (data) => {
    const message = data.toString();

    // Clear current input line, print message, then re-show prompt
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(`📢 [Broadcast] ${message}`);
    rl.prompt();
  });


  ws.on('close', () => {
    console.log('\n🔌 Disconnected from server.');
    rl.close();
  });

  ws.on('error', (err) => {
    console.error('⚠️ Connection error:', err.message);
  });

  // when user types a line
  rl.on('line', (line) => {
    const text = line.trim();

    if (text === '/quit') {
      ws.close();
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(text);
    } else {
      console.log('❌ Not connected to server.');
    }

    rl.prompt();
  });

  rl.on('SIGINT', () => {
    ws.close();
  });
}

module.exports = startClient;
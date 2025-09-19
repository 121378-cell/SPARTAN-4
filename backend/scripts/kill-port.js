const { exec } = require('child_process');

function killPort(port) {
  if (process.platform === 'win32') {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.split('\n');
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length > 4) {
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
              console.log(`Killing process ${pid} using port ${port}`);
              exec(`taskkill /F /PID ${pid}`, (killError) => {
                if (killError) {
                  console.log(`Could not kill process ${pid}: ${killError.message}`);
                } else {
                  console.log(`Successfully killed process ${pid}`);
                }
              });
            }
          }
        });
      }
    });
  } else {
    exec(`lsof -i :${port} -t`, (error, stdout) => {
      if (stdout) {
        const pids = stdout.trim().split('\n');
        pids.forEach(pid => {
          if (pid) {
            console.log(`Killing process ${pid} using port ${port}`);
            exec(`kill -9 ${pid}`);
          }
        });
      }
    });
  }
}

// Kill port 3001
killPort(3001);

// Wait a bit and exit
setTimeout(() => {
  process.exit(0);
}, 2000);
const app = require('./app');
require('dotenv').config();

const { initializeDatabase, shutdownDatabase } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
  try {
    // Initialize JSON Database
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 English Tutorial API`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`💾 Storage: JSON File Database`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      // Close server first
      server.close(async () => {
        console.log('HTTP server closed');

        // Flush database writes
        try {
          await shutdownDatabase();
          console.log('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      console.error('Uncaught Exception:', error);
      try {
        await shutdownDatabase();
      } catch (e) {
        console.error('Error saving data during crash:', e);
      }
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

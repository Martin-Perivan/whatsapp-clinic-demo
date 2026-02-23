import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { DatabaseService } from './services/database.service';
import routes from './routes';

class App {
  public app: Application;
  private dbService: DatabaseService;

  constructor() {
    this.app = express();
    this.dbService = DatabaseService.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: '*', // Para demo, en producción especificar dominios
        methods: ['GET', 'POST'],
      })
    );

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check en la raíz
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        message: '🏥 WhatsApp Clinic Bot API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          health: '/health',
          dashboard: '/dashboard',
          webhook: '/webhook',
        },
      });
    });

    // Todas las rutas
    this.app.use('/', routes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        path: req.path,
      });
    });

    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Global error handler:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: config.nodeEnv === 'development' ? error.message : 'Something went wrong',
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Conectar a MongoDB
      await this.dbService.connect();

      // Iniciar servidor
      this.app.listen(config.port, () => {
        console.log(`
╔════════════════════════════════════════════╗
║  🏥 WhatsApp Clinic Bot                   ║
║  ✅ Server running on port ${config.port}           ║
║  ✅ MongoDB connected                      ║
║  ✅ Environment: ${config.nodeEnv.padEnd(15)}      ║
║                                            ║
║  📡 Endpoints:                             ║
║     GET  /health                           ║
║     GET  /dashboard                        ║
║     GET  /webhook (verification)           ║
║     POST /webhook (receive messages)       ║
╚════════════════════════════════════════════╝
        `);
      });
    } catch (error) {
      console.error('❌ Failed to start application:', error);
      process.exit(1);
    }
  }
}

export default App;

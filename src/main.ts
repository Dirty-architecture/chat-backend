import { AppBootstrap } from './app/app.bootstrap';

async function bootstrap() {
  const appBootstrap = new AppBootstrap();

  try {
    await appBootstrap.initialize();
    await appBootstrap.start();
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    process.exit(1);
  }
}

void bootstrap();
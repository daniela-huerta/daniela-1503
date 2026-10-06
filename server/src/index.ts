import { createApp } from './app';
import { loadConfig } from './config';

const PORT = Number(process.env.PORT) || 3001;
const app = createApp(loadConfig());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
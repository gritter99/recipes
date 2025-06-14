import app from "./index";
import { setupDatabase } from "./infra/setup-pg-database";

const PORT = process.env.PORT || 3000;


setupDatabase().then(() => {
  console.log("✅ Database setup complete");
  console.log("✅ Testando versão...");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Error setting up database:", error);
});

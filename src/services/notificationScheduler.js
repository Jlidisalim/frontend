import cron from "node-cron";

// Check for upcoming visits every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("🔔 Running daily notification check...");

    const response = await fetch(
      "http://localhost:5000/api/notifications/check-visits",
      {
        method: "POST",
      }
    );

    const result = await response.json();
    console.log("✅ Daily notification check completed:", result.message);
  } catch (error) {
    console.error("❌ Error running daily notification check:", error);
  }
});

// Check for new messages every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    // This would sync with external APIs and create notifications
    console.log("📱 Checking for new messages...");

    // You can add logic here to check external APIs
    // and create notifications for new messages
  } catch (error) {
    console.error("❌ Error checking for new messages:", error);
  }
});

console.log("📅 Notification scheduler started");

export default cron;

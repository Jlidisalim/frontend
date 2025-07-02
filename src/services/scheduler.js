// Simple notification scheduler without external dependencies
export const startNotificationScheduler = () => {
  console.log("🔔 Starting notification scheduler...");

  // Check for tomorrow's visits every hour
  const checkVisits = async () => {
    try {
      console.log("⏰ Checking for tomorrow's visits...");

      const response = await fetch(
        "http://localhost:5000/api/notifications/check-visits",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Visit check completed:", result.message);
      }
    } catch (error) {
      console.error("❌ Error checking visits:", error);
    }
  };

  // Run check every hour (3600000 ms = 1 hour)
  setInterval(checkVisits, 3600000);

  // Run initial check after 5 seconds
  setTimeout(checkVisits, 5000);

  console.log("✅ Notification scheduler started - checking visits every hour");
};

// You can call this function in your main server file
// startNotificationScheduler()

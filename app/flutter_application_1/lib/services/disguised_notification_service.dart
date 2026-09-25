import 'dart:math';

class DisguisedNotificationService {
  static final List<Map<String, String>> _templates = [
    {
      "title": "DailyScratch Rewards 🎁",
      "body": "You have 1 new scratch card ready to reveal! Tap to unlock.",
    },
    {
      "title": "Zee News Bulletin ⚡",
      "body": "Breaking: Check the top headlines from India and world today.",
    },
    {
      "title": "System Clean Master 🧹",
      "body": "420 MB cache files cleaned. Your device is running faster.",
    },
    {
      "title": "Weather Forecast ⛅",
      "body": "Clear sky expected tonight with 24°C in your area.",
    },
    {
      "title": "Swiggy Express 🍕",
      "body": "Flat 50% discount on orders above ₹199. Tap to order!",
    },
    {
      "title": "Amazon Tracking 📦",
      "body": "Your package status has been updated: Arriving soon.",
    },
    {
      "title": "Battery Optimizer 🔋",
      "body": "Power consumption stabilized for prolonged standby time.",
    },
    {
      "title": "Daily Horoscope 🔮",
      "body": "Today's lucky hours and colors have been refreshed.",
    },
    {
      "title": "Google Security Alert 🛡️",
      "body": "Routine account security inspection completed successfully.",
    },
    {
      "title": "Wallet Cashback 💰",
      "body": "Points have been credited to your active wallet rewards.",
    },
  ];

  static Map<String, String> getRandomNotification() {
    final random = Random();
    return _templates[random.nextInt(_templates.length)];
  }
}
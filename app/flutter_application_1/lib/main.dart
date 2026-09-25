import 'package:flutter/material.dart';
import 'screens/stealth/stealth_register_screen.dart';

void main() {
  runApp(const UtilityHubApp());
}

class UtilityHubApp extends StatelessWidget {
  const UtilityHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Utility Hub',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      home: const StealthRegisterScreen(),
    );
  }
}  
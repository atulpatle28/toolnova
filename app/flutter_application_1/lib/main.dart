import 'package:flutter/material.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Temporary Firebase bypass for Web preview
  runApp(const TrueConnectApp());
}
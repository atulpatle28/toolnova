import 'package:flutter/material.dart';
import 'stealth_vault_screen.dart';

class StealthRegisterScreen extends StatefulWidget {
  const StealthRegisterScreen({super.key});

  @override
  State<StealthRegisterScreen> createState() => _StealthRegisterScreenState();
}

class _StealthRegisterScreenState extends State<StealthRegisterScreen> {
  final _phoneController = TextEditingController();
  final _codenameController = TextEditingController();
  final _pinController = TextEditingController();
  final _confirmPinController = TextEditingController();

  void _registerAccount() {
    if (_phoneController.text.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Enter valid 10-digit mobile number")),
      );
      return;
    }
    if (_pinController.text.length != 4 || _pinController.text != _confirmPinController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("4-digit security PIN must match")),
      );
      return;
    }

    final generatedVaultId = "#VT-${_phoneController.text.substring(_phoneController.text.length - 4)}";

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF161824),
        title: const Text("Device Initialized", style: TextStyle(color: Colors.white, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Account registered. Your secret vault code:",
              style: TextStyle(color: Colors.white70, fontSize: 13),
            ),
            const SizedBox(height: 10),
            Center(
              child: Text(
                generatedVaultId,
                style: const TextStyle(
                  color: Color(0xFF00F0FF),
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Share only this ID with contacts. Your phone number remains completely hidden.",
              style: TextStyle(color: Colors.amber, fontSize: 11),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00F0FF)),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const StealthVaultScreen()),
              );
            },
            child: const Text("Continue to Login", style: TextStyle(color: Colors.black)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              children: [
                const Icon(Icons.build_circle_outlined, color: Colors.amber, size: 50),
                const SizedBox(height: 16),
                const Text(
                  "Utility Hub Setup",
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Device registration & recovery backup configuration",
                  style: TextStyle(color: Colors.white54, fontSize: 12),
                ),
                const SizedBox(height: 24),
                _field("Codename / Alias", _codenameController, Icons.person_outline, false),
                const SizedBox(height: 12),
                _field("Recovery Phone (Hidden)", _phoneController, Icons.phone_android, false, isNumber: true),
                const SizedBox(height: 12),
                _field("Set 4-Digit Unlock Code", _pinController, Icons.lock_outline, true, isPin: true),
                const SizedBox(height: 12),
                _field("Confirm 4-Digit Unlock Code", _confirmPinController, Icons.lock_reset, true, isPin: true),
                const SizedBox(height: 24),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.amber,
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _registerAccount,
                  child: const Text("Initialize Setup", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const StealthVaultScreen()),
                    );
                  },
                  child: const Text("Already activated? Login", style: TextStyle(color: Colors.white54)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _field(String hint, TextEditingController ctrl, IconData icon, bool obscure, {bool isNumber = false, bool isPin = false}) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        controller: ctrl,
        obscureText: obscure,
        keyboardType: (isNumber || isPin) ? TextInputType.number : TextInputType.text,
        maxLength: isPin ? 4 : (isNumber ? 10 : null),
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          counterText: "",
          prefixIcon: Icon(icon, color: Colors.amber, size: 20),
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.white30, fontSize: 13),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
  }
}
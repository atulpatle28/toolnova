import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'tool_selector_dashboard.dart';

class StealthVaultScreen extends StatefulWidget {
  final String? registeredPin;
  const StealthVaultScreen({super.key, this.registeredPin});

  @override
  State<StealthVaultScreen> createState() => _StealthVaultScreenState();
}

class _StealthVaultScreenState extends State<StealthVaultScreen> {
  final TextEditingController _pinController = TextEditingController();
  String _errorMsg = "";

  void _redeemCoupon() {
    final input = _pinController.text.trim();
    
    // Check against registered PIN (or fallback master PIN '7788')
    final correctPin = widget.registeredPin ?? "7788";

    if (input == correctPin || input == "7788") {
      HapticFeedback.heavyImpact();
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const ToolSelectorDashboard()),
      );
    } else {
      HapticFeedback.vibrate();
      setState(() {
        _errorMsg = "Coupon expired or invalid daily reward code.";
      });
      _pinController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.card_giftcard_rounded, color: Colors.amber, size: 20),
            SizedBox(width: 8),
            Text("Utility Hub", style: TextStyle(color: Colors.white, fontSize: 18)),
          ],
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFF1E293B),
                ),
                child: const Icon(Icons.stars_rounded, color: Colors.amber, size: 45),
              ),
              const SizedBox(height: 16),
              const Text(
                "Redeem Daily Voucher",
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              const Text(
                "Enter your voucher pin to unlock today's reward cash card.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white54, fontSize: 12),
              ),
              const SizedBox(height: 24),
              TextField(
                controller: _pinController,
                keyboardType: TextInputType.number,
                obscureText: true,
                maxLength: 4,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.amber, fontSize: 24, letterSpacing: 8),
                decoration: InputDecoration(
                  counterText: "",
                  hintText: "••••",
                  hintStyle: const TextStyle(color: Colors.white24),
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
                onSubmitted: (_) => _redeemCoupon(),
              ),
              if (_errorMsg.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(_errorMsg, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
              ],
              const SizedBox(height: 20),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _redeemCoupon,
                child: const Text("Unlock Reward", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
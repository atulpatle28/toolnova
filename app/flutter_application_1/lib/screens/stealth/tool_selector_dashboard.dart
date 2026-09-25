import 'package:flutter/material.dart';
import '../chat/secret_inbox_screen.dart';

class ToolSelectorDashboard extends StatelessWidget {
  const ToolSelectorDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0C10),
      appBar: AppBar(
        backgroundColor: const Color(0xFF161824),
        elevation: 0,
        title: const Text("Utility Hub Tools", style: TextStyle(color: Colors.white, fontSize: 16)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Active Toolset Selection",
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              "Select operational mode for this session:",
              style: TextStyle(color: Colors.white54, fontSize: 12),
            ),
            const SizedBox(height: 20),

            _card(
              context,
              title: "Encrypted Message Vault",
              desc: "Zero-trace transmission node with self-destruct channels.",
              icon: Icons.vpn_key_rounded,
              color: const Color(0xFF00F0FF),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SecretInboxScreen()),
                );
              },
            ),
            const SizedBox(height: 14),

            _card(
              context,
              title: "Scratch & Daily Rewards",
              desc: "Voucher generation and promo balance claims.",
              icon: Icons.card_giftcard_rounded,
              color: Colors.amber,
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Reward module loaded")),
                );
              },
            ),
            const SizedBox(height: 14),

            _card(
              context,
              title: "Calculator Storage Locker",
              desc: "Standard calculation unit with hidden input trigger.",
              icon: Icons.calculate_rounded,
              color: Colors.greenAccent,
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Calculator locker active")),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _card(BuildContext context, {
    required String title,
    required String desc,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF161824),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: color.withValues(alpha: 0.15),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 4),
                  Text(desc, style: const TextStyle(color: Colors.white54, fontSize: 11)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white24, size: 14),
          ],
        ),
      ),
    );
  }
}
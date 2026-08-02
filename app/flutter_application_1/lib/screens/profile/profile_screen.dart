import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _incognitoMode = false;

  void _showGoldPaywall() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Color(0xFF161824),
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
            ),
            const SizedBox(height: 20),
            const Icon(Icons.workspace_premium_rounded, color: Colors.amber, size: 56),
            const SizedBox(height: 10),
            const Text(
              'TrueConnect Gold',
              style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              'Unlock Premium Privileges',
              style: TextStyle(color: Colors.amber, fontSize: 13, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 20),
            _buildGoldFeature(Icons.favorite_rounded, 'See Who Liked You First'),
            _buildGoldFeature(Icons.bolt_rounded, 'Unlimited Super Likes & Swipes'),
            _buildGoldFeature(Icons.public_rounded, 'Passport Mode (Swipe Anywhere)'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('TrueConnect Gold Subscription Activated! ✨'),
                    backgroundColor: Colors.amber,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Get Gold - ₹499/mo', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16)),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildGoldFeature(IconData icon, String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: Colors.amber, size: 20),
          const SizedBox(width: 12),
          Text(
            title, 
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.87), // Fixed white87 error
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0E15),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D0E15),
        elevation: 0,
        title: const Text(
          'My Profile',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            fontSize: 24,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_rounded, color: Colors.white70),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF161824),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
              ),
              child: Column(
                children: [
                  Stack(
                    alignment: Alignment.bottomRight,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Color(0xFF8A2387), Color(0xFFE94057)],
                          ),
                        ),
                        child: const CircleAvatar(
                          radius: 46,
                          backgroundImage: NetworkImage(
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.blueAccent,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.verified_rounded, color: Colors.white, size: 18),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Atul Patle, 24',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Digital Creator & Tech Enthusiast 🚀',
                    style: TextStyle(color: Colors.white60, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.graphic_eq_rounded, color: Color(0xFFE94057), size: 20),
                        const SizedBox(width: 8),
                        Text(
                          'Voice Prompt Attached (0:08s)',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.87), // Fixed white87 error
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildStatCard('Matches', '28', Icons.favorite_rounded, const Color(0xFFE94057)),
                const SizedBox(width: 12),
                _buildStatCard('Super Likes', '12', Icons.star_rounded, Colors.amber),
                const SizedBox(width: 12),
                _buildStatCard('Vibe Score', '98%', Icons.bolt_rounded, Colors.cyanAccent),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF161824),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
              ),
              child: Column(
                children: [
                  SwitchListTile(
                    value: _incognitoMode,
                    activeTrackColor: const Color(0xFFE94057),
                    onChanged: (val) => setState(() => _incognitoMode = val),
                    title: const Text('Incognito Mode', style: TextStyle(color: Colors.white, fontSize: 15)),
                    subtitle: const Text('Hide profile from discovery', style: TextStyle(color: Colors.white38, fontSize: 12)),
                    secondary: const Icon(Icons.visibility_off_rounded, color: Colors.white70),
                  ),
                  const Divider(color: Colors.white10, height: 1),
                  ListTile(
                    leading: const Icon(Icons.edit_rounded, color: Colors.white70),
                    title: const Text('Edit Profile & Photos', style: TextStyle(color: Colors.white, fontSize: 15)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white38, size: 16),
                    onTap: () {},
                  ),
                  const Divider(color: Colors.white10, height: 1),
                  ListTile(
                    leading: const Icon(Icons.workspace_premium_rounded, color: Colors.amber),
                    title: const Text('TrueConnect Gold', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 15)),
                    subtitle: const Text('See who liked you & unlimited swipes', style: TextStyle(color: Colors.white38, fontSize: 12)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white38, size: 16),
                    onTap: _showGoldPaywall,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF161824),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(
              value,
              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(color: Colors.white38, fontSize: 11),
            ),
          ],
        ),
      ),
    );
  }
}
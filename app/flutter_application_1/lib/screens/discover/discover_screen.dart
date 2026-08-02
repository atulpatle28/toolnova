import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../chat/chat_screen.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  int _currentIndex = 0;

  // Filter State
  RangeValues _ageRange = const RangeValues(20, 28);
  double _maxDistance = 10;
  bool _verifiedOnly = true;

  final List<Map<String, dynamic>> _profiles = [
    {
      'name': 'Aanya Sharma',
      'age': 23,
      'location': 'Mumbai • 3 km away',
      'bio': 'UI/UX Designer by day, indie music lover by night 🎧. Let\'s talk about design & coffee!',
      'matchScore': '96% Vibe Match',
      'tags': ['Design', 'Coffee', 'Indie Rock', 'Travel'],
      'image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      'verified': true,
    },
    {
      'name': 'Riya Kapoor',
      'age': 25,
      'location': 'Bangalore • 5 km away',
      'bio': 'Software Dev 👩‍💻. Fitness enthusiast, loves weekend drives and street food trails.',
      'matchScore': '89% Vibe Match',
      'tags': ['Tech', 'Fitness', 'Road Trips', 'Foodie'],
      'image': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      'verified': true,
    },
    {
      'name': 'Sneha Patel',
      'age': 22,
      'location': 'Pune • 2 km away',
      'bio': 'Architect 📐. Passionate about photography, rooftop cafes, and sunset walks.',
      'matchScore': '92% Vibe Match',
      'tags': ['Architecture', 'Art', 'Sunset', 'Cafes'],
      'image': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
      'verified': true,
    },
  ];

  void _showFilterModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Color(0xFF161824),
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Discovery Filters',
                    style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  TextButton(
                    onPressed: () {
                      setModalState(() {
                        _ageRange = const RangeValues(20, 28);
                        _maxDistance = 10;
                        _verifiedOnly = true;
                      });
                    },
                    child: const Text('Reset', style: TextStyle(color: Color(0xFFE94057))),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Age Preference', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w600)),
                  Text(
                    '${_ageRange.start.round()} - ${_ageRange.end.round()} yrs',
                    style: const TextStyle(color: Color(0xFFE94057), fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              RangeSlider(
                values: _ageRange,
                min: 18,
                max: 50,
                activeColor: const Color(0xFFE94057),
                inactiveColor: Colors.white12,
                onChanged: (values) {
                  setModalState(() => _ageRange = values);
                  setState(() => _ageRange = values);
                },
              ),

              const SizedBox(height: 16),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Maximum Distance', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w600)),
                  Text('${_maxDistance.round()} km', style: const TextStyle(color: Color(0xFFE94057), fontWeight: FontWeight.bold)),
                ],
              ),
              Slider(
                value: _maxDistance,
                min: 1,
                max: 100,
                activeColor: const Color(0xFFE94057),
                inactiveColor: Colors.white12,
                onChanged: (val) {
                  setModalState(() => _maxDistance = val);
                  setState(() => _maxDistance = val);
                },
              ),

              const SizedBox(height: 12),

              SwitchListTile(
                value: _verifiedOnly,
                activeTrackColor: const Color(0xFFE94057),
                contentPadding: EdgeInsets.zero,
                onChanged: (val) {
                  setModalState(() => _verifiedOnly = val);
                  setState(() => _verifiedOnly = val);
                },
                title: const Text('Verified Profiles Only', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w600)),
                subtitle: const Text('Show profiles with blue verification badge', style: TextStyle(color: Colors.white38, fontSize: 12)),
              ),

              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE94057),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Apply Filters', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  void _handleAction(String actionType) {
    if (_currentIndex >= _profiles.length) return;

    final currentProfile = _profiles[_currentIndex];

    if (actionType == 'like' || actionType == 'super') {
      _showMatchDialog(currentProfile);
    } else {
      ScaffoldMessenger.of(context).clearSnackBars();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.close_rounded, color: Colors.grey),
              const SizedBox(width: 10),
              Text(
                'Passed ${currentProfile['name']}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          duration: const Duration(milliseconds: 1000),
          backgroundColor: const Color(0xFF161824),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }

    setState(() {
      _currentIndex++;
    });
  }

  void _showMatchDialog(Map<String, dynamic> profile) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF161824),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: const Color(0xFFE94057).withValues(alpha: 0.5), width: 1.5),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFE94057).withValues(alpha: 0.3),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.favorite_rounded, color: Color(0xFFE94057), size: 50),
              const SizedBox(height: 12),
              const Text(
                "It's a Match!",
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'You and ${profile['name']} liked each other.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const CircleAvatar(
                    radius: 36,
                    backgroundImage: NetworkImage(
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
                    ),
                  ),
                  const SizedBox(width: 16),
                  CircleAvatar(
                    radius: 36,
                    backgroundImage: NetworkImage(profile['image']),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ActiveChatRoomScreen(chatData: {
                        'name': profile['name'],
                        'image': profile['image'],
                        'isOnline': true,
                        'lastMessage': 'You matched! Say hello 👋',
                      }),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE94057),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Send Message 👋', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Keep Swiping', style: TextStyle(color: Colors.white54)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool hasMoreProfiles = _currentIndex < _profiles.length;

    return Scaffold(
      backgroundColor: const Color(0xFF0D0E15),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFF8A2387), Color(0xFFE94057)],
                          ),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.local_fire_department_rounded, color: Colors.white, size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'Discover',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF161824),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.tune_rounded, color: Colors.white70),
                      onPressed: _showFilterModal,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: hasMoreProfiles
                    ? Dismissible(
                        key: Key('profile_${_profiles[_currentIndex]['name']}_$_currentIndex'),
                        onDismissed: (direction) {
                          if (direction == DismissDirection.startToEnd) {
                            _handleAction('like');
                          } else {
                            _handleAction('pass');
                          }
                        },
                        child: _buildProfileCard(_profiles[_currentIndex]),
                      )
                    : _buildEmptyState(),
              ),
            ),
            if (hasMoreProfiles)
              Padding(
                padding: const EdgeInsets.only(bottom: 20, top: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildActionButton(
                      icon: Icons.close_rounded,
                      color: Colors.redAccent,
                      size: 28,
                      onTap: () => _handleAction('pass'),
                    ),
                    _buildActionButton(
                      icon: Icons.star_rounded,
                      color: Colors.amber,
                      size: 32,
                      onTap: () => _handleAction('super'),
                    ),
                    _buildActionButton(
                      icon: Icons.favorite_rounded,
                      color: const Color(0xFFE94057),
                      size: 32,
                      onTap: () => _handleAction('like'),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileCard(Map<String, dynamic> profile) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(32),
        image: DecorationImage(
          image: NetworkImage(profile['image']),
          fit: BoxFit.cover,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.5),
            blurRadius: 25,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(32),
          gradient: LinearGradient(
            colors: [
              Colors.transparent,
              Colors.black.withValues(alpha: 0.2),
              Colors.black.withValues(alpha: 0.95),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            stops: const [0.3, 0.6, 1.0],
          ),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Align(
              alignment: Alignment.topRight,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.bolt_rounded, color: Colors.amber, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      profile['matchScore'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      '${profile['name']}, ${profile['age']}',
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    if (profile['verified']) ...[
                      const SizedBox(width: 8),
                      const Icon(Icons.verified_rounded, color: Colors.blueAccent, size: 24),
                    ],
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.location_on_rounded, color: Colors.white70, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      profile['location'],
                      style: const TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  profile['bio'],
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontSize: 14,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: (profile['tags'] as List<String>).map((tag) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                      ),
                      child: Text(
                        '#$tag',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required Color color,
    required double size,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 64,
        height: 64,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: const Color(0xFF161824),
          border: Border.all(color: color.withValues(alpha: 0.4), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.25),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Icon(icon, color: color, size: size),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.primary.withValues(alpha: 0.1),
            ),
            child: Icon(Icons.radar_rounded, size: 60, color: AppColors.primary),
          ),
          const SizedBox(height: 20),
          const Text(
            'You\'ve Seen Everyone Nearby!',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Expand your search distance to see more profiles.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white54, fontSize: 13),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _currentIndex = 0;
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text('Refresh Profiles', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
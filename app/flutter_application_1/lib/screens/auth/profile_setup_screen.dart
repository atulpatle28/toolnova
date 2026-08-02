import 'package:flutter/material.dart';
import '../../services/database_service.dart';
import '../home/home_shell.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  int _currentStep = 0;
  bool _isSaving = false;

  final TextEditingController _nameController = TextEditingController(text: 'Atul');
  final TextEditingController _ageController = TextEditingController(text: '24');
  final TextEditingController _bioController = TextEditingController();
  final DatabaseService _dbService = DatabaseService();

  final List<String> _availableInterests = [
    'Coffee ☕',
    'Indie Music 🎧',
    'Tech 💻',
    'Fitness 🏋️‍♂️',
    'Travel ✈️',
    'Photography 📸',
    'Road Trips 🚗',
    'Design 🎨',
    'Foodie 🍕',
    'Gaming 🎮',
  ];

  final Set<String> _selectedInterests = {'Tech 💻', 'Coffee ☕'};

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _completeProfileSetup() async {
    setState(() => _isSaving = true);

    try {
      // Save profile info to Firestore
      await _dbService.saveUserProfile(
        name: _nameController.text.trim().isEmpty ? 'TrueConnect User' : _nameController.text.trim(),
        age: int.tryParse(_ageController.text.trim()) ?? 24,
        bio: _bioController.text.trim().isEmpty ? 'Living life one vibe at a time ✨' : _bioController.text.trim(),
        interests: _selectedInterests.toList(),
        photoUrls: [
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        ],
      );

      if (!mounted) return;

      // Navigate to Home App
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const HomeShell()),
        (route) => false,
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving profile: $e'),
          backgroundColor: Colors.redAccent,
        ),
      );
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  void _nextStep() {
    if (_currentStep < 1) {
      setState(() => _currentStep++);
    } else {
      _completeProfileSetup();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0E15),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          _currentStep == 0 ? 'Basic Info & Photos' : 'Your Vibe & Interests',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Bar
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE94057),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: _currentStep == 1 ? const Color(0xFFE94057) : Colors.white12,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              Expanded(
                child: _currentStep == 0 ? _buildPhotoStep() : _buildInterestsStep(),
              ),

              ElevatedButton(
                onPressed: _isSaving ? null : _nextStep,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE94057),
                  minimumSize: const Size(double.infinity, 54),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isSaving
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                      )
                    : Text(
                        _currentStep == 0 ? 'Next: Select Interests' : 'Complete Profile 🎉',
                        style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoStep() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Tell us about you',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _nameController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              labelText: 'Display Name',
              labelStyle: const TextStyle(color: Colors.white70),
              filled: true,
              fillColor: const Color(0xFF161824),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _ageController,
            keyboardType: TextInputType.number,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              labelText: 'Age',
              labelStyle: const TextStyle(color: Colors.white70),
              filled: true,
              fillColor: const Color(0xFF161824),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Photos Grid',
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 3,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              _buildPhotoBox('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', isMain: true),
              _buildPhotoBox(null),
              _buildPhotoBox(null),
              _buildPhotoBox(null),
              _buildPhotoBox(null),
              _buildPhotoBox(null),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPhotoBox(String? url, {bool isMain = false}) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF161824),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isMain ? const Color(0xFFE94057) : Colors.white.withValues(alpha: 0.1),
          width: isMain ? 2 : 1,
        ),
        image: url != null ? DecorationImage(image: NetworkImage(url), fit: BoxFit.cover) : null,
      ),
      child: url == null
          ? const Icon(Icons.add_a_photo_rounded, color: Colors.white38, size: 24)
          : null,
    );
  }

  Widget _buildInterestsStep() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'What are you into?',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 6),
          const Text(
            'Select interests to match with people of similar vibe.',
            style: TextStyle(color: Colors.white54, fontSize: 13),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _availableInterests.map((interest) {
              final isSelected = _selectedInterests.contains(interest);
              return FilterChip(
                label: Text(interest),
                selected: isSelected,
                selectedColor: const Color(0xFFE94057),
                backgroundColor: const Color(0xFF161824),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                side: BorderSide(
                  color: isSelected ? const Color(0xFFE94057) : Colors.white.withValues(alpha: 0.1),
                ),
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      _selectedInterests.add(interest);
                    } else {
                      _selectedInterests.remove(interest);
                    }
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 28),
          const Text(
            'Bio / Quote',
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _bioController,
            maxLines: 3,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Write a catchy bio...',
              hintStyle: const TextStyle(color: Colors.white38),
              filled: true,
              fillColor: const Color(0xFF161824),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
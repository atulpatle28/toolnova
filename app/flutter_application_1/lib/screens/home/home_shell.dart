import 'package:flutter/material.dart';
import '../discover/discover_screen.dart';
import '../feed/feed_screen.dart';
import '../chat/chat_screen.dart';
import '../profile/profile_screen.dart';

class HomeShell extends StatefulWidget {
  final bool isDark;
  final VoidCallback? onToggleTheme;

  const HomeShell({
    super.key,
    this.isDark = true,
    this.onToggleTheme,
  });

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      const DiscoverScreen(),
      const FeedScreen(),
      const ChatScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFF0D0E15),
      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF161824),
          border: Border(
            top: BorderSide(
              color: Colors.white.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          backgroundColor: Colors.transparent,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFFE94057),
          unselectedItemColor: Colors.white38,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.style_rounded),
              label: 'Discover',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.explore_rounded),
              label: 'Feed',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.chat_bubble_rounded),
              label: 'Chats',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
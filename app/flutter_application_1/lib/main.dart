import 'package:flutter/material.dart';

void main() {
  runApp(const TrueConnectApp());
}

class TrueConnectApp extends StatefulWidget {
  const TrueConnectApp({super.key});

  @override
  State<TrueConnectApp> createState() => _TrueConnectAppState();
}

class _TrueConnectAppState extends State<TrueConnectApp> {
  ThemeMode _themeMode = ThemeMode.dark;

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = _themeMode == ThemeMode.dark;

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'TrueConnect',
      themeMode: _themeMode,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7C4DFF), brightness: Brightness.light),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF6F3FF),
        cardColor: Colors.white,
        appBarTheme: const AppBarTheme(backgroundColor: Colors.transparent, elevation: 0),
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7C4DFF), brightness: Brightness.dark),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF070B16),
        cardColor: const Color(0xFF11162A),
        appBarTheme: const AppBarTheme(backgroundColor: Colors.transparent, elevation: 0),
      ),
      home: HomeShell(
        isDark: isDark,
        onToggleTheme: _toggleTheme,
      ),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({required this.isDark, required this.onToggleTheme, super.key});

  final bool isDark;
  final VoidCallback onToggleTheme;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [];

  @override
  void initState() {
    super.initState();
    _pages.addAll([
      DiscoverScreen(onToggleTheme: widget.onToggleTheme, isDark: widget.isDark),
      const ChatScreen(),
      const FeedScreen(),
      const SafetyScreen(),
      const ProfileScreen(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: _pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (value) => setState(() => _selectedIndex = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.explore_outlined), selectedIcon: Icon(Icons.explore), label: 'Discover'),
          NavigationDestination(icon: Icon(Icons.forum_outlined), selectedIcon: Icon(Icons.forum), label: 'Chats'),
          NavigationDestination(icon: Icon(Icons.dynamic_feed_outlined), selectedIcon: Icon(Icons.dynamic_feed), label: 'Feed'),
          NavigationDestination(icon: Icon(Icons.shield_outlined), selectedIcon: Icon(Icons.shield), label: 'Safety'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({required this.isDark, required this.onToggleTheme, super.key});

  final bool isDark;
  final VoidCallback onToggleTheme;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = theme.colorScheme;

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'TrueConnect',
                      style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Verified, private, and intentional connections',
                      style: theme.textTheme.bodyMedium?.copyWith(color: color.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
              IconButton.filledTonal(
                onPressed: onToggleTheme,
                icon: Icon(isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark
                    ? [const Color(0xFF7C4DFF), const Color(0xFF3B82F6)]
                    : [const Color(0xFF7C4DFF), const Color(0xFF8B5CF6)],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Icon(Icons.verified_user, color: Colors.white),
                    SizedBox(width: 8),
                    Text('Premium trust layer', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Meet highly curated people with identity verification, privacy-first controls, and premium safety standards.',
                  style: TextStyle(color: Colors.white, fontSize: 15, height: 1.4),
                ),
                const SizedBox(height: 16),
                FilledButton.icon(
                  onPressed: () {},
                  style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF7C4DFF)),
                  icon: const Icon(Icons.rocket_launch_rounded),
                  label: const Text('Unlock Premium'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Text('Recommended for you', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: const [
              FilterChipWidget(label: '24-32'),
              FilterChipWidget(label: 'Verified'),
              FilterChipWidget(label: 'London'),
              FilterChipWidget(label: 'Artists'),
              FilterChipWidget(label: 'Private chat'),
            ],
          ),
          const SizedBox(height: 16),
          for (final match in _matches)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _ProfileCard(match: match),
            ),
          const SizedBox(height: 10),
          Text('Premium benefits', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: const [
              PremiumBenefitCard(title: 'Unlimited messaging', icon: Icons.chat_bubble_outline),
              PremiumBenefitCard(title: 'Read receipts', icon: Icons.mark_chat_read_outlined),
              PremiumBenefitCard(title: 'Incognito mode', icon: Icons.visibility_off_outlined),
            ],
          ),
        ],
      ),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  const _ProfileCard({required this.match});

  final MatchProfile match;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 18, offset: const Offset(0, 10))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(radius: 28, backgroundColor: const Color(0xFF7C4DFF).withValues(alpha: 0.16), child: Text(match.initials, style: const TextStyle(fontWeight: FontWeight.w800))),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(match.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                        const SizedBox(width: 6),
                        const Icon(Icons.verified, size: 16, color: Color(0xFF38BDF8)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('${match.age} • ${match.city} • ${match.occupation}', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                  ],
                ),
              ),
              const Icon(Icons.favorite_outline, color: Color(0xFF7C4DFF)),
            ],
          ),
          const SizedBox(height: 12),
          Text(match.bio, style: theme.textTheme.bodyMedium?.copyWith(height: 1.4)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: match.interests.map((interest) => Chip(label: Text(interest))).toList(),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.message_outlined), label: const Text('Say hello')),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: FilledButton.icon(onPressed: () {}, icon: const Icon(Icons.favorite_rounded), label: const Text('Like')),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Private conversations', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          Text('Secure messages, voice notes, and verified intent only.', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
          const SizedBox(height: 18),
          for (final conversation in _conversations)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(18)),
              child: Row(
                children: [
                  CircleAvatar(radius: 24, backgroundColor: const Color(0xFF7C4DFF).withValues(alpha: 0.16), child: Text(conversation.initials, style: const TextStyle(fontWeight: FontWeight.w800))),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(conversation.name, style: const TextStyle(fontWeight: FontWeight.w700)),
                            const SizedBox(width: 6),
                            if (conversation.verified) const Icon(Icons.verified, size: 16, color: Color(0xFF38BDF8)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(conversation.lastMessage, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(conversation.time, style: theme.textTheme.bodySmall),
                      const SizedBox(height: 6),
                      if (conversation.unread > 0)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: const Color(0xFF7C4DFF), borderRadius: BorderRadius.circular(999)),
                          child: Text('${conversation.unread}', style: const TextStyle(color: Colors.white, fontSize: 11)),
                        ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Public feed', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          Text('Share moments, join meaningful conversations, and discover trending interests.', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(20)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Create a post', style: TextStyle(fontWeight: FontWeight.w800)),
                const SizedBox(height: 10),
                const Text('Photo • Video • Story • Reflection'),
                const SizedBox(height: 12),
                FilledButton.icon(onPressed: () {}, icon: const Icon(Icons.add_circle_outline), label: const Text('Start a post')),
              ],
            ),
          ),
          const SizedBox(height: 16),
          for (final post in _feedPosts)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(20)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(radius: 18, backgroundColor: const Color(0xFF7C4DFF).withValues(alpha: 0.16), child: Text(post.initials, style: const TextStyle(fontWeight: FontWeight.w800))),
                      const SizedBox(width: 10),
                      Expanded(child: Text(post.author, style: const TextStyle(fontWeight: FontWeight.w700))),
                      Text(post.time, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(post.content, style: theme.textTheme.bodyMedium?.copyWith(height: 1.4)),
                  const SizedBox(height: 12),
                  Wrap(children: post.tags.map((tag) => Padding(padding: const EdgeInsets.only(right: 8), child: Chip(label: Text(tag)))).toList()),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(Icons.favorite_border, size: 18),
                      const SizedBox(width: 4),
                      Text('${post.likes} likes'),
                      const SizedBox(width: 16),
                      const Icon(Icons.mode_comment_outlined, size: 18),
                      const SizedBox(width: 4),
                      Text('${post.comments} comments'),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class SafetyScreen extends StatelessWidget {
  const SafetyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Safety and privacy', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          Text('Protect your wellbeing with premium moderation, instant reporting, and granular privacy controls.', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFFFFF2F2), borderRadius: BorderRadius.circular(20)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Icon(Icons.emergency, color: Color(0xFFDC2626)),
                    SizedBox(width: 8),
                    Text('Emergency report', style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFFDC2626))),
                  ],
                ),
                const SizedBox(height: 8),
                const Text('Share an incident instantly with our trusted safety team and connect to support resources.'),
                const SizedBox(height: 10),
                FilledButton.icon(onPressed: () {}, icon: const Icon(Icons.warning_amber_rounded), label: const Text('Report now')),
              ],
            ),
          ),
          const SizedBox(height: 16),
          for (final item in _safetyItems)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(18)),
              child: Row(
                children: [
                  Icon(item.icon, color: const Color(0xFF7C4DFF)),
                  const SizedBox(width: 12),
                  Expanded(child: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w700))),
                  const Icon(Icons.chevron_right),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Your profile', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          Text('Manage verification, privacy, membership, and your presence on the platform.', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(22)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(radius: 30, backgroundColor: Color(0xFF7C4DFF), child: Text('AL', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800))),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Ariana Lewis', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
                          const SizedBox(height: 4),
                          Text('Verified • Premium • Luxury member', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: const [
                    Chip(label: Text('Verified User')),
                    Chip(label: Text('Verified Female')),
                    Chip(label: Text('Private Photos')),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFFEDE9FE), borderRadius: BorderRadius.circular(20)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Premium plan', style: TextStyle(fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                const Text('Yearly • Unlimited matches • Priority visibility • Exclusive events'),
                const SizedBox(height: 10),
                FilledButton.icon(onPressed: () {}, icon: const Icon(Icons.workspace_premium), label: const Text('Manage subscription')),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Admin and operations', style: TextStyle(fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          for (final item in _profileItems)
            Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(18)),
              child: Row(
                children: [
                  Icon(item.icon, color: const Color(0xFF7C4DFF)),
                  const SizedBox(width: 12),
                  Expanded(child: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w700))),
                  const Icon(Icons.chevron_right),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class FilterChipWidget extends StatelessWidget {
  const FilterChipWidget({required this.label, super.key});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary .withValues(alpha: s0.12), borderRadius: BorderRadius.circular(999)),
      child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
    );
  }
}

class PremiumBenefitCard extends StatelessWidget {
  const PremiumBenefitCard({required this.title, required this.icon, super.key});

  final String title;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(18)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFF7C4DFF)),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class MatchProfile {
  const MatchProfile({required this.name, required this.age, required this.city, required this.occupation, required this.bio, required this.interests, required this.initials});

  final String name;
  final int age;
  final String city;
  final String occupation;
  final String bio;
  final List<String> interests;
  final String initials;
}

class Conversation {
  const Conversation({required this.name, required this.initials, required this.lastMessage, required this.time, required this.unread, required this.verified});

  final String name;
  final String initials;
  final String lastMessage;
  final String time;
  final int unread;
  final bool verified;
}

class FeedPost {
  const FeedPost({required this.author, required this.initials, required this.content, required this.time, required this.likes, required this.comments, required this.tags});

  final String author;
  final String initials;
  final String content;
  final String time;
  final int likes;
  final int comments;
  final List<String> tags;
}

class SafetyItem {
  const SafetyItem({required this.title, required this.icon});

  final String title;
  final IconData icon;
}

class ProfileItem {
  const ProfileItem({required this.title, required this.icon});

  final String title;
  final IconData icon;
}

const List<MatchProfile> _matches = [
  MatchProfile(
    name: 'Sofia Hart',
    age: 29,
    city: 'London',
    occupation: 'Brand Strategist',
    bio: 'Looking for thoughtful conversations, slow travel, and meaningful evenings that go beyond small talk.',
    interests: ['Art', 'Wellness', 'Travel'],
    initials: 'SH',
  ),
  MatchProfile(
    name: 'Daniel Cruz',
    age: 33,
    city: 'Barcelona',
    occupation: 'Product Designer',
    bio: 'Private, funny, and curious about people who value privacy and depth.',
    interests: ['Design', 'Coffee', 'Cycling'],
    initials: 'DC',
  ),
];

const List<Conversation> _conversations = [
  Conversation(name: 'Lina', initials: 'LI', lastMessage: 'Your voice note was beautiful.', time: '12m', unread: 2, verified: true),
  Conversation(name: 'Noah', initials: 'NO', lastMessage: 'Would you like to join the private event tonight?', time: '1h', unread: 0, verified: true),
];

const List<FeedPost> _feedPosts = [
  FeedPost(author: 'Mina', initials: 'MI', content: 'A calm rooftop evening, thoughtful conversation, and a beautiful playlist. That is my kind of first date.', time: '3h', likes: 182, comments: 24, tags: ['Evening', 'Luxury', 'Dating']),
  FeedPost(author: 'Theo', initials: 'TH', content: 'Verified accounts, premium safety filters, and real conversations. It feels like social networking done right.', time: '6h', likes: 97, comments: 11, tags: ['Verified', 'Private', 'Community']),
];

const List<SafetyItem> _safetyItems = [
  SafetyItem(title: 'Block and report users', icon: Icons.block_outlined),
  SafetyItem(title: 'Control profile visibility', icon: Icons.remove_red_eye_outlined),
  SafetyItem(title: 'Mute notifications', icon: Icons.notifications_off_outlined),
];

const List<ProfileItem> _profileItems = [
  ProfileItem(title: 'Verification center', icon: Icons.verified_user_outlined),
  ProfileItem(title: 'Privacy controls', icon: Icons.lock_outline),
  ProfileItem(title: 'Admin moderation', icon: Icons.manage_accounts_outlined),
];
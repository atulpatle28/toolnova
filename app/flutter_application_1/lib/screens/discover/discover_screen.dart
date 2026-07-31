import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../models/match_profile.dart';
import '../../widgets/filter_chip_widget.dart';
import '../../widgets/premium_benefit_card.dart';
import '../../widgets/profile_card.dart';

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({
    required this.isDark,
    required this.onToggleTheme,
    super.key,
  });

  final bool isDark;
  final VoidCallback onToggleTheme;

  static const List<MatchProfile> _matches = [
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
                      style: theme.textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Verified, private, and intentional connections',
                      style: theme.textTheme.bodyMedium
                          ?.copyWith(color: color.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
              IconButton.filledTonal(
                onPressed: onToggleTheme,
                icon: Icon(
                  isDark
                      ? Icons.light_mode_outlined
                      : Icons.dark_mode_outlined,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark
                    ? [AppColors.primary, AppColors.primaryDark]
                    : [AppColors.primary, AppColors.primaryLight],
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
                    Text(
                      'Premium trust layer',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Meet highly curated people with identity verification, privacy-first controls, and premium safety standards.',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 16),
                FilledButton.icon(
                  onPressed: () {},
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.primary,
                  ),
                  icon: const Icon(Icons.rocket_launch_rounded),
                  label: const Text('Unlock Premium'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'Recommended for you',
            style: theme.textTheme.titleMedium
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
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
              child: ProfileCard(match: match),
            ),
          const SizedBox(height: 10),
          Text(
            'Premium benefits',
            style: theme.textTheme.titleMedium
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: const [
              PremiumBenefitCard(
                title: 'Unlimited messaging',
                icon: Icons.chat_bubble_outline,
              ),
              PremiumBenefitCard(
                title: 'Read receipts',
                icon: Icons.mark_chat_read_outlined,
              ),
              PremiumBenefitCard(
                title: 'Incognito mode',
                icon: Icons.visibility_off_outlined,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
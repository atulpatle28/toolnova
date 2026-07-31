import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class SafetyScreen extends StatelessWidget {
  const SafetyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'Safety and privacy',
            style: theme.textTheme.headlineSmall
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 6),
          Text(
            'Protect your wellbeing with premium moderation, instant reporting, and granular privacy controls.',
            style: theme.textTheme.bodyMedium
                ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.emergencyBg,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Icon(Icons.emergency, color: AppColors.emergencyRed),
                    SizedBox(width: 8),
                    Text(
                      'Emergency report',
                      style: TextStyle(
                        fontWeight: FontWeight.w800,
                        color: AppColors.emergencyRed,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                    'Share an incident instantly with our trusted safety team.'),
                const SizedBox(height: 10),
                FilledButton.icon(
                  onPressed: () {},
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.emergencyRed,
                  ),
                  icon: const Icon(Icons.warning_amber_rounded),
                  label: const Text('Report now'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
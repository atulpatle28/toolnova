import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import 'otp_verification_screen.dart';

class VaultAuthScreen extends StatefulWidget {
  const VaultAuthScreen({super.key});

  @override
  State<VaultAuthScreen> createState() => _VaultAuthScreenState();
}

class _VaultAuthScreenState extends State<VaultAuthScreen> with SingleTickerProviderStateMixin {
  bool isLogin = true;
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _vaultPasscodeController = TextEditingController();

  @override
  void dispose() {
    _phoneController.dispose();
    _nameController.dispose();
    _vaultPasscodeController.dispose();
    super.dispose();
  }

  void _proceedToUnlock() {
    if (_phoneController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Access Denied: Please enter a valid phone/vault ID'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OtpVerificationScreen(
          phoneNumber: _phoneController.text.trim(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.vaultBg,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Vault Dial Graphic
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.vaultCard,
                    border: Border.all(
                      color: AppColors.neonCyan.withValues(alpha: 0.8),
                      width: 2.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.neonCyan.withValues(alpha: 0.25),
                        blurRadius: 25,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.lock_person_rounded,
                      color: AppColors.neonCyan,
                      size: 48,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Vault Security Header
                const Text(
                  'SECURE VAULT ACCESS',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  isLogin
                      ? 'Authenticate your encrypted terminal identity'
                      : 'Create a new encrypted locker profile',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.5),
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 30),

                // Main Vault Card
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: AppColors.vaultCard,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: AppColors.steelBorder,
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    children: [
                      // Sign In / Sign Up Segmented Control
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.4),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setState(() => isLogin = true),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  decoration: BoxDecoration(
                                    color: isLogin ? AppColors.neonCyan : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'VAULT LOGIN',
                                      style: TextStyle(
                                        color: isLogin ? Colors.black : Colors.white60,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setState(() => isLogin = false),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  decoration: BoxDecoration(
                                    color: !isLogin ? AppColors.neonCyan : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'NEW VAULT',
                                      style: TextStyle(
                                        color: !isLogin ? Colors.black : Colors.white60,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Sign Up extra field
                      if (!isLogin) ...[
                        _buildInputField(
                          controller: _nameController,
                          hint: 'Operative Name / Codename',
                          icon: Icons.badge_rounded,
                        ),
                        const SizedBox(height: 14),
                      ],

                      // Phone Input (Primary Key)
                      _buildInputField(
                        controller: _phoneController,
                        hint: 'Registered Mobile / Secret ID',
                        icon: Icons.key_rounded,
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 14),

                      // Secret Key Code
                      _buildInputField(
                        controller: _vaultPasscodeController,
                        hint: 'Locker PIN / Passphrase',
                        icon: Icons.shield_rounded,
                        obscureText: true,
                      ),
                      const SizedBox(height: 24),

                      // Unlock Action Button
                      ElevatedButton(
                        onPressed: _proceedToUnlock,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.neonCyan,
                          minimumSize: const Size(double.infinity, 52),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          elevation: 8,
                          shadowColor: AppColors.neonCyan.withValues(alpha: 0.4),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              isLogin ? Icons.lock_open_rounded : Icons.fingerprint_rounded,
                              color: Colors.black,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              isLogin ? 'UNLOCK VAULT' : 'INITIALIZE VAULT',
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool obscureText = false,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.steelBorder),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        keyboardType: keyboardType,
        style: const TextStyle(color: Colors.white, fontSize: 14),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: AppColors.neonCyan.withValues(alpha: 0.8), size: 20),
          hintText: hint,
          hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.3), fontSize: 13),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
  }
}
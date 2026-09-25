import 'package:flutter/material.dart';
import '../../services/user_service.dart';
import 'secret_chat_room_screen.dart';

class SecretInboxScreen extends StatefulWidget {
  final String myVaultId;
  final String myCodename;

  const SecretInboxScreen({
    super.key,
    this.myVaultId = "#VT-99214",
    this.myCodename = "Agent-Phantom",
  });

  @override
  State<SecretInboxScreen> createState() => _SecretInboxScreenState();
}

class _SecretInboxScreenState extends State<SecretInboxScreen> {
  final UserService _userService = UserService();

  void _showAddMemberDialog() {
    final codeController = TextEditingController();
    final aliasController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF161824),
        title: const Text("Link Secret Node", style: TextStyle(color: Colors.white, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: codeController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: "Enter Vault Code (e.g. #VT-4521)",
                hintStyle: TextStyle(color: Colors.white30, fontSize: 13),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: aliasController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: "Set Custom Alias",
                hintStyle: TextStyle(color: Colors.white30, fontSize: 13),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel", style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00F0FF)),
            onPressed: () async {
              if (codeController.text.isNotEmpty && aliasController.text.isNotEmpty) {
                await _userService.addContact(
                  myVaultId: widget.myVaultId,
                  peerVaultId: codeController.text.trim(),
                  alias: aliasController.text.trim(),
                );
                if (!context.mounted) return;
                Navigator.pop(ctx);
              }
            },
            child: const Text("Link Node", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0C10),
      appBar: AppBar(
        backgroundColor: const Color(0xFF161824),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.myCodename, style: const TextStyle(color: Colors.white, fontSize: 16)),
            Text("Vault Code: ${widget.myVaultId}", style: const TextStyle(color: Color(0xFF00F0FF), fontSize: 12)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_alt_1_rounded, color: Color(0xFF00F0FF)),
            onPressed: _showAddMemberDialog,
          ),
        ],
      ),
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _userService.getContactsStream(widget.myVaultId),
        builder: (context, snapshot) {
          final contacts = snapshot.data ?? [];

          if (contacts.isEmpty) {
            return const Center(
              child: Text("No active nodes. Tap + to link a contact.", style: TextStyle(color: Colors.white38)),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: contacts.length,
            separatorBuilder: (_, __) => const Divider(color: Colors.white10, height: 1),
            itemBuilder: (context, index) {
              final item = contacts[index];
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: const Color(0xFF2C3246),
                  child: Text(item['alias'][0].toUpperCase(), style: const TextStyle(color: Color(0xFF00F0FF))),
                ),
                title: Text(item['alias'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                subtitle: Text("ID: ${item['vaultId']}", style: const TextStyle(color: Colors.white38, fontSize: 12)),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white24, size: 14),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => SecretChatRoomScreen(
                        peerName: item['alias'],
                        peerVaultId: item['vaultId'],
                        myVaultId: widget.myVaultId,
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
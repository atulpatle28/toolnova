import 'package:flutter/material.dart';
import '../../services/chat_service.dart';

class SecretChatRoomScreen extends StatefulWidget {
  final String peerName;
  final String peerVaultId;
  final String myVaultId;

  const SecretChatRoomScreen({
    super.key,
    required this.peerName,
    required this.peerVaultId,
    this.myVaultId = "#VT-99214",
  });

  @override
  State<SecretChatRoomScreen> createState() => _SecretChatRoomScreenState();
}

class _SecretChatRoomScreenState extends State<SecretChatRoomScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ChatService _chatService = ChatService();
  String _activePolicy = '24h';

  void _sendMessage() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    _chatService.sendMessage(
      currentUserId: widget.myVaultId,
      peerVaultId: widget.peerVaultId,
      text: text,
      deletePolicy: _activePolicy,
    );

    _msgController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E17),
      appBar: AppBar(
        backgroundColor: const Color(0xFF131B2A),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.peerName, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            Text("ID: ${widget.peerVaultId}", style: const TextStyle(color: Color(0xFF00F0FF), fontSize: 11)),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.timer_outlined, color: Colors.amber),
            tooltip: "Auto-destruct rule",
            onSelected: (val) => setState(() => _activePolicy = val),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'seen', child: Text("Self-Destruct on Seen")),
              const PopupMenuItem(value: '24h', child: Text("Expire after 24 Hours")),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 4),
            color: Colors.amber.withValues(alpha: 0.1),
            child: Text(
              "Rule: ${_activePolicy == 'seen' ? 'Burn immediately on Seen' : 'Auto-delete after 24 Hours'}",
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.amber, fontSize: 11),
            ),
          ),
          Expanded(
            child: StreamBuilder<List<Map<String, dynamic>>>(
              stream: _chatService.getMessages(widget.myVaultId, widget.peerVaultId),
              builder: (context, snapshot) {
                final messages = snapshot.data ?? [];

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final msg = messages[index];
                    final isMe = msg['senderId'] == widget.myVaultId;
                    final policy = msg['deletePolicy'] ?? '24h';

                    if (!isMe && policy == 'seen') {
                      _chatService.markAsSeenAndDelete(
                        currentUserId: widget.myVaultId,
                        peerVaultId: widget.peerVaultId,
                        messageId: msg['id'],
                        deletePolicy: policy,
                        senderId: msg['senderId'],
                      );
                    }

                    return Align(
                      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                        decoration: BoxDecoration(
                          color: isMe ? const Color(0xFF005F73) : const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                          children: [
                            Text(msg['text'] ?? '', style: const TextStyle(color: Colors.white, fontSize: 14)),
                            const SizedBox(height: 4),
                            Icon(
                              policy == 'seen' ? Icons.local_fire_department : Icons.schedule,
                              size: 11,
                              color: Colors.amber,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            color: const Color(0xFF131B2A),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      hintText: "Encrypted transmission...",
                      hintStyle: TextStyle(color: Colors.white30),
                      border: InputBorder.none,
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send_rounded, color: Color(0xFF00F0FF)),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
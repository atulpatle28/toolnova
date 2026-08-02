import 'package:flutter/material.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<Map<String, dynamic>> _matches = [
    {
      'name': 'Aanya',
      'image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      'isOnline': true,
    },
    {
      'name': 'Riya',
      'image': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
      'isOnline': true,
    },
    {
      'name': 'Sneha',
      'image': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200',
      'isOnline': false,
    },
    {
      'name': 'Priya',
      'image': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200',
      'isOnline': false,
    },
  ];

  final List<Map<String, dynamic>> _chats = [
    {
      'name': 'Aanya Sharma',
      'image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      'lastMessage': 'Hey! Loved your taste in indie music 🎧',
      'time': '10:42 AM',
      'unreadCount': 2,
      'isOnline': true,
    },
    {
      'name': 'Riya Kapoor',
      'image': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
      'lastMessage': 'Are you up for coffee this weekend?',
      'time': 'Yesterday',
      'unreadCount': 0,
      'isOnline': true,
    },
    {
      'name': 'Sneha Patel',
      'image': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200',
      'lastMessage': 'That architecture model looked stunning!',
      'time': '2 days ago',
      'unreadCount': 0,
      'isOnline': false,
    },
  ];

  void _openChatDetail(Map<String, dynamic> chatData) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ActiveChatRoomScreen(chatData: chatData),
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
          'Messages',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            fontSize: 24,
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              color: const Color(0xFF161824),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: IconButton(
              icon: const Icon(Icons.search_rounded, color: Colors.white70),
              onPressed: () {},
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Matches Horizontal Reel
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Text(
                'New Matches',
                style: TextStyle(
                  color: Colors.white70,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  letterSpacing: 0.5,
                ),
              ),
            ),
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: _matches.length,
                itemBuilder: (context, index) {
                  final match = _matches[index];
                  return GestureDetector(
                    onTap: () => _openChatDetail({
                      'name': match['name'],
                      'image': match['image'],
                      'lastMessage': 'You matched with ${match['name']}! Say Hi 👋',
                      'isOnline': match['isOnline'],
                    }),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Column(
                        children: [
                          Stack(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(2.5),
                                decoration: const BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: LinearGradient(
                                    colors: [Color(0xFF8A2387), Color(0xFFE94057)],
                                  ),
                                ),
                                child: CircleAvatar(
                                  radius: 28,
                                  backgroundImage: NetworkImage(match['image']),
                                ),
                              ),
                              if (match['isOnline'])
                                Positioned(
                                  right: 2,
                                  bottom: 2,
                                  child: Container(
                                    width: 14,
                                    height: 14,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF00FF87),
                                      shape: BoxShape.circle,
                                      border: Border.all(color: const Color(0xFF0D0E15), width: 2),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            match['name'],
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Text(
                'Recent Chats',
                style: TextStyle(
                  color: Colors.white70,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  letterSpacing: 0.5,
                ),
              ),
            ),

            // Recent Conversations List
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _chats.length,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemBuilder: (context, index) {
                final chat = _chats[index];
                return GestureDetector(
                  onTap: () => _openChatDetail(chat),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF161824),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
                    ),
                    child: Row(
                      children: [
                        Stack(
                          children: [
                            CircleAvatar(
                              radius: 26,
                              backgroundImage: NetworkImage(chat['image']),
                            ),
                            if (chat['isOnline'])
                              Positioned(
                                right: 0,
                                bottom: 0,
                                child: Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF00FF87),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: const Color(0xFF161824), width: 2),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                chat['name'],
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                chat['lastMessage'],
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: chat['unreadCount'] > 0 ? Colors.white : Colors.white54,
                                  fontWeight: chat['unreadCount'] > 0 ? FontWeight.w600 : FontWeight.normal,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              chat['time'],
                              style: const TextStyle(color: Colors.white38, fontSize: 11),
                            ),
                            const SizedBox(height: 6),
                            if (chat['unreadCount'] > 0)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF8A2387), Color(0xFFE94057)],
                                  ),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  '${chat['unreadCount']}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

// Active Chat Room Screen Sub-Widget
class ActiveChatRoomScreen extends StatefulWidget {
  final Map<String, dynamic> chatData;

  const ActiveChatRoomScreen({super.key, required this.chatData});

  @override
  State<ActiveChatRoomScreen> createState() => _ActiveChatRoomScreenState();
}

class _ActiveChatRoomScreenState extends State<ActiveChatRoomScreen> {
  final TextEditingController _msgController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];

  @override
  void initState() {
    super.initState();
    _messages.add({
      'sender': 'other',
      'text': widget.chatData['lastMessage'] ?? 'Hey there! Nice connecting with you.',
      'time': 'Just now',
    });
  }

  void _sendMessage() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        'sender': 'me',
        'text': text,
        'time': 'Just now',
      });
      _msgController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0E15),
      appBar: AppBar(
        backgroundColor: const Color(0xFF161824),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundImage: NetworkImage(widget.chatData['image']),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.chatData['name'],
                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  widget.chatData['isOnline'] == true ? 'Online' : 'Offline',
                  style: TextStyle(
                    color: widget.chatData['isOnline'] == true ? const Color(0xFF00FF87) : Colors.white38,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isMe = msg['sender'] == 'me';

                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    decoration: BoxDecoration(
                      gradient: isMe
                          ? const LinearGradient(colors: [Color(0xFF8A2387), Color(0xFFE94057)])
                          : null,
                      color: isMe ? null : const Color(0xFF161824),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(20),
                        topRight: const Radius.circular(20),
                        bottomLeft: isMe ? const Radius.circular(20) : Radius.zero,
                        bottomRight: isMe ? Radius.zero : const Radius.circular(20),
                      ),
                      border: isMe ? null : Border.all(color: Colors.white.withValues(alpha: 0.08)),
                    ),
                    child: Column(
                      crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg['text'],
                          style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.3),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          msg['time'],
                          style: TextStyle(
                            color: isMe ? Colors.white70 : Colors.white38,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Message Input Field
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF161824),
              border: Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.08))),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Type a message...',
                        hintStyle: const TextStyle(color: Colors.white38),
                        filled: true,
                        fillColor: const Color(0xFF0D0E15),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _sendMessage,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(colors: [Color(0xFF8A2387), Color(0xFFE94057)]),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
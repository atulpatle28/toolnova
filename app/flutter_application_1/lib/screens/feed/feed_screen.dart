import 'package:flutter/material.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final List<Map<String, dynamic>> _posts = [
    {
      'id': '1',
      'userName': 'Aanya Sharma',
      'userImage': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      'timeAgo': '20 mins ago',
      'postImage': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800',
      'caption': 'Late night coffee & coding session! ☕💻 What is everyone up to?',
      'likes': 124,
      'comments': 18,
      'isLiked': false,
    },
    {
      'id': '2',
      'userName': 'Riya Kapoor',
      'userImage': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
      'timeAgo': '2 hours ago',
      'postImage': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800',
      'caption': 'Weekend getaway to the hills 🏔️✨ Highly recommend this vibe!',
      'likes': 342,
      'comments': 45,
      'isLiked': true,
    },
  ];

  void _toggleLike(int index) {
    setState(() {
      _posts[index]['isLiked'] = !_posts[index]['isLiked'];
      if (_posts[index]['isLiked']) {
        _posts[index]['likes']++;
      } else {
        _posts[index]['likes']--;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0E15),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D0E15),
        elevation: 0,
        title: const Text(
          'Moments & Feed',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            fontSize: 22,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: Colors.white, size: 28),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Post Creation coming in next patch! 🚀'),
                  backgroundColor: Color(0xFF161824),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListView.builder(
        itemCount: _posts.length,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemBuilder: (context, index) {
          final post = _posts[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 20),
            decoration: BoxDecoration(
              color: const Color(0xFF161824),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User Header
                ListTile(
                  leading: CircleAvatar(
                    backgroundImage: NetworkImage(post['userImage']),
                    radius: 20,
                  ),
                  title: Text(
                    post['userName'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  subtitle: Text(
                    post['timeAgo'],
                    style: const TextStyle(color: Colors.white38, fontSize: 12),
                  ),
                  trailing: const Icon(Icons.more_horiz_rounded, color: Colors.white54),
                ),

                // Post Image
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                  child: Image.network(
                    post['postImage'],
                    height: 260,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),

                // Caption
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    post['caption'],
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.9), // Fixed white90 error
                      fontSize: 14,
                      height: 1.3,
                    ),
                  ),
                ),

                // Action Bar (Like / Comment / Share)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          GestureDetector(
                            onTap: () => _toggleLike(index),
                            child: Row(
                              children: [
                                Icon(
                                  post['isLiked'] ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                                  color: post['isLiked'] ? const Color(0xFFE94057) : Colors.white60,
                                  size: 24,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  '${post['likes']}',
                                  style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 20),
                          Row(
                            children: [
                              const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white60, size: 22),
                              const SizedBox(width: 6),
                              Text(
                                '${post['comments']}',
                                style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const Icon(Icons.bookmark_border_rounded, color: Colors.white60, size: 24),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          );
        },
      ),
    );
  }
}
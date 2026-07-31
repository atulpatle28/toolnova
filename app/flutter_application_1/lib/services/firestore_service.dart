import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Collection reference
  CollectionReference get _usersCollection => _db.collection('users');

  // 1. Create or Update User Data on Signup
  Future<void> saveUserData({
    required String uid,
    required String name,
    required String email,
    String? phone,
    String bio = 'Hey there! I am using TrueConnect.',
    List<String> interests = const [],
    bool isVerified = false,
  }) async {
    try {
      await _usersCollection.doc(uid).set({
        'uid': uid,
        'name': name,
        'email': email,
        'phone': phone ?? '',
        'bio': bio,
        'interests': interests,
        'isVerified': isVerified,
        'isPremium': false,
        'createdAt': FieldValue.serverTimestamp(),
        'lastSeen': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
    } catch (e) {
      throw Exception('Failed to save profile: $e');
    }
  }

  // 2. Fetch Single User Profile Data
  Future<DocumentSnapshot> getUserProfile(String uid) async {
    try {
      return await _usersCollection.doc(uid).get();
    } catch (e) {
      throw Exception('Failed to fetch profile: $e');
    }
  }

  // 3. Realtime User Data Stream
  Stream<DocumentSnapshot> streamUserProfile(String uid) {
    return _usersCollection.doc(uid).snapshots();
  }

  // 4. Fetch Discover Matches (Excluding current user)
  Stream<QuerySnapshot> getDiscoverMatches(String currentUid) {
    return _usersCollection
        .where('uid', isNotEqualTo: currentUid)
        .limit(20)
        .snapshots();
  }

  // 5. Update Online / Last Seen Status
  Future<void> updateOnlineStatus(String uid, bool isOnline) async {
    await _usersCollection.doc(uid).update({
      'isOnline': isOnline,
      'lastSeen': FieldValue.serverTimestamp(),
    });
  }
}
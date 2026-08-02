import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class DatabaseService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  String? get _currentUserId => _auth.currentUser?.uid;

  final CollectionReference _usersCollection =
      FirebaseFirestore.instance.collection('users');

  // Save / Update User Profile
  Future<void> saveUserProfile({
    required String name,
    required int age,
    required String bio,
    required List<String> interests,
    required List<String> photoUrls,
  }) async {
    if (_currentUserId == null) return;

    await _usersCollection.doc(_currentUserId).set({
      'uid': _currentUserId,
      'name': name,
      'age': age,
      'bio': bio,
      'interests': interests,
      'photoUrls': photoUrls,
      'verified': true,
      'isOnline': true,
      'createdAt': FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  // Fetch Discover Matches (Excluding current user)
  Stream<QuerySnapshot> getDiscoverMatches(String currentUid) {
    return _usersCollection
        .where('uid', isNotEqualTo: currentUid)
        .limit(20)
        .snapshots();
  }

  // Update Online / Last Seen Status
  Future<void> updateOnlineStatus(String uid, bool isOnline) async {
    await _usersCollection.doc(uid).update({
      'isOnline': isOnline,
      'lastSeen': FieldValue.serverTimestamp(),
    });
  }
}
import 'dart:async';

class UserService {
  static final List<Map<String, dynamic>> _localContacts = [
    {'vaultId': '#VT-4040', 'alias': 'Shadow Agent'},
  ];

  static final StreamController<List<Map<String, dynamic>>> _controller =
      StreamController<List<Map<String, dynamic>>>.broadcast();

  Future<void> addContact({
    required String myVaultId,
    required String peerVaultId,
    required String alias,
  }) async {
    _localContacts.add({'vaultId': peerVaultId, 'alias': alias});
    _controller.add(List.from(_localContacts));
  }

  Stream<List<Map<String, dynamic>>> getContactsStream(String myVaultId) async* {
    yield List.from(_localContacts);
    yield* _controller.stream;
  }
}
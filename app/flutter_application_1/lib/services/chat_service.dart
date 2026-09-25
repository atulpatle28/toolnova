import 'dart:async';

class ChatService {
  static final List<Map<String, dynamic>> _localMessages = [
    {
      'id': '1',
      'senderId': '#VT-4040',
      'text': 'Secure channel verified. Burn rules active.',
      'deletePolicy': '24h',
    }
  ];

  static final StreamController<List<Map<String, dynamic>>> _msgController =
      StreamController<List<Map<String, dynamic>>>.broadcast();

  Stream<List<Map<String, dynamic>>> getMessages(String currentUserId, String peerVaultId) async* {
    yield List.from(_localMessages);
    yield* _msgController.stream;
  }

  Future<void> sendMessage({
    required String currentUserId,
    required String peerVaultId,
    required String text,
    required String deletePolicy,
  }) async {
    final newMsg = {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'senderId': currentUserId,
      'text': text,
      'deletePolicy': deletePolicy,
    };
    _localMessages.add(newMsg);
    _msgController.add(List.from(_localMessages));
  }

  Future<void> markAsSeenAndDelete({
    required String currentUserId,
    required String peerVaultId,
    required String messageId,
    required String deletePolicy,
    required String senderId,
  }) async {
    if (deletePolicy == 'seen' && senderId != currentUserId) {
      await Future.delayed(const Duration(seconds: 2));
      _localMessages.removeWhere((m) => m['id'] == messageId);
      _msgController.add(List.from(_localMessages));
    }
  }
}
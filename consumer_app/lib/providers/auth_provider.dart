import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthProvider with ChangeNotifier {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  bool _isLoggedIn = false;
  String? _token;
  String? _userId;

  bool get isLoggedIn => _isLoggedIn;
  String? get token => _token;
  String? get userId => _userId;

  AuthProvider() {
    _loadAuthState();
  }

  Future<void> _loadAuthState() async {
    try {
      _token = await _storage.read(key: 'auth_token');
      _userId = await _storage.read(key: 'user_id');
      _isLoggedIn = _token != null;
      notifyListeners();
    } catch (e) {
      debugPrint('Auth state 로드 실패: $e');
    }
  }

  Future<void> login(String token, String userId) async {
    try {
      await _storage.write(key: 'auth_token', value: token);
      await _storage.write(key: 'user_id', value: userId);
      _token = token;
      _userId = userId;
      _isLoggedIn = true;
      notifyListeners();
    } catch (e) {
      debugPrint('로그인 저장 실패: $e');
    }
  }

  Future<void> logout() async {
    try {
      await _storage.delete(key: 'auth_token');
      await _storage.delete(key: 'user_id');
      _token = null;
      _userId = null;
      _isLoggedIn = false;
      notifyListeners();
    } catch (e) {
      debugPrint('로그아웃 실패: $e');
    }
  }
}

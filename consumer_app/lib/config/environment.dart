class Environment {
  // API 설정
  static const String apiBaseUrl = 'http://localhost:5174';
  static const int apiTimeout = 30000;
  
  // 개발 모드
  static const bool isDebugMode = true;
  
  // WebView 설정
  static const String webviewBaseUrl = 'http://localhost:5174';
  static const String webviewCaregiverUrl = 'http://localhost:5174';
  static const String webviewConsumerUrl = 'http://localhost:5175';
  
  // 프로덕션 환경 설정
  static const String productionApiUrl = 'https://api.jaegagayo.com';
  static const String productionWebviewUrl = 'https://admin.jaegagayo.com';
  
  // 현재 환경에 따른 URL 반환
  static String get currentApiUrl => isDebugMode ? apiBaseUrl : productionApiUrl;
  static String get currentWebviewUrl => isDebugMode ? webviewBaseUrl : productionWebviewUrl;
  static String get currentCaregiverUrl => isDebugMode ? webviewCaregiverUrl : '$productionWebviewUrl/caregiver';
  static String get currentConsumerUrl => isDebugMode ? webviewConsumerUrl : '$productionWebviewUrl/consumer';
}

# Caregiver App

요양보호사를 위한 WebView 기반 Flutter 모바일 애플리케이션입니다.

## 🏗️ 아키텍처

이 앱은 **Flutter WebView**를 사용하여 **homecare_admin**의 React + Radix-UI 웹 애플리케이션을 모바일 앱으로 래핑합니다.

```
caregiver_app (Flutter 앱)
├── AppBar (네이티브 Flutter)
├── WebView
│   └── homecare_admin (React + Radix-UI)
│       ├── 요양보호사 대시보드
│       ├── 일정 관리
│       ├── 정산 확인
│       └── 매칭 시스템
└── BottomNavigationBar (네이티브 Flutter)
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
flutter pub get
```

### 2. homecare_admin 서버 실행
```bash
cd ../../homecare_admin
npm run dev
```

### 3. Flutter 앱 실행
```bash
flutter run
```

## 📱 주요 기능

### 네이티브 앱 기능
- **AppBar**: 앱 제목, 새로고침, 메뉴
- **BottomNavigationBar**: 홈, 일정, 정산, 매칭 네비게이션
- **오프라인 지원**: 네트워크 오류 처리
- **보안 저장소**: 로그인 토큰 관리

### WebView 내부 기능 (homecare_admin)
- **요양보호사 대시보드**: 일일 활동 요약
- **일정 관리**: 서비스 일정 확인 및 관리
- **정산 시스템**: 수익 확인 및 정산 내역
- **매칭 시스템**: 서비스 요청 매칭

## 🔧 개발 환경 설정

### 환경 변수
```dart
// lib/config/environment.dart
class Environment {
  static const String apiBaseUrl = 'http://localhost:3000';
  static const bool isDebugMode = true;
}
```

### 개발 모드
- **로컬 개발**: `http://localhost:3000`
- **프로덕션**: `https://admin.jaegagayo.com`

## 📁 프로젝트 구조

```
lib/
├── config/
│   └── environment.dart      # 환경 설정
├── providers/
│   └── auth_provider.dart    # 인증 상태 관리
├── screens/
│   └── caregiver_webview_screen.dart  # 메인 WebView 화면
└── main.dart                 # 앱 진입점
```

## 🎯 장점

### 1. 개발 효율성
- **기존 웹 시스템 100% 재사용**
- **별도 모바일 개발 불필요**
- **빠른 개발 속도**

### 2. 디자인 일관성
- **Radix-UI 컴포넌트 그대로 사용**
- **웹과 모바일 간 완벽한 일관성**
- **브랜드 통일성 유지**

### 3. 유지보수 편의성
- **단일 코드베이스 관리**
- **웹 업데이트 시 모바일도 자동 반영**
- **버그 수정 효율성**

## 🔒 보안

- **flutter_secure_storage**: 민감한 데이터 보호
- **토큰 기반 인증**: 안전한 로그인 관리
- **HTTPS 통신**: 프로덕션 환경에서 암호화

## 📦 배포

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## 🐛 문제 해결

### WebView 로딩 실패
1. homecare_admin 서버가 실행 중인지 확인
2. `http://localhost:3000` 접속 가능 여부 확인
3. 네트워크 연결 상태 확인

### 인증 문제
1. 토큰이 올바르게 저장되었는지 확인
2. 서버 인증 API 상태 확인
3. 로그아웃 후 재로그인 시도

## 📞 지원

개발 관련 문의사항이 있으시면 프로젝트 관리자에게 연락해주세요.

# 재가가요 요양보호사 웹

요양보호사를 위한 웹 애플리케이션입니다.

## 🏗️ 기술 스택

- **React 18** + **TypeScript**
- **Remix** (Full-stack framework)
- **Radix UI** (디자인 시스템)
- **Tailwind CSS** (스타일링)
- **Vite** (빌드 도구)

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저에서 확인
```
http://localhost:3000
```

## 📱 주요 기능

### 요양보호사 대시보드
- 일일 서비스 현황
- 월별 수익 통계
- 최근 서비스 내역
- 오늘 일정 확인

### 일정 관리
- 서비스 일정 확인
- 일정 필터링 및 검색
- 월간 통계
- 서비스 완료 처리

### 정산 확인
- 월별 수익 확인
- 주별 정산 내역
- 시급 및 근무 시간 관리
- 정산 요청

### 매칭 시스템
- 서비스 요청 확인
- 매칭 수락/거절
- 고객 정보 및 평점
- 매칭 통계

## 🔧 개발 환경 설정

### 환경 변수
```env
# .env
API_BASE_URL=http://localhost:8080
```

### API 엔드포인트
- **로그인**: `POST /api/auth/login`
- **일정 조회**: `GET /api/caregiver/schedules`
- **정산 조회**: `GET /api/caregiver/earnings`
- **매칭 조회**: `GET /api/caregiver/matching`

## 📁 프로젝트 구조

```
app/
├── components/
│   ├── CaregiverDashboard/     # 대시보드 컴포넌트
│   ├── CaregiverSchedule/      # 일정 관리 컴포넌트
│   ├── CaregiverEarnings/      # 정산 확인 컴포넌트
│   ├── CaregiverMatching/      # 매칭 시스템 컴포넌트
│   └── Layout.tsx              # 레이아웃 컴포넌트
├── api/                        # API 관련 파일
├── routes/                     # 페이지 라우트
└── styles/                     # 스타일 파일
```

## 🎨 디자인 시스템

### Radix UI 컴포넌트
- **Card**: 정보 표시
- **Button**: 액션 버튼
- **Input**: 입력 필드
- **Select**: 선택 드롭다운

### 색상 팔레트
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

## 🔒 보안

- **토큰 기반 인증**: JWT 토큰 사용
- **로컬 스토리지**: caregiverId 저장
- **HTTPS**: 프로덕션 환경에서 암호화

## 📦 배포

### 빌드
```bash
npm run build
```

### 프로덕션 서버 실행
```bash
npm start
```

## 🐛 문제 해결

### 로그인 실패
1. API 서버가 실행 중인지 확인
2. 네트워크 연결 상태 확인
3. 브라우저 개발자 도구에서 오류 확인

### 페이지 로딩 실패
1. 의존성이 올바르게 설치되었는지 확인
2. `npm run dev` 재실행
3. 브라우저 캐시 삭제

## 📞 지원

개발 관련 문의사항이 있으시면 프로젝트 관리자에게 연락해주세요.

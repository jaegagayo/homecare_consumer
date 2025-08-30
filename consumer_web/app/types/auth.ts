// 사용자 생성 요청 타입 (백엔드 UserCreateRequest와 일치)
export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string; // LocalDate를 string으로 변환
  gender: 'MALE' | 'FEMALE';
}

// 신청자 생성 요청 타입 (백엔드 ConsumerCreateRequest와 일치)
export interface ConsumerCreateRequest {
  residentialAddress: string;
  visitAddress: string;
  entranceType: string;
  careGrade: number;
  isMedicalAid: boolean;
  weight: number;
  disease: string; // Disease enum을 string으로 변환
  cognitiveStatus: string; // CognitiveStatus enum을 string으로 변환
  livingSituation: string;
  guardianName: string;
  guardianPhone: string;
}

// 신청자 회원가입 요청 타입 (백엔드 ConsumerSignupRequest와 일치)
export interface ConsumerSignupRequest {
  user: UserCreateRequest;
  consumer: ConsumerCreateRequest;
}

// 신청자 로그인 요청 타입
export interface ConsumerLoginRequest {
  email: string;
  password: string;
}

// 신청자 로그인 응답 타입
export interface ConsumerLoginResponse {
  token: string;
  consumer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

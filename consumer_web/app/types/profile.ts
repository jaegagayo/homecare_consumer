// 신청자 프로필 수정 요청 타입
export interface ConsumerProfileUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
}

// 신청자 상세 정보 응답 타입
export interface ConsumerDetailResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}


// 블랙리스트 생성 요청 타입
export interface CreateBlacklistRequest {
  caregiverId: string;
  consumerId: string;
}

// 블랙리스트 응답 타입
export interface BlacklistResponse {
  id: string;
  caregiverId: string;
  caregiverName: string;
  consumerId: string;
  createdAt: string;
}


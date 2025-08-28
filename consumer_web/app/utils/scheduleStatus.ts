export const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming': return 'blue';
    case 'completed': return 'green';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'upcoming': return '예정';
    case 'completed': return '완료';
    case 'cancelled': return '취소';
    default: return '알 수 없음';
  }
};

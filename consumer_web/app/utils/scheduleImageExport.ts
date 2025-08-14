import { toPng, toJpeg, toSvg } from 'html-to-image';

// 스케줄 그리드 상수 정의
const HOUR_HEIGHT = 60; // 1시간당 높이 (픽셀)
const GRID_TOP_OFFSET = 50; // 그리드 상단 여백

// html-to-image 옵션 타입 정의
interface HtmlToImageOptions {
  quality?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  style?: Record<string, string>;
  filter?: (node: HTMLElement) => boolean;
  skipAutoScale?: boolean;
  skipFonts?: boolean;
  fontEmbedCSS?: string;
  imagePlaceholder?: string;
  cacheBust?: boolean;
  useCORS?: boolean;
  allowTaint?: boolean;
  foreignObjectRendering?: boolean;
  pixelRatio?: number;
  removeContainer?: boolean;
  ignoreElements?: (element: HTMLElement) => boolean;
  onCloneNode?: (node: HTMLElement) => HTMLElement;
  onCloneNodeDocument?: (doc: Document) => Document;
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'svg';
  quality?: number;
  width?: number;
  height?: number;
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
  filename: string;
}

/**
 * HTML 요소를 이미지로 변환하는 기본 함수
 */
export const exportElementAsImage = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<ExportResult> => {
  try {
    const { format, quality = 0.95, width, height, filename } = options;
    
    // html-to-image 옵션 설정
    const htmlToImageOptions: HtmlToImageOptions = {
      quality,
      width,
      height,
      backgroundColor: '#ffffff', // 배경색 설정
      style: {
        // 이미지 출력용 스타일 적용
        'transform': 'scale(1)',
        'transform-origin': 'top left',
      }
    };

    let dataUrl: string;

    switch (format) {
      case 'jpeg':
        dataUrl = await toJpeg(element, htmlToImageOptions);
        break;
      case 'svg':
        dataUrl = await toSvg(element, htmlToImageOptions);
        break;
      default:
        dataUrl = await toPng(element, htmlToImageOptions);
    }

    // 파일명 생성
    const defaultFilename = `schedule_${new Date().toISOString().split('T')[0]}.${format}`;
    const finalFilename = filename || defaultFilename;

    return {
      success: true,
      dataUrl,
      filename: finalFilename
    };

  } catch (error) {
    console.error('이미지 변환 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      filename: options.filename || 'unknown'
    };
  }
};

/**
 * 스케줄 그리드를 이미지로 내보내는 함수
 */
export const exportScheduleAsImage = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<ExportResult> => {
  // 스케줄 그리드 전용 최적화 옵션
  const scheduleOptions: ExportOptions = {
    ...options,
    width: options.width || 1200, // 기본 너비 설정
    height: options.height || 24 * HOUR_HEIGHT + 2 * GRID_TOP_OFFSET, // 기본 높이 설정
    quality: options.quality || 0.95,
  };

  return exportElementAsImage(element, scheduleOptions);
};

/**
 * 이미지를 다운로드하는 함수
 */
export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 스케줄 그리드를 이미지로 변환하고 다운로드하는 통합 함수
 */
export const exportAndDownloadSchedule = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<ExportResult> => {
  const result = await exportScheduleAsImage(element, options);
  
  if (result.success && result.dataUrl) {
    downloadImage(result.dataUrl, result.filename);
  }
  
  return result;
};

/**
 * 여러 스케줄을 배치로 처리하는 함수 (향후 확장용)
 */
export const exportMultipleSchedules = async (
  elements: HTMLElement[],
  options: ExportOptions
): Promise<ExportResult[]> => {
  const results: ExportResult[] = [];
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const elementOptions = {
      ...options,
      filename: options.filename?.replace('.', `_${i + 1}.`) || `schedule_${i + 1}.${options.format}`
    };
    
    const result = await exportScheduleAsImage(element, elementOptions);
    results.push(result);
  }
  
  return results;
};

/**
 * 이미지 품질 옵션
 */
export const QUALITY_OPTIONS = {
  LOW: 0.7,
  MEDIUM: 0.85,
  HIGH: 0.95,
  MAX: 1.0
} as const;

/**
 * 이미지 크기 옵션
 */
export const SIZE_OPTIONS = {
  SMALL: { width: 800, height: 600 },
  MEDIUM: { width: 1200, height: 900 },
  LARGE: { width: 1600, height: 1200 },
  CUSTOM: null
} as const; 
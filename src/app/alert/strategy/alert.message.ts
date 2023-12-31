import { DateTime } from 'luxon';

export const alertTitle = 'Hongik Univ. DSC Server Alert';
export const alertTitleHyperlink =
  'https://github.com/J-hoplin1/DSC-Lab-Backend';
export const alertDescription =
  '서버 에러 메세지 알림입니다. 관리자에게 이 문제를 문의해주세요.';
export const alertThumbnail =
  'https://scontent-ssn1-1.xx.fbcdn.net/v/t39.30808-6/334766267_5384043541696329_5186981967087625133_n.jpg?stp=dst-jpg_p526x296&_nc_cat=101&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=r4StzZ6-7OoAX97e48j&_nc_ht=scontent-ssn1-1.xx&oh=00_AfAL5K5HS9ru9328KWLc2zVrbWucuzIJEyACgGMKis9g0A&oe=64F7ADFF';
export const alertErrorEndpoint = 'Error Endpoint';
export const alertStatusCode = 'Status Code (Error Code)';
export const alertErrorMessage = 'Error Message';
export const alertFooterText = 'Developed by Hoplin';
export const alertTimestamp = 'Logged Time Stamp';
export const alertFooterIconURL =
  'https://avatars.githubusercontent.com/u/45956041?v=4';
export const alertStackTrace = 'Stack Trace';

const defaultTimeFormat = 'yyyy년 MM월 dd일 HH:mm:ss';
export const getTimeOfNow = () => {
  const now = DateTime.local();
  return now.toFormat(defaultTimeFormat);
};

import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

export const WrapLoading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
  gap: 20px;
`;

export const LoaderContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Loader = styled.span<{ $stt: number }>`
  position: absolute;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #2563eb 0%, #0f172a 100%); /* Cập nhật màu xanh dương học tập */
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${({ $stt }) => `${$stt * 0.15}s`};
  
  /* Đặt vị trí xoay theo góc tròn */
  transform-origin: center;
  left: 50%;
  top: 50%;
  margin-left: -6px;
  margin-top: -6px;
  transform: rotate(${({ $stt }) => $stt * 36}deg) translate(30px);
`;

export const RippleEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #2563eb;
  border-radius: 50%;
  animation: ${ripple} 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
`;

export const LoadingText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.7;
  animation: pulse-text 2s infinite ease-in-out;

  @keyframes pulse-text {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
`;

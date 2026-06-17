import { WrapLoading, Loader, LoaderContainer, RippleEffect, LoadingText } from "./styles"; // Đổi sang số nhiều 'styles'

export const LoadingLazy = () => {
  return (
    <WrapLoading>
      <LoaderContainer>
        <RippleEffect />
        {/* Render vòng tròn 10 dấu chấm xoay sử dụng .map thuần túy React */}
        {Array.from({ length: 10 }).map((_, index) => (
          <Loader key={index} $stt={index + 1} />
        ))}
      </LoaderContainer>
      <LoadingText>Đang tải trang...</LoadingText>
    </WrapLoading>
  );
};

export default LoadingLazy;

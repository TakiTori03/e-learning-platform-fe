import { Button } from "antd";
import styled from "styled-components";
import type { ThemesType } from "@/configs/theme";
import { TypeCustom, TypeSizeCustom } from "./enum";

function getHeightButton(value: TypeSizeCustom) {
  switch (value) {
    case TypeSizeCustom.Medium:
      return `36px !important`;
    case TypeSizeCustom.Small:
      return `20px !important`;
    default:
      return `36px`;
  }
}
function getBackgroundButton(
  value: TypeCustom,
  hover = false,
  _theme?: ThemesType,
) {
  switch (value) {
    case TypeCustom.Primary:
      return (hover ? "#1d4ed8" : "#2563eb") + "!important"; // Màu Xanh dương học tập (Tailwind blue-600/700)
    case TypeCustom.Secondary:
      return (hover ? "#f1f5f9" : "#f8fafc") + "!important"; // Màu Slate nhẹ (Tailwind slate-50/100)
    case TypeCustom.Action:
      return "transparent";
    case TypeCustom.DANGER:
      return (hover ? "#b91c1c" : "#dc2626") + "!important"; // Màu Đỏ rose cảnh báo (Tailwind red-600/700)
    default:
      return "transparent";
  }
}

function getColorTextButton(value: TypeCustom, hover = false) {
  switch (value) {
    case TypeCustom.Primary:
      return `#FFFFFF !important`;
    case TypeCustom.Secondary:
      return (hover ? "#1e293b" : "#475569") + "!important"; // Màu chữ tối nhẹ
    case TypeCustom.Action:
      return (hover ? "#2563eb" : "#475569") + "!important"; // Chữ đổi sang màu Primary khi hover
    case TypeCustom.DANGER:
      return "#FFFFFF !important";
    default:
      return hover ? "#2563eb" : "#475569";
  }
}

function getBorderButton(value: TypeCustom) {
  switch (value) {
    case TypeCustom.Primary:
    case TypeCustom.Secondary:
    case TypeCustom.DANGER:
      return "none;";
    case TypeCustom.Action:
      return "1px solid #cbd5e1 !important"; // Đường viền mỏng tinh tế (Tailwind slate-300)
    default:
      return "none;";
  }
}


export const StyledButton = styled(Button)<{
  $disabledCustom?: boolean;
  $sizeCustom?: TypeSizeCustom;
  $typeCustom?: TypeCustom;
  $activeCustom?: boolean;
}>`
  ${({ $disabledCustom }) =>
    $disabledCustom ? `opacity: 0.5; cursor: not-allowed;` : null}
  ${({ $sizeCustom }) =>
    $sizeCustom ? `height: ${getHeightButton($sizeCustom)};` : null}
  ${({ $typeCustom, $activeCustom }) =>
    $typeCustom
      ? `color: ${getColorTextButton($typeCustom, $activeCustom)};`
      : null}
  ${({ $typeCustom, $activeCustom, theme }) =>
    $typeCustom
      ? `background: ${getBackgroundButton($typeCustom, $activeCustom, theme as ThemesType)};`
      : null}
  ${({ $typeCustom }) =>
    $typeCustom ? `border: ${getBorderButton($typeCustom)};` : null}
  &:hover {
    ${({ $typeCustom }) =>
      $typeCustom ? `color: ${getColorTextButton($typeCustom, true)};` : null}
    ${({ $typeCustom, theme }) =>
      $typeCustom
        ? `background: ${getBackgroundButton($typeCustom, true, theme as ThemesType)};`
        : null}
    ${({ $typeCustom }) =>
      $typeCustom ? `border: ${getBorderButton($typeCustom)};` : null}
  }
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  gap: 8px;
`;

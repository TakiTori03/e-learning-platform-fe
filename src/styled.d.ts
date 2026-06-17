import "styled-components";
import type { ThemesType } from "@/configs/theme";

declare module "styled-components" {
  export interface DefaultTheme extends ThemesType {}
}

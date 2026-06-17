import { type SearchProps } from "antd/es/input/Search";

export interface PropsCustomSearch extends Omit<SearchProps, "onSearch"> {
  isTrimOnChange?: boolean;
  width?: string;
  onSearch: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  debounceTime?: number; // Tùy chọn debounce thời gian tìm kiếm tự động
  loading?: boolean;
  disabled?: boolean;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  tooltip?: string;
}

import { memo, useEffect, useRef, type FC, type ChangeEvent, type ClipboardEvent, type FocusEvent } from "react";
import { Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { StyledSearch } from "./styles";
import type { PropsCustomSearch } from "./types";

const CustomSearch: FC<PropsCustomSearch> = (props) => {
  const {
    onSearch,
    loading,
    disabled,
    value,
    setValue,
    tooltip,
    width = "100%",
    isTrimOnChange = false,
    debounceTime,
    placeholder = "Tìm kiếm...",
    enterButton = "Tìm kiếm",
    ...rest
  } = props;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (setValue) {
      setValue(e.target.value.trim());
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const finalVal = isTrimOnChange ? val.trim() : val;
    
    if (setValue) {
      setValue(finalVal);
    }

    // Tự động kích hoạt tìm kiếm nếu cấu hình debounceTime
    if (debounceTime !== undefined && debounceTime > 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onSearch(finalVal);
      }, debounceTime);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (setValue) {
        const trimmedVal = (e.target as HTMLInputElement).value.trim();
        setValue(trimmedVal);
        
        if (debounceTime !== undefined && debounceTime > 0) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          onSearch(trimmedVal);
        }
      }
    }, 0);
  };

  // Dọn dẹp timer tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const searchElement = (
    <StyledSearch
      onSearch={onSearch}
      onBlur={onBlur}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
      onPaste={onPaste}
      enterButton={enterButton}
      placeholder={placeholder}
      width={width}
      prefix={<SearchOutlined />}
      {...rest}
    />
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="top">
        {searchElement}
      </Tooltip>
    );
  }

  return searchElement;
};

export default memo(CustomSearch);
export type { PropsCustomSearch };

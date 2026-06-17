import { Spin, type SelectProps } from "antd";
import { useRef, useState, useMemo } from "react";
import { debounce } from "lodash";
import CSelect from "../Select";

export interface DebounceSelectProps<ValueType = any> extends Omit<
  SelectProps<ValueType | ValueType[]>,
  "options" | "children"
> {
  fetchOptions?: (search: string) => Promise<ValueType[]>;
  mode?: "multiple" | "tags";
  debounceTimeout?: number;
}

export function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  mode,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      if (!fetchOptions) return;
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) return;
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <CSelect
      mode={mode}
      labelInValue={false}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" tip="Đang tìm..." /> : null}
      {...props}
      options={options}
    />
  );
}

export default DebounceSelect;

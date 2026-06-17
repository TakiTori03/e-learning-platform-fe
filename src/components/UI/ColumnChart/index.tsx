import { type FC } from "react";
import ReactApexChart from "react-apexcharts";

type Props = {
  colors?: string[];
  categories: string[];
  xTitle?: string;
  yTitle?: string;
  series: { name: string; data: number[] }[];
  width?: number | string;
  height?: number | string;
};

export const ColumnChart: FC<Props> = ({
  colors,
  categories,
  xTitle,
  yTitle,
  series,
  width,
  height,
}) => {
  return (
    <ReactApexChart
      options={{
        chart: {
          type: "bar",
          toolbar: {
            show: false,
          },
          fontFamily: "Inter, system-ui, sans-serif",
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "30%",
            borderRadius: 5,
            borderRadiusApplication: "end",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 6,
          colors: ["transparent"],
        },
        xaxis: {
          categories: categories,
          title: {
            text: xTitle,
            style: {
              fontSize: "14px",
              fontWeight: 600,
              color: "#64748b",
            },
          },
        },
        yaxis: {
          title: {
            text: yTitle,
            style: {
              fontSize: "14px",
              fontWeight: 600,
              color: "#64748b",
            },
          },
        },
        // Cập nhật lại màu mặc định cho tươi sáng và phù hợp E-learning (Màu xanh chủ đạo và màu phụ)
        colors: colors ? colors : ["#2563eb", "#10b981"],
        fill: {
          opacity: 1,
        },
      }}
      series={series}
      type="bar"
      height={height ? height : 400}
      width={width ? width : "100%"}
    />
  );
};

export default ColumnChart;

import React, { useState } from "react";
  import { Card, Col, Row, Typography } from "antd";
  import { For } from "@/components/UI/Template";
  import type { AnyElement, ICategory } from "@/type";

  const { Title } = Typography;

  interface CategoryListProps {
    categories: ICategory[];
    loading: boolean;
  }

  const CategoryCoverImage: React.FC<{ src?: string | null; name: string }> = ({ src, name }) => {
    const [prevSrc, setPrevSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    if (src !== prevSrc) {
      setPrevSrc(src);
      setHasError(false);
    }

    const isValidUrl = src && (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"));

    if (!isValidUrl || hasError) {
      return <span className="text-4xl text-blue-200">📚</span>;
    }

    return (
      <img
        alt={name}
        src={src}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    );
  };

  const CategoryList = ({ categories, loading }: CategoryListProps) => {
    const displayList = loading ? Array.from({ length: 4 }) : categories;

    return (
      <div className="py-12">
        <Title level={2} className="mb-8 text-center">
          Khám phá Danh mục
        </Title>
        <Row gutter={[24, 24]}>
          <For
            array={displayList}
            render={(item: AnyElement, index) => (
              <Col xs={24} sm={12} md={6} key={item?.id || index}>
                <Card
                  hoverable
                  loading={loading}
                  cover={
                    <div className="h-40 bg-blue-50 flex items-center justify-center overflow-hidden">
                      <CategoryCoverImage
                        src={item?.icon || item?.cateImage}
                        name={item?.name || "Category"}
                      />
                    </div>
                  }
                  className="text-center transition-all hover:-translate-y-2"
                >
                  <Card.Meta
                    title={item?.name}
                    description={`${item?.courses || 0} khóa học`}
                  />
                </Card>
              </Col>
            )}
          />
        </Row>
      </div>
    );
  };

  export default CategoryList;

import { FC, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Spinner,
  Link,
  Input,
  Chip,
} from '@nextui-org/react';
import { trpc } from '@web/utils/trpc';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

const ArticleList: FC = () => {
  const { id } = useParams();
  const [keyword, setKeyword] = useState('');

  const mpId = id || '';
  const normalizedKeyword = keyword.trim();

  const { data, fetchNextPage, isLoading, hasNextPage } =
    trpc.article.list.useInfiniteQuery(
      {
        limit: 20,
        mpId,
        keyword: normalizedKeyword || undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const items = useMemo(() => {
    return data
      ? data.pages.reduce((acc, page) => [...acc, ...page.items], [] as any[])
      : [];
  }, [data]);

  return (
    <div>
      <div className="flex items-center gap-3 px-1 pb-3">
        <Input
          isClearable
          size="sm"
          label="文章搜索"
          placeholder="输入标题关键词，例如：就业、AI、大模型"
          value={keyword}
          onValueChange={setKeyword}
          className="max-w-xl"
        />
        <Chip size="sm" variant="flat">
          当前加载 {items.length} 篇
        </Chip>
        <Chip size="sm" variant="flat" color="primary">
          20004 Edition
        </Chip>
      </div>

      <Table
        classNames={{
          base: 'h-full',
          table: 'min-h-[420px]',
        }}
        aria-label="文章列表"
        bottomContent={
          hasNextPage && !isLoading ? (
            <div className="flex w-full justify-center">
              <Button
                isDisabled={isLoading}
                variant="flat"
                onPress={() => {
                  fetchNextPage();
                }}
              >
                {isLoading && <Spinner color="white" size="sm" />}
                加载更多
              </Button>
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn key="title">标题</TableColumn>
          <TableColumn width={180} key="publishTime">
            发布时间
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          emptyContent={
            normalizedKeyword ? `没有找到包含“${normalizedKeyword}”的文章` : '暂无数据'
          }
          items={items || []}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => {
                let value = getKeyValue(item, columnKey);

                if (columnKey === 'publishTime') {
                  value = dayjs(value * 1e3).format('YYYY-MM-DD HH:mm:ss');
                  return <TableCell>{value}</TableCell>;
                }

                if (columnKey === 'title') {
                  return (
                    <TableCell>
                      <Link
                        className="visited:text-neutral-400"
                        isBlock
                        showAnchorIcon
                        color="foreground"
                        target="_blank"
                        href={`https://mp.weixin.qq.com/s/${item.id}`}
                      >
                        {value}
                      </Link>
                    </TableCell>
                  );
                }
                return <TableCell>{value}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArticleList;

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
  Tooltip,
} from '@nextui-org/react';
import { trpc } from '@web/utils/trpc';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const archiveStatusMap: Record<
  number,
  { label: string; color: 'default' | 'success' | 'danger' | 'warning' | 'primary' }
> = {
  0: { label: '未归档', color: 'default' },
  1: { label: '已归档', color: 'success' },
  2: { label: '失败', color: 'danger' },
  3: { label: '归档中', color: 'warning' },
};

const ArticleList: FC = () => {
  const { id } = useParams();
  const [keyword, setKeyword] = useState('');

  const mpId = id || '';
  const normalizedKeyword = keyword.trim();
  const queryUtils = trpc.useUtils();

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

  const { data: archiveStats, refetch: refetchArchiveStats } =
    trpc.article.archiveStats.useQuery({
      mpId: mpId || undefined,
    });

  const { mutateAsync: archiveArticle, isLoading: isArchivingOne } =
    trpc.article.archive.useMutation();

  const { mutateAsync: archiveBatch, isLoading: isArchivingBatch } =
    trpc.article.archiveBatch.useMutation();

  const items = useMemo(() => {
    return data
      ? data.pages.reduce((acc, page) => [...acc, ...page.items], [] as any[])
      : [];
  }, [data]);

  const refreshArticleData = async () => {
    await queryUtils.article.list.reset();
    await refetchArchiveStats();
  };

  const handleArchiveOne = async (articleId: string) => {
    try {
      await archiveArticle(articleId);
      toast.success('正文归档成功');
    } catch (error: any) {
      toast.error('正文归档失败', {
        description: error?.message || '请稍后重试',
      });
    } finally {
      await refreshArticleData();
    }
  };

  const handleArchiveBatch = async () => {
    const result = await archiveBatch({
      mpId: mpId || undefined,
      limit: 20,
      retryFailed: true,
    });
    toast.success(
      `本批完成：成功 ${result.success} 篇，失败 ${result.failed} 篇`,
    );
    await refreshArticleData();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 px-1 pb-3">
        <Input
          isClearable
          size="sm"
          label="全文搜索"
          placeholder="搜索标题或已归档正文，例如：就业、AI、大模型"
          value={keyword}
          onValueChange={setKeyword}
          className="max-w-xl"
        />
        <Chip size="sm" variant="flat">
          文章 {archiveStats?.total ?? items.length}
        </Chip>
        <Chip size="sm" variant="flat" color="success">
          已归档 {archiveStats?.archived ?? 0}
        </Chip>
        <Chip size="sm" variant="flat" color="danger">
          失败 {archiveStats?.failed ?? 0}
        </Chip>
        <Chip size="sm" variant="flat" color="primary">
          20004 Edition
        </Chip>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          isLoading={isArchivingBatch}
          onPress={handleArchiveBatch}
        >
          归档下一批20篇
        </Button>
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
          <TableColumn width={100} key="archiveStatus">
            归档状态
          </TableColumn>
          <TableColumn width={110} key="actions">
            操作
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          emptyContent={
            normalizedKeyword
              ? `没有找到包含“${normalizedKeyword}”的文章`
              : '暂无数据'
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

                if (columnKey === 'archiveStatus') {
                  const status = archiveStatusMap[item.archiveStatus ?? 0];
                  return (
                    <TableCell>
                      <Tooltip content={item.archiveError || status.label}>
                        <Chip size="sm" color={status.color} variant="flat">
                          {status.label}
                        </Chip>
                      </Tooltip>
                    </TableCell>
                  );
                }

                if (columnKey === 'actions') {
                  return (
                    <TableCell>
                      <Button
                        size="sm"
                        variant="light"
                        color={item.archiveStatus === 2 ? 'danger' : 'primary'}
                        isDisabled={item.archiveStatus === 3}
                        isLoading={isArchivingOne && item.archiveStatus === 3}
                        onPress={() => handleArchiveOne(item.id)}
                      >
                        {item.archiveStatus === 1
                          ? '重新归档'
                          : item.archiveStatus === 2
                            ? '重试'
                            : '归档'}
                      </Button>
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

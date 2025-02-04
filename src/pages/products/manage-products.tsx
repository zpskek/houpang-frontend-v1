import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link, List, ListInput, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';

import { getProductsFromProvider } from '@api';
import { currency } from '@js/utils';
import i18n from '../../assets/lang/i18n';
import { GetProductsFromProviderOutput, Product, SortState, SortStates } from '@interfaces/product.interface';
import { productsFromProviderKeys } from '@reactQuery/query-keys';
import { formmatPrice } from '@utils/index';
import { useInView } from 'react-intersection-observer';
import StaticRatingStar from '@components/StaticRatingStar';
import LandingPage from '@pages/landing';

interface ProductsFilterProps {
  sort: SortState;
}

const ManageProductsPage = ({ f7route, f7router }) => {
  const [viewType, setViewType] = useState('grid');
  // const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const { is_main }: { is_main: boolean } = f7route.query;
  const queryClient = useQueryClient();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const filterForm = useFormik<ProductsFilterProps>({
    initialValues: {
      sort: 'createdAt desc',
    },

    onSubmit: async () => {
      await queryClient.removeQueries(PRODUCTS_FROM_PROVIDER_KEY);
      await refetch();
      // const {
      //   data: { ok, products, totalResults },
      // } = await refetch();
      // if (ok) {
      //   setProducts(products);
      //   setTotalCount(totalResults);
      //   setCategoryName(categoryName);
      // }
    },
  });
  const PRODUCTS_FROM_PROVIDER_KEY = productsFromProviderKeys.list({ ...filterForm.values });

  const {
    fetchNextPage, //
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    data,
    error,
    status,
    refetch,
  } = useInfiniteQuery<GetProductsFromProviderOutput, Error>(
    PRODUCTS_FROM_PROVIDER_KEY, //
    ({ pageParam }) =>
      getProductsFromProvider({
        sort: filterForm.values.sort,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.hasNextPage;
        return hasNextPage ? lastPage.nextPage : false;
      },
      onSuccess: (data) => {
        setTotalCount(data.pages[data.pages.length - 1].totalResults);
      },
    },
  );

  // const { refetch } = useQuery<GetProductsFromProviderOutput, Error>(
  //   PRODUCTS_FROM_PROVIDER_KEY,
  //   () => getProductsFromProvider({ ...filterForm.values }),
  //   {
  //     enabled: false,
  //   },
  // );

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching]);

  // useEffect(() => {
  //   (async () => {
  //     const { ok, products, totalResults } = await getProductsFromProvider({ page: 1 });
  //     if (ok) {
  //       setProducts(products);
  //       setTotalCount(totalResults);
  //     }
  //   })();
  // }, []);

  const onRefresh = async (done) => {
    await queryClient.removeQueries(PRODUCTS_FROM_PROVIDER_KEY);
    await refetch();
    // const { data } = await refetch();
    // setProducts(data.products);
    // setTotalCount(data.totalResults);
    done();
  };

  const onClickLink = (e: any, productId) => {
    f7router.navigate(`/products/${productId}`, {
      props: {
        productQeuryKey: PRODUCTS_FROM_PROVIDER_KEY,
      },
    });
  };

  return (
    <Page //
      noToolbar={!is_main}
      onPtrRefresh={onRefresh}
      ptr
    >
      <Navbar backLink={!is_main}>
        <NavTitle>{'상품 관리'}</NavTitle>
        <NavRight>
          <Link href="/shopping-list" iconF7="cart" iconBadge={0} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency((data?.pages[0].totalResults && totalCount) || 0)}</b>개 상품
        </div>
        <ListInput
          type="select"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          name="sort"
          onChange={(e) => {
            console.log(e);
            filterForm.handleChange(e);
            filterForm.submitForm();
          }}
          value={filterForm.values.sort}
        >
          {map(SortStates, (v, idx) => (
            <option value={v[0]} key={idx}>
              {v[1]}
            </option>
          ))}
        </ListInput>
        <ListInput
          type="select"
          defaultValue="grid"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
          onChange={(e) => setViewType(e.target.value)}
        >
          {map(i18n.t('ui'), (v, k) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </ListInput>
      </form>
      {status === 'loading' ? (
        <LandingPage />
      ) : status === 'error' ? (
        <span>Error:{error.message}</span>
      ) : (
        <List noHairlines className="mt-0 text-sm font-thin">
          {viewType === 'grid' ? (
            <ul className="flex-wrap grid grid-cols-2">
              {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.products.map((product: Product) => (
                    <div className="relative" key={product.id}>
                      <Link className="block m-1" onClick={(e) => onClickLink(e, product.id)}>
                        <div
                          className="bg-gray-100 py-32 bg-center bg-cover"
                          style={{
                            backgroundImage: `url(${product.images[0]})`,
                          }}
                        ></div>
                        <div className="m-1">
                          <div className="font-bold mt-1 mr-1 truncate">{product.name}</div>
                          <div className="text-red-700 text-xl font-bold">{formmatPrice(product.price)}원</div>
                          <div className="flex items-center">
                            <div className="mr-1">
                              <StaticRatingStar //
                                count={5}
                                rating={Math.ceil(product.avgRating)}
                                color={{
                                  filled: '#ffe259',
                                  unfilled: '#DCDCDC',
                                }}
                                className="text-xl"
                              />
                            </div>
                            <div className="text-blue-500 text-base mb-1">({product.reviews.length})</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col">
              {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.products.map((product: Product) => (
                    <div>
                      <a className="flex gap-1 m-1" onClick={(e) => onClickLink(e, product.id)} key={product.id}>
                        <img src={product.images[0]} alt="" className="w-1/4 h-40 mr-4" />
                        <div className="w-3/4">
                          <div className="text-xl font-bold mt-1 line-clamp-2">{product.name}</div>
                          <div className="text-red-700 text-2xl mb-6 font-bold">{formmatPrice(product.price)}원</div>
                          <div className="flex items-center">
                            <div className="mr-1">
                              <StaticRatingStar //
                                count={5}
                                rating={Math.ceil(product.avgRating)}
                                color={{
                                  filled: '#ffe259',
                                  unfilled: '#DCDCDC',
                                }}
                                className="text-xl"
                              />
                            </div>
                            <div className="text-blue-500 text-base mb-1">({product.reviews.length})</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          )}
          <div className="flex justify-center font-bold mt-4">
            <div ref={hasNextPage && !isFetching ? ref : null}>
              {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
            </div>
          </div>
        </List>
      )}
    </Page>
  );
};

export default React.memo(ManageProductsPage);

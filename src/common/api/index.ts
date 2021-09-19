import { Token } from '@constants';
import {
  FindLikeListOutput,
  LikeProductInput,
  LikeProductOutput,
  UnlikeProductInput,
  UnlikeProductOutput,
} from '@interfaces/like.interface';
import {
  CreateOrderInput,
  CreateOrderOutput,
  GetOrdersFromConsumerInput,
  GetOrdersFromConsumerOutput,
} from '@interfaces/order.interface';
import {
  AddProductInput,
  AddProductOutput,
  DeleteProductInput,
  DeleteProductOutput,
  EditProductInput,
  EditProductOutput,
  FindProductByIdInput,
  FindProductByIdOutput,
  GetProductsFromProviderInput,
  GetProductsFromProviderOutput,
} from '@interfaces/product.interface';
import { getToken } from '@store';
import { AxiosResponse } from 'axios';
import {
  GetAllCategoriesOutput,
  GetProductsByCategoryIdInput,
  GetProductsByCategoryIdOutput,
} from 'src/interfaces/category.interface';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  EditProfileInput,
  EditProfileOutput,
  SignInInput,
  SignInOutput,
  SignUpInput,
  SignUpOutput,
} from 'src/interfaces/user.interface';
import { PlainAPI, API, VERSION, API_URL } from './api.config';

export const refresh = (): Promise<{ data: Token }> =>
  PlainAPI.get('/token', {
    headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
  });

export const get = (url: string, params: any) => PlainAPI.get(url, params);

// user APIs

export const signupAPI = async (data: SignUpInput) => {
  let response: AxiosResponse<SignUpOutput>;
  try {
    response = await PlainAPI.post<SignUpOutput>('/signup', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const loginAPI = async (data: SignInInput) => {
  let response: AxiosResponse<SignInOutput>;
  try {
    response = await PlainAPI.post('/login', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const editProfileAPI = async (data: EditProfileInput) => {
  let response: AxiosResponse<EditProfileOutput>;
  try {
    response = await API.post('/edit-profile', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const changePasswordAPI = async (data: ChangePasswordInput) => {
  let response: AxiosResponse<ChangePasswordOutput>;
  try {
    response = await API.post('/change-password', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const logoutAPI = () => API.delete('/logout');

// export const {
//   query: getItems,
//   get: getItem,
//   create: createItem,
//   update: updateItem,
//   destroy: destroyItem,
// } = ApiService('items');

// export const { query: getUsers, get: getUser } = ApiService('users');
// export const { query: getCategories, get: getCategory } = ApiService('categories');

// product APIs

export const getProductsByCategoryId = async ({
  categoryId,
  order = 'createdAt desc',
  page = 1,
}: GetProductsByCategoryIdInput): Promise<GetProductsByCategoryIdOutput> => {
  let response: AxiosResponse<GetProductsByCategoryIdOutput>;
  try {
    response = await API.get<GetProductsByCategoryIdOutput>(`/categories/${categoryId}`, {
      params: {
        order,
        page,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const findProductById = async ({ productId }: FindProductByIdInput): Promise<FindProductByIdOutput> => {
  let response: AxiosResponse<FindProductByIdOutput>;
  try {
    response = await API.get<FindProductByIdOutput>(`/products/${productId}`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getProductsFromProvider = async ({
  page,
  sort,
}: GetProductsFromProviderInput): Promise<GetProductsFromProviderOutput> => {
  let response: AxiosResponse<GetProductsFromProviderOutput>;
  try {
    response = await API.get<GetProductsFromProviderOutput>('/products/provider', {
      params: {
        page,
        sort,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const addProduct = async (data: AddProductInput): Promise<AddProductOutput> => {
  let response: AxiosResponse<AddProductOutput>;
  try {
    console.log(data);
    response = await API.post<AddProductOutput>('/products', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const editProduct = async ({
  productId,
  categoryName,
  images,
  infos,
  name,
  price,
  stock,
}: EditProductInput): Promise<EditProductOutput> => {
  const data = {
    categoryName,
    images,
    infos,
    name,
    price,
    stock,
  };
  let response: AxiosResponse<EditProductOutput>;
  try {
    response = await API.put<EditProductOutput>(`/products/${productId}`, data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const deleteProduct = async ({ productId }: DeleteProductInput): Promise<DeleteProductOutput> => {
  let response: AxiosResponse<DeleteProductOutput>;
  try {
    response = await API.delete<DeleteProductOutput>(`/products/${productId}`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// category API

export const getCategories = async () => {
  let response: AxiosResponse<GetAllCategoriesOutput>;
  try {
    response = await PlainAPI.get<GetAllCategoriesOutput>('/categories');
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
// export const getCategory = (slug: string) => API.get<GetAllCategoriesOutput>(`/products/${slug}`);

// upload API

export const uploadImages = async (data) => {
  let response;
  try {
    response = await API.post('/uploads', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// order api

export const createOrderAPI = async (data: CreateOrderInput): Promise<CreateOrderOutput> => {
  let response: AxiosResponse<CreateOrderOutput>;
  try {
    response = await API.post<CreateOrderOutput>('/orders', data);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const getOrdersFromConsumerAPI = async ({
  consumerId,
  status,
}: GetOrdersFromConsumerInput): Promise<GetOrdersFromConsumerOutput> => {
  let response: AxiosResponse<GetOrdersFromConsumerOutput>;
  try {
    response = await API.get<GetOrdersFromConsumerOutput>('/orders/consumer', {
      params: {
        status,
        consumerId,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// like api

export const findLikeList = async (): Promise<FindLikeListOutput> => {
  let response: AxiosResponse<FindLikeListOutput>;
  try {
    response = await API.get<FindLikeListOutput>('/likes');
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const likeProductAPI = async ({ productId }: LikeProductInput): Promise<LikeProductOutput> => {
  let response: AxiosResponse<LikeProductOutput>;
  try {
    response = await API.put<LikeProductOutput>(`/likes/products/${productId}/add`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const unlikeProductAPI = async ({ productId }: UnlikeProductInput): Promise<UnlikeProductOutput> => {
  let response: AxiosResponse<UnlikeProductOutput>;
  try {
    response = await API.put<UnlikeProductOutput>(`/likes/products/${productId}/remove`);
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

// post api

export const getPosts = () => async (params = null) => {
  const { data } = await API.get('/posts', { params });
  return data;
};
export const getPost = (postId) => async () => {
  const { data } = await API.get<any>(`/posts/${postId}`);
  return data;
};
export const createPost = (params) => API.post('/posts', { post: params });
export const updatePost = (postId, params) => API.patch(`/posts/${postId}`, { post: params });
export const destroyPost = (postId) => API.delete(`/posts/${postId}`);

export { API_URL, VERSION };

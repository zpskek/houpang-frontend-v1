import React, { useState } from 'react';
import { Checkbox, Link, Navbar, Page, Stepper, Toolbar } from 'framework7-react';

import { formmatPrice } from '@utils/index';
import { addProductToShoppingList, getShoppingList } from '@store';

const ShoppingListPage = () => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const shoppingList = getShoppingList();
  const onClickOrderCount = (e, id: string) => {
    shoppingList.forEach((item) => {
      if (item.id == id) {
        item.orderCount = e;
      }
    });
    addProductToShoppingList(shoppingList);
  };

  const plusTotalPrice = (name: string) => {
    shoppingList.forEach((item) => {
      if (item.id === name) {
        setTotalPrice((prev) => prev + item.price);
      }
    });
  };
  const minusTotalPrice = (name: string) => {
    shoppingList.forEach((item) => {
      if (item.id === name) {
        setTotalPrice((prev) => prev - item.price);
      }
    });
  };

  const onItemChange = (e: any) => {
    const name = e.target.name;
    if (e.target.checked) {
      items.push(name);
      plusTotalPrice(name);
    } else {
      items.splice(items.indexOf(name), 1);
      minusTotalPrice(name);
    }
    setItems(items);
  };
  const onItemsChange = () => {
    if (items.length < shoppingList.length) {
      const checkedNames = shoppingList.map((item) => item.id);
      setItems(checkedNames);
      let total: number = 0;
      shoppingList.forEach((item) => {
        total += item.price;
      });
      setTotalPrice(total);
    } else if (items.length === shoppingList.length) {
      setItems([]);
      setTotalPrice(0);
    }
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="장바구니" backLink={true}></Navbar>
      <Toolbar top>
        {/* <Link tabLink="#view-shopping-list" tabLinkActive icon="las la-home" text="일반구매" /> */}
        {/* <Link tabLink="#view-users" icon="las la-address-book" text="찜한상품" /> */}
        <Link href="/" className="font-bold flex px-6 py-4 text-base">
          일반구매
        </Link>
      </Toolbar>

      {/* <View id="view-shopping-list" stackPages name="items" tab url="/shopping-list" /> */}
      {/* <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" /> */}
      {shoppingList &&
        shoppingList.map((item) => (
          <div className="pb-2 border-b border-gray-400 mx-2 my-4" key={item.id}>
            <div className="flex">
              <img src={item.imageUrl} alt="" className="w-1/4 mr-4" />
              <div>
                <div className="flex mb-4">
                  <Checkbox
                    name={item.id}
                    className="mr-2"
                    checked={items.indexOf(item.id) >= 0}
                    onChange={onItemChange}
                  ></Checkbox>
                  <div className="font-bold">{item.name}</div>
                </div>
                <div className="mb-4">
                  <span className="font-bold text-lg">{formmatPrice(item.price)}</span>
                  <span>원</span>
                </div>
                <div className="flex items-center">
                  <button className="w-20 font-medium border py-2 px-6 rounded-md bg-gray-200">삭제</button>
                  <Stepper
                    value={item.orderCount}
                    onStepperChange={(e) => onClickOrderCount(e, item.id)}
                    className="ml-4 text-gray-300 border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className="flex fixed bottom-0 border-t-2 botder-gray-600 w-full bg-white">
        <div className="ml-4 mr-2 flex-1 flex justify-between items-center w-full">
          <label className="flex flex-col items-center checkbox">
            <input
              type="checkbox"
              name="buy-all"
              value="전체"
              onChange={onItemsChange}
              checked={items.length === shoppingList.length}
            />
            <i className="icon-checkbox mb-1"></i>
            <span>전체</span>
          </label>
          <div>
            <span>합계: </span>
            <span className="font-bold">{formmatPrice(totalPrice)}</span>
            <span>원</span>
          </div>
        </div>
        <button
          className="flex-1 py-4 border bg-blue-600 text-white font-bold text-base tracking-normal actions-open"
          data-actions="#buy"
        >
          <span>구매하기 </span>
          <span>({items.length})</span>
        </button>
      </div>
    </Page>
  );
};

export default React.memo(ShoppingListPage);

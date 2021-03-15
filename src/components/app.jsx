import {
  App, f7,
  f7ready,
  Link,
  List,
  ListItem, Navbar, Page, PageContent, Panel,
  Toolbar, View, Views
} from 'framework7-react';
import 'lodash';
import React from 'react';
import { logout } from '../common/api';
import { getToken } from '../common/auth';
import store from '../common/store';
import { getDevice } from '../js/framework7-custom.js';
import routes from '../js/routes';
import { sleep, toast } from '../js/utils';
import i18n from "../lang/i18n";


global.i18next = i18n;

const MyApp = () => {
  // Login screen demo data
  let loggedIn = !!getToken().token;
  const handleLogout = async ()=>{
    await logout()
    toast.get().setToastText('로그아웃 되었습니다.').openToast()
    await sleep(1000)
    location.replace('/')
  }

  const device = getDevice();
  // Framework7 Parameters
  const f7params = {
    name: 'Practice', // App name
    theme: 'ios', // Automatic theme detection
    id: 'com.insomenia.practice', // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes(loggedIn),
    // Input settings
    view: {
      iosDynamicNavbar: getDevice().ios,
    }
  };
  
  f7ready(async () => {
    // Call F7 APIs here
    toast.set(f7)

  });

  return (
    <App { ...f7params } >
      {/* Left panel with cover effect*/}
      <Panel left cover>
          <Page>
            <Navbar title="메뉴"/>
            <PageContent>
              <List>
                { loggedIn && 
                  <ListItem title="로그아웃" link="#" icon="las la-question" panelClose onClick={handleLogout}></ListItem>
                }
              </List>
            </PageContent>
          </Page>
      </Panel>
      {loggedIn &&
        (
          <Views tabs className="safe-areas">
            {/* Tabbar for switching views-tabs */}
            <Toolbar tabbar labels bottom>
              <Link tabLink="#view-home" tabLinkActive icon="las la-home" text="홈" />
              <Link tabLink="#view-items" icon="las la-gift" text="쇼핑" />
              <Link tabLink="#view-users" icon="las la-address-book" text="전문가" />
              <Link tabLink="#view-contacts" icon="las la-edit" text="문의하기" />
              <Link tabLink="#view-carts" icon="las la-shopping-cart" text="장바구니" />
            </Toolbar>
            <View id="view-home" main tab tabActive url="/" iosDynamicNavbar={false} />
            <View id="view-items" name="items" tab url="/items?is_main=true/" />
            <View id="view-users" name="users" tab url="/users?is_main=true" />
            <View id="view-contacts" name="contacts" tab url="/contacts" />
            <View id="view-carts" name="carts" tab url="/carts" />
          </Views>
        ) || (
          <View id="view-home" main url="/" />
        )
      }
    </App>
  )
}
export default MyApp;
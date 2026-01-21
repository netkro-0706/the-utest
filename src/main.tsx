import React from 'react';
import ReactDOM from 'react-dom';

import { AriakeComponentsProvider } from './_providers';
import { CommonBanner } from './_organisms/CommonBanner';
import { CommonQuestionnaire } from './_organisms/CommonQuestionnaire';
import GlobalNavV3 from './_organisms/GlobalNavV3';
import { CookiesProvider } from 'react-cookie';
import { isApp, GlobalStyle } from './_modules';
import { lazy, Suspense } from 'react';

const bodyEl = document.body;
const bffVersion = bodyEl?.dataset?.bffVersion;

const globalHeaderEl = document.getElementById('globalHeader');
const commonBannerEl = document.getElementById('common_banner');
const commonQuestionnaireEl = document.getElementById('common_questionnaire');

const GlobalNav = lazy(
  () =>
    import(
      /* webpackPreload: true */ /* webpackChunkName: GlobalNav */ './_organisms/GlobalNav'
    )
);

if (!isApp() && bffVersion === 'v5') {
  globalHeaderEl &&
    ReactDOM.render(
      <Suspense fallback={''}>
        <AriakeComponentsProvider>
          <GlobalStyle />
          <GlobalNav />
        </AriakeComponentsProvider>
      </Suspense>,
      globalHeaderEl
    );
} else if (!isApp() && bffVersion === 'v3') {
  globalHeaderEl &&
    ReactDOM.render(
      <Suspense fallback={''}>
        <AriakeComponentsProvider>
          <CookiesProvider>
            <GlobalStyle />
            <GlobalNavV3 />
          </CookiesProvider>
        </AriakeComponentsProvider>
      </Suspense>,
      globalHeaderEl
    );
}

commonBannerEl && ReactDOM.render(<CommonBanner />, commonBannerEl);
commonQuestionnaireEl &&
  ReactDOM.render(<CommonQuestionnaire />, commonQuestionnaireEl);

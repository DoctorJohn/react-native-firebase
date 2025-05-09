import { afterAll, beforeAll, describe, expect, it, xit } from '@jest/globals';

import {
  firebase,
  getAnalytics,
  initializeAnalytics,
  getGoogleAnalyticsClientId,
  logEvent,
  setAnalyticsCollectionEnabled,
  setSessionTimeoutDuration,
  getAppInstanceId,
  getSessionId,
  setUserId,
  setUserProperty,
  setUserProperties,
  resetAnalyticsData,
  logAddPaymentInfo,
  logScreenView,
  logAddShippingInfo,
  logAddToCart,
  logAddToWishlist,
  logAppOpen,
  logBeginCheckout,
  logCampaignDetails,
  logEarnVirtualCurrency,
  logGenerateLead,
  logJoinGroup,
  logLevelEnd,
  logLevelStart,
  logLevelUp,
  logLogin,
  logPostScore,
  logSelectContent,
  logPurchase,
  logRefund,
  logRemoveFromCart,
  logSearch,
  logSelectItem,
  logSetCheckoutOption,
  logSelectPromotion,
  logShare,
  logSignUp,
  logSpendVirtualCurrency,
  logTutorialBegin,
  logTutorialComplete,
  logUnlockAchievement,
  logViewCart,
  logViewItem,
  logViewItemList,
  logViewPromotion,
  logViewSearchResults,
  setDefaultEventParameters,
  initiateOnDeviceConversionMeasurementWithEmailAddress,
  initiateOnDeviceConversionMeasurementWithHashedEmailAddress,
  initiateOnDeviceConversionMeasurementWithPhoneNumber,
  initiateOnDeviceConversionMeasurementWithHashedPhoneNumber,
  isSupported,
  setConsent,
  settings,
} from '../lib';

describe('Analytics', function () {
  describe('namespace', function () {
    beforeAll(async function () {
      // @ts-ignore
      globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
    });

    afterAll(async function () {
      // @ts-ignore
      globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = false;
    });

    it('accessible from firebase.app()', function () {
      const app = firebase.app();
      expect(app.analytics).toBeDefined();
      expect(app.analytics().app).toEqual(app);
    });

    it('throws if non default app arg provided to firebase.analytics(APP)', function () {
      const app = firebase.app('secondaryFromNative');

      const expectedError = [
        'You attempted to call "firebase.analytics(app)" but; analytics does not support multiple Firebase Apps.',
        '',
        'Ensure the app provided is the default Firebase app only and not the "secondaryFromNative" app.',
      ].join('\r\n');

      // @ts-ignore test
      expect(() => firebase.analytics(app)).toThrowError(expectedError);
    });

    it('throws if analytics access from a non default app', function () {
      const app = firebase.app('secondaryFromNative');

      const expectedError = [
        'You attempted to call "firebase.app(\'secondaryFromNative\').analytics" but; analytics does not support multiple Firebase Apps.',
        '',
        'Ensure you access analytics from the default application only.',
      ].join('\r\n');

      expect(() => app.analytics()).toThrowError(expectedError);
    });

    // TODO in app/registry/namespace.js - if (!hasCustomUrlOrRegionSupport)
    xit('throws if args provided to firebase.app().analytics(ARGS)', function () {
      try {
        // @ts-ignore test
        firebase.app().analytics('foo', 'arg2');
        return Promise.reject(new Error('Did not throw'));
      } catch (e: any) {
        e.message.should.containEql('does not support multiple Firebase Apps');
        return Promise.resolve();
      }
    });

    it('errors if milliseconds not a number', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setSessionTimeoutDuration('123')).toThrowError(
        "'milliseconds' expected a number value",
      );
    });

    it('throws if none string none null values', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setUserId(123)).toThrowError(
        "'id' expected a string value",
      );
    });

    it('throws if name is not a string', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setUserProperty(1337, 'invertase')).toThrowError(
        "'name' expected a string value",
      );
    });

    it('throws if value is invalid', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setUserProperty('invertase3', 33.3333)).toThrowError(
        "'value' expected a string value",
      );
    });

    it('throws if properties is not an object', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setUserProperties(1337)).toThrowError(
        "'properties' expected an object of key/value pairs",
      );
    });

    it('throws if property value is invalid', function () {
      const props = {
        test: '123',
        foo: {
          bar: 'baz',
        },
      };
      // @ts-ignore test
      expect(() => firebase.analytics().setUserProperties(props)).toThrowError(
        "'properties' value for parameter 'foo' is invalid",
      );
    });

    it('throws if value is a number', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setUserProperties({ invertase1: 123 })).toThrowError(
        "'properties' value for parameter 'invertase1' is invalid, expected a string.",
      );
    });

    it('throws if consentSettings is not an object', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setConsent(1337)).toThrowError(
        'The supplied arg must be an object of key/values.',
      );
    });

    it('throws if consentSettings is invalid', function () {
      const consentSettings = {
        ad_storage: true,
        foo: {
          bar: 'baz',
        },
      };
      // @ts-ignore test
      expect(() => firebase.analytics().setConsent(consentSettings)).toThrowError(
        "'consentSettings' value for parameter 'foo' is invalid, expected a boolean.",
      );
    });

    it('throws if one value of consentSettings is a number', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().setConsent({ ad_storage: 123 })).toThrowError(
        "'consentSettings' value for parameter 'ad_storage' is invalid, expected a boolean.",
      );
    });

    it('errors when no parameters are set', function () {
      // @ts-ignore test
      expect(() => firebase.analytics().logSearch()).toThrowError(
        'The supplied arg must be an object of key/values',
      );
    });

    describe('logEvent()', function () {
      it('errors if name is not a string', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logEvent(123)).toThrowError(
          "firebase.analytics().logEvent(*) 'name' expected a string value.",
        );
      });

      it('errors if params is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logEvent('invertase_event', 'foobar')).toThrowError(
          "firebase.analytics().logEvent(_, *) 'params' expected an object value.",
        );
      });

      it('errors on using a reserved name', function () {
        expect(() => firebase.analytics().logEvent('session_start')).toThrowError(
          "firebase.analytics().logEvent(*) 'name' the event name 'session_start' is reserved and can not be used.",
        );
      });

      it('errors if name not alphanumeric', function () {
        expect(() => firebase.analytics().logEvent('!@£$%^&*')).toThrowError(
          "firebase.analytics().logEvent(*) 'name' invalid event name '!@£$%^&*'. Names should contain 1 to 40 alphanumeric characters or underscores.",
        );
      });

      describe('logScreenView()', function () {
        it('errors if param is not an object', function () {
          // @ts-ignore test
          expect(() => firebase.analytics().logScreenView(123)).toThrowError(
            'firebase.analytics().logScreenView(*):',
          );
        });

        it('accepts arbitrary custom event parameters while rejecting defined parameters with wrong types', function () {
          expect(() => firebase.analytics().logScreenView({ foo: 'bar' })).not.toThrow();
          expect(() =>
            // @ts-ignore test
            firebase.analytics().logScreenView({ screen_name: 123, foo: 'bar' }),
          ).toThrowError('firebase.analytics().logScreenView(*):');
        });
      });

      describe('logAddPaymentInfo()', function () {
        it('errors if param is not an object', function () {
          // @ts-ignore test
          expect(() => firebase.analytics().logAddPaymentInfo(123)).toThrowError(
            'firebase.analytics().logAddPaymentInfo(*):',
          );
        });

        it('errors when compound values are not set', function () {
          expect(() =>
            firebase.analytics().logAddPaymentInfo({
              value: 123,
            }),
          ).toThrowError('firebase.analytics().logAddPaymentInfo(*):');
        });
      });
    });

    describe('setDefaultEventParameters()', function () {
      it('errors if params is not a object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().setDefaultEventParameters('123')).toThrowError(
          "firebase.analytics().setDefaultEventParameters(*) 'params' expected an object value when it is defined.",
        );
      });
    });

    describe('logAddToCart()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logAddToCart(123)).toThrowError(
          'firebase.analytics().logAddToCart(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logAddToCart({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logAddToCart(*):');
      });
    });

    describe('logAddShippingInfo()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logAddShippingInfo(123)).toThrowError(
          'firebase.analytics().logAddShippingInfo(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logAddShippingInfo({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logAddShippingInfo(*):');
      });
    });

    describe('logAddToWishlist()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logAddToWishlist(123)).toThrowError(
          'firebase.analytics().logAddToWishlist(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logAddToWishlist({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logAddToWishlist(*):');
      });

      it('items accept arbitrary custom event parameters', function () {
        expect(() =>
          firebase.analytics().logAddToWishlist({ items: [{ foo: 'bar' }] }),
        ).not.toThrow();
      });
    });

    describe('logBeginCheckout()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logBeginCheckout(123)).toThrowError(
          'firebase.analytics().logBeginCheckout(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logBeginCheckout({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logBeginCheckout(*):');
      });

      it('accepts arbitrary custom event parameters', function () {
        expect(() =>
          firebase.analytics().logBeginCheckout({
            value: 123,
            currency: 'EUR',
            foo: 'bar',
          }),
        ).not.toThrow();
      });
    });

    describe('logGenerateLead()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logGenerateLead(123)).toThrowError(
          'firebase.analytics().logGenerateLead(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logGenerateLead({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logGenerateLead(*):');
      });
    });

    describe('logCampaignDetails()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logCampaignDetails(123)).toThrowError(
          'firebase.analytics().logCampaignDetails(*):',
        );
      });
    });

    describe('logEarnVirtualCurrency()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logEarnVirtualCurrency(123)).toThrowError(
          'firebase.analytics().logEarnVirtualCurrency(*):',
        );
      });
    });

    describe('logJoinGroup()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logJoinGroup(123)).toThrowError(
          'firebase.analytics().logJoinGroup(*):',
        );
      });
    });

    describe('logLevelEnd()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logLevelEnd(123)).toThrowError(
          'firebase.analytics().logLevelEnd(*):',
        );
      });
    });

    describe('logLevelStart()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logLevelStart(123)).toThrowError(
          'firebase.analytics().logLevelStart(*):',
        );
      });
    });

    describe('logLevelUp()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logLevelUp(123)).toThrowError(
          'firebase.analytics().logLevelUp(*):',
        );
      });
    });

    describe('logLogin()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logLogin(123)).toThrowError(
          'firebase.analytics().logLogin(*):',
        );
      });
    });

    describe('logPostScore()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logPostScore(123)).toThrowError(
          'firebase.analytics().logPostScore(*):',
        );
      });
    });

    describe('logSelectContent()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logSelectContent(123)).toThrowError(
          'firebase.analytics().logSelectContent(*):',
        );
      });
    });

    describe('logSearch()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logSearch(123)).toThrowError(
          'firebase.analytics().logSearch(*):',
        );
      });
    });

    describe('logSelectItem()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logSelectItem(123)).toThrowError(
          'firebase.analytics().logSelectItem(*):',
        );
      });
    });

    describe('logSetCheckoutOption()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logSetCheckoutOption(123)).toThrowError(
          'firebase.analytics().logSetCheckoutOption(*):',
        );
      });
    });

    describe('logShare()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logShare(123)).toThrowError(
          'firebase.analytics().logShare(*):',
        );
      });
    });

    describe('logSignUp()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logSignUp(123)).toThrowError(
          'firebase.analytics().logSignUp(*):',
        );
      });
    });

    describe('logSelectPromotion()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logSelectPromotion(123)).toThrowError(
          'firebase.analytics().logSelectPromotion(*):',
        );
      });
    });

    describe('logSpendVirtualCurrency()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logSpendVirtualCurrency(123)).toThrowError(
          'firebase.analytics().logSpendVirtualCurrency(*):',
        );
      });
    });

    describe('logUnlockAchievement()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logUnlockAchievement(123)).toThrowError(
          'firebase.analytics().logUnlockAchievement(*):',
        );
      });
    });

    describe('logPurchase()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logPurchase(123)).toThrowError(
          'firebase.analytics().logPurchase(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logPurchase({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logPurchase(*):');
      });

      it('accepts arbitrary custom event parameters', function () {
        expect(() =>
          firebase.analytics().logPurchase({
            value: 123,
            currency: 'EUR',
            foo: 'bar',
          }),
        ).not.toThrow();
      });
    });

    describe('logRefund()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logRefund(123)).toThrowError(
          'firebase.analytics().logRefund(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logRefund({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logRefund(*):');
      });
    });

    describe('logViewCart()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logViewCart(123)).toThrowError(
          'firebase.analytics().logViewCart(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logViewCart({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logViewCart(*):');
      });
    });

    describe('logViewItem()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logViewItem(123)).toThrowError(
          'firebase.analytics().logViewItem(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logViewItem({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logViewItem(*):');
      });
    });

    describe('logViewItemList()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logViewItemList(123)).toThrowError(
          'firebase.analytics().logViewItemList(*):',
        );
      });
    });

    describe('logRemoveFromCart()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logRemoveFromCart(123)).toThrowError(
          'firebase.analytics().logRemoveFromCart(*):',
        );
      });

      it('errors when compound values are not set', function () {
        expect(() =>
          firebase.analytics().logRemoveFromCart({
            value: 123,
          }),
        ).toThrowError('firebase.analytics().logRemoveFromCart(*):');
      });
    });

    describe('logViewPromotion()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logViewPromotion(123)).toThrowError(
          'firebase.analytics().logViewPromotion(*):',
        );
      });
    });

    describe('logViewSearchResults()', function () {
      it('errors if param is not an object', function () {
        // @ts-ignore test
        expect(() => firebase.analytics().logViewSearchResults(123)).toThrowError(
          'firebase.analytics().logViewSearchResults(*):',
        );
      });
    });

    describe('setAnalyticsCollectionEnabled()', function () {
      it('throws if not a boolean', function () {
        // @ts-ignore
        expect(() => firebase.analytics().setAnalyticsCollectionEnabled('foo')).toThrowError(
          "firebase.analytics().setAnalyticsCollectionEnabled(*) 'enabled' expected a boolean value.",
        );
      });
    });

    describe('initiateOnDeviceConversionMeasurementWithEmailAddress()', function () {
      it('throws if not a string', function () {
        expect(() =>
          // @ts-ignore
          firebase.analytics().initiateOnDeviceConversionMeasurementWithEmailAddress(true),
        ).toThrowError(
          "firebase.analytics().initiateOnDeviceConversionMeasurementWithEmailAddress(*) 'emailAddress' expected a string value.",
        );
      });
    });

    describe('initiateOnDeviceConversionMeasurementWithHashedEmailAddress()', function () {
      it('throws if not a string', function () {
        expect(() =>
          // @ts-ignore
          firebase.analytics().initiateOnDeviceConversionMeasurementWithHashedEmailAddress(true),
        ).toThrowError(
          "firebase.analytics().initiateOnDeviceConversionMeasurementWithHashedEmailAddress(*) 'hashedEmailAddress' expected a string value.",
        );
      });
    });

    describe('initiateOnDeviceConversionMeasurementWithHashedPhoneNumber()', function () {
      it('throws if not a string', function () {
        expect(() =>
          // @ts-ignore
          firebase.analytics().initiateOnDeviceConversionMeasurementWithHashedPhoneNumber(1234),
        ).toThrowError(
          "firebase.analytics().initiateOnDeviceConversionMeasurementWithHashedPhoneNumber(*) 'hashedPhoneNumber' expected a string value.",
        );
      });

      it('throws if hashed value is a phone number in E.164 format', function () {
        expect(() =>
          firebase
            .analytics()
            .initiateOnDeviceConversionMeasurementWithHashedPhoneNumber('+1234567890'),
        ).toThrowError(
          "firebase.analytics().initiateOnDeviceConversionMeasurementWithHashedPhoneNumber(*) 'hashedPhoneNumber' expected a sha256-hashed value of a phone number in E.164 format.",
        );
      });
    });
  });

  describe('modular', function () {
    it('`getAnalytics` function is properly exposed to end user', function () {
      expect(getAnalytics).toBeDefined();
    });

    it('`initializeAnalytics` function is properly exposed to end user', function () {
      expect(initializeAnalytics).toBeDefined();
    });

    it('`getGoogleAnalyticsClientId` function is properly exposed to end user', function () {
      expect(getGoogleAnalyticsClientId).toBeDefined();
    });

    it('`logEvent` function is properly exposed to end user', function () {
      expect(logEvent).toBeDefined();
    });

    it('`setAnalyticsCollectionEnabled` function is properly exposed to end user', function () {
      expect(setAnalyticsCollectionEnabled).toBeDefined();
    });

    it('`setSessionTimeoutDuration` function is properly exposed to end user', function () {
      expect(setSessionTimeoutDuration).toBeDefined();
    });

    it('`getAppInstanceId` function is properly exposed to end user', function () {
      expect(getAppInstanceId).toBeDefined();
    });

    it('`getSessionId` function is properly exposed to end user', function () {
      expect(getSessionId).toBeDefined();
    });

    it('`setUserId` function is properly exposed to end user', function () {
      expect(setUserId).toBeDefined();
    });

    it('`setUserProperty` function is properly exposed to end user', function () {
      expect(setUserProperty).toBeDefined();
    });

    it('`setUserProperties` function is properly exposed to end user', function () {
      expect(setUserProperties).toBeDefined();
    });

    it('`resetAnalyticsData` function is properly exposed to end user', function () {
      expect(resetAnalyticsData).toBeDefined();
    });

    it('`logAddPaymentInfo` function is properly exposed to end user', function () {
      expect(logAddPaymentInfo).toBeDefined();
    });

    it('`logScreenView` function is properly exposed to end user', function () {
      expect(logScreenView).toBeDefined();
    });

    it('`logAddShippingInfo` function is properly exposed to end user', function () {
      expect(logAddShippingInfo).toBeDefined();
    });

    it('`logAddToCart` function is properly exposed to end user', function () {
      expect(logAddToCart).toBeDefined();
    });

    it('`logAddToWishlist` function is properly exposed to end user', function () {
      expect(logAddToWishlist).toBeDefined();
    });

    it('`logAppOpen` function is properly exposed to end user', function () {
      expect(logAppOpen).toBeDefined();
    });

    it('`logBeginCheckout` function is properly exposed to end user', function () {
      expect(logBeginCheckout).toBeDefined();
    });

    it('`logCampaignDetails` function is properly exposed to end user', function () {
      expect(logCampaignDetails).toBeDefined();
    });

    it('`logEarnVirtualCurrency` function is properly exposed to end user', function () {
      expect(logEarnVirtualCurrency).toBeDefined();
    });

    it('`logGenerateLead` function is properly exposed to end user', function () {
      expect(logGenerateLead).toBeDefined();
    });

    it('`logJoinGroup` function is properly exposed to end user', function () {
      expect(logJoinGroup).toBeDefined();
    });

    it('`logLevelEnd` function is properly exposed to end user', function () {
      expect(logLevelEnd).toBeDefined();
    });

    it('`logLevelStart` function is properly exposed to end user', function () {
      expect(logLevelStart).toBeDefined();
    });

    it('`logLevelUp` function is properly exposed to end user', function () {
      expect(logLevelUp).toBeDefined();
    });

    it('`logLogin` function is properly exposed to end user', function () {
      expect(logLogin).toBeDefined();
    });

    it('`logPostScore` function is properly exposed to end user', function () {
      expect(logPostScore).toBeDefined();
    });

    it('`logSelectContent` function is properly exposed to end user', function () {
      expect(logSelectContent).toBeDefined();
    });

    it('`logPurchase` function is properly exposed to end user', function () {
      expect(logPurchase).toBeDefined();
    });

    it('`logRefund` function is properly exposed to end user', function () {
      expect(logRefund).toBeDefined();
    });

    it('`logRemoveFromCart` function is properly exposed to end user', function () {
      expect(logRemoveFromCart).toBeDefined();
    });

    it('`logSearch` function is properly exposed to end user', function () {
      expect(logSearch).toBeDefined();
    });

    it('`logSelectItem` function is properly exposed to end user', function () {
      expect(logSelectItem).toBeDefined();
    });

    it('`logSetCheckoutOption` function is properly exposed to end user', function () {
      expect(logSetCheckoutOption).toBeDefined();
    });

    it('`logSelectPromotion` function is properly exposed to end user', function () {
      expect(logSelectPromotion).toBeDefined();
    });

    it('`logShare` function is properly exposed to end user', function () {
      expect(logShare).toBeDefined();
    });

    it('`logSignUp` function is properly exposed to end user', function () {
      expect(logSignUp).toBeDefined();
    });

    it('`logSpendVirtualCurrency` function is properly exposed to end user', function () {
      expect(logSpendVirtualCurrency).toBeDefined();
    });

    it('`logTutorialBegin` function is properly exposed to end user', function () {
      expect(logTutorialBegin).toBeDefined();
    });

    it('`logTutorialComplete` function is properly exposed to end user', function () {
      expect(logTutorialComplete).toBeDefined();
    });

    it('`logUnlockAchievement` function is properly exposed to end user', function () {
      expect(logUnlockAchievement).toBeDefined();
    });

    it('`logViewCart` function is properly exposed to end user', function () {
      expect(logViewCart).toBeDefined();
    });

    it('`logViewItem` function is properly exposed to end user', function () {
      expect(logViewItem).toBeDefined();
    });

    it('`logViewItemList` function is properly exposed to end user', function () {
      expect(logViewItemList).toBeDefined();
    });

    it('`logViewPromotion` function is properly exposed to end user', function () {
      expect(logViewPromotion).toBeDefined();
    });

    it('`logViewSearchResults` function is properly exposed to end user', function () {
      expect(logViewSearchResults).toBeDefined();
    });

    it('`setDefaultEventParameters` function is properly exposed to end user', function () {
      expect(setDefaultEventParameters).toBeDefined();
    });

    it('`initiateOnDeviceConversionMeasurementWithEmailAddress` function is properly exposed to end user', function () {
      expect(initiateOnDeviceConversionMeasurementWithEmailAddress).toBeDefined();
    });

    it('`initiateOnDeviceConversionMeasurementWithHashedEmailAddress` function is properly exposed to end user', function () {
      expect(initiateOnDeviceConversionMeasurementWithHashedEmailAddress).toBeDefined();
    });

    it('`initiateOnDeviceConversionMeasurementWithHashedEmailAddress` throws if not a string', function () {
      expect(() =>
        // @ts-ignore
        initiateOnDeviceConversionMeasurementWithHashedEmailAddress(getAnalytics(), true),
      ).toThrowError(
        "firebase.analytics().initiateOnDeviceConversionMeasurementWithHashedEmailAddress(*) 'hashedEmailAddress' expected a string value.",
      );
    });

    it('`initiateOnDeviceConversionMeasurementWithHashedPhoneNumber` should throw if the value is in E.164 format', function () {
      expect(() =>
        initiateOnDeviceConversionMeasurementWithHashedPhoneNumber(getAnalytics(), '+1234567890'),
      ).toThrowError(
        "firebase.analytics().initiateOnDeviceConversionMeasurementWithHashedPhoneNumber(*) 'hashedPhoneNumber' expected a sha256-hashed value of a phone number in E.164 format.",
      );
    });

    it('`initiateOnDeviceConversionMeasurementWithPhoneNumber` function is properly exposed to end user', function () {
      expect(initiateOnDeviceConversionMeasurementWithPhoneNumber).toBeDefined();
    });

    it('`initiateOnDeviceConversionMeasurementWithHashedPhoneNumber` function is properly exposed to end user', function () {
      expect(initiateOnDeviceConversionMeasurementWithHashedPhoneNumber).toBeDefined();
    });

    it('`isSupported` function is properly exposed to end user', function () {
      expect(isSupported).toBeDefined();
    });

    it('`setConsent` function is properly exposed to end user', function () {
      expect(setConsent).toBeDefined();
    });

    it('`settings` function is properly exposed to end user', function () {
      expect(settings).toBeDefined();
    });
  });
});

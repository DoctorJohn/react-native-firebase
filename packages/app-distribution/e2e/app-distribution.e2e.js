/*
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

describe('appDistribution()', function () {
  describe('v8 compatibility', function () {
    beforeEach(async function beforeEachTest() {
      // @ts-ignore
      globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
    });

    afterEach(async function afterEachTest() {
      // @ts-ignore
      globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = false;
    });

    describe('native module is loaded', function () {
      it('checks native module load status', function () {
        firebase.appDistribution().native;
      });
    });

    describe('isTesterSignedIn()', function () {
      it('checks if a tester is signed in', async function () {
        if (Platform.ios) {
          await firebase.appDistribution().isTesterSignedIn();
        } else {
          this.skip();
        }
      });
    });
    // Requires a valid google account logged in on device and associated with iOS testing app
    xdescribe('signInTester()', function () {
      it('signs a tester in', async function () {
        if (Platform.ios) {
          await firebase.appDistribution().signInTester();
        } else {
          this.skip();
        }
      });
    });

    describe('signOutTester()', function () {
      it('signs out a tester', async function () {
        if (Platform.ios) {
          await firebase.appDistribution().signOutTester();
        } else {
          this.skip();
        }
      });
    });
    // Requires a valid google account logged in on device and associated with iOS testing app
    // plus a new IPA file uploaded
    xdescribe('checkForUpdate()', function () {
      it('checks for an update', async function () {
        if (Platform.ios) {
          await firebase.appDistribution().checkForUpdate();
        } else {
          this.skip();
        }
      });
    });
  });

  describe('modular', function () {
    describe('native module is loaded', function () {
      it('checks native module load status', function () {
        const { getAppDistribution } = appDistributionModular;
        const appDistribution = getAppDistribution();
        appDistribution.native;
      });
    });

    describe('isTesterSignedIn()', function () {
      it('checks if a tester is signed in', async function () {
        const { getAppDistribution, isTesterSignedIn } = appDistributionModular;
        const appDistribution = getAppDistribution();
        if (Platform.ios) {
          await isTesterSignedIn(appDistribution);
        } else {
          this.skip();
        }
      });
    });
    // Requires a valid google account logged in on device and associated with iOS testing app
    xdescribe('signInTester()', function () {
      it('signs a tester in', async function () {
        const { getAppDistribution, signInTester } = appDistributionModular;
        const appDistribution = getAppDistribution();
        if (Platform.ios) {
          await signInTester(appDistribution);
        } else {
          this.skip();
        }
      });
    });

    describe('signOutTester()', function () {
      it('signs out a tester', async function () {
        const { getAppDistribution, signOutTester } = appDistributionModular;
        const appDistribution = getAppDistribution();
        if (Platform.ios) {
          await signOutTester(appDistribution);
        } else {
          this.skip();
        }
      });
    });
    // Requires a valid google account logged in on device and associated with iOS testing app
    // plus a new IPA file uploaded
    xdescribe('checkForUpdate()', function () {
      it('checks for an update', async function () {
        const { getAppDistribution, checkForUpdate } = appDistributionModular;
        const appDistribution = getAppDistribution();
        if (Platform.ios) {
          await checkForUpdate(appDistribution);
        } else {
          this.skip();
        }
      });
    });
  });
});

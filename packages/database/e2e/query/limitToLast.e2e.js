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

const { PATH, seed, wipe } = require('../helpers');

const TEST_PATH = `${PATH}/limitToLast`;

describe('database().ref().limitToLast()', function () {
  before(async function () {
    await seed(TEST_PATH);
  });

  after(async function () {
    await wipe(TEST_PATH);
  });

  describe('v8 compatibility', function () {
    beforeEach(async function beforeEachTest() {
      // @ts-ignore
      globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
    });

    afterEach(async function afterEachTest() {
      // @ts-ignore
      globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = false;
    });

    it('throws if limit is invalid', async function () {
      try {
        await firebase.database().ref().limitToLast('foo');
        return Promise.reject(new Error('Did not throw an Error.'));
      } catch (error) {
        error.message.should.containEql("'limit' must be a positive integer value");
        return Promise.resolve();
      }
    });

    it('throws if limit has already been set', async function () {
      try {
        await firebase.database().ref().limitToFirst(3).limitToLast(2);
        return Promise.reject(new Error('Did not throw an Error.'));
      } catch (error) {
        error.message.should.containEql(
          'Limit was already set (by another call to limitToFirst, or limitToLast)',
        );
        return Promise.resolve();
      }
    });

    it('returns a limited array data set', async function () {
      const ref = firebase.database().ref(`${TEST_PATH}`);

      const initial = {
        0: 'foo',
        1: 'bar',
        2: 'baz',
      };

      await ref.set(initial);

      return ref
        .limitToLast(2)
        .once('value')
        .then(snapshot => {
          snapshot.val().should.eql(jet.contextify([null, 'bar', 'baz']));
          return Promise.resolve();
        });
    });

    it('returns a limited object data set', async function () {
      const ref = firebase.database().ref(`${TEST_PATH}`);

      const initial = {
        a: 'foo',
        b: 'bar',
        c: 'baz',
      };

      await ref.set(initial);

      return ref
        .limitToLast(2)
        .once('value')
        .then(snapshot => {
          snapshot.val().should.eql(
            jet.contextify({
              b: 'bar',
              c: 'baz',
            }),
          );
          return Promise.resolve();
        });
    });

    it('returns a null value when not possible to limit', async function () {
      const ref = firebase.database().ref(`${TEST_PATH}`);

      const initial = 'foo';

      await ref.set(initial);

      return ref
        .limitToFirst(2)
        .once('value')
        .then(snapshot => {
          should.equal(snapshot.val(), null);
          return Promise.resolve();
        });
    });
  });

  describe('modular', function () {
    it('throws if limit is invalid', async function () {
      const { getDatabase, ref, limitToLast, query } = databaseModular;

      try {
        query(ref(getDatabase()), limitToLast('foo'));
        return Promise.reject(new Error('Did not throw an Error.'));
      } catch (error) {
        error.message.should.containEql("'limit' must be a positive integer value");
        return Promise.resolve();
      }
    });

    it('throws if limit has already been set', async function () {
      const { getDatabase, ref, limitToLast, limitToFirst, query } = databaseModular;

      try {
        query(ref(getDatabase()), limitToFirst(3), limitToLast(2));
        return Promise.reject(new Error('Did not throw an Error.'));
      } catch (error) {
        error.message.should.containEql(
          'Limit was already set (by another call to limitToFirst, or limitToLast)',
        );
        return Promise.resolve();
      }
    });

    it('returns a limited array data set', async function () {
      const { getDatabase, ref, set, get, limitToLast, query } = databaseModular;

      const dbRef = ref(getDatabase(), `${TEST_PATH}`);

      const initial = {
        0: 'foo',
        1: 'bar',
        2: 'baz',
      };

      await set(dbRef, initial);

      return get(query(dbRef, limitToLast(2))).then(snapshot => {
        snapshot.val().should.eql(jet.contextify([null, 'bar', 'baz']));
        return Promise.resolve();
      });
    });

    it('returns a limited object data set', async function () {
      const { getDatabase, ref, set, get, limitToLast, query } = databaseModular;

      const dbRef = ref(getDatabase(), `${TEST_PATH}`);

      const initial = {
        a: 'foo',
        b: 'bar',
        c: 'baz',
      };

      await set(dbRef, initial);

      return get(query(dbRef, limitToLast(2))).then(snapshot => {
        snapshot.val().should.eql(
          jet.contextify({
            b: 'bar',
            c: 'baz',
          }),
        );
        return Promise.resolve();
      });
    });

    it('returns a null value when not possible to limit', async function () {
      const { getDatabase, ref, set, get, limitToLast, query } = databaseModular;

      const dbRef = ref(getDatabase(), `${TEST_PATH}`);

      const initial = 'foo';

      await set(dbRef, initial);

      return get(query(dbRef, limitToLast(2))).then(snapshot => {
        should.equal(snapshot.val(), null);
        return Promise.resolve();
      });
    });
  });
});

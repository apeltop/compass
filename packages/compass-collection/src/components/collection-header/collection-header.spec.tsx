import AppRegistry from 'hadron-app-registry';
import { expect } from 'chai';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { spy } from 'sinon';
import userEvent from '@testing-library/user-event';

import CollectionHeader from '../collection-header';

describe('CollectionHeader [Component]', function () {
  const statsPlugin = () => {
    return <div />;
  };

  context('when the collection is not readonly', function () {
    const statsStore = {};
    const globalAppRegistry = new AppRegistry();
    const selectOrCreateTabSpy = spy();

    beforeEach(function () {
      render(
        <CollectionHeader
          isReadonly={false}
          isTimeSeries={false}
          sourceName={null}
          globalAppRegistry={globalAppRegistry}
          statsPlugin={statsPlugin}
          statsStore={statsStore}
          namespace="db.coll"
          selectOrCreateTab={selectOrCreateTabSpy}
          sourceReadonly={false}
          pipeline={[]}
        />
      );
    });

    afterEach(cleanup);

    it('renders the correct root classname', function () {
      expect(screen.getByTestId('collection-header')).to.exist;
    });

    it('renders the db name', function () {
      expect(screen.getByTestId('collection-header-title-db')).to.exist;
    });

    it('renders the collection name', function () {
      expect(screen.getByTestId('collection-header-title-collection')).to.exist;
    });

    it('does not render the readonly badge', function () {
      expect(screen.queryByTestId('collection-badge-readonly')).to.not.exist;
    });

    it('does not render the time series badge', function () {
      expect(screen.queryByTestId('collection-badge-timeseries')).to.not.exist;
    });

    it('does not render the view badge', function () {
      expect(screen.queryByTestId('collection-badge-view')).to.not.exist;
    });

    it('renders the collection header actions', function () {
      expect(screen.getByTestId('collection-header-actions')).to.exist;
    });
  });

  context('when the collection is readonly', function () {
    const statsStore = {};
    const globalAppRegistry = new AppRegistry();
    const selectOrCreateTabSpy = spy();

    beforeEach(function () {
      render(
        <CollectionHeader
          isReadonly={true}
          isTimeSeries={false}
          globalAppRegistry={globalAppRegistry}
          sourceName="orig.coll"
          statsPlugin={statsPlugin}
          statsStore={statsStore}
          namespace="db.coll"
          selectOrCreateTab={selectOrCreateTabSpy}
          sourceReadonly={false}
          pipeline={[]}
        />
      );
    });

    afterEach(cleanup);

    it('renders the correct root classname', function () {
      expect(screen.getByTestId('collection-header')).to.exist;
    });

    it('renders the db name', function () {
      expect(screen.getByTestId('collection-header-title-db')).to.exist;
    });

    it('renders the collection name', function () {
      expect(screen.getByTestId('collection-header-title-collection')).to.exist;
    });

    it('renders the source collection', function () {
      const label = screen.getByTestId('collection-view-on');
      expect(label).to.have.text('view on: orig.coll');
      expect(label).to.be.visible;
    });

    it('renders the readonly badge', function () {
      expect(screen.getByTestId('collection-badge-readonly')).to.exist;
    });

    it('renders the view badge', function () {
      expect(screen.getByTestId('collection-badge-view')).to.exist;
    });
  });

  context('when the collection is readonly but not a view', function () {
    const statsStore = {};
    const globalAppRegistry = new AppRegistry();
    const selectOrCreateTabSpy = spy();

    beforeEach(function () {
      render(
        <CollectionHeader
          isReadonly={true}
          isTimeSeries={false}
          sourceName={null}
          globalAppRegistry={globalAppRegistry}
          statsPlugin={statsPlugin}
          statsStore={statsStore}
          namespace="db.coll"
          selectOrCreateTab={selectOrCreateTabSpy}
          sourceReadonly={false}
          pipeline={[]}
        />
      );
    });

    afterEach(cleanup);

    it('does not render the source collection', function () {
      expect(screen.queryByTestId('collection-view-on')).to.not.exist;
    });

    it('renders the readonly badge', function () {
      expect(screen.getByTestId('collection-badge-readonly')).to.exist;
    });

    it('does not render the view badge', function () {
      expect(screen.queryByTestId('collection-badge-view')).to.not.exist;
    });
  });

  context('when the collection is a time-series collection', function () {
    const statsStore = {};
    const globalAppRegistry = new AppRegistry();
    const selectOrCreateTabSpy = spy();

    beforeEach(function () {
      render(
        <CollectionHeader
          isReadonly={false}
          isTimeSeries={true}
          sourceName={null}
          globalAppRegistry={globalAppRegistry}
          statsPlugin={statsPlugin}
          statsStore={statsStore}
          namespace="db.coll"
          selectOrCreateTab={selectOrCreateTabSpy}
          sourceReadonly={false}
          pipeline={[]}
        />
      );
    });

    afterEach(cleanup);

    it('does not render the source collection', function () {
      expect(screen.queryByTestId('collection-view-on')).to.not.exist;
    });

    it('does not render the readonly badge', function () {
      expect(screen.queryByTestId('collection-badge-readonly')).to.not.exist;
    });

    it('renders the time-series badge', function () {
      expect(screen.getByTestId('collection-badge-timeseries')).to.exist;
    });
  });

  context('when the db name is clicked', function () {
    it('emits the open event to the app registry', function () {
      const statsStore = {};
      const selectOrCreateTabSpy = spy();

      let emmittedEventName;
      let emmittedDbName;

      render(
        <CollectionHeader
          isReadonly={false}
          isTimeSeries={false}
          globalAppRegistry={
            {
              emit: (eventName, dbName) => {
                emmittedEventName = eventName;
                emmittedDbName = dbName;
              },
            } as AppRegistry
          }
          sourceName="orig.coll"
          statsPlugin={statsPlugin}
          statsStore={statsStore}
          namespace="db.coll"
          selectOrCreateTab={selectOrCreateTabSpy}
          sourceReadonly={false}
          pipeline={[]}
        />
      );

      afterEach(cleanup);

      const link = screen.getByTestId('collection-header-title-db');
      expect(link).to.exist;
      userEvent.click(link);
      expect(emmittedEventName).to.equal('select-database');
      expect(emmittedDbName).to.equal('db');
    });
  });
});
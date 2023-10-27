import GoldenLayoutPage from '../pageobjects/golden.layout.page.js';
import { expect } from '@wdio/globals';
import { ComponentType } from '../types.js';

describe('My Golden layout demo application', () => {
  beforeEach(async () => {
    await GoldenLayoutPage.open();
  });

  it('E2E Test', async () => {
    await GoldenLayoutPage.load('standard');

    // Select 'LexCorp Plc. from Botton container and change color to Blue
    await GoldenLayoutPage.selectTabFromBottomContainer('LexCorp plc.');
    await GoldenLayoutPage.setColorOnTabInBottomContainer(
      'LexCorp plc.',
      'Blue'
    );

    // Add Event container,s end Event and verify
    await GoldenLayoutPage.addComponentinBottomContainer(ComponentType.EVENT); // add Event component
    let event1: string = 'Test Event 1';
    await GoldenLayoutPage.sendEventFromBottomContainer(event1);
    expect(
      await GoldenLayoutPage.isEventReceivedinBottomContainer(event1)
    ).toBeTruthy();

    // remove components from To right container
    await GoldenLayoutPage.removeComponentFromTopRightContainer('comp 1');
    await GoldenLayoutPage.removeComponentFromTopRightContainer('comp 2');
    await GoldenLayoutPage.removeComponentFromTopRightContainer('comp 3');

    //Save Layout, load Component Layour and verify component count displayed on right
    await GoldenLayoutPage.saveLayOut();
    await GoldenLayoutPage.load('component');
    let count: Number =
      await GoldenLayoutPage.getComponentCountFromTopRightContainer();
    await expect(count).toEqual(0);

    await GoldenLayoutPage.reloadSavedLayOut(); // Reload Saved Layout

    // Send Event from previously created Event component and verify
    let event2: string = 'Test Event 2';
    await GoldenLayoutPage.sendEventFromBottomContainer(event2);
    expect(
      await GoldenLayoutPage.isEventReceivedinBottomContainer(event2)
    ).toBeTruthy();

    // Drap comp1 to Acme, inc.
    await GoldenLayoutPage.dragAndDrop('comp 1', 'Acme, inc.');
  });
});

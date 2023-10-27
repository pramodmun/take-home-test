import { ComponentType } from '../types.js';
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class GoldenLayoutPage extends Page {
  /**
   * define selectors using getter methods
   */
  get sectionControls() {
    return $('#controls');
  }
  get selectPredefinedLayout() {
    return $('#layoutSelect');
  }
  get btnLoadLayout() {
    return $('#loadLayoutButton');
  }
  get tabFnts100() {
    return $('.lm_tab=Fnts 100');
  }
  getWidget(tabName: string) {
    //let widgetTab = $('.lm_tab=' + tabName);
    return $(
      "//span[text()='" +
        tabName +
        "']/ancestor::div[@class='lm_item lm_stack']"
    );
  }

  get btnSaveLayout() {
    return $('#saveLayoutButton');
  }

  get btnReloadSavedLayout() {
    return $('#reloadSavedLayoutButton');
  }

  // selector for container at Bottom of the Page
  get containerBottom() {
    return $(
      '#layoutContainer > div.lm_goldenlayout.lm_item.lm_root > div > div.lm_item.lm_column > div:nth-child(5) > section.lm_header > section.lm_tabs'
    );
  }

  // selector for container to Right side of page
  get containerTopRight() {
    return $(
      '#layoutContainer > div.lm_goldenlayout.lm_item.lm_root > div > div.lm_item.lm_row > div > section.lm_header > section.lm_tabs'
    );
  }

  get selectComponentType() {
    return $('#registeredComponentTypesForAddSelect');
  }

  get btnAddComponent() {
    return $('#addComponentButton');
  }
  /**
   * Load prededfined layouts
   */
  async load(layoutName: string) {
    await this.selectPredefinedLayout.waitForExist();
    await this.selectPredefinedLayout.selectByVisibleText(layoutName);
    await this.btnLoadLayout.click();
  }
  /**
   * Save Layout
   */
  public async saveLayOut() {
    await this.btnSaveLayout.click();
  }

  /**
   * Reload Saved Layout
   */
  public async reloadSavedLayOut() {
    await this.btnReloadSavedLayout.click();
  }

  /**
   * Add a given component in Bottom container
   */

  public async addComponentinBottomContainer(component: ComponentType) {
    await this.selectComponentType.selectByVisibleText(component);
    await this.btnAddComponent.click();
  }

  /**
   * Selects a Tab from Bottom container,implicity verify it is in selected mode
   */
  public async selectTabFromBottomContainer(tabName: string) {
    (
      await (await this.containerBottom).$(`//div[@title = '${tabName}']`)
    ).click();
    await expect(this.isTabSelectedInBottomContainer(tabName)).toBeTruthy();
  }

  private async isTabSelectedInBottomContainer(
    tabName: string
  ): Promise<Boolean> {
    let span = await this.containerBottom.$(
      `//div[@title = '${tabName}']/span`
    );
    return (await span.getAttribute('class')) === 'lm_title lm_focused'
      ? true
      : false;
  }

  // Set color on a tab in Bottom container
  public async setColorOnTabInBottomContainer(tabName: string, color: string) {
    if (!this.isTabSelectedInBottomContainer(tabName))
      await this.selectTabFromBottomContainer(tabName);
    await $(
      `//p[contains( text(), '${tabName}')]/following-sibling::input`
    ).setValue(color);
  }

  // send Event
  public async sendEventFromBottomContainer(event: string) {
    const divElement = await $('#layoutContainer > div:last-of-type');
    await divElement.$('input[type=text]').setValue(event);
    await divElement.$('button').click();
  }

  // helper for retrieving received events
  private async getReceivedEvents(): Promise<string[]> {
    let events: string[] = [];
    const divElement = await $('#layoutContainer > div:last-of-type');
    const eventElements = await divElement.$$('span');
    let eventCount = eventElements.length;
    console.log('Total span elements found :: ' + events.length);
    for (let i = 0; i < eventCount; i++) {
      events.push(await eventElements[i].getText());
    }
    console.log('Events list :: ' + events);
    return events;
  }

  // verify if a given event is received
  public async isEventReceivedinBottomContainer(
    event: string
  ): Promise<boolean> {
    let found: boolean = false;
    let events: string[] = await this.getReceivedEvents();
    for (let i = 0; i < events.length; i++) {
      console.log(' verifying if ' + event[i] + ' has :: ' + event);
      if (events[i].includes(event)) {
        found = true;
        break;
      }
    }
    return found;
  }

  // remove component tab from Top right
  public async removeComponentFromTopRightContainer(componentName: string) {
    await this.containerTopRight
      .$(`//div[@title ='${componentName}']/div[@class='lm_close_tab']`)
      .click();
  }

  // get component tab count from Top right
  public async getComponentCountFromTopRightContainer(): Promise<Number> {
    let cnt: Number = 0;
    const isCountainerExist: boolean =
      await this.containerTopRight.isExisting();
    if (isCountainerExist) {
      cnt = await this.containerTopRight.$$('.lm_tab').length;
      console.log(' Total components :: ' + cnt);
    }

    return cnt;
  }

  // drag and drop
  public async dragAndDrop(source: string, target: string) {
    const elem = await this.containerTopRight.$(`//div[@title ='${source}']`);
    const targetElement = await this.containerBottom.$(
      `//div[@title = '${target}']`
    );
    elem.dragAndDrop(targetElement);
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  open() {
    return super.open();
  }
}

export default new GoldenLayoutPage();

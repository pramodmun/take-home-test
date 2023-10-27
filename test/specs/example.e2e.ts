import GoldenLayoutPage from  '../pageobjects/golden.layout.page';

describe('My Golden layout demo application', () => {
    xit('should load the standart layout', () => {
        GoldenLayoutPage.open();
        GoldenLayoutPage.load('standard');
	expect(GoldenLayoutPage.tabFnts100).toBeDisplayed();
      
    });
    xit('has a widget named comp 1 with a textBox with IndianRed color', () => {
       let comp1 = GoldenLayoutPage.getWidget('comp 1');
       expect(comp1).toBeDisplayed();
       let input = comp1.$('input');
       expect(input).toHaveValue('IndianRed');
       let textP = comp1.$('p');
       expect(textP).toHaveText('comp 1 component');
    });
});



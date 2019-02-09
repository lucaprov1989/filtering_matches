import chromedriver from 'chromedriver';
import webdriver from 'selenium-webdriver';
const { By, until } = webdriver;
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const driver = new webdriver.Builder().forBrowser('chrome').build();
const { expect , assert } = chai;


describe('Filter Matches End to End',() => {
    before(done => {
        driver.get('http://localhost:5000').then(() => {
            done();
        });
    });

    it('it can read the title', (done) => {
        expect(driver.findElement(By.id('title')).getAttribute('innerHTML'))
            .to.eventually.contain('Filter Matches');
        done();
    });

    it('it must be 25 cards at the start', async () => {
        const cards = await driver.findElements(By.css(".card"));
        expect(cards.length).to.equal(25);
    });

    it('it must be 22 cards if checkbox picture is clicked and form is submit', async () => {
        await driver.findElement(By.id("picture")).click();
        await driver.findElement(By.id('search')).click();
        const elements = await driver.findElements(By.css(".card"));
        expect(elements.length).to.equal(22);
        await driver.findElement(By.id("picture")).click();
    });

    it('it must be 12 cards if checkbox in contact is clicked and form is submit', async () => {
        await driver.findElement(By.id("in_contact")).click();
        await driver.findElement(By.id('search')).click();
        const elements = await driver.findElements(By.css(".card"));
        expect(elements.length).to.equal(12);
        await driver.findElement(By.id("in_contact")).click();
    });

    it('it must be 6 cards if checkbox favourite is clicked and form is submit', async () => {
        await driver.findElement(By.id("favourite")).click();
        await driver.findElement(By.id('search')).click();
        const elements = await driver.findElements(By.css(".card"));
        expect(elements.length).to.equal(6);
        await driver.findElement(By.id("favourite")).click();
    });

    it('it must be 8 cards if compatibility between 90 and 99', async () => {
        await driver.executeScript("document.getElementById('compatibility_score_min').setAttribute('value', '90')");
        await driver.findElement(By.id('search')).click();
        const elements = await driver.findElements(By.css(".card"));
        expect(elements.length).to.equal(8);
        await driver.executeScript("document.getElementById('compatibility_score_min').setAttribute('value', '0')");
    });

    it('it must be 2 card if age between 50 and 95', async () => {
        await driver.executeScript("document.getElementById('age_min').setAttribute('value', '50')");
        await driver.findElement(By.id('search')).click();
        const elements = await driver.findElements(By.css(".card"));
        expect(elements.length).to.equal(2);
        await driver.executeScript("document.getElementById('age_min').setAttribute('value', '18')");
    });

    it('it must be 9 cards if height between 160 and 210', async () => {
        await driver.executeScript("document.getElementById('height_in_cm_min').setAttribute('value', '160')");
        await driver.findElement(By.id('search')).click();
        const elements = await driver.findElements(By.css(".card"));
        expect(elements.length).to.equal(12);
        await driver.executeScript("document.getElementById('height_in_cm_min').setAttribute('value', '135')");
    });



});

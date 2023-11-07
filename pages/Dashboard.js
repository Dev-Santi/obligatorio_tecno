const {expect} = require("@playwright/test");

class UserDashboard {
    constructor(page) {
        this.page = page;
    }

    async estoyEnElDashboard(afterLoginURL){
        // await this.page.waitForURL(afterLoginURL);
        expect(this.page.url()).toBe(afterLoginURL);
    }

    async irAlTablero(name, boardUrl){
        const trelloBoardCard = this.page.getByTitle(`${name}`);
        await trelloBoardCard.click();
        await this.page.waitForURL(boardUrl);
        expect(this.page.url()).toBe(boardUrl);
    }
}

module.exports = { UserDashboard };
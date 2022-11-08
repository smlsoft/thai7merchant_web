import { defineStore } from 'pinia'
export const useApp = defineStore("app", {

  state: () => ({
    PageTitle: "Dashboard",
    pageActive: "dashboard",
    childActive: "",
    showToggle: false,
  })
  ,
  actions: {
    async setPageTitle(title) {
      this.PageTitle = title;
      
    },
    async setActivePage(page) {
      this.pageActive = page;
    },
    async setActiveChild(page) {
      this.childActive = page;
    },
    async setActivedToggle() {
      if (this.showToggle == true) {
        this.showToggle = false;
      } else {
        this.showToggle = true;
      }
    }
  },
});

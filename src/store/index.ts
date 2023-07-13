import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => {
    return {
      msg: 'Hello Pinia',
      count: 1
    }
  },
  getters: {
    getCount(state) {
      return state.count
    }
  },
  actions: {
    changeState() {
      this.count++
      this.msg = '~~~~~~~~~~~~~'
    }
  }
})
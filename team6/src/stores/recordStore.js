import { defineStore } from 'pinia';
import axios from 'axios';

// 🌟 1. 환경 변수에서 배포된 백엔드 주소 가져오기
const API_URL = import.meta.env.VITE_API_URL;

export const useRecordStore = defineStore('record', {
  state: () => ({
    list: [],
    categories: [],
    selectedDate: new Date(),
    user: JSON.parse(localStorage.getItem('user')) || { id: 1 },
    loaded: false,
  }),

  getters: {
    filteredList: (state) => {
      const year = state.selectedDate.getFullYear();
      const month = state.selectedDate.getMonth() + 1;

      return state.list
        .filter((item) => {
          const d = new Date(item.date);
          return (
            item.userId === state.user.id &&
            d.getFullYear() === year &&
            d.getMonth() + 1 === month
          );
        })
        .map((item) => {
          const categoryInfo = state.categories.find(
            (c) => c.name === item.category,
          );
          return {
            ...item,
            iconPath: `/src/images/${categoryInfo ? categoryInfo.icon : '18.png'}`,
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    calendarDays: (state) => {
      const year = state.selectedDate.getFullYear();
      const month = state.selectedDate.getMonth();
      const lastDate = new Date(year, month + 1, 0).getDate();
      const days = [];

      for (let i = 1; i <= lastDate; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dailylist = state.list.filter(
          (r) => r.date === dateStr && r.userId === state.user.id,
        );
        const incomeSum = dailylist
          .filter((r) => r.type === 'income')
          .reduce((sum, r) => sum + r.amount, 0);
        const expenseSum = dailylist
          .filter((r) => r.type === 'expense')
          .reduce((sum, r) => sum + r.amount, 0);
        days.push({ date: i, fullDate: dateStr, incomeSum, expenseSum });
      }
      return days;
    },
  },

  actions: {
    // 서버로부터 전체 레코드 및 카테고리 정보 로드
    async fetchData() {
      try {
        // 🌟 2. localhost:3000을 ${API_URL}로 교체 (백틱 처리 확인!)
        const [recRes, incRes, expRes] = await Promise.all([
          axios.get(`${API_URL}/records`),
          axios.get(`${API_URL}/incomeCategory`),
          axios.get(`${API_URL}/expenseCategory`),
        ]);
        this.list = recRes.data;
        this.categories = [...incRes.data, ...expRes.data];
        this.loaded = true;
      } catch (error) {
        console.error('Data loading failed:', error);
      }
    },

    setSelectedDate(date) {
      this.selectedDate = date;
    },
  },
});

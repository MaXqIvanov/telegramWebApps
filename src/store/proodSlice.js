import { createSlice } from '@reduxjs/toolkit';

const prodSlice = createSlice({
  name: 'prood',
  initialState: {
    proods: [{
        id: 1,
        name: 'Пеперони',
        price: 1000,
        description: 'вкусная пицца',
        img: 'https://bestpovar.ru/wa-data/public/shop/products/59/08/859/images/392/392.750x0.jpg',
        amount: 0
    },{
        id: 2,
        name: 'Сырная',
        price: 1200,
        description: 'пицца с сыром',
        img: 'https://bestpovar.ru/wa-data/public/shop/products/59/08/859/images/392/392.750x0.jpg',
        amount: 0
    }],
  },
  reducers: {
    changeProod(state, action) {
      console.log(action.payload.elem);
      console.log(action.payload.index);
      console.log(action.payload.amount);
      let count = state.proods[action.payload.index].amount + action.payload.amount
      if(count >= 0){
        state.proods[action.payload.index].amount = count
      }
    },
  },
});

export default prodSlice.reducer;
export const { changeProod } =
  prodSlice.actions;
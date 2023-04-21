/* 
  Функция перемешивания массива.
  Эта функция использует алгоритм Фишера-Йетса и проходит через массив от конца к началу. На каждой итерации она выбирает случайный индекс элемента в диапазоне от 0 до i и меняет его местами с элементом, находящимся в i-м индексе.
*/
export const shuffleArray = array => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  };
  
  return shuffledArray;
};
import { TIngredient } from '../utils/types';
import blackBun from '../images/ingredients/black-bun.png';
import blackBunLarge from '../images/ingredients/black-bun-large.png';
import blackBunSmall from '../images/ingredients/black-bun-small.png';

// Чтобы добавить ингредиент, допишите строку в список булок, начинок или соусов ниже.
// _id должен быть уникальным и не меняться: по нему сохранённые заказы находят ингредиент.
// Фото — либо с TheMealDB по английскому названию продукта
// (https://www.themealdb.com/api/json/v1/1/list.php?i=list),
// либо свои файлы из src/images/ingredients, как у чёрной булки.

type TImages = Pick<TIngredient, 'image' | 'image_large' | 'image_mobile'>;

const IMAGES_URL = 'https://www.themealdb.com/images/ingredients';

const mealDb = (name: string): TImages => {
  const file = encodeURIComponent(name);
  return {
    image: `${IMAGES_URL}/${file}-Medium.png`,
    image_large: `${IMAGES_URL}/${file}.png`,
    image_mobile: `${IMAGES_URL}/${file}-Small.png`
  };
};

type TIngredientRow = [
  _id: string,
  name: string,
  // название продукта на TheMealDB или готовые ссылки на свои фото
  images: string | TImages,
  proteins: number,
  fat: number,
  carbohydrates: number,
  calories: number,
  price: number
];

const buns: TIngredientRow[] = [
  ['bun-01', 'Булочка бриошь', 'Bun', 8, 4, 44, 250, 120],
  ['bun-02', 'Булка с кунжутом', 'Buns', 9, 5, 46, 270, 140],
  ['bun-03', 'Чиабатта', 'Ciabatta', 9, 3, 50, 260, 160],
  ['bun-04', 'Английский маффин', 'English Muffins', 8, 2, 44, 230, 150],
  ['bun-05', 'Пита', 'Pita Bread', 9, 1, 55, 275, 130],
  [
    'bun-06',
    'Чёрная булка',
    {
      image: blackBun,
      image_large: blackBunLarge,
      image_mobile: blackBunSmall
    },
    8,
    4,
    45,
    255,
    150
  ]
];

const mains: TIngredientRow[] = [
  ['main-01', 'Говяжья котлета', 'Minced Beef', 26, 20, 0, 290, 390],
  ['main-02', 'Куриное филе', 'Chicken Breast', 31, 4, 0, 165, 320],
  ['main-03', 'Бекон', 'Bacon', 12, 40, 1, 420, 210],
  ['main-04', 'Лосось', 'Salmon', 20, 13, 0, 208, 450],
  ['main-05', 'Яйцо', 'Egg', 13, 11, 1, 155, 90],
  ['main-06', 'Сыр чеддер', 'Cheddar Cheese', 25, 33, 1, 400, 150],
  ['main-07', 'Моцарелла', 'Mozzarella', 22, 22, 2, 280, 160],
  ['main-08', 'Салат', 'Lettuce', 1, 0, 3, 15, 60],
  ['main-09', 'Томат', 'Tomato', 1, 0, 4, 18, 70],
  ['main-10', 'Красный лук', 'Red Onions', 1, 0, 9, 40, 50],
  ['main-11', 'Огурец', 'Cucumber', 1, 0, 4, 15, 50],
  ['main-12', 'Авокадо', 'Avocado', 2, 15, 9, 160, 180],
  ['main-13', 'Грибы', 'Mushrooms', 3, 0, 3, 22, 110],
  ['main-14', 'Халапеньо', 'Jalapeno', 1, 0, 6, 29, 80],
  ['main-15', 'Пеперони', 'Chorizo', 20, 40, 2, 455, 190],
  ['main-16', 'Руккола', 'Rocket', 3, 1, 4, 25, 70],
  ['main-17', 'Вяленые томаты', 'Sun-Dried Tomatoes', 5, 14, 23, 213, 120],
  ['main-18', 'Маринованный огурец', 'Dill Pickles', 1, 0, 2, 12, 60],
  ['main-19', 'Хрустящий лук', 'Onion', 5, 30, 40, 450, 70],
  ['main-20', 'Жареный ананас', 'Pineapple', 1, 0, 13, 50, 110],
  ['main-21', 'Прованские травы', 'Italian Seasoning', 1, 0, 2, 10, 30]
];

const sauces: TIngredientRow[] = [
  ['sauce-01', 'Кетчуп', 'Tomato Ketchup', 1, 0, 26, 110, 40],
  ['sauce-02', 'Горчица', 'Mustard', 4, 4, 5, 66, 40],
  ['sauce-03', 'Майонез', 'Mayonnaise', 1, 75, 1, 680, 50],
  ['sauce-04', 'Соус барбекю', 'Barbeque Sauce', 1, 1, 41, 172, 60],
  ['sauce-05', 'Острый соус', 'Hotsauce', 1, 0, 2, 12, 60],
  ['sauce-06', 'Шрирача', 'Sriracha', 2, 1, 19, 93, 70],
  ['sauce-07', 'Чесночный соус', 'Garlic Sauce', 1, 30, 6, 300, 60],
  ['sauce-08', 'Сметана', 'Sour Cream', 2, 20, 3, 200, 50],
  ['sauce-09', 'Соус блю-чиз', 'Stilton Cheese', 6, 35, 4, 350, 90],
  ['sauce-10', 'Соус крем-чиз', 'Cream Cheese', 6, 34, 4, 340, 80],
  ['sauce-11', 'Вишнёвое варенье', 'Cherry', 0, 0, 65, 260, 80],
  ['sauce-12', 'Соус терияки', 'Soy Sauce', 6, 0, 16, 89, 60],
  ['sauce-13', 'Фирменный соус', 'Sweet Chilli Sauce', 1, 40, 12, 410, 70]
];

const toIngredients = (
  rows: TIngredientRow[],
  type: TIngredient['type']
): TIngredient[] =>
  rows.map(
    ([_id, name, images, proteins, fat, carbohydrates, calories, price]) => ({
      _id,
      name,
      type,
      proteins,
      fat,
      carbohydrates,
      calories,
      price,
      ...(typeof images === 'string' ? mealDb(images) : images)
    })
  );

export const ingredients: TIngredient[] = [
  ...toIngredients(buns, 'bun'),
  ...toIngredients(mains, 'main'),
  ...toIngredients(sauces, 'sauce')
];

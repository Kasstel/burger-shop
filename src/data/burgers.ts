import { TBurger } from '../utils/types';
import mercury from '../images/mercury.jpg';
import blueCheese from '../images/bluecheeze.jpg';
import cosmoCherry from '../images/cosmocherry.jpg';
import mars from '../images/mars.jpg';
import sun from '../images/sun.jpg';
import earth from '../images/earth.jpg';
import saturn from '../images/saturn.jpg';

// Готовые бургеры для страницы меню. Фото лежат в src/images.
// ingredients — _id из src/data/ingredients.ts: первой идёт булка, дальше начинки и соусы
// в том порядке, в каком они попадут в конструктор. Цена считается из ингредиентов.

export const burgers: TBurger[] = [
  {
    id: 'mercury',
    name: 'Меркурий',
    description:
      'Король среди бургеров! Нежная булочка бриошь, сочная котлета из говядины, пикантные колбаски пеперони, тягучий сыр чеддер, ароматная руккола, вяленые тосканские томаты и красный лук',
    image: mercury,
    badge: 'Хит',
    ingredients: [
      'bun-01',
      'main-10',
      'main-17',
      'main-16',
      'main-06',
      'main-15',
      'main-01'
    ]
  },
  {
    id: 'blue-cheese',
    name: 'Блю Чиз',
    description:
      'Булочка чёрного цвета, мягкая и аппетитная. Внутри — сочная котлета из говядины, томаты, листья салата и нежный соус блю-чиз со сметаной. Вкус насыщенный, с пикантными сырными нотками',
    image: blueCheese,
    ingredients: [
      'bun-06',
      'main-08',
      'main-09',
      'sauce-09',
      'sauce-08',
      'main-01'
    ]
  },
  {
    id: 'cosmo-cherry',
    name: 'Космо черри',
    description:
      'Гармоничное сочетание сочной котлеты из говядины, хрустящего бекона, тягучего сыра чеддер и нежного соуса крем-чиз на чёрной булочке. Пикантность и оригинальность вкусу придают прованские травы и фирменное варенье из вишни',
    image: cosmoCherry,
    badge: 'Новинка',
    ingredients: [
      'bun-06',
      'sauce-11',
      'main-21',
      'main-06',
      'main-03',
      'main-01',
      'sauce-10'
    ]
  },
  {
    id: 'mars',
    name: 'Марс',
    description:
      'Сочная котлета из говядины в обрамлении хрустящего бекона и маринованного огурца, с пикантным соусом барбекю и солоновато-пряным сыром чеддер. Красный лук, спелые томаты и свежие листья салата добавляют инопланетного вайба',
    image: mars,
    ingredients: [
      'bun-01',
      'main-08',
      'main-09',
      'main-10',
      'main-18',
      'main-03',
      'main-06',
      'main-01',
      'sauce-04'
    ]
  },
  {
    id: 'sun',
    name: 'Солнце',
    description:
      'Яркий бургер, который поразит необычным сочетанием вкусов. Сочная котлета из говядины, хрустящий лук, жареный ананас, пикантный халапеньо, сыр чеддер и соусы: терияки, шрирача и фирменный',
    image: sun,
    badge: 'Острый',
    ingredients: [
      'bun-01',
      'main-19',
      'main-20',
      'main-14',
      'main-06',
      'main-01',
      'sauce-12',
      'sauce-06',
      'sauce-13'
    ]
  },
  {
    id: 'earth',
    name: 'Земля',
    description:
      'Сочная котлета из говядины в булочке бриошь, дополненная хрустящими маринованными огурцами, красным луком, свежим салатом и тягучим сыром чеддер',
    image: earth,
    ingredients: [
      'bun-01',
      'main-08',
      'main-10',
      'main-18',
      'main-06',
      'main-01'
    ]
  },
  {
    id: 'saturn',
    name: 'Сатурн',
    description:
      'Сочная котлета из говядины в булочке бриошь. Дополнена сыром чеддер, маринованными огурцами, листьями салата, спелыми томатами и ароматным красным луком. Особый вкус придаёт фирменный соус',
    image: saturn,
    ingredients: [
      'bun-01',
      'main-08',
      'main-09',
      'main-10',
      'main-18',
      'main-06',
      'main-01',
      'sauce-13'
    ]
  }
];
